alter table public.notifications
  add column if not exists attempt_count integer not null default 0 check (attempt_count >= 0);

alter table public.notifications
  add column if not exists last_attempted_at timestamptz;

comment on column public.notifications.attempt_count is 'Bounded delivery attempts for a single notification row.';
