# TrendMind

TrendMind is a campaign intelligence studio for turning a brief into:

- research-backed market signals
- multiple strategic angles
- draft campaign variants
- synthetic audience testing
- studio-ready visual direction
- a launch package with alternates and response guidance

## Local setup

Install dependencies:

```bash
npm install
```

Create your local env file from `.env.example`, then provide the integrations you want to use.

By default, the app runs in `pglite` mode for a reliable local demo and persists data in `.trendmind-pglite/`. If you want to use a real Postgres database instead, set:

```bash
TRENDMIND_DB_MODE=pg
```

## Run the app

For local development:

```bash
npm run dev
```

For a production-style demo:

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000).

## Useful scripts

```bash
npm run lint
npm run db:migrate
npm run smoke
npm run test:e2e
```

`npm run smoke` exercises the campaign pipeline through create, brief update, full run, targeted rerun, and persistence checks.

`npm run test:e2e` builds the app and runs the browser workflow test against the production server path.
