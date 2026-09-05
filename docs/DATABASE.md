# Database Design

This document covers the implemented StockSignal tables and RPCs. The incremental JengaFlow target schema and transaction boundaries are defined in `JENGAFLOW_DOMAIN_MODEL.md`.

The reviewed Supabase/PostgreSQL schema lives in `supabase/schema.sql` and is applied as a timestamped CLI migration in `supabase/migrations/`. Privileged application access uses typed server-only repositories; browser clients receive no service-role key and no permissive RLS policies.

## Apply locally or remotely

See `docs/SUPABASE_SETUP.md` for the complete command-by-command process, environment mapping, migration workflow, safety warnings, and troubleshooting.

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
npm run db:types
```

The generated `src/types/database.generated.ts` file matches the MVP schema so builds do not require a live project. Stable domain aliases live in `src/types/database.ts` and are not overwritten by type generation.

## Tables

- `inventory_items`: material identity, available quantity, reorder level, contacts, and alert state.
- `stock_movements`: immutable stock-in, stock-out, and adjustment audit records.
- `notifications`: low-stock and restock SMS attempts and outcomes.
- `restock_requests`: explicit supplier requests and their lifecycle.

UUID primary keys support distributed creation. Check constraints are used instead of PostgreSQL enums during the MVP so allowed values remain visible and can evolve with simple migrations. SKU is unique; quantities and reorder levels cannot be negative; movement and requested quantities must be positive. Foreign-key indexes support item history queries, while status/time indexes support operational queues.

All public tables have RLS enabled with no permissive policies. This denies browser Data API access until authentication and organization ownership are designed. Initial privileged access must occur only from server-side code. Future policies must include real ownership predicates rather than merely `TO authenticated`.

## Transactional movement plan

`public.apply_stock_movement` locks the inventory row with `FOR UPDATE`, validates the operation, updates quantity and `alert_active`, and inserts the movement in one transaction. SMS is attempted after that transaction and recorded separately so provider failures do not corrupt stock history.

`public.create_restock_request` locks the inventory row, validates the item, unit, requested quantity, supplier name, and phone number, then inserts the pending `RESTOCK_REQUEST` notification and the restock request in the same transaction. A failure cannot leave one record without the other. SMS delivery still happens after commit.

Before applying the schema, review it in the Supabase SQL editor or convert it into a timestamped CLI migration, then run Supabase database advisors.
