-- Create a restock request and its linked notification in one transaction.

create or replace function public.create_restock_request(
  p_inventory_item_id uuid,
  p_requested_quantity numeric,
  p_supplier_name text,
  p_supplier_phone text,
  p_message text,
  p_unit text
)
returns table (
  restock_request_id uuid,
  notification_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  item public.inventory_items%rowtype;
  created_notification public.notifications%rowtype;
  created_request public.restock_requests%rowtype;
begin
  if p_inventory_item_id is null then
    raise exception 'Choose a valid inventory item.';
  end if;

  if p_requested_quantity is null or p_requested_quantity <= 0 then
    raise exception 'Requested quantity must be greater than zero.';
  end if;

  if p_supplier_name is null or btrim(p_supplier_name) = '' then
    raise exception 'Supplier name is required.';
  end if;

  if p_supplier_phone is null or p_supplier_phone !~ '^\+[1-9][0-9]{7,14}$' then
    raise exception 'Enter a phone number in international format, for example +254712345678.';
  end if;

  if p_message is null or btrim(p_message) = '' then
    raise exception 'A restock message is required.';
  end if;

  if p_unit is null or btrim(p_unit) = '' then
    raise exception 'Unit is required.';
  end if;

  select *
  into item
  from public.inventory_items
  where id = p_inventory_item_id
  for update;

  if not found then
    raise exception 'The inventory item was not found.';
  end if;

  if btrim(p_unit) <> item.unit then
    raise exception 'The requested unit does not match the material unit.';
  end if;

  if item.quantity > item.reorder_level then
    raise exception 'Restock requests are available only while the material is low stock.';
  end if;

  insert into public.notifications (
    inventory_item_id,
    type,
    recipient,
    message,
    provider,
    status
  )
  values (
    item.id,
    'RESTOCK_REQUEST',
    p_supplier_phone,
    btrim(p_message),
    'AFRICAS_TALKING',
    'PENDING'
  )
  returning * into created_notification;

  insert into public.restock_requests (
    inventory_item_id,
    requested_quantity,
    supplier_name,
    supplier_phone,
    notification_id
  )
  values (
    item.id,
    p_requested_quantity,
    btrim(p_supplier_name),
    p_supplier_phone,
    created_notification.id
  )
  returning * into created_request;

  restock_request_id := created_request.id;
  notification_id := created_notification.id;
  return next;
end;
$$;

revoke all on function public.create_restock_request(uuid, numeric, text, text, text, text) from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.create_restock_request(uuid, numeric, text, text, text, text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.create_restock_request(uuid, numeric, text, text, text, text) from authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.create_restock_request(uuid, numeric, text, text, text, text) to service_role;
  end if;
end
$$;

comment on function public.create_restock_request(uuid, numeric, text, text, text, text) is
  'Creates a restock request and its linked pending notification atomically.';
