# Contributing

Read `AGENTS.md` and the linked product, architecture, roadmap, development, and security documents before changing code.

- Never push implementation work directly to `main`.
- Create one focused branch per coding session from the current approved base. Examples include `feat/inventory-movements`, `feat/low-stock-sms`, `feat/restock-request`, `feat/ussd-inventory`, or `fix/duplicate-alerts`.
- Keep changes and commits small and focused. Use Conventional Commit-style messages.
- Add tests for business rules and update relevant documentation.
- Run lint, typecheck, tests, and the production build before opening a pull request.
- Configure every commit as `Valence Mwigani <phenomenalvalence@gmail.com>` and verify it after committing.
- Never commit credentials, local environment files, or authorship metadata for Cursor, Codex, AI, bots, or other automated tools.
- At the end of each session, push the session branch and open one pull request describing scope, risks, and actual validation. Leave merging to Valence.

Follow `docs/AGENT_WORKFLOW.md` for the exact start, commit, verification, and end-of-session commands.
