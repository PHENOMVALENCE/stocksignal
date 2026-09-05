# MFGFlow Product Specification

## Product direction

MFGFlow extends StockSignal from inventory monitoring into an order-to-production platform for small African manufacturers. StockSignal remains the inventory and shortage-signal module; MFGFlow connects it to customer orders, product recipes, production work, quality control, delivery readiness, and explainable recommendations.

The hackathon promise is one complete journey:

> Record a customer order, determine its material needs, identify shortages before work begins, track production, complete quality checks, and mark the order ready for delivery.

## Primary user and operating assumptions

The first user is an owner or operations manager at a small workshop. A single organization and manager workflow is sufficient for the first demo, but every new business table must include `organization_id` so authentication and multi-tenancy can be introduced without redesigning the domain.

The MVP must work well on a low-cost phone and unreliable connection. Keep screens compact, preserve submitted data on validation errors, avoid decorative dashboards, and make the next required action obvious.

## Core journey

1. Record a customer and order with products, quantities, promised date, and notes.
2. Resolve each product through a versioned bill of materials (BOM).
3. Multiply BOM quantities by ordered quantities and aggregate required materials.
4. Compare requirements with available inventory without silently reserving or consuming it.
5. Show shortages, affected order lines, and an explainable recommended action.
6. Confirm the order and create a production job with defined stages.
7. Record stage progress and consume inventory through the existing transactional movement service.
8. Complete the applicable quality checklist and record defects.
9. Mark the job complete and the order ready for delivery only when its gate conditions pass.
10. Retain an audit trail linking the order, requirements, movements, production events, and inspections.

## MVP capabilities

### Orders

- Create and view customers and orders.
- Support multiple order lines and an expected completion date.
- Statuses: `DRAFT`, `CONFIRMED`, `IN_PRODUCTION`, `READY`, `COMPLETED`, `CANCELLED`.
- Order numbers are unique within an organization and generated server-side.

### Products and bills of materials

- Define a product, output unit, and active BOM version.
- A BOM line links one product unit to a positive quantity of an inventory item.
- Confirmed orders retain a requirement snapshot so later BOM edits do not rewrite history.

### Material planning

- Calculate gross requirements deterministically; do not use an LLM for arithmetic.
- Report `required`, `available`, and `shortage = max(required - available, 0)` in the material's unit.
- The first MVP reports availability and shortages; reservation is a separate later feature.

### Production

- Create at most one active production job per order.
- Default stages: `PLANNING`, `PREPARATION`, `ASSEMBLY`, `FINISHING`, `QUALITY_CHECK`, `COMPLETE`.
- Record stage transitions with actor, timestamp, and optional note.
- Enforce legal transitions on the server and retain immutable transition history.

### Quality control

- Attach a checklist template to a product or production job.
- Record pass/fail/not-applicable responses and defect notes.
- A failed required check prevents production completion until resolved or explicitly re-inspected.

### Recommendations

- Start with deterministic rules: shortage severity, promised-date proximity, incomplete prerequisites, stalled stages, and failed quality checks.
- Every recommendation contains a severity, short explanation, evidence references, and suggested action.
- An LLM may later summarize verified facts, but must not invent quantities, statuses, dates, or business records and must not execute mutations.

## Non-functional requirements

- All mutations are authenticated server actions or protected route handlers.
- Organization ownership is enforced with tested RLS before multiple organizations use the system.
- Quantities use decimal-safe PostgreSQL numeric fields and one canonical unit per inventory item.
- State transitions and inventory mutations are transactional and idempotent where retries are plausible.
- Customer phone numbers and operational notes are treated as private data.
- SMS delivery remains outside business transactions and records success or sanitized failure.
- Dates are stored in UTC; promised dates are interpreted in the organization's configured timezone.
- No demo value may be shown as real operational data.

## Explicitly out of scope for the hackathon journey

Payments, accounting, payroll, supplier marketplace, route optimization, barcode scanning, IoT sensors, advanced forecasting, autonomous purchasing, and full ERP functionality.

## Demo acceptance scenario

A furniture maker records an order for 100 school desks. The active desk BOM produces aggregated material requirements. Available paint is insufficient, so MFGFlow shows the exact shortage and recommends replenishment before finishing. The manager creates a production job, advances it through the configured stages, records inventory consumption through StockSignal, completes the desk quality checklist, and marks the order ready for delivery. All records remain linked and visible in the order timeline.
