# TrendMind - Final Front-End Plan

This is the final mix we are choosing.

The foundation is `PLAN2`: the campaign should feel like one living artifact that writes itself in front of the user.

From `PLAN1`, we keep the idea that each phase must still feel purpose-built. The product should not turn into a flat "document with seven similar blocks." Each section needs its own work surface and its own logic.

From `PLAN3`, we keep only the theatrical energy of `Trial`. That phase should feel like the emotional centerpiece of the product, but we are not turning the whole app into a spatial board.

So the final direction is:

> TrendMind becomes one living campaign workspace, built as a single scrolling campaign artifact with inline phases, a hidden-by-default Inspector instead of a permanent agent rail, and a standout Trial experience that gives the product its special moment.

---

## 1. Core Product Direction

TrendMind should no longer behave like a phase-by-phase wizard where the user fills something, waits, clicks `Continue`, then moves to the next screen.

It should feel like one campaign artifact that grows from top to bottom:

`Brief -> Research -> Strategy -> Draft -> Trial -> Studio -> Launch`

The user opens a campaign and sees the whole shape of the work immediately. The sections exist from the start as part of one scrollable workspace. As the system works, each section fills in, stabilizes, and becomes editable.

The product should feel like:

- one campaign
- one workspace
- one continuous flow
- many specialized sections inside that flow

Not seven disconnected pages.

---

## 2. The Main Shell

The shell should stay disciplined and space-efficient.

On the left, there is still a slim navigation rail for campaigns, library, analytics, and account-level navigation. It should behave like a spine, not a heavy wall.

At the top, there is a very compact top strip for the campaign name, status, share, export, and the few highest-level actions.

Under that, there is a slim phase ribbon showing:

`Brief`, `Research`, `Strategy`, `Draft`, `Trial`, `Studio`, `Launch`

This ribbon is not a gate. It is a navigator. Clicking a phase jumps the user to that section inside the campaign workspace.

The center of the product is the campaign itself: one vertically scrollable workspace.

The right side should no longer be a permanent agent panel. Instead, it becomes a selection-aware `Inspector`. Most of the time, it stays hidden so the workspace gets the width it needs. When the user selects a research card, a strategy angle, a draft element, a persona reaction, or a visual layer, the Inspector opens and shows the relevant depth for that exact thing.

There can still be a light ambient activity surface, but not a big permanent rail. A small pulse bar or live ticker is enough for background activity.

So the shell becomes:

- a slim left rail
- a compact top strip
- a compact phase ribbon
- one large central campaign workspace
- a hidden-by-default Inspector on the right

That solves the biggest current layout problem immediately.

---

## 3. The Main UX Model

The campaign should write itself forward by default.

The user should not babysit the flow by pressing `Continue` after every stage. Instead, the system runs forward with soft auto-advance. When a section is ready, the next section begins unless the user pauses or intervenes.

All sections should be visible from the start as quiet skeletons, so the user always understands the full shape of the campaign.

Editing should feel intelligent. If the user changes something important in `Brief`, the downstream sections should become visibly stale. The product should make that cause-and-effect relationship clear instead of silently regenerating everything.

The user should feel like a supervising editor, not like a wizard-step operator.

That means:

- no locked phases
- no required `Continue` flow
- no dead waiting states
- no giant empty screens for not-yet-reached phases

The campaign should always feel alive.

---

## 4. Section Philosophy

This is where the final mix matters most.

We are keeping the living-document structure from `PLAN2`, but each phase still needs to behave like a real tool, as in `PLAN1`.

So the sections should live inside one campaign artifact, but they should not all look like repeated document cards.

Each section should answer the question: what kind of work is happening here, and what is the best surface for that work?

That is the rule for the whole redesign.

---

## 5. Section-by-Section Plan

### Brief

`Brief` should sit at the top of the workspace as the source-of-truth block.

It should be compact, dense, and inline-editable. No giant title area. No oversized decorative intro. No wasting the first screen on phase branding.

This section should clearly hold the campaign essentials: brand, audience, goal, platform, tone, references, and constraints.

AI suggestions can appear directly inside the fields, but the section should still feel like a clean, controllable source of truth.

Its job is not to impress visually. Its job is to establish the campaign cleanly and make downstream editing meaningful.

### Research

`Research` should become an embedded evidence board inside the campaign.

This section needs to feel richer and denser than the current UI. It should show actual useful findings, not decorative blocks. The structure from the earlier plans is the right one: a compact research grid that makes it easy to scan trend signals, competitive references, audience insights, risk notes, and fact checks.

Each research item should feel attributable and inspectable. The user should be able to click into it and see more through the Inspector.

This section should feel analytical and credible.

### Strategy

`Strategy` should become the place where the product clearly makes three angle bets in parallel.

This section should show three distinct angle cards side by side, with equal importance. The user should immediately understand that TrendMind is not producing one generic direction. It is surfacing multiple meaningful strategic lanes.

