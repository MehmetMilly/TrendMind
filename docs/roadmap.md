# Roadmap

TrendMind is an active prototype. The roadmap below focuses on making it more reliable, easier to review, and more useful as an open-source AI campaign tool.

## Short-Term Polish

- Add screenshots or a short demo walkthrough to the README.
- Clean up untracked local artifacts and keep the repository focused on app code and docs.
- Improve empty states and error states in the workspace UI.
- Document a reliable local demo path with PGlite.
- Add small examples of campaign briefs and expected launch outputs.

## Better Testing

- Add unit tests for prompt builders and AI output normalization.
- Add API route tests for campaign creation, updates, selections, revisions, and runs.
- Add a no-secrets smoke path that validates persistence and phase state transitions with deterministic fixtures.
- Expand Playwright coverage for brief editing, revision notes, selections, and launch rendering.
- Add accessibility checks for the core workspace.

## Better AI Pipeline Reliability

- Add stricter schemas for AI phase outputs.
- Add repair/retry handling for incomplete JSON.
- Improve status reporting when AI providers fail or time out.
- Separate provider configuration from phase orchestration.
- Add clearer warnings when research search is unavailable.

## Better Arabic And English Campaign Support

- Review Arabic strings and demo fixtures for natural tone.
- Add English demo fixtures and tests.
- Make language direction and RTL/LTR behavior explicit per campaign.
- Add localization QA notes for generated copy.
- Improve prompt guidance for Arabic market context without overclaiming.

## Better Deployment And Demo Experience

- Add a hosted demo setup guide.
- Add seeded demo campaigns that are clearly labeled as examples.
- Add screenshots and a short video/gif once the UI flow is stable.
- Document Vercel deployment requirements.
- Add database reset/seed commands for demo environments.

## Open-Source Friendliness

- Keep README, architecture docs, roadmap, and AGENTS.md current.
- Create focused GitHub issues for realistic future work.
- Add contribution guidelines for tests, UI fixes, docs, and AI pipeline work.
- Avoid fake traction claims and unsupported production-readiness language.
- Add changelog or release notes once the project starts cutting versions.
