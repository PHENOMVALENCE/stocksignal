# Docker

The production image uses multi-stage Node 24 Alpine builds and Next.js standalone output. Only runtime dependencies, public assets, and generated static files enter the final non-root image.

Build and run:

```bash
docker build -t stocksignal .
docker run --rm --env-file .env.local -p 3000:3000 stocksignal
```

Environment variables are injected at runtime and local environment files are excluded from the build context. The shell needs no external credentials, so omit `--env-file` when only validating the foundation.

- Application: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`

Expected health response:

```json
{"status":"ok","service":"stocksignal"}
```

For multi-instance deployment, introduce a shared cache before relying on ISR or cross-instance revalidation.
