# AGENTS.md — control-asistencia

Sistema web de control de asistencia para municipalidad. Monorepo con dos workspaces independientes.

## Structure

```
backend/   Express 5 + Prisma 7 + PostgreSQL + JWT (CommonJS)
frontend/  React 19 + Vite 8 + Tailwind 4 + React Router 7 (ESM)
```

No root-level package.json. Commands must run from within `backend/` or `frontend/`.

## Dev commands

**Backend** (run from `backend/`):
```bash
npm run dev          # node --watch src/index.js — no nodemon
npm run db:migrate   # prisma migrate dev
npm run db:seed      # seeds areas + fiscales with password fiscal123
npm run db:studio    # Prisma Studio GUI
npm run test         # jest --runInBand (sequential — tests dir is empty currently)
```

**Frontend** (run from `frontend/`):
```bash
npm run dev    # Vite dev server on :5173, proxies /api → localhost:3000
npm run lint   # eslint only — no typecheck (plain JS)
```

**Never run `npm run build` after changes** — user constraint.

## Backend architecture

- **Entry**: `src/index.js` — Express app with helmet, cors, rate-limit
- **Prisma client**: `src/lib/prisma.js` — uses `@prisma/adapter-pg` (driver adapter pattern, Prisma 7 requirement)
- **Auth**: JWT, 8h expiry, token in `Authorization: Bearer` header
- **Key middleware chain**: `authMiddleware` → `areaGuard` (on routes with `:trabajadorId`)
- **areaGuard** (`src/middlewares/area-guard.middleware.js`): prevents IDOR — verifies `trabajador.areaId === req.fiscal.areaId`. Apply AFTER `authMiddleware`. Attaches `req.trabajador` to avoid duplicate queries.
- **Routes**: `/api/auth`, `/api/trabajadores`, `/api/asistencia`, `/api/areas`
- **Login rate limit**: 10 req / 15 min (separate, stricter limiter on `/api/auth`)

## Prisma 7 quirks

- **Driver adapter is mandatory**: `PrismaPg` from `@prisma/adapter-pg` — NOT optional, Prisma 7 requires it for PostgreSQL
- Schema has no `url` in `datasource` block — URL comes from `prisma.config.ts` via `process.env.DATABASE_URL`
- `prisma.config.ts` is the Prisma config file (not schema); uses `tsx` to execute
- Migrations live in `prisma/migrations/` — one migration (`20260410001814_init`)
- Seed uses `upsert` for idempotency — safe to run multiple times

## Database schema (key facts)

- `Area` → `Fiscal` (one-to-many), `Area` → `Trabajador` (one-to-many)
- `RegistroAsistencia` has unique constraint `[trabajadorId, fecha]` — one record per worker per day
- `fecha` field is `@db.Date` (date only, no time)
- `EstadoAsistencia` enum: `PRESENTE | AUSENTE | DESCANSO_SEMANAL | DESCANSO_MEDICO | PATERNIDAD | VACACIONES`
- Fiscales have `activo` boolean — check before allowing login

## Frontend architecture

- **Auth state**: `AuthContext.jsx` — stores `{ fiscal, token }` in localStorage keys `token` and `fiscal`
- **API client**: `src/lib/api.js` — axios instance with base `/api`. Interceptors: auto-attach JWT, redirect to `/login` on 401
- **Routes**: `/login` → `Login.jsx`, `/` → `Asistencia.jsx` (protected via `RutaProtegida`)
- **Icons**: inline Heroicon SVGs only — Google Material Symbols do NOT load in this Vite setup
- **Tailwind 4**: uses `@tailwindcss/vite` plugin (not PostCSS). No `tailwind.config.js` needed.

## Seed credentials (dev only)

| usuario              | password  | área           |
|----------------------|-----------|----------------|
| fiscal.barrido       | fiscal123 | Barrido        |
| fiscal.lavado        | fiscal123 | Lavado de Calles |
| fiscal.recoleccion   | fiscal123 | Recolección    |
| fiscal.verdes        | fiscal123 | Áreas Verdes   |

## Environment

- Node v24 (user's installed version)
- Requires `DATABASE_URL` in `backend/.env` — see `.env.example` for format
- Frontend Vite proxy: `/api` → `http://localhost:3000` (both servers must be running for full-stack dev)

## Conventions

- Backend: CommonJS (`require`/`module.exports`) — do NOT use ESM `import` in backend files
- Frontend: ESM (`import`/`export`) — standard React/Vite
- Spanish variable and comment names throughout (nombres, trabajador, fiscal, área)
- Conventional commits format — no AI attribution in commit messages
