# AGENTS.md

Guidance for Codex-like coding agents working in this repository.

## Project Overview

TrendMind is a Next.js campaign intelligence studio. It turns a campaign brief into staged outputs: research, strategy, copy drafts, synthetic audience testing, studio direction, and a launch package.

The project is an active prototype. Keep changes honest and scoped. Do not add fake users, fake metrics, fake screenshots, fake deployments, or unsupported claims.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

Use `TRENDMIND_DB_MODE=pglite` for local development without a cloud database.

## Build And Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run test` runs TypeScript plus a no-secret local repository check using in-memory PGlite.
It also runs `npm run check:encoding` to catch replacement characters and common mojibake markers in source and docs.

Smoke test:

```bash
npm run smoke
```

The smoke test requires `OPENROUTER_API_KEY` because synthetic fallbacks are disabled.

E2E test:

```bash
npm run test:e2e
```

The Playwright test builds the app and runs the browser workflow with explicit synthetic fallbacks and no external keys. Use `npm run smoke` for the real OpenRouter-backed pipeline.

## Important Directories

- `src/app`: Next.js App Router pages and API routes.
- `src/components/trendmind`: workspace UI.
- `src/lib/campaign-engine.ts`: staged AI campaign pipeline.
- `src/lib/campaign-repository.ts`: campaign persistence API.
- `src/lib/db.ts`: PGlite/Postgres runtime database layer.
- `src/lib/db/migrations`: SQL migrations.
- `src/lib/campaign-prompts.ts`: AI prompt construction.
- `scripts`: migration and smoke-test scripts.
- `tests`: Playwright tests.
- `docs`: architecture, roadmap, and application-support docs.

## Environment Variables

Only use variables that are actually read by the app. See `.env.example`.

Never commit `.env`, API keys, database files, `.trendmind-pglite`, `.vercel`, logs, or private data.

Key variables:

- `DATABASE_URL`
- `TRENDMIND_DB_MODE`
- `TRENDMIND_ALLOW_SYNTHETIC_FALLBACKS`
- `OPENROUTER_API_KEY`
- `OPENROUTER_BASE_URL`
- `OPENROUTER_MODEL`
- `OPENROUTER_FALLBACK_MODEL`
- `OPENROUTER_TIMEOUT_MS`
- `TAVILY_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Coding Style

Prefer existing project patterns over new abstractions. Keep TypeScript types explicit where they clarify campaign data shapes. Use structured parsing and validation for AI outputs. Keep UI changes consistent with the existing Arabic-first, RTL workspace unless the user explicitly asks for a redesign.

## Safe Implementation Guidelines

Make small changes and run the narrowest useful checks first. If touching the pipeline, inspect both `campaign-engine.ts` and `types.ts`. If touching persistence, inspect the migration and repository layer. If touching UI phase rendering, verify the affected phase with a browser or Playwright when practical.

Do not remove major product phases, agents, demo flows, or Arabic support without user approval. Do not silently enable synthetic AI fallbacks in production-like paths.

## Known Limitations

- Full campaign smoke testing currently requires `OPENROUTER_API_KEY`.
- Research search enrichment requires `TAVILY_API_KEY`.
- The current UI is a prototype and still needs stronger accessibility and responsive QA.
- Screenshot/demo assets are not yet committed.
- Test coverage is still thin around API routes, prompt normalization, and error states.

## Preferred Workflow

1. Check `git status --short --branch`.
2. Read the relevant code before editing.
3. Keep changes scoped to the request.
4. Update docs when behavior changes.
5. Run `npm run lint`, `npm run typecheck`, and `npm run build` for substantial changes.
6. Run `npm run test:e2e` for browser workflow changes. Run `npm run smoke` only when required credentials and time are available.
7. Report failures honestly instead of hiding them.
