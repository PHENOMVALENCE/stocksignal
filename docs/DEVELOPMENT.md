# Development

## Prerequisites

- Git
- Node.js 24 LTS and npm
- Docker Desktop
- GitHub CLI (optional, recommended)
- Supabase account
- Africa's Talking account

## Setup

```bash
git clone https://github.com/PHENOMVALENCE/stocksignal.git
cd stocksignal
git switch codex-master-changes
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Docker

```bash
docker build -t stocksignal .
docker run --env-file .env.local -p 3000:3000 stocksignal
```

Open `http://localhost:3000` or check `http://localhost:3000/api/health`.

Use npm only. Keep Node, the Docker base image, and CI on compatible major versions. Integration credentials are optional for the shell but required when their service is called.
