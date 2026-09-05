# JengaFlow Implementation Plan

## Delivery strategy

Build one end-to-end vertical slice at a time. A feature is complete only when its migration, generated types, repository, domain rules, server action, UI state, tests, documentation, and acceptance evidence are complete. Do not create the whole target schema in advance.

## Phase 0 — alignment and access

### JF-00: Rename the product shell to JengaFlow — complete

Keep StockSignal as the inventory module. Update navigation and copy without renaming technical folders or destabilizing working inventory behavior.

### JF-01: Add organizations and authenticated membership

Introduce Supabase Auth, organizations, memberships, ownership columns, protected routes, and tested RLS. Migrate existing demo records into one organization. This is a prerequisite for storing customer and order data safely.

Acceptance: anonymous access is denied; a member can access only their organization; service-role use remains server-only; cross-organization integration tests pass.

## Phase 1 — order and material planning

### JF-02: Record customers

Create/list/select customers with validated contact information and accessible empty/error states.

### JF-03: Define products

Create/list products with organization-scoped unique SKUs and output units.

### JF-04: Define one active BOM

Create and view a versioned BOM with inventory-backed material lines. Validate units, positive quantities, ownership, and active-version rules.

### JF-05: Record draft orders

Create an order containing customer, promised date, notes, and one or more product lines. Persist the order and lines atomically.

### JF-06: Calculate material requirements

Implement a pure calculator plus repository query that aggregates BOM requirements and compares them with StockSignal inventory. Present exact requirements and shortages on the order.

### JF-07: Confirm an order and snapshot its plan

Use one RPC to validate the draft, snapshot BOM/version and material requirements, then mark it confirmed. Repeated submission must be idempotent.

Phase acceptance: the 100-school-desk example shows exact requirements and an explainable paint shortage before production begins.

## Phase 2 — production tracking

### JF-08: Create a production job

Create one job from a confirmed order, append its initial stage event, and show a job overview.

### JF-09: Advance production stages

Implement legal server-enforced transitions and an immutable timeline. Prevent skipped or backward transitions unless a later explicit rework feature permits them.

### JF-10: Link material consumption

Record job consumption through the existing stock RPC and link resulting movements to the job without duplicating inventory calculations.

Phase acceptance: a confirmed desk order moves visibly from planning through finishing and its material consumption appears in both job and inventory history.

## Phase 3 — quality and completion

### JF-11: Define a quality checklist

Create a versioned product checklist with ordered, required items.

### JF-12: Complete a production inspection

Record results and defect notes. Derive pass/fail from required responses and retain the checklist snapshot.

### JF-13: Mark an order ready

In one transaction, require a passing inspection, complete the job, and move the order to `READY`.

Phase acceptance: the desk job cannot complete with a failed required check and becomes ready after a passing inspection.

## Phase 4 — decision support and demo

### JF-14: Generate rule-based recommendations

Create deterministic recommendations for material shortages, due-date risk, stalled jobs, and failed quality checks. Each recommendation must show evidence and a suggested action.

### JF-15: Add an AI operational summary

Optionally summarize only verified recommendation facts with structured output, timeout/fallback handling, cost limits, and no mutation tools. The rule-based view remains functional when AI is unavailable.

### JF-16: Build the order-to-production dashboard

Show actionable orders, shortages, active stages, quality failures, and upcoming promised dates using persisted data.

### JF-17: Add deterministic demo data and script

Provide a clearly labelled school-desk dataset, repeatable seed/reset commands, and a short offline-safe demo path.

## Suggested pull-request boundaries

Use one PR per numbered feature. A PR may contain several small commits when they form one vertical slice, for example migration/types, domain/repository, UI/action, tests/docs. Stack PRs only when the dependency is explicit; otherwise branch from updated `main`.

## Definition of done

- Acceptance criteria demonstrated with persisted data.
- Input validation and sanitized errors are present.
- RLS and organization ownership are tested when data is exposed.
- Transaction and idempotency behavior is tested for multi-write operations.
- Loading, error, empty, mobile, keyboard, and accessible status states are covered.
- `npm ci`, lint, typecheck, tests, build, audit, database reset/lint/advisors, and Docker checks pass as applicable.
- Generated database types and documentation are updated.
- Commit and PR follow `docs/AGENT_WORKFLOW.md`.

## Risks to manage deliberately

- Scope creep: the demo journey takes priority over ERP breadth.
- Unit mismatches: MVP uses the inventory item's canonical unit; conversion needs a separate design.
- Concurrent stock use: availability is a snapshot until reservation is designed.
- Historical drift: confirmation and inspection records snapshot the versions used.
- AI hallucination: deterministic calculations and evidence remain the source of truth.
- Connectivity/provider failure: core records commit independently of SMS or AI calls.
