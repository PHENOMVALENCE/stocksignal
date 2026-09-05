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
- Create a focused session branch from the current approved base branch.
- Make small, coherent commits using Conventional Commit-style messages.
- Every commit must be authored only as `Valence Mwigani <phenomenalvalence@gmail.com>`.
- Never add Cursor, Codex, OpenAI, AI, bot, agent, generated-by, or co-author attribution.
- Verify commit author and body after every commit.
- At the end of every coding session, push the session branch and open one focused pull request.
- Never merge pull requests automatically.
- Follow the complete procedure in `docs/AGENT_WORKFLOW.md`.

## Before modifying code

Inspect:

- `AGENTS.md`
- `README.md`
- `docs/PROJECT_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/DEVELOPMENT.md`
- `docs/SECURITY.md`
- `docs/AGENT_WORKFLOW.md`

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
