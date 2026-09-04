# StockSignal Agent Instructions

## Mission

StockSignal is a production-minded manufacturing stock-monitoring platform using Next.js, TypeScript, Supabase, Africa's Talking, and Docker.

## Non-negotiable engineering rules

- Use TypeScript for application code and prefer strict typing.
- Avoid `any` unless technically unavoidable and documented.
- Use the Next.js App Router.
- Keep server secrets on the server.
- Never expose Africa's Talking API keys or Supabase service-role/server secrets.
- Do not commit `.env`, `.env.local`, or credentials.
- Keep components reasonably small and business logic outside large UI components.
- Use server-only modules for privileged integrations.
- Validate external input and handle errors intentionally.
- Avoid premature abstraction and unnecessary dependencies.
- Prioritize hackathon reliability over architectural novelty.
- Do not implement speculative features unless listed in the roadmap or specifically requested.

## Git rules

- Never work directly on `main`.
- Default implementation branch: `codex-master-changes`.
- Make small, coherent commits using Conventional Commit-style messages.
- Never commit as Codex, OpenAI, or AI and never add AI co-author trailers.
- Never merge pull requests automatically.
- Push the working branch and open a pull request for Valence to review.

## Before modifying code

Inspect:

- `AGENTS.md`
- `README.md`
- `docs/PROJECT_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/DEVELOPMENT.md`
- `docs/SECURITY.md`

## Before committing

Run:

```text
npm run lint
npm run typecheck
npm run test (when tests exist)
npm run build
```

During iteration, run only the relevant subset when appropriate, but the complete quality gate must pass before opening a pull request.

## Feature implementation rule

For each substantial feature:

1. Understand requirements.
2. Identify data model changes.
3. Identify API and business-logic changes.
4. Implement the smallest useful vertical slice.
5. Add validation.
6. Add tests where appropriate.
7. Update documentation.
8. Commit separately.
9. Continue.

## Architecture discipline

Do not put Africa's Talking credentials into client components. Do not allow browser code to directly perform privileged Supabase operations.

Prefer this flow:

```text
UI
  -> server action / route handler
  -> domain / service logic
  -> database / external API
```

## Documentation discipline

Any meaningful architectural decision or new feature should update the corresponding documentation.
