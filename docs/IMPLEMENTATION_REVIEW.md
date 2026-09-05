# Current Implementation Review

Reviewed on 2026-09-05 against feature commit `9c189bb` and open pull request #3.

## Implemented

- Next.js App Router operations dashboard backed by persisted Supabase data.
- Inventory listing and validated material creation.
- Inventory detail, movement history, and stock-in, stock-out, and adjustment forms.
- PostgreSQL `apply_stock_movement` RPC using `FOR UPDATE` for atomic balance/movement updates.
- One pending low-stock notification per healthy-to-low threshold crossing.
- Africa's Talking delivery after the inventory transaction commits, with normalized errors, attempt counts, and bounded retry.
- Low-stock supplier restock request UI and linked notification history.
- Filterable/paginated notification history with loading, empty, and error states.
- Five ordered migrations, generated database types, server-only repositories, validation, and unit/integration tests.

## Open pull requests

- **PR #2 — documentation backlog:** `codex-master-changes` into `main`; open.
- **PR #3 — P0 inventory MVP:** `feat/p0-inventory-mvp` into `codex-master-changes`; open and mergeable. Its Application CI, Docker Build, and Database schema checks passed at review time; re-check them after every push.

PR #3 is stacked on PR #2. Review and merge #2 first, then update/merge #3. Future sessions should normally branch directly from updated `main`; use stacked PRs only when the dependency is intentional and documented.

## Review findings

1. **Authorship metadata needs correction in future work.** The seven original feature commits have good, outcome-based subjects, but each contains a `Co-authored-by: Cursor` trailer. This conflicts with StockSignal's rule that commits be authored only by Valence. Public history has not been rewritten; all new commits use only `Valence Mwigani <phenomenalvalence@gmail.com>`, and `docs/AGENT_WORKFLOW.md` adds a mandatory verification command.
2. **“Inventory CRUD” is broader than the implemented UI.** List and create are implemented, along with movement operations; editing material metadata and deleting/archiving an item are not implemented. Documentation and PR descriptions should use precise wording until update/archive behavior exists.
3. **Restock creation is not one database transaction.** The notification is inserted before the restock request. A failure between writes could leave an unlinked notification. Move both inserts into one RPC or compensate explicitly before treating this workflow as production-safe.
4. **Restock idempotency is application-level.** The two-minute duplicate check is read-then-write and can race under concurrent submissions. Add a database idempotency key or uniqueness strategy for robust duplicate prevention.
5. **Authentication remains intentionally absent.** RLS is enabled with no browser policies; server-only service-role repositories currently perform data access. Do not expose inventory through a browser client until organization ownership and tested RLS policies are implemented.
6. **Live external integrations remain unverified.** Local database behavior is verified, but a hosted Supabase project and Africa's Talking sandbox credentials are still required for the real hackathon flow.

## Recommended next small features

1. `fix: create restock request and notification atomically`
2. `test: enforce restock request idempotency under concurrency`
3. `feat: edit inventory material details`
4. `feat: add demo seed data`
5. `feat: authenticate managers with organization-scoped RLS`
6. `feat: add USSD inventory lookup`

Each item should be its own independently tested commit or session PR unless a direct dependency makes a small stack clearer.
