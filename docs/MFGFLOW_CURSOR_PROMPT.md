# Cursor Start Prompt for MFGFlow

Paste the following into Cursor from the repository root. It intentionally begins with project inspection and only the first implementation slice.

---

Work in the StockSignal repository, which is evolving into MFGFlow. StockSignal remains the inventory and shortage-signal module inside the broader order-to-production product.

Before editing anything, read these files completely:

1. `AGENTS.md`
2. `README.md`
3. `docs/AGENT_WORKFLOW.md`
4. `docs/MFGFLOW_PRODUCT_SPEC.md`
5. `docs/MFGFLOW_DOMAIN_MODEL.md`
6. `docs/MFGFLOW_IMPLEMENTATION_PLAN.md`
7. `docs/ARCHITECTURE.md`
8. `docs/DATABASE.md`
9. `docs/SECURITY.md`
10. `docs/STATUS.md`
11. `docs/TASKS.md`

Then inspect the current branch, working tree, recent commits, open pull requests, migrations, generated database types, repository/service patterns, tests, and Vercel/Supabase configuration. Do not edit until you can summarize what is implemented, which PR is the intended base, and whether other work is uncommitted.

Start only `MF-00: Rename the product shell to MFGFlow` from `docs/MFGFLOW_IMPLEMENTATION_PLAN.md`.

Requirements:

- Present MFGFlow as the overall product and StockSignal as its inventory module.
- Update product copy, metadata, navigation labels, and documentation references needed for a coherent shell.
- Do not rename database tables, code directories, packages, environment variables, Vercel/Supabase projects, or working inventory concepts.
- Do not implement authentication, customers, products, BOMs, orders, production, quality control, or AI in this slice.
- Preserve all existing inventory, movement, alert, restock, SMS, health, Docker, and deployment behavior.
- Add or update focused tests where product metadata or navigation behavior is testable.
- Update `docs/STATUS.md` and `docs/TASKS.md` when the slice is complete.

Development procedure:

1. Follow `docs/AGENT_WORKFLOW.md` exactly.
2. Never work directly on `main` or an unrelated open PR branch. Start from the approved base and create `codex/feat-mfgflow-product-shell` unless that branch already exists.
3. Configure Git locally as `Valence Mwigani <phenomenalvalence@gmail.com>`.
4. Work in the smallest independently reviewable changes and stage explicit files.
5. Use the commit subject `feat: present MFGFlow product shell` unless the actual outcome requires a more precise subject.
6. Never add Cursor, AI, agent, bot, generated-by, or co-author attribution to commits or PR text.
7. Verify the author and complete commit body with `git show -s --format='%an <%ae>%n%B' HEAD`.
8. Run the full quality gate plus relevant Docker/database checks.
9. Push without force and open one focused PR for Valence to review. Never merge it.

Stop and report rather than guessing if the correct base branch is ambiguous, the worktree contains unrelated changes, a migration would modify hosted data, or credentials are required. Finish by reporting the PR URL, commits, checks, files changed, remaining configuration, and the next recommended feature (`MF-01`, not implemented in this session).

---
