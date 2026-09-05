# Supabase Database Setup

StockSignal tracks its database as ordered SQL migrations in `supabase/migrations/`. These migrations—not manual dashboard edits and not `supabase/schema.sql`—are the deployment source of truth. The schema file is a readable reference.

Supabase CLI `2.116.0` is pinned as a development dependency, so use `npx supabase` or the npm scripts below. Do not depend on an unrelated global CLI version.

## Prerequisites

- Node.js 24 and npm
- Docker Desktop running for local Supabase
- A Supabase account for a hosted project
- A Git feature branch; never work directly on `main`

Install dependencies and confirm the pinned CLI:

```bash
npm ci
npx supabase --version
```

Expected CLI version: `2.116.0`.

## Run the database locally

The repository already contains `supabase/config.toml`; do not run `supabase init` again.

```bash
npm run db:start
npx supabase status
npm run db:reset
npm run db:lint
npm run db:types
```

`db:start` launches the local Supabase stack in Docker. `db:reset` destroys only the local development database, recreates it, and replays every committed migration. It discards uncommitted local data.

`db:types` regenerates `src/types/database.generated.ts`. Keep application-specific aliases in `src/types/database.ts`; never hand-edit the generated file.

Open the Studio URL printed by `npx supabase status` (normally `http://localhost:54323`). Confirm the four tables—`inventory_items`, `stock_movements`, `notifications`, and `restock_requests`—and the `apply_stock_movement` and `create_restock_request` RPCs exist.

Verify them from the command line:

```bash
npx supabase db query --local "select table_name from information_schema.tables where table_schema = 'public' order by table_name;"
npx supabase db query --local "select routine_name from information_schema.routines where routine_schema = 'public' order by routine_name;"
```

To connect the app to local Supabase:

1. Copy `.env.example` to `.env.local`.
2. Run `npx supabase status`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` to the printed API URL.
4. Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the printed publishable/anon key.
5. Set `SUPABASE_SERVICE_ROLE_KEY` to the printed service-role/secret key.

Never commit `.env.local` or paste secret values into an issue, PR, log, or coding-agent prompt.

```bash
npm run dev
```

Stop local Supabase without deleting its volumes:

```bash
npm run db:stop
```

## Deploy to a hosted Supabase project

Create a blank project in the Supabase dashboard and retain its database password securely. Find the project reference in the dashboard URL or project settings.

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase migration list --linked
```

Preview exactly what will run:

```bash
npx supabase db push --linked --dry-run
```

Confirm the target project and migration list, then apply and verify:

```bash
npx supabase db push --linked
npx supabase migration list --linked
npx supabase db lint --linked --level warning --fail-on error
npx supabase gen types --linked --schema public > src/types/database.generated.ts
git diff -- src/types/database.generated.ts
```

Put the hosted project URL, publishable/anon key, and service-role key in `.env.local` using `.env.example`. The service-role key bypasses RLS and must remain server-only.

Never run `supabase db reset --linked` as part of normal deployment; it destroys and rebuilds the linked remote database. Use `db push` after a dry run.

## Make a database change

Never edit a migration that has already been applied or pushed. Create a new, descriptively named migration:

```bash
git switch -c feat/add-supplier-reference
npx supabase migration new add_supplier_reference
```

Edit only the newly created SQL file, then validate:

```bash
npm run db:reset
npm run db:lint
npm run db:types
npm test
npm run typecheck
git diff --check
```

Review and stage only this feature's migration, generated types, stable aliases when needed, tests, and documentation:

```bash
git config --local user.name "Valence Mwigani"
git config --local user.email "phenomenalvalence@gmail.com"
git add supabase/migrations/<new-migration>.sql src/types/database.generated.ts src/types/database.ts <related-tests-and-docs>
git commit -m "feat: add supplier reference to inventory"
git show -s --format='%an <%ae>%n%B' HEAD
```

After review, use `db push --linked --dry-run`, then `db push --linked`. Run the full quality gate and open the session PR according to `docs/AGENT_WORKFLOW.md`.

## Pull an authorized dashboard change

Avoid manual remote schema changes. If one already exists, do not invent a timestamp or hand-copy it. Link the correct project and run:

```bash
npx supabase db pull <descriptive-name>
npx supabase migration list --linked
```

Review the generated migration, replay it against a fresh local database, regenerate types, and commit it as one focused database feature.

## Troubleshooting

- **Docker is unavailable:** start Docker Desktop, then rerun `npm run db:start`.
- **Migration histories differ:** inspect `npx supabase migration list --linked`. Do not use `migration repair` until the correct state is understood.
- **Browser queries return no rows:** RLS has no permissive browser policies by design. Current repositories use a server-only privileged client.
- **Supabase is not configured:** verify `.env.local`, then restart `npm run dev`.
- **Generated types differ unexpectedly:** confirm whether `--local` or `--linked` was intended and that migrations match.

Before changing commands in this guide, run `npx supabase <command> --help` and check current official Supabase CLI documentation.
