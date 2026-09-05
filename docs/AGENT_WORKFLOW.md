# Coding Agent Workflow

This workflow applies to Cursor, Codex, and every other coding agent used on StockSignal. The human repository owner is Valence Mwigani. Agents implement and verify changes, but commits must appear as ordinary commits authored only by Valence.

## Core unit: one small feature

A small feature is the smallest independently understandable, testable, and maintainable change that produces one outcome. It should normally touch one vertical concern and be easy to review without relying on unrelated changes.

Good feature slices include:

- add one validation rule and its tests;
- add one repository operation and its mapping/error tests;
- add one server action backed by an existing service;
- add one focused UI state or workflow;
- add one migration for one schema change;
- fix one defect with a regression test;
- update documentation for one completed behavior.

Do not combine database redesign, multiple screens, unrelated refactors, formatting, and dependency upgrades in one commit. If the commit subject needs “and” to describe unrelated outcomes, split it.

## Start of every session

1. Read `AGENTS.md` and the documentation it lists.
2. Run `git status`, `git remote -v`, `git branch -a`, and inspect open pull requests.
3. Update the intended base branch and create one session branch:

   ```bash
   git switch main
   git pull --ff-only origin main
   git switch -c feat/<short-session-name>
   ```

   Use `fix/`, `docs/`, `test/`, `chore/`, or `refactor/` when those better describe the session. Never work directly on `main`.

4. Configure and verify the human author identity:

   ```bash
   git config --local user.name "Valence Mwigani"
   git config --local user.email "phenomenalvalence@gmail.com"
   git config --local user.name
   git config --local user.email
   ```

5. Confirm the session goal and divide it into small feature slices before editing.

For a deliberately stacked pull request, start from the approved parent branch and clearly state the dependency in the PR. Otherwise, always branch from current `main`.

## Implement and commit each feature

For every slice:

1. Identify its acceptance criteria and affected schema, domain, server, UI, validation, tests, and documentation.
2. Implement only that slice.
3. Run the smallest relevant tests during iteration.
4. Review `git diff` and `git diff --check`; verify no credentials or unrelated files are present.
5. Stage explicit files rather than using `git add .` blindly.
6. Commit using `<type>: <imperative outcome>`.
7. Verify the new commit:

   ```bash
   git show --stat --oneline HEAD
   git show -s --format='%an <%ae>%n%B' HEAD
   ```

The output must show only `Valence Mwigani <phenomenalvalence@gmail.com>`. The body must not contain `Co-authored-by`, generated-by, bot, agent, Cursor, Codex, OpenAI, or other automated attribution.

## Commit naming

Use a subject that helps a future maintainer understand and locate the change from `git log`.

Good:

- `feat: validate inventory material creation`
- `feat: record stock movements atomically`
- `fix: suppress duplicate low-stock notifications`
- `test: cover restock request idempotency`
- `docs: explain linked Supabase deployment`
- `chore: pin Supabase CLI version`

Avoid `updates`, `final changes`, `cursor work`, `fix stuff`, `WIP`, or a feature number without an outcome.

## End of every session

1. Update `docs/STATUS.md`, `docs/TASKS.md`, and affected guides.
2. Run the complete gate:

   ```bash
   npm ci
   npm run lint
   npm run typecheck
   npm test
   npm run build
   npm audit
   ```

3. Run database/Docker checks when relevant. Inspect `git status`, the branch diff, commit list, and authorship:

   ```bash
   git diff --check
   git diff --stat origin/main...HEAD
   git log --format='%h %an <%ae> %s' origin/main..HEAD
   git log --format='%B' origin/main..HEAD
   git status --short
   ```

4. Push the session branch without force:

   ```bash
   git push -u origin HEAD
   ```

5. Open one pull request for the session:

   ```bash
   gh pr create --base main --head "$(git branch --show-current)" \
     --title "<type>: <clear session outcome>" \
     --body-file .github/PULL_REQUEST_BODY.md
   ```

   If using PowerShell, get the current branch with `$branch = git branch --show-current` and pass `--head $branch`.

6. Leave the PR open for Valence to review and merge. Report its URL, commits, checks, configuration still required, and the next small feature.

Never merge automatically, force-push, rewrite public history, hide a failed check, or begin another unrelated feature after opening the session PR.

## Recommended agent instruction

Add this to any Cursor or coding-agent prompt:

> Work in small, independently reviewable feature slices. After each slice, test it and create a focused Conventional Commit authored only as Valence Mwigani `<phenomenalvalence@gmail.com>`. Do not add co-author or generated-by attribution. At the end of the session, run the complete quality gate, push the session branch, and open one pull request for Valence to review. Never merge it.
