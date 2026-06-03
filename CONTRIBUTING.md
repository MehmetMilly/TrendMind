# Contributing

Thanks for your interest in TrendMind. This project is an active prototype for AI-assisted campaign intelligence.

## Local Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Use `TRENDMIND_DB_MODE=pglite` for local development unless you are testing Postgres behavior.

## Branches

Create a focused branch for each change:

```bash
git switch -c feature/my-change
```

## Checks

Before opening a pull request, run:

```bash
npm run lint
npm run typecheck
npm run build
```

Run `npm run smoke` when changing the campaign engine and an `OPENROUTER_API_KEY` is available. Run `npm run test:e2e` when changing the main browser workflow.

## Pull Requests

Keep pull requests focused. Explain what changed, why it changed, and which checks passed. If a check fails because it needs credentials or a local service, say that clearly.

## Useful Contributions

- More test coverage for the campaign pipeline.
- Better API route error handling.
- Accessibility and responsive UI improvements.
- Export formats for launch packages.
- Arabic localization QA and English campaign quality improvements.
- Documentation and demo walkthroughs.
- Safer AI output parsing and recovery paths.

## What To Avoid

Do not commit secrets, `.env` files, local database files, generated temp folders, or fake project claims. Do not remove major phases or Arabic support without discussing the direction first.
