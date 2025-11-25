# Webapp Template Repo

Monorepo starter for a technical screen: Next.js frontend, NestJS backend, MySQL via TypeORM, Turborepo tooling, and Jest/Playwright tests.

## Quickstart

```bash
npm install
cp .env.example .env
npm run dev          # turbo dev (web + api) with docker-compose started automatically
```

## Scripts

- `npm run dev` – run web + api in dev mode (turbo). Depends on `start:docker-compose`.
- `npm run start:docker-compose` – bring up docker-compose stack (MySQL by default)
- `npm run lint` – eslint for all workspaces
- `npm run format` – prettier write-all
- `npm run test:unit` – unit tests (web + api)
- `npm run test:functional` – backend functional tests (Nest + supertest). Turbo runs `start:docker-compose` first.
- `npm run test:e2e` – Playwright E2E (web). Uses `npm run dev` via Playwright webServer.
- `turbo install` – runs `npm install` via Turbo (currently root only; extend later for node versions/Colima, etc.).

Per workspace you can filter: `npx turbo test:unit --filter=api` or `--filter=web`.

## Backend (NestJS + TypeORM)

- Hexagonal layout with controller/service/repository (port/adapters).
- `GET /users/:id` returns `{ id }` or 404.
- TypeORM config reads env (`DATABASE_*`). Uses MySQL by default; tests use in-memory SQLite.
- Functional tests live in `apps/api/test/functional`.

## Frontend (Next.js)

- Simple Home page with “Hello World” hero copy.
- Unit test via Testing Library; E2E via Playwright (`apps/web/tests/e2e`).

## Database

- `docker-compose.yml` runs MySQL 8 with defaults from `.env.example`.
- Schema: single `users` table with UUID primary key; TypeORM `synchronize` will create it in dev/test.

## Linting/Formatting

- ESLint with TypeScript + Next config.
- Prettier config shared across packages.
- `.npmrc` pins registry to npmjs.org for this project; `.nvmrc` sets Node 22.14.0.

## Notes

- Jest configs are TypeScript in each workspace.
- Dev ports: web `3000`, api `4000` (configurable via `PORT`).
