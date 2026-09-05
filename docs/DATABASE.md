# Database Design

The reviewed Supabase/PostgreSQL schema lives in `supabase/schema.sql` and is applied as a timestamped CLI migration in `supabase/migrations/`. Privileged application access uses typed server-only repositories; browser clients receive no service-role key and no permissive RLS policies.

## Apply locally or remotely

```bash
# Local Supabase (Docker)
npx supabase start
npx supabase db reset

# Linked remote project
npx supabase link --project-ref <project-ref>
npx supabase db push
```

Regenerate types after a schema change:

```bash
npx supabase gen types typescript --local > src/types/database.ts
```

The committed `src/types/database.ts` file matches the MVP schema so builds do not require a live project.

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
