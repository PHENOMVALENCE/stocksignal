# Build-Ready Feature Backlog

This is the original StockSignal inventory backlog. F01–F07 are implemented. New order-to-production development must use `MFGFLOW_IMPLEMENTATION_PLAN.md` instead of extending this numbering.

This backlog translates the product specification into implementable vertical slices. Complete the slices in order because each one establishes contracts used by the next.

## F01 — Supabase migration and typed data access

**Outcome:** the reviewed MVP schema can be applied repeatably and accessed only through server-side repositories.

**Build:** convert `supabase/schema.sql` into a Supabase CLI migration; add generated database types; add small repositories for inventory items, movements, notifications, and restock requests; document local/remote migration commands.

**Acceptance criteria:**

- A fresh Supabase database can apply the migration without manual edits.
- All public tables retain RLS; no permissive anonymous policy is introduced.
- Privileged clients remain server-only and validate configuration lazily.
- Repository methods are strictly typed and provider/database errors are normalized.
- Schema and repository integration tests run without live production credentials.

## F02 — Inventory list and material creation

**Outcome:** a manager can see materials and add a valid inventory item.

**Build:** implement `/inventory`, an empty state, a responsive inventory table, and a create-material form using a server action. Validate name, unique SKU, unit, starting quantity, reorder level, manager phone, and optional supplier details with Zod.

**Acceptance criteria:**

- Submitted values are validated on the server; client hints do not replace server validation.
- Quantity and reorder level accept zero but not negative values.
- Duplicate SKU produces a clear, non-sensitive error.
- Status is derived from `quantity <= reorder_level`.
- No demo values are presented as real data, and loading/error/empty states are accessible.

## F03 — Inventory detail and transactional movements

**Outcome:** a manager can inspect an item and safely record stock in, stock out, or an adjustment.

**Build:** implement `/inventory/[id]`, movement history, a movement form, and a PostgreSQL transaction/RPC that locks the item row, validates the operation, updates the balance/alert state, and inserts the movement atomically.

**Acceptance criteria:**

- Stock-out cannot produce a negative balance.
- Adjustment can set the balance to zero; stock-in/out quantities must be positive.
- The saved movement contains correct previous and new quantities.
- Concurrent movement tests do not lose updates.
- `updated_at` changes automatically and movement history is newest first.

## F04 — Persistent low-stock signal engine

**Outcome:** each healthy-to-low transition schedules exactly one manager alert.

**Build:** reuse the pure functions in `src/services/inventory/stock-rules.ts`; persist `alert_active` within the stock transaction; create a pending notification record only on a new threshold event.

**Acceptance criteria:**

- `50 - 40 = 10` at reorder level 15 creates one `LOW_STOCK` notification.
- Further changes `14 -> 13 -> 12` create no additional alert while active.
- Replenishment `12 -> 30` resets the alert without sending SMS.
- A later change `30 -> 14` creates a new alert.
- Unit and database integration tests cover boundary equality and transition behavior.

## F05 — Africa's Talking SMS delivery

**Outcome:** pending low-stock alerts can be delivered and audited without risking inventory consistency.

**Build:** add message builders, normalize SDK results, send only after the inventory transaction commits, and update notification status to `SENT` or `FAILED`. Add a safe retry path with a bounded attempt policy.

**Acceptance criteria:**

- Missing credentials produce a clear server configuration error only when SMS is invoked.
- Manager phone and message inputs are validated before provider calls.
- Provider message ID and sanitized failures are recorded.
- A provider failure never rolls back a valid stock movement.
- Tests stub the SDK; optional sandbox verification is separately documented.

## F06 — Supplier restock request

**Outcome:** a manager can send a low-stock item's supplier a recorded replenishment request.

**Build:** add **Request Restock** to low-stock item details; validate requested quantity and supplier; create the request and notification; send the supplier message; show outcome/history.

**Acceptance criteria:**

- The action is visible only when the item is low and supplier details are available or explicitly entered.
- Requested quantity is positive and rendered with the item's unit.
- Request and notification records are linked.
- SMS delivery success/failure is visible without leaking provider internals.
- Double submission is prevented or idempotently handled.

## F07 — Dashboard and notification history

**Outcome:** managers can quickly identify action-required inventory and audit communications.

**Build:** implement a compact dashboard with low-stock items and recent movements, plus `/notifications` with type/status/date filters and links to materials.

**Acceptance criteria:**

- Metrics are calculated from real persisted data, not hard-coded samples.
- Low-stock items are ordered by operational urgency.
- Notification statuses use accessible text and color semantics.
- Queries are indexed, paginated where appropriate, and have clear empty/error states.

## F08 — Authentication and authorization

**Outcome:** privileged inventory operations require an authenticated manager and data access is organization-scoped.

**Build:** define organization membership, integrate Supabase Auth, replace the server-only foundation posture with tested RLS ownership policies, and protect mutations and operational routes.

**Acceptance criteria:**

- Anonymous users cannot read or mutate inventory data.
- Policies include row ownership predicates, not only `TO authenticated`.
- Authorization never depends on user-editable metadata.
- Cross-organization access tests fail for reads and writes.

## F09 — USSD inventory workflow (P1)

**Outcome:** authorized users can check stock, record consumption, view low-stock items, and request restock from a basic phone.

**Build:** add an Africa's Talking callback route, session/menu state, compact validation, and calls into the same domain services used by the web UI.

**Acceptance criteria:**

- Callback payloads are validated and authenticity protections are used where supported.
- Menus distinguish `CON` and `END` responses correctly.
- Session state expires and does not contain secrets.
- USSD movements use the same transactional and alert rules as the web UI.

## Cross-cutting definition of done

For every feature: keep secrets server-side; validate inputs; preserve RLS; add unit/integration coverage; run lint, typecheck, tests, build, and relevant Docker checks; update documentation and `docs/STATUS.md`; use a focused Conventional Commit; never merge the pull request automatically.
