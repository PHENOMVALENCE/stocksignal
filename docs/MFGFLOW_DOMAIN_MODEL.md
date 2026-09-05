# MFGFlow Domain and Database Plan

This is the target model, not an instruction to create all tables in one migration. Implement one feature slice and one reversible migration at a time. Existing StockSignal inventory, movement, notification, and restock tables remain authoritative.

## Ownership foundation

- `organizations`: manufacturer identity, timezone, and settings.
- `organization_members`: authenticated user membership and role.
- Add `organization_id` to business records before exposing authenticated browser access.

Do not add permissive policies. RLS policies must combine role targeting with an organization-membership predicate, and cross-organization tests must cover reads and writes.

## Order planning

- `customers`: organization, name, phone, email, address, timestamps.
- `products`: organization, SKU, name, output unit, active flag, timestamps.
- `boms`: product, version, status (`DRAFT`, `ACTIVE`, `RETIRED`), effective timestamp.
- `bom_lines`: BOM, inventory item, positive quantity per product unit.
- `orders`: organization, customer, order number, promised date, status, notes, timestamps.
- `order_lines`: order, product, positive quantity, unit, optional line notes.
- `order_material_requirements`: confirmed-order snapshot containing inventory item, required quantity, available-at-calculation quantity, shortage quantity, source BOM version, and calculated timestamp.

Important constraints:

- Unique `(organization_id, order_number)` and `(organization_id, sku)`.
- One active BOM per product, enforced transactionally.
- BOM and order-line quantities must be greater than zero.
- Product, inventory item, customer, and order must belong to the same organization.
- Confirmation fails when a line has no active BOM; shortages warn but do not necessarily block confirmation.

## Production and quality

- `production_jobs`: organization, order, status, current stage, planned/started/completed timestamps.
- `production_stage_events`: job, from-stage, to-stage, actor, note, timestamp; immutable.
- `quality_checklist_templates`: organization, product, name, version, active flag.
- `quality_check_items`: template, label, instructions, required flag, display order.
- `quality_inspections`: job, template version, inspector, status, timestamps.
- `quality_results`: inspection, checklist item snapshot, result, defect note.

Important constraints:

- One active job per order.
- Legal stage and order transitions are enforced in transactional RPCs.
- A completed job cannot be moved backward; corrections use explicit events.
- Required failed or unanswered quality results block completion.
- Templates are versioned; inspections retain a historical snapshot.

## Recommendations and audit

- `recommendations`: organization, optional order/job/material references, rule code, severity, explanation, evidence JSON, suggested action, status, timestamps.
- Prefer domain event/audit records for important transitions rather than mutable notes alone.
- Evidence JSON contains identifiers and computed facts, never secret keys or raw provider payloads.

## Service boundaries

```text
UI
  -> server action
    -> order / planning / production / quality service
      -> typed repository or transactional RPC
        -> Supabase PostgreSQL

verified domain facts
  -> recommendation rules
    -> optional AI summarizer
```

Suggested modules:

```text
src/services/orders/
src/services/planning/
src/services/production/
src/services/quality/
src/services/recommendations/
src/repositories/customers.ts
src/repositories/products.ts
src/repositories/orders.ts
src/repositories/production-jobs.ts
src/repositories/quality.ts
```

## Transaction boundaries

- Confirm order: lock the draft order, validate active BOMs, snapshot requirements, and change status.
- Create production job: validate confirmed order and uniqueness, create job and first stage event, update order status.
- Advance stage: lock job, validate transition, append event, update current stage and related order status.
- Complete inspection: validate all required results and derive inspection status.
- Complete production: require a passing inspection, close job, and set order `READY` in one transaction.
- Consume material: call the existing stock movement RPC; link the movement to the job in a later focused migration rather than duplicating balance logic.

## Index and query expectations

Index organization ownership columns, order status/promised date, job status/current stage, foreign keys used in timelines, active BOM lookup, unresolved recommendations, and inspection/job lookup. Paginate order lists and timelines. Validate query plans only after realistic demo data exists.
