create index if not exists notifications_type_created_idx
  on public.notifications (type, created_at desc);
