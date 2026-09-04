# Architecture

```text
User
  |
  v
Next.js UI
  |
  v
Next.js server layer
  |
  +--------------------------+
  |                          |
  v                          v
Supabase PostgreSQL     Africa's Talking
                           |
                    +------+------+
                    |             |
                   SMS           USSD
                              (future)
```

## Shape

StockSignal is a modular monolith: one Next.js deployment with UI, route handlers/server actions, domain services, and external adapters. This keeps the hackathon system easy to run and debug without blocking later module boundaries.

Browser components display state and submit user intent. Server actions handle first-party UI mutations; route handlers expose health checks and future callbacks. Domain services own inventory and alert rules. Server-only adapters isolate Supabase privileged access and Africa's Talking credentials.

## Data and consistency

PostgreSQL is the source of truth for inventory, movements, and notification attempts. Production stock mutation should be atomic: lock/read the balance, validate, calculate, update the item, and insert the movement in one transaction or RPC. This prevents concurrent writes from losing stock.

SMS delivery is deliberately outside the inventory transaction. The reliable sequence is: validate and persist the stock transaction, determine whether notification is due, attempt delivery, then persist success or failure. An Africa's Talking outage must not invalidate a legitimate inventory movement.

## Notification boundary

Notification services accept domain messages and return normalized provider results. Provider-specific response shapes stay inside `src/services/africas-talking`. The `alert_active` state suppresses repeated low-stock alerts and resets only after stock rises above the reorder level.

## Packaging and deployment

Next.js standalone output is packaged as a non-root, multi-stage Docker image. The same repository can deploy to Vercel or a container host. A single-instance deployment needs no shared Next.js cache; multi-instance dynamic caching will require an external cache strategy if introduced.

GitHub Actions runs dependency installation, lint, typecheck, tests, application build, and an independent Docker build check. Images are not published until a registry is explicitly configured.
