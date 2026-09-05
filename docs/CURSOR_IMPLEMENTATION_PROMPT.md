# Cursor Implementation Prompt

> Archived foundation prompt: F01–F07 are already implemented. For new work, use `JENGAFLOW_CURSOR_PROMPT.md`.

Copy the prompt below into Cursor while the repository is checked out on a new feature branch based on the reviewed foundation.

---

You are implementing the StockSignal P0 MVP in this repository. Read `AGENTS.md`, `README.md`, `docs/PROJECT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/FEATURE_BACKLOG.md`, `docs/DATABASE.md`, `docs/AFRICAS_TALKING.md`, `docs/ENVIRONMENT.md`, `docs/TESTING.md`, and `docs/SECURITY.md` before editing anything.

Implement build-ready features F01 through F07 from `docs/FEATURE_BACKLOG.md` as small vertical slices, in order. Do not implement F08 authentication or F09 USSD in this pass. Do not add Prisma, a component framework, microservices, speculative analytics, or P2/P3 functionality.

Engineering requirements:

1. Use Next.js App Router, strict TypeScript, Tailwind CSS, Zod, Supabase/PostgreSQL, and the existing Africa's Talking adapter boundary.
2. Use Server Components for reads and Server Actions for first-party UI mutations. Reserve route handlers for health checks, external callbacks, or a genuinely public API.
3. Keep all service-role and Africa's Talking credentials in server-only modules. Never import them into client components.
4. Convert the reviewed schema into a proper Supabase CLI migration and generate typed database definitions. Keep RLS enabled; do not create broad anonymous/authenticated policies before F08.
5. Implement stock movements through one PostgreSQL transaction/RPC that locks the inventory row, validates the movement, writes the new quantity and alert state, and inserts movement/pending-notification records atomically.
6. Reuse and extend `src/services/inventory/stock-rules.ts`. Preserve these behaviors exactly: equality is low stock; an active below-threshold alert is suppressed; replenishment above threshold resets it; a later crossing creates a new alert; an adjustment may set stock to zero.
7. Commit the inventory transaction before calling Africa's Talking. Provider failure must update notification status but must never invalidate the inventory movement.
8. Validate phone numbers, quantities, identifiers, and all form/provider inputs. Return helpful sanitized errors and log no secrets.
9. Build an operational, responsive UI consistent with `docs/DESIGN.md`: restrained industrial palette, clear quantity hierarchy, accessible status semantics, and explicit loading/error/empty states. Do not display fake statistics.
10. Add unit tests for domain/message rules, integration tests for repositories/actions/RPC behavior, and SDK mocks for SMS. Tests must not require live credentials.

Work feature by feature. Before each feature, state the schema, server/domain, UI, validation, and test changes you will make. After each feature, run the relevant checks, review the diff for secrets, update `docs/STATUS.md` and `docs/TASKS.md`, and create one or more focused Conventional Commits. Never use AI attribution or co-author trailers.

The complete acceptance gate is:

```text
npm ci
npm run lint
npm run typecheck
npm test
npm run build
docker build -t stocksignal .
```

Stop and report clearly if Supabase credentials/project linkage or Africa's Talking sandbox credentials are required for live verification. Do not invent credentials, modify a production project, force-push, merge into `main`, or bypass a failing check. Finish with a summary of implemented features, migrations, tests, commits, remaining configuration, and exact demo steps.

---
