-- Local verification for atomic restock creation. Run after `npm run db:reset`:
--   npx supabase db query --local -f supabase/tests/create_restock_request.sql

do $$
declare
  item_id uuid;
  created record;
  notification_count integer;
  request_count integer;
begin
  insert into public.inventory_items (name, sku, unit, quantity, reorder_level, manager_phone)
  values ('Cotton Fabric', 'COT-ATOMIC-1', 'metres', 10, 15, '+254712345678')
  returning id into item_id;

  select * into created
  from public.create_restock_request(
    item_id,
    50,
    'Demo Mill',
    '+254700000002',
    'STOCKSIGNAL RESTOCK REQUEST',
    'metres'
  );

  if created.restock_request_id is null or created.notification_id is null then
    raise exception 'Expected both restock and notification identifiers.';
  end if;

  if not exists (
    select 1
    from public.restock_requests r
    join public.notifications n on n.id = r.notification_id
    where r.id = created.restock_request_id
      and n.id = created.notification_id
      and n.type = 'RESTOCK_REQUEST'
  ) then
    raise exception 'Expected the restock request to be linked to its notification.';
  end if;

  execute $sql$
    create function pg_temp.fail_restock_insert()
    returns trigger
    language plpgsql
    as $fn$
    begin
      raise exception 'forced restock insert failure';
    end;
    $fn$
  $sql$;

  execute 'create trigger fail_restock_insert before insert on public.restock_requests for each row execute function pg_temp.fail_restock_insert()';

  begin
    perform public.create_restock_request(
      item_id,
      25,
      'Demo Mill',
      '+254700000003',
      'STOCKSIGNAL RESTOCK REQUEST',
      'metres'
    );
    raise exception 'Expected the forced restock insert failure to roll back.';
  exception
    when others then
      if sqlerrm not like '%forced restock insert failure%' then
        raise;
      end if;
  end;

  execute 'drop trigger fail_restock_insert on public.restock_requests';

  select count(*) into notification_count
  from public.notifications
  where inventory_item_id = item_id
    and recipient = '+254700000003';

  select count(*) into request_count
  from public.restock_requests
  where inventory_item_id = item_id
    and supplier_phone = '+254700000003';

  if notification_count <> 0 or request_count <> 0 then
    raise exception 'A failed restock write left an orphaned notification or request.';
  end if;
end
$$;
