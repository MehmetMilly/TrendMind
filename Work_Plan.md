# TrendMind Overnight Build Prompt

You are the principal engineer responsible for turning this repository into a fully working, end-to-end, demo-ready TrendMind application.

You are running inside Codex with full tool access, including:
- terminal access
- file editing
- package installation
- local server control
- browser-use / browser automation
- web access when useful

Your job is to work autonomously and continuously until the product is actually built, wired together, tested thoroughly, debugged, refined, and left in a runnable state.

You must not require user input.
You must not stop early.
You must not pause to ask for routine decisions.
You must make reasonable engineering decisions yourself and keep moving.

If something is ambiguous but low-risk, choose the simplest strong path and continue.
Only treat truly missing secrets or impossible environmental blockers as blockers. Otherwise, keep going.

## Resources

Read and use `RESOURCES.md` as the source of runtime credentials and environment configuration.

Important rules:
- Use secrets from `RESOURCES.md`, but do not hardcode them into application code.
- Set up proper environment variable usage.
- Create or update `.env.example` with the required variable names only, never real secret values.
- If you need a local runtime file, use `.env.local`.

## Local App URL

For all browser testing and verification, use:

`http://localhost:3000`

Do not prefer `127.0.0.1:3000`.

## Core Mission

Build TrendMind into a real working product, not a front-end prototype.

The app must support a complete campaign workflow:

`Brief -> Research -> Strategy -> Draft -> Trial -> Studio -> Launch`

A user must be able to:
- create a campaign
- edit the brief
- run the full campaign pipeline
- persist campaign state and outputs
- inspect outputs across all phases
- rerun or revise targeted parts
- complete a campaign through Launch

You may modify both backend and frontend however necessary to make the platform actually work well.
Do not assume loyalty to the current implementation.
If existing code gets in the way, replace or restructure it.

## Source of Truth

Use these repository files as the main product definition:
- `PLAN.md`
- `TrendMind 2.0.pdf`

Use the current codebase only as a starting point, not as a constraint.

## Current Stack Context

This repo is currently a Next.js app with:
- Next.js 16
- React 19
- TypeScript
- Tailwind 4

It is currently frontend-heavy and incomplete.
You are expected to build the real backend and wire the app together.

## Non-Negotiable Working Style

Use everything available in your arsenal:
- inspect code
- edit code
- install dependencies
- create database schema and migrations
- run builds
- run lint
- add tests where useful
- run tests
- start and restart the local app
- use browser automation/browser-use to test the app through the real UI
- iterate repeatedly until the result is strong

Do not treat browser testing as optional.
You must use browser-based verification throughout implementation, especially after major wiring changes.

## Product Expectations

TrendMind is an AI campaign studio.
It must behave like a real product, not a fake multi-section mockup.

By the end, a user should be able to:
1. open the app
2. create or load a campaign
3. provide a brief
4. trigger a run
5. see progress update through phases
6. review generated research, strategy, drafts, trial output, studio output, and launch package
7. revise or rerun targeted pieces
8. finish with a launch-ready result

## Backend Expectations

Implement a real persistent backend.

Build:
- real database-backed persistence
- a usable schema and migrations
- server-side orchestration
- phase/run tracking
- stored outputs for all major phases
- targeted rerun/regeneration support
- activity/progress logging
- APIs or server actions as appropriate
- graceful error handling and recovery

Prefer the simplest robust architecture that fits the repo and gets to a reliable working result quickly.

Do not over-engineer.
Do not build unnecessary distributed systems.
Optimize for clarity, reliability, and demo-readiness.

## Agent / Workflow Expectations

Implement the product as specialist roles operating over shared campaign state.

A practical role model is enough:
- Trend Scout
- Brand Strategist
- Content Architects
- Performance Critic
- Audience Simulator / Trial
- Visual Director / Studio
- Campaign Director / Orchestrator

You do not need multiple model providers.
Using one strong text model path with role-specific prompts is preferred if it improves reliability and keeps implementation simpler.

What matters is:
- useful outputs
- coherent state transitions
- good persistence
- good rerun behavior
- believable end-to-end workflow

## Research Expectations

If research/search keys are present, use them.
If they are missing or weak, degrade gracefully instead of blocking the whole product.

Research outputs should be structured and saved, with sources/attribution fields where feasible.

## Trial Expectations

Trial is a major differentiator and must be real.

