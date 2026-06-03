# Architecture

TrendMind is built around a campaign workspace. A user creates a brief, then the system moves through staged campaign phases and stores each phase as structured data.

## Main App Structure

- `src/app/page.tsx` loads the initial campaign bootstrap and renders the app shell.
- `src/app/api/campaigns` exposes campaign creation and workspace APIs.
- `src/app/api/campaigns/[campaignId]/run` starts campaign pipeline runs.
- `src/components/trendmind` contains the workspace UI, navigation, phase views, drawers, and inspector.
- `src/lib/campaign-engine.ts` runs the staged generation pipeline.
- `src/lib/campaign-repository.ts` reads and writes campaign state.
- `src/lib/db.ts` chooses between PGlite and Postgres and runs migrations.
- `src/lib/campaign-prompts.ts` builds AI prompts for each phase.
- `src/lib/types.ts` defines the campaign, phase, agent, and output data shapes.

## Campaign Flow

The product flow is:

```text
Brief -> Research -> Strategy -> Draft -> Trial -> Studio -> Launch
```

The brief captures the campaign context. Research gathers and synthesizes market signals. Strategy turns those signals into competing campaign angles. Draft generates copy atoms and variants. Trial simulates audience reactions and scores variants. Studio creates a visual direction and asset checklist. Launch packages the winning direction into final copy, alternates, response guidance, risks, and next steps.

## Data Persistence

Campaign data is stored in SQL tables created by `src/lib/db/migrations/0001_init.sql`.

The main persisted records are:

- campaigns
- campaign phase outputs
- campaign runs
- campaign activity logs
- campaign revisions

`TRENDMIND_DB_MODE=auto` uses Postgres when `DATABASE_URL` is reachable and falls back to PGlite otherwise. `pglite` is useful for local development and demos. `pg` requires a Postgres-compatible `DATABASE_URL`.

## AI And Agent Pipeline

The campaign engine represents phases as specialized agents:

- Director coordinates flow and launch decisions.
- Scout handles research signals.
- Strategist creates campaign angles.
- Architect builds draft variants.
- Simulator models audience reactions.
- Critic and Fact Checker reduce weak claims and risky output.
- Visual creates studio direction.

When `OPENROUTER_API_KEY` is configured, generation uses OpenRouter chat completions. Tavily search is optional and only used when `TAVILY_API_KEY` is available. Synthetic fallbacks are disabled by default; missing AI credentials produce explicit errors unless `TRENDMIND_ALLOW_SYNTHETIC_FALLBACKS=true` is set for a clearly scoped test or demo run.

## Testing Approach

Current checks include:

- ESLint for source quality.
- TypeScript `tsc --noEmit` for type checking.
- `scripts/encoding-check.ts` for UTF-8/mojibake regression checks.
- `scripts/local-check.ts` for no-secret repository and PGlite persistence checks.
- `scripts/smoke.ts` for an AI-backed campaign pipeline smoke test.
- `tests/app.e2e.spec.ts` for browser workflow stability.

The Playwright e2e path is deterministic and no-secret, using explicit synthetic fallbacks to verify browser workflow stability. The smoke path depends on `OPENROUTER_API_KEY` and verifies the real AI-backed campaign pipeline.

## Current Limitations

- Test coverage is still narrow.
- CI can validate lint, typecheck, and build without secrets, but full campaign smoke testing needs an AI key.
- The app has no committed screenshot walkthrough yet.
- AI output parsing is defensive but could use more focused tests.
- Arabic and English quality should be reviewed with real campaign examples.
- Export formats for launch packages are not yet implemented.

## Future Improvements

- Add unit tests for output normalization and prompt contracts.
- Add API route tests for campaign creation, updates, selections, revisions, and run status.
- Add a deterministic demo mode that is clearly labeled and never confused with AI output.
- Add screenshot-based README documentation.
- Add export formats such as Markdown, PDF, CSV, and slide-ready campaign decks.
- Improve accessibility and responsive QA in the workspace UI.
