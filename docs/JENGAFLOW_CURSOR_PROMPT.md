# Cursor Start Prompt for JengaFlow

Paste the following into Cursor from the repository root. It intentionally begins with project inspection and only the next implementation slice.

---

Work in the StockSignal repository, which is evolving into JengaFlow. StockSignal remains the inventory and shortage-signal module inside the broader order-to-production product.

Before editing anything, read these files completely:

1. `AGENTS.md`
2. `README.md`
3. `docs/AGENT_WORKFLOW.md`
4. `docs/JENGAFLOW_PRODUCT_SPEC.md`
5. `docs/JENGAFLOW_DOMAIN_MODEL.md`
6. `docs/JENGAFLOW_IMPLEMENTATION_PLAN.md`
7. `docs/ARCHITECTURE.md`
8. `docs/DATABASE.md`
9. `docs/SECURITY.md`
10. `docs/STATUS.md`
11. `docs/TASKS.md`

Then inspect the current branch, working tree, recent commits, open pull requests, migrations, generated database types, repository/service patterns, tests, and Vercel/Supabase configuration. Do not edit until you can summarize what is implemented, which PR is the intended base, and whether other work is uncommitted.

Start only `JF-01: Add organizations and authenticated membership` from `docs/JENGAFLOW_IMPLEMENTATION_PLAN.md`.

Requirements:

- Add organizations and organization memberships using Supabase Auth user IDs.
- Add organization ownership to existing inventory, movement, notification, and restock records through forward-only migrations with a documented migration path for existing records.
- Protect operational routes and mutations with server-side session and membership checks.
- Add explicit RLS policies with organization-membership predicates; `TO authenticated` alone is not authorization.
- Use trusted database membership records for authorization. Never authorize with user-editable metadata.
- Test anonymous denial, same-organization access, and cross-organization denial for reads and writes.
- Preserve service-role access only in server-only modules and preserve existing inventory, SMS, Docker, and deployment behavior.
- Do not implement customers, products, BOMs, orders, production, quality control, recommendations, or AI in this slice.
- Update `docs/STATUS.md` and `docs/TASKS.md` when the slice is complete.

Development procedure:

1. Follow `docs/AGENT_WORKFLOW.md` exactly.
2. Never work directly on `main` or an unrelated open PR branch. Start from the approved base and create `codex/feat-organization-auth` unless that branch already exists.
3. Configure Git locally as `Valence Mwigani <phenomenalvalence@gmail.com>`.
4. Work in the smallest independently reviewable changes and stage explicit files.
5. Use small commits with precise outcomes, such as `feat: add organization membership schema`, `feat: enforce organization-scoped inventory access`, and `feat: protect manager routes`.
6. Never add Cursor, AI, agent, bot, generated-by, or co-author attribution to commits or PR text.
7. Verify the author and complete commit body with `git show -s --format='%an <%ae>%n%B' HEAD`.
8. Run the full quality gate plus relevant Docker/database checks.
9. Push without force and open one focused PR for Valence to review. Never merge it.

Do not push migrations to hosted Supabase without explicit authorization. Stop and report rather than guessing if the correct base branch is ambiguous, the worktree contains unrelated changes, existing records cannot be assigned safely, or credentials are required. Finish by reporting the PR URL, commits, checks, files changed, migration instructions, remaining configuration, and the next recommended feature (`JF-02`, not implemented in this session).

---