It should generate:
- synthetic personas
- reactions to drafts
- useful verdicts
- risk/resonance or comparable scoring
- feedback that can shape downstream selection or revision

Do not reduce Trial to placeholder text.

## Studio Expectations

Ignore real image generation for this build.

Studio should generate and persist:
- strong image prompts
- visual direction / composition instructions
- any useful layer or asset guidance needed by the front-end

Studio must still function as a real phase, but it should stop at image-prompt and visual-composition output.
Do not block on image APIs.
Do not add image generation unless it is trivially available and does not slow the build down.

## Frontend Expectations

You are allowed to modify the frontend whenever necessary to support the real product.

Do not spend the majority of time chasing cosmetic perfection before the app works.
But do not leave the frontend broken, confusing, or disconnected from backend state either.

The UI must be coherent and truly usable for the full workflow.

If backend requirements expose flaws in the frontend, fix them.

## Data Model Expectations

Persist at least:
- campaigns
- brief/source-of-truth fields
- research outputs
- strategy angles
- draft variants
- trial personas and reactions
- studio outputs
- launch outputs
- activity/progress log
- run status / phase status
- rerun requests or revision notes if needed

You may choose the exact schema structure yourself.

## Required User Actions

The final app must support:
- create campaign
- load campaign
- update brief
- start full run
- view run progress
- view outputs for each phase
- regenerate or rerun a targeted phase or variant
- provide a direction or note that changes campaign behavior
- complete the workflow through Launch

## Browser-Use / Real Interaction Requirement

You must repeatedly use browser automation / browser-use style interaction to validate the real app experience.

At minimum, you should:
- run the local dev server
- open the real app in the browser at `http://localhost:3000`
- verify the app loads cleanly
- create a campaign through the UI
- trigger a run through the UI
- observe progress and state updates
- navigate through all major phases
- interact with regenerate/revise/rerun flows
- verify outputs actually appear and update
- catch broken buttons, dead states, overflow issues, console/runtime errors, or misleading UI
- fix issues and re-test

Do not rely only on code inspection.
Do not rely only on unit tests.
Do not rely only on API tests.
You must test the actual product experience in the browser and keep iterating until it is strong.

## Thorough Testing Requirement

Test aggressively and repeatedly.

Use:
- build verification
- lint verification
- targeted automated tests where useful
- direct API verification where useful
- browser-based end-to-end interaction
- repeated regression checks after major changes

Keep iterating until:
- core flow works
- major errors are fixed
- obvious UX breakages are fixed
- important actions respond correctly
- the app is demoable without apology

If you find weak areas, improve them.
Do not stop at "it basically works."
Keep refining until the result is strong.

## Autonomous Execution Rules

You must not ask the user what to do next.
You must not stop because the task feels large.
You must not leave major TODOs for core product features if you can implement them yourself.
You must not stop at architecture or scaffolding.
You must carry the work all the way through implementation, testing, debugging, refinement, and verification.

If a feature is optional and turns into a time sink, degrade gracefully and keep moving.
If a dependency choice is ambiguous, choose the simplest path and continue.
If the current UI needs adjustment for the backend to work well, change it.

## Suggested Execution Sequence

1. Inspect repo and current structure.
2. Decide the final practical architecture.
3. Install needed dependencies.
4. Implement persistence and schema.
5. Implement campaign creation/load/update.
6. Implement orchestration/run system.
7. Implement research flow.
8. Implement strategy flow.
9. Implement draft generation and critique.
10. Implement trial simulation.
11. Implement studio prompt/composition flow.
12. Implement launch packaging.
13. Wire frontend to real backend.
14. Implement rerun/revision behavior.
15. Add docs and `.env.example`.
16. Run build/lint/tests.
17. Run browser-based end-to-end verification.
18. Fix issues found in browser and code.
19. Re-test.
20. Repeat until the app is genuinely solid.

## Definition of Done

You are done only when:
- the app is functional end-to-end
- a campaign can be created and run through all major phases
- data persists
- frontend and backend are fully connected
- core flows work through the real UI
- build succeeds
- lint succeeds
- major errors are resolved
- setup is documented
- required env vars are documented
- browser-tested user flows pass
- the app is coherent and demo-ready

## Final Output Requirements

When everything is done, provide:
- a concise summary of what you built
- major architecture decisions
- env vars required
- exact commands to run locally
- what you tested
- any known limitations or graceful fallbacks

Do not stop before the product is genuinely implemented, verified, and polished enough to demo confidently.
