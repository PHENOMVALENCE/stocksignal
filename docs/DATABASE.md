# Database Design

The planned Supabase/PostgreSQL schema is defined in `supabase/schema.sql`. It is intentionally not applied to a remote project by this foundation.

## Tables

- `inventory_items`: material identity, available quantity, reorder level, contacts, and alert state.
- `stock_movements`: immutable stock-in, stock-out, and adjustment audit records.
- `notifications`: low-stock and restock SMS attempts and outcomes.
- `restock_requests`: explicit supplier requests and their lifecycle.

UUID primary keys support distributed creation. Check constraints are used instead of PostgreSQL enums during the MVP so allowed values remain visible and can evolve with simple migrations. SKU is unique; quantities and reorder levels cannot be negative; movement and requested quantities must be positive. Foreign-key indexes support item history queries, while status/time indexes support operational queues.

All public tables have RLS enabled with no permissive policies. This denies browser Data API access until authentication and organization ownership are designed. Initial privileged access must occur only from server-side code. Future policies must include real ownership predicates rather than merely `TO authenticated`.

## Transactional movement plan

Production movement writes should use a database transaction/RPC to lock the inventory row, validate the operation, update the balance and alert state, and insert the movement. SMS is attempted after that transaction and recorded separately so provider failures do not corrupt stock history.

Before applying the schema, review it in the Supabase SQL editor or convert it into a timestamped CLI migration, then run Supabase database advisors.
