# Architecture

```text
Manager
  |
  v
Next.js UI
  |
  v
Next.js server layer
  |
  +--> orders / planning / production / quality / recommendations
  |                                |
  |                                v
  +--> StockSignal inventory --> Supabase PostgreSQL
  |
  `--> notification service --> Africa's Talking SMS
```

## Shape

JengaFlow is a modular monolith: one Next.js deployment with UI, route handlers/server actions, domain services, and external adapters. StockSignal is its inventory module. This keeps the hackathon system easy to run and debug without blocking clear order, planning, production, quality, recommendation, and notification boundaries.

Order-to-production state flows forward through explicit server-enforced transitions. Multi-record transitions use PostgreSQL RPCs. Historical BOM requirements, production events, and quality results are snapshots or immutable events so later configuration edits do not rewrite completed work.

Browser components display state and submit user intent. Server actions handle first-party UI mutations; route handlers expose health checks and future callbacks. Domain services own inventory and alert rules. Server-only adapters isolate Supabase privileged access and Africa's Talking credentials.

## Data and consistency

PostgreSQL is the source of truth for inventory, movements, and notification attempts. Production stock mutation should be atomic: lock/read the balance, validate, calculate, update the item, and insert the movement in one transaction or RPC. This prevents concurrent writes from losing stock.

SMS delivery is deliberately outside the inventory transaction. The reliable sequence is: validate and persist the stock transaction, determine whether notification is due, attempt delivery, then persist success or failure. An Africa's Talking outage must not invalidate a legitimate inventory movement.

## Notification boundary

Notification services accept domain messages and return normalized provider results. Provider-specific response shapes stay inside `src/services/africas-talking`. The `alert_active` state suppresses repeated low-stock alerts and resets only after stock rises above the reorder level.

## Recommendation boundary

Domain services calculate quantities, shortages, due-date risk, production state, and quality gates deterministically. Recommendations cite those persisted facts. A later AI adapter may summarize structured evidence, but it cannot invent operational facts or mutate orders, inventory, jobs, or inspections.

## Packaging and deployment

Next.js standalone output is packaged as a non-root, multi-stage Docker image. The same repository can deploy to Vercel or a container host. A single-instance deployment needs no shared Next.js cache; multi-instance dynamic caching will require an external cache strategy if introduced.

GitHub Actions runs dependency installation, lint, typecheck, tests, application build, and an independent Docker build check. Images are not published until a registry is explicitly configured.
