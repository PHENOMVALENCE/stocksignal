-- Atomic stock movement: lock the item, validate, update quantity/alert, insert the movement.

create or replace function public.apply_stock_movement(
  p_inventory_item_id uuid,
  p_type text,
  p_quantity numeric,
  p_notes text default null
)
returns table (
  movement_id uuid,
  previous_quantity numeric,
  new_quantity numeric,
  alert_active boolean,
  notification_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  item public.inventory_items%rowtype;
  next_quantity numeric(14, 3);
  next_alert boolean;
  movement public.stock_movements%rowtype;
begin
  if p_type not in ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT') then
    raise exception 'The movement type is not allowed.';
  end if;

  if p_type = 'ADJUSTMENT' then
    if p_quantity is null or p_quantity < 0 then
      raise exception 'An adjustment cannot set a negative balance.';
    end if;
  elsif p_quantity is null or p_quantity <= 0 then
    raise exception 'A stock movement quantity must be greater than zero.';
  end if;

  select *
  into item
  from public.inventory_items
  where id = p_inventory_item_id
  for update;

  if not found then
    raise exception 'The inventory item was not found.';
  end if;

  if p_type = 'STOCK_OUT' then
    next_quantity := item.quantity - p_quantity;
  elsif p_type = 'STOCK_IN' then
    next_quantity := item.quantity + p_quantity;
  else
    next_quantity := p_quantity;
  end if;

  if next_quantity < 0 then
    raise exception 'A stock movement cannot create a negative balance.';
  end if;

  next_alert := next_quantity <= item.reorder_level;

  update public.inventory_items
  set
    quantity = next_quantity,
    alert_active = next_alert
  where id = item.id;

  insert into public.stock_movements (
    inventory_item_id,
    type,
    quantity,
    previous_quantity,
    new_quantity,
    notes
  )
  values (
    item.id,
    p_type,
    p_quantity,
    item.quantity,
    next_quantity,
    nullif(btrim(coalesce(p_notes, '')), '')
  )
  returning * into movement;

  movement_id := movement.id;
  previous_quantity := item.quantity;
  new_quantity := next_quantity;
  alert_active := next_alert;
  notification_id := null;
  return next;
end;
$$;

revoke all on function public.apply_stock_movement(uuid, text, numeric, text) from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.apply_stock_movement(uuid, text, numeric, text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.apply_stock_movement(uuid, text, numeric, text) from authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.apply_stock_movement(uuid, text, numeric, text) to service_role;
  end if;
end
$$;

comment on function public.apply_stock_movement(uuid, text, numeric, text) is
  'Locks an inventory row, applies one validated movement, and updates alert_active atomically.';