This section should feel like a decision surface, not a text dump.

The key thing here is contrast. The three angles need to feel clearly different in posture and direction, while still belonging to the same campaign.

### Draft

`Draft` should feel like a drafting tool, not a paragraph section.

The best direction here is the structured, compact drafting surface from the existing plans: the system generates multiple pieces of the draft such as hook, angle, tone, and CTA, then composes them into full variants below.

This keeps the section purposeful and interactive, while still fitting inside the living campaign artifact.

The important thing is that Draft must not look like "here are three big text blocks." It needs to visually communicate construction, comparison, and refinement.

Critique should appear inline, attached to the relevant draft content, instead of becoming a separate ceremony.

### Trial

`Trial` should be the showpiece.

This is where we take the emotional energy from `PLAN3` without changing the whole product model.

The section should stay inside the campaign workspace, but when it becomes active it should feel more dramatic than the surrounding sections. It can temporarily expand, gain more visual focus, and turn into a small audience-simulation theatre inside the scroll.

The user should see drafts under test, synthetic personas reacting, and verdicts forming in a way that feels alive and memorable.

This section is where judges should immediately understand that TrendMind is doing something more interesting than "generate ad copy."

But it is important that Trial still fits the rest of the product. It should be theatrical, not chaotic.

### Studio

`Studio` should become the visual production stage.

This section should not just show a finished image. It should feel like a real composition surface with a live ad preview and meaningful visual structure.

The right model here is the inline Studio from the earlier plans: the selected draft is turned into a composed ad preview with layers such as background, product, headline, CTA, and logo.

Inside the main document, this section should show the composed result. When the user wants to work on it more deeply, Studio can expand into a larger focus mode while still belonging to the same campaign artifact.

This section is important because it makes TrendMind feel like it goes beyond text.

### Launch

`Launch` should be the ending state of the campaign and the natural bottom of the artifact.

This section should feel read-first and presentation-ready. It should clearly show the selected winner, the alternates, the platform adaptations, and the risk/response notes carried over from Trial.

The user should be able to scroll from the brief all the way down to a clear, polished deliverable.

That continuity is one of the biggest advantages of this whole direction.

---

## 6. The Inspector and Agent Presence

The permanent right-side agent panel should be removed.

It is too expensive spatially, and it hurts the product more than it helps.

Instead, agent presence should be split into three lighter layers.

First, every meaningful block should have small inline attribution. Research items, strategy angles, drafts, reactions, and visual outputs should all quietly show who produced them.

Second, the product can keep a subtle ambient activity surface, like a pulse bar or ticker, so the workspace still feels alive even when the Inspector is closed.

Third, the right side becomes the `Inspector`. It opens only when the user selects something. It should show the exact depth relevant to the selected thing: reasoning, sources, alternatives, supporting evidence, or revision actions.

This gives the product depth without sacrificing canvas space.

If there is still a Director-style chat surface, it should be separate from the old permanent rail mentality. It should be summoned only when the user wants to give a higher-level instruction, not pinned open all the time.

---

## 7. Space and Layout Rules

The redesign should be ruthless about wasted space.

The current front-end spends too much room telling the user what phase they are on. The new version should spend that room on actual work.

So:

- phase headers must become much smaller
- repeated title-and-description hero blocks should disappear
- decorative chrome should stop pushing content below the fold
- the central workspace should win as much width and height as possible

The campaign should feel editorial in polish, but tool-like in discipline.

That balance is important. We are not trying to make the workspace boring. We are trying to make it intentional.

---

## 8. What We Are Explicitly Not Doing

We are not keeping the current phase implementations and lightly polishing them.

We are not keeping the permanent right-side agent rail.

We are not building the full spatial-board concept from `PLAN3`.

We are not letting the living-document idea flatten the product into seven similar content blocks.

And we are not designing the workspace like a landing page or a design showcase.

---

## 9. Why This Is the Right Mix

This direction keeps the strongest thing from `PLAN2`, which is that the campaign becomes one artifact that visibly writes itself and resolves into a deliverable.

It keeps the most important corrective from `PLAN1`, which is that each phase still has its own purpose-built surface and its own kind of work.

And it keeps the most memorable moment from `PLAN3`, which is the feeling that `Trial` is a real event inside the product, not just another static section.

That combination gives TrendMind a better chance of feeling:

- special enough to stand out
- clear enough to understand quickly
- polished enough to feel premium
- grounded enough to actually build

---

## 10. Final Summary

TrendMind should become a single living campaign workspace.

The campaign should be one scrollable artifact with seven inline phases:

`Brief -> Research -> Strategy -> Draft -> Trial -> Studio -> Launch`

The right-side agent rail should be replaced by a hidden-by-default Inspector.

Each phase should feel like a real specialized tool inside the artifact, not just another document card.

And `Trial` should be treated as the dramatic centerpiece that makes the whole product feel different from a normal AI marketing app.
