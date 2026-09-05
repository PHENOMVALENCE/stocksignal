# MFGFlow

**Order-to-production clarity for African manufacturers.**

MFGFlow is evolving StockSignal into a lightweight order-to-production platform for small and medium manufacturers in Africa. StockSignal remains the working inventory module: it tracks critical raw materials, identifies reorder conditions, and uses Africa's Talking channels to help teams act before shortages stop production. The documented next phases connect customer orders, bills of materials, production progress, quality checks, and explainable recommendations.

## Problem

Manufacturers often track stock across notebooks or disconnected spreadsheets. A shortage may become visible only when a production task is already blocked, while the responsible manager or supplier is away from a computer.

## Solution

StockSignal pairs a clear inventory record with event-driven communication. A stock movement updates the balance; crossing a configured reorder threshold creates one manager alert; replenishment resets the signal; and a later shortage can alert again. Managers can then initiate a supplier restock request by SMS.

## Project status

**Implemented — P0 MVP**

- Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS, and ESLint
- MFGFlow product shell with StockSignal as the inventory module, plus a deployment health endpoint
- Pure stock calculation and duplicate-alert rules with unit tests
- Lazy server-side environment validation
- Supabase schema design with constraints, indexes, and RLS enabled
- Africa's Talking server adapter boundary
- Production Docker image and GitHub Actions validation
- Product, architecture, security, development, and demo documentation

**Planned — next**

- Organization-scoped authentication
- Customers, products, bills of materials, and customer orders
- Order material planning and shortage recommendations
- Production tracking, quality checks, and delivery readiness

**Future**

- USSD interaction, authentication, multi-location operations, analytics, forecasting, and additional communications channels

## How it works

```text
Manager -> Next.js UI -> server action / route -> domain service
                                              |-> Supabase PostgreSQL
                                              `-> Africa's Talking SMS
```

MFGFlow is a modular monolith; StockSignal is its inventory module. Browser code never receives privileged Supabase or Africa's Talking credentials. Valid inventory transactions are persisted before an SMS attempt so a provider outage does not erase stock history.

## Tech stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Supabase/PostgreSQL
- Africa's Talking Node.js SDK
- Zod and Vitest
- Docker and GitHub Actions

## Repository structure

```text
src/app/                         UI routes and route handlers
src/components/                  focused UI components
src/lib/                         environment and database primitives
src/services/inventory/          stock domain rules
src/services/africas-talking/    server-only SMS adapter
supabase/migrations/             timestamped CLI migrations
supabase/schema.sql              reviewable MVP database schema
src/repositories/                server-only typed data access
src/types/database.ts            generated-style Database types
docs/                            product and engineering documentation
.github/                         CI and contribution templates
```

## Getting started

Requirements: Git, Node.js 24 LTS, and npm. Docker Desktop is needed only for container validation. Supabase and Africa's Talking accounts are needed for live integrations.

```bash
git clone https://github.com/PHENOMVALENCE/stocksignal.git
cd stocksignal
git switch codex-master-changes
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The initial shell builds without real external credentials.

## Environment variables

`.env.example` lists placeholders for the public application URL, Supabase URL and keys, and Africa's Talking username, API key, and optional sender ID. Never commit `.env.local`. See `docs/ENVIRONMENT.md` for visibility and requirement details.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Docker

```bash
docker build -t stocksignal .
docker run --rm --env-file .env.local -p 3000:3000 stocksignal
```

Check `http://localhost:3000/api/health`. See `docs/DOCKER.md` for the production image design.

## Development workflow

Do not work directly on `main`. Use focused branches and Conventional Commit-style messages, run the complete quality gate, update affected documentation, and open a pull request for human review. Read `AGENTS.md` and `CONTRIBUTING.md` before implementing features.

## Roadmap and demo

The P0 roadmap centers on inventory CRUD, transactional movements, threshold detection, Africa's Talking SMS, restock requests, and notification history. `docs/DEMO.md` defines a reproducible Cotton Fabric scenario for hackathon judging.

## Documentation

- [Product specification](docs/PROJECT_SPEC.md)
- [MFGFlow product specification](docs/MFGFLOW_PRODUCT_SPEC.md), [domain model](docs/MFGFLOW_DOMAIN_MODEL.md), and [implementation plan](docs/MFGFLOW_IMPLEMENTATION_PLAN.md)
- [Cursor start prompt for MFGFlow](docs/MFGFLOW_CURSOR_PROMPT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md) and [task checklist](docs/TASKS.md)
- [Build-ready feature backlog](docs/FEATURE_BACKLOG.md) and [Cursor implementation prompt](docs/CURSOR_IMPLEMENTATION_PROMPT.md)
- [Current implementation review](docs/IMPLEMENTATION_REVIEW.md)
- [Database design](docs/DATABASE.md), [Supabase setup](docs/SUPABASE_SETUP.md), and [environment](docs/ENVIRONMENT.md)
- [Africa's Talking](docs/AFRICAS_TALKING.md)
- [Development](docs/DEVELOPMENT.md), [coding-agent workflow](docs/AGENT_WORKFLOW.md), [testing](docs/TESTING.md), and [Docker](docs/DOCKER.md)
- [Security](docs/SECURITY.md), [design](docs/DESIGN.md), and [decisions](docs/DECISIONS.md)
- [Project status](docs/STATUS.md), [demo](docs/DEMO.md), and [official resources](docs/RESOURCES.md)

## Hackathon focus

The existing StockSignal MVP proves reliable inventory and replenishment signals. The MFGFlow hackathon journey builds on it: record an order, calculate material needs, expose a shortage, track production, pass quality control, and mark the order ready for delivery.
