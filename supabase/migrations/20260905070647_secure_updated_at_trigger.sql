-- Trigger helpers do not need elevated privileges or direct Data API access.

alter function public.set_updated_at() security invoker;

revoke all on function public.set_updated_at() from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.set_updated_at() from anon;
  end if;

  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.set_updated_at() from authenticated;
  end if;
end
$$;
