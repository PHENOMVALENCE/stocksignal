# Project Status

## Current phase

P0 MVP — F01–F07 complete

## Implemented

- Next.js App Router with TypeScript, Tailwind CSS, and lint/typecheck/test scripts
- Product, architecture, security, environment, database, development, and demo documentation
- Environment validation primitives
- Pure, tested stock threshold logic
- Professional application shell and `/api/health`
- Production Docker configuration and GitHub validation workflows
- Schema verified to apply cleanly and idempotently against PostgreSQL 16
- Zero known dependency vulnerabilities
- Timestamped Supabase CLI migration, typed Database definitions, and server-only repositories
- Inventory list, empty/error states, and validated material creation
- Transactional stock-in, stock-out, and adjustment RPC with movement history
- Persistent low-stock transitions with one pending manager notification per crossing
- Africa's Talking SMS delivery after commit, with sanitized SENT/FAILED audit and bounded retry
- Supplier restock requests from low-stock items, linked to notification history
- Atomic `create_restock_request` RPC so a restock row and its notification are written together
- Operations dashboard and filterable notification history from persisted data

## Verified

The foundation gate is run against a clean install: lint, typecheck, 17 unit
tests, production build, secret scan, Docker image build, a container health
check on `/api/health`, and schema application to a throwaway PostgreSQL 16
instance including the `updated_at` triggers and movement constraints.

## Next

1. Configure a Supabase project and apply `supabase/migrations`.
2. Add Africa's Talking credentials for live demo SMS.
3. Add optional authentication (F08) and USSD (F09).

## Blockers

- Live persistence and SMS delivery require user-provided Supabase and Africa's Talking project configuration.
