-- StockSignal MVP schema. Review before applying to a Supabase project.
--
-- Row Level Security is enabled on every table and no policy is defined, so
-- anon and authenticated roles are denied by default. All access goes through
-- the server using the service role key, which bypasses RLS. Add explicit
-- policies here when end-user authentication is introduced.

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  sku text not null unique check (char_length(trim(sku)) > 0),
  unit text not null check (char_length(trim(unit)) > 0),
  quantity numeric(14, 3) not null default 0 check (quantity >= 0),
  reorder_level numeric(14, 3) not null default 0 check (reorder_level >= 0),
  manager_phone text,
  supplier_name text,
  supplier_phone text,
  alert_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items(id) on delete restrict,
  type text not null check (type in ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT')),
  quantity numeric(14, 3) not null check (quantity >= 0),
  previous_quantity numeric(14, 3) not null check (previous_quantity >= 0),
  new_quantity numeric(14, 3) not null check (new_quantity >= 0),
  notes text,
  created_at timestamptz not null default now(),
  -- STOCK_IN and STOCK_OUT are relative and must move a positive amount.
  -- ADJUSTMENT records the counted absolute balance, which may be zero.
  constraint stock_movements_quantity_by_type check (
    type = 'ADJUSTMENT' or quantity > 0
  )
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items(id) on delete restrict,
  type text not null check (type in ('LOW_STOCK', 'RESTOCK_REQUEST')),
  recipient text not null check (char_length(trim(recipient)) > 0),
  message text not null check (char_length(trim(message)) > 0),
  provider text not null default 'AFRICAS_TALKING',
  provider_message_id text,
  status text not null check (status in ('PENDING', 'SENT', 'FAILED')),
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.restock_requests (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items(id) on delete restrict,
  requested_quantity numeric(14, 3) not null check (requested_quantity > 0),
  supplier_name text not null check (char_length(trim(supplier_name)) > 0),
  supplier_phone text not null check (char_length(trim(supplier_phone)) > 0),
  status text not null default 'REQUESTED' check (status in ('REQUESTED', 'ACKNOWLEDGED', 'CANCELLED', 'FULFILLED')),
  notification_id uuid references public.notifications(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stock_movements_item_created_idx
  on public.stock_movements (inventory_item_id, created_at desc);
create index if not exists notifications_item_created_idx
  on public.notifications (inventory_item_id, created_at desc);
create index if not exists notifications_status_created_idx
  on public.notifications (status, created_at);
create index if not exists restock_requests_item_created_idx
  on public.restock_requests (inventory_item_id, created_at desc);

alter table public.inventory_items enable row level security;
alter table public.stock_movements enable row level security;
alter table public.notifications enable row level security;
alter table public.restock_requests enable row level security;

comment on table public.inventory_items is 'Manufacturing raw-material balances and reorder state.';
comment on table public.stock_movements is 'Immutable audit trail for inventory balance changes.';
comment on table public.notifications is 'Outbound notification attempts and provider outcomes.';
comment on table public.restock_requests is 'Supplier replenishment requests initiated by managers.';

-- Keep updated_at truthful; the column default only covers insert.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists inventory_items_set_updated_at on public.inventory_items;
create trigger inventory_items_set_updated_at
  before update on public.inventory_items
  for each row execute function public.set_updated_at();

drop trigger if exists restock_requests_set_updated_at on public.restock_requests;
create trigger restock_requests_set_updated_at
  before update on public.restock_requests
  for each row execute function public.set_updated_at();
