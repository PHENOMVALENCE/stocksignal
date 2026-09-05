# Security

- Never expose `AT_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY`; both belong in server-only modules.
- Only explicitly public values may use the `NEXT_PUBLIC_` prefix.
- Validate all route, action, callback, and provider input at trust boundaries.
- Do not commit secrets, bake them into Docker images, log credentials or sensitive payloads, or return raw infrastructure errors.
- Authenticate privileged inventory mutations when authentication is introduced.
- Enable and test Supabase RLS before allowing browser access. Policies must enforce organization/row ownership.
- Rate-limit externally exposed mutation APIs and USSD/webhook callbacks where appropriate.
- Verify webhook or USSD callback authenticity where the platform supports it.
- Sanitize error responses while retaining useful server-side operational context.
- Pin dependencies through `package-lock.json`, monitor advisories, and review transitive risks.

The baseline schema enables RLS and grants no data policies. Server-only privileged access is the temporary foundation posture, not a final authorization design.

## Dependency policy

`npm audit` must report zero known vulnerabilities on `main`.

The Africa's Talking SDK pins older `axios`, `lodash`, and `joi` releases that
carry published advisories. Because the fixes exist upstream within the same
major version, `package.json` lifts them with `overrides` rather than
downgrading the SDK, which `npm audit fix --force` would otherwise do without
resolving the advisories. The SDK is verified to initialize against the lifted
versions. Revisit the overrides whenever the SDK is upgraded.

