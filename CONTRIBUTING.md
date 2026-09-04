# Contributing

Read `AGENTS.md` and the linked product, architecture, roadmap, development, and security documents before changing code.

- Never push implementation work directly to `main`.
- For this setup session, use `codex-master-changes`. Future branches may use `feat/inventory-movements`, `feat/low-stock-sms`, `feat/restock-request`, `feat/ussd-inventory`, or `fix/duplicate-alerts`.
- Keep changes and commits small and focused. Use Conventional Commit-style messages.
- Add tests for business rules and update relevant documentation.
- Run lint, typecheck, tests, and the production build before opening a pull request.
- Never commit credentials, local environment files, or authorship metadata for automated tools.
- Open a pull request, describe risks and validation, and leave merging to a human reviewer.
