# Commit Guide

Use this format:

```text
<type>: <imperative summary>
```

Good examples:

- `feat: add stock movement service`
- `feat: send low-stock SMS alerts`
- `fix: prevent duplicate threshold notifications`
- `docs: document USSD callback flow`
- `test: cover stock threshold transitions`

Avoid vague subjects such as `updates`, `changes`, `work`, `final`, `stuff`, `fix bugs`, or `codex changes`. Each commit must contain one coherent concern.

Every commit must show only:

```text
Valence Mwigani <phenomenalvalence@gmail.com>
```

Before the first commit of a session, set the repository-local identity. After every commit, run:

```bash
git show -s --format='%an <%ae>%n%B' HEAD
```

Do not include `Co-authored-by` or any Cursor, Codex, OpenAI, AI, bot, agent, or generated-by attribution. See `docs/AGENT_WORKFLOW.md` for the full small-feature workflow.
