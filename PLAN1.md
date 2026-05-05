# PLAN 1 — The Disciplined Campaign Workspace

> **Direction:** grounded / practical.
> Keep the seven-phase mental model, but rebuild every phase from scratch as a *purpose-built workspace* instead of a decorative showcase page. Each phase is a different *tool*, tuned to the work that phase actually requires.

This plan does not try to reinvent the format. It tries to make `TrendMind` feel like a serious, dense, well-engineered marketing workstation — closer in spirit to Linear, Figma, or a trading terminal than to a content generator.

The bet: judges will instantly understand the product because the seven-phase flow is legible at a glance, and the *quality of execution per phase* is what makes it feel premium.

---

## 1. Core interface idea

A single shell with three persistent zones and one summonable surface:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TopStrip  (32px)   campaign · status pill · share · export · ⋯           │
├────┬────────────────────────────────────────────────────────┬────────────┤
│    │ PhaseBar (36px)  Brief · Research · Strategy · Draft ·│            │
│    │                  Trial · Studio · Launch              │            │
│Nav ├────────────────────────────────────────────────────────┤  Director  │
│Rail│                                                        │  Drawer    │
│48→ │            PHASE WORKSPACE                             │  (summoned)│
│240 │            (custom layout per phase)                   │            │
│    │                                                        │            │
│    ├────────────────────────────────────────────────────────┤            │
│    │ PulseBar (24px)  ●● Trend Scout reading 42 sources… ▸ │            │
└────┴────────────────────────────────────────────────────────┴────────────┘
```

- **NavRail (left, 48px collapsed / 240px hover)** — campaigns, library, analytics, profile. Dark green spine. Replaces today's heavy 232px sidebar.
- **TopStrip (32px)** — campaign title, live status pill (`Strategy · running 1m 12s`), share, export. One row. No decorative chrome.
- **PhaseBar (36px)** — seven phase pills with status dots (`pending / running / ready / approved / stale`) and a tiny progress arc inside each pill. Click jumps phases. **Phases are not locked.**
- **PhaseWorkspace** — the canvas. Critically, **each phase has its own bespoke layout**. There is no shared "PHASE CANVAS" template with a giant title and description block. The canvas *is* the work surface.
- **PulseBar (24px)** — bottom-of-canvas live ticker showing the most recent agent action with a tiny pulsing dot. Click expands to a 200px ambient panel with the last ~10 actions. Replaces the right activity feed.
- **Director Drawer (right, summoned)** — 360px overlay drawer that slides in from the right *only when the user calls it*. Holds: full agent list, agent-specific reasoning, a "talk to Director" composer. Default state: hidden, with a 28px peek tab. Never a permanent layout citizen.

This shell already recovers ~470px of horizontal canvas and ~120px of vertical canvas vs. today, before any phase is rebuilt.

---

## 2. The seven phases — each as a custom workspace

The key idea of this plan: **each phase is its own workspace**, optimized for what that phase actually does. Below is what each one looks like.

### 2.1 Brief — "Captured Context"

A two-column layout where the left is a structured form and the right is *AI-generated context that grows as you type*.

```
┌──────────────────────────────┬──────────────────────────────┐
│  Brand · Audience · Goal     │   AI Context Pane            │
│  Platform · Tone · Constraints│   (live)                     │
│  Reference links             │                              │
│                              │   • detected industry        │
│                              │   • likely audience archetypes│
│                              │   • brand voice signals      │
│                              │   • known competitors        │
│                              │   • tone risk flags          │
│                              │   sources: …                 │
└──────────────────────────────┴──────────────────────────────┘
```

- The left side is dense, no oversized labels, no decorative paper texture.
- The right side fills automatically as the user types — Trend Scout and Brand Strategist quietly run in the background. Each suggested value can be `accepted / edited / dismissed` with a single click.
- No "Continue" button. When the brief crosses a confidence threshold (configurable), Research auto-starts; the user sees a 4-second cancel/hold pill (`Starting Research in 4s · hold`).

### 2.2 Research — "Evidence Board"

A three-column research board:

```
┌──────────────┬──────────────┬──────────────┐
│ Trend Signals│ Competitive  │ Audience     │
│              │ Landscape    │ Insights     │
├──────────────┼──────────────┼──────────────┤
│ • signal     │ • ad sample  │ • archetype  │
│ • signal     │ • ad sample  │ • objection  │
│ • signal     │ • ad sample  │ • desire     │
│              │              │              │
│ Brand Memory │ Risk Notes   │ Fact Checks  │
└──────────────┴──────────────┴──────────────┘
```

- Each card has a visible source chip (link), a confidence bar, and a small byline (`Trend Scout · 14:02`).
- The user can pin cards (they ride forward into Strategy), strike cards (they get hidden but recallable), or merge cards.
- A small "ask for more on this" inline action regenerates that single column without restarting the phase.

This is the phase that most resembles a real research analyst surface — denser than today, with much more evidence visible per square inch.

### 2.3 Strategy — "The Three Angles"

Three angle cards, side by side, with a shared rationale rail:

```
┌──────────┬──────────┬──────────┐
│ Safe Bet │ Sharp    │ Viral /  │
│          │ Take     │ Chaos    │
│ posture  │ posture  │ posture  │
│ promise  │ promise  │ promise  │
│ proof    │ proof    │ proof    │
│ risks    │ risks    │ risks    │
│ score    │ score    │ score    │
└──────────┴──────────┴──────────┘
   shared rationale rail (why these 3, who picks each)
```

- Three angle lanes are visualized *in parallel*, never as a single bullet list.
- Each card has a 1-sentence promise, a posture word (e.g. *Reassuring · Provocative · Outrageous*), proof points sourced from the research board (with hover-to-source), and a risk badge.
- The user can pin one or many to advance to Draft. By default, all three advance — the product wants you to see contrast.

This is the first place TrendMind visibly *bets on multiple directions in parallel*, which is the heart of the new product idea.

### 2.4 Draft — "Variant Matrix"

A matrix layout with one row per advancing angle and one column per dimension.

```
            Hook        Angle        Tone         CTA
Safe Bet    [ A ][ B ]  [ A ][ B ]   [ A ][ B ]   [ A ][ B ]
Sharp       [ A ][ B ]  [ A ][ B ]   [ A ][ B ]   [ A ][ B ]
Viral       [ A ][ B ]  [ A ][ B ]   [ A ][ B ]   [ A ][ B ]
```

- Each cell is a small editable card. Hover surfaces a tiny `regenerate · pin · drop` toolbar.
- A "Compose" button mixes one cell per column into a single full draft preview at the bottom — the user can compose multiple full drafts.
- The Performance Critic appears not as a separate panel but as **inline scribbles** on each cell (a single-line "this hook is too generic" with a regenerate suggestion). One critique-rewrite loop runs by default; a second only if scores are still low.

This is much denser and more tactical than today's three-lane drafting view. The matrix makes it physically obvious that draft variations are multi-dimensional, not just "three captions."

### 2.5 Trial — "Audience Simulator" *(the demo showpiece)*

A split layout: drafts left, an audience reaction stream right.

```
┌───────────────────────────┬───────────────────────────────┐
│  DRAFTS (selectable)      │  AUDIENCE REACTIONS           │
│  ┌──────┐ ┌──────┐        │  ┌─────────────────────────┐  │
│  │ A1   │ │ A2   │        │  │ @sara_27  ★★★☆☆        │  │
│  └──────┘ └──────┘        │  │ "I'd skip this — sounds │  │
│  ┌──────┐ ┌──────┐        │  │  like every other ad"   │  │
│  │ B1   │ │ B2   │        │  └─────────────────────────┘  │
│  └──────┘ └──────┘        │  ┌─────────────────────────┐  │
│                           │  │ @kareem.dev  ★★★★★      │  │
│  Persona panel (filter)   │  │ "Actually funny, I'd RT"│  │
│  • Skeptic   3            │  └─────────────────────────┘  │
│  • Target    5            │  ┌─────────────────────────┐  │
│  • Mocker    2            │  │ @noor.s     ★★☆☆☆       │  │
│  • Detractor 2            │  │ "This makes me cringe"  │  │
│                           │  └─────────────────────────┘  │
│                           │                               │
│                           │  Verdict:                     │
│                           │  Resonance 62 · Risk 41       │
│                           │  Why it works · Why it fails  │
└───────────────────────────┴───────────────────────────────┘
```

- Personas are generated to match the brief's audience plus typical sceptic/mocker archetypes from the PDF.
- Reactions stream in *one at a time*, with a visible typing pulse — this is intentionally cinematic for ~6–8 seconds, then settles.
- A bottom verdict block summarizes resonance, risk, why-it-works, why-it-fails, and proposes a refinement to send back into Draft. A single click does that.

This is the emotional center of the product. Even in a grounded design, this phase deserves a small bit of theatre because it is the unique selling point.

### 2.6 Studio — "Compose the Ad"

A real composition canvas, not a stack of stock images.

```
┌───────────────┬───────────────────────────────┬─────────────┐
│  Layout       │     LIVE AD CANVAS            │  Asset Tray │
│  templates    │                               │             │
│  ▢▢▢          │     [composed ad preview]     │  • bg img   │
│               │                               │  • product  │
│  Brand Panel  │                               │  • headline │
│  · palette    │                               │  • CTA      │
│  · type       │                               │             │
│  · logo       │                               │  Generate   │
│               │                               │  Layer ▸    │
└───────────────┴───────────────────────────────┴─────────────┘
```

- The center is an editable artboard. Layers (background, product image, headline, CTA, logo) are real layers, not flattened.
- Visual Director auto-fills with a first composition, but every layer can be regenerated, swapped, repositioned, locked.
- Brand panel enforces palette and type — the AI cannot drift outside it.
- A small "Show me 3" button generates three composition variants for the same draft.

This is the phase TrendMind 2.0 explicitly added because the older version skipped real visual production. Treating it as a layer-based artboard (closer to Figma than to Midjourney) makes it feel productized.

### 2.7 Launch — "The Press Pack"

A read-mode presentation of the final campaign:

```
┌──────────────────────────────────────────────────────────────┐
│  CAMPAIGN: <name>                       Status: Ready        │
├──────────────────────────────────────────────────────────────┤
│  Hero variant (winner)                                       │
│  ┌────────────────────────┐                                  │
│  │   final composed ad    │  Why this won · Trial verdict    │
│  └────────────────────────┘                                  │
│                                                              │
│  Alternates: B  C                                            │
│                                                              │
│  Platform versions: X · LinkedIn · Instagram · TikTok        │
│                                                              │
│  Risk & Response notes                                       │
│  · expected objections                                       │
│  · pre-written replies                                       │
│                                                              │
│  Publish ▸    Export ▸    Share read-only ▸                   │
└──────────────────────────────────────────────────────────────┘
```

- Launch is read-first, not edit-first.
- Risk & response notes are produced from the Trial phase verdict — the system already knows what skeptics will say, so it pre-writes replies for the community manager.
- Platform versions are generated as adaptations of the winner, not as separate drafts.

This phase visibly *delivers something*. It's the thing the user shows their boss.

---

## 3. Workflow model

The seven phases run **as a continuous chain** by default, but each phase is a real stop where the user can intervene.

- The system advances on **soft auto-approval**: when a phase reaches a confidence threshold, a 4–6 second cancel/hold pill appears, then the next phase starts.
- **No locked phases.** The user can click any phase pill at any time. If a downstream phase is empty, the workspace shows a quiet skeleton with `awaiting Strategy` rather than a full empty state.
- **Stale propagation.** If the user edits the Brief after Research has run, the Research/Strategy/Draft pills turn amber with `stale`, and the system offers to refresh only the affected sections.
- **Iteration is built in.** Trial can send a refinement back to Draft. Draft can send a question back to Research. Research can be re-run on a single column without re-running everything.

The user's mental model: *"I am supervising a small AI team that runs the campaign forward by itself, and I dive into any phase when I want to push back."*

---

## 4. How the AI shows up

- **In-place bylines.** Every produced block carries a small agent chip (`Trend Scout · 14:02 · 42 sources`). Clicking the chip opens that agent's reasoning trail in the Director Drawer.
- **Pulse Bar at the bottom.** A live one-line ticker of the most recent agent action. Tiny pulsing dot. Click to expand.
- **Director Drawer (summoned).** Holds the full team roster, per-agent reasoning history, and a composer to ask the Director to do something specific (`focus Strategy on a Gen-Z lens`). It is *never* permanently visible.
- **Critic as inline annotations.** Performance Critic does not get its own panel — its critiques appear as small inline notes attached to the cells they critique. This makes the critic feel like a colleague editing the doc, not a separate ceremony.
- **Audience as faces.** In Trial, agents momentarily become *humanized personas* with names, avatars, and reactions. This is the only phase where agents stop being utility roles and briefly become characters — that contrast is what makes the Trial phase land.

---

## 5. What makes this direction special

- **Each phase is a real tool.** The product stops feeling like a wizard with seven near-identical screens and starts feeling like seven specialized surfaces — research board, angle cards, variant matrix, audience simulator, ad composer, press pack. That alone separates it from generic AI marketing tools.
- **Density is a feature.** Today's TrendMind wastes huge amounts of vertical space on phase chrome. This plan removes the giant titles, descriptions, and decorative ribbons, and uses the space for actual research, drafts, and reactions.
- **The right rail is dead.** The single biggest layout problem in the current build is solved: there is no permanent agent panel. Agent presence is ambient (Pulse Bar) + inline (bylines) + summoned (Drawer).
- **Trial is the demo moment.** Even inside a grounded design, the audience-simulator phase is theatrical enough to make a hackathon judge lean forward. It is the part of the product that visibly *does more than generate copy*.
- **Launch is a real deliverable.** The product visibly hands the user a polished package with hero, alternates, platform versions, and pre-written objection replies. That makes the system look like it has executive function, not just generative function.

---

## 6. Why this fits the PDF

The PDF describes TrendMind 2.0 as a system that:

- discovers the strongest **angle** rather than writing one ad,
- explores **multiple directions in parallel**,
- runs an **audience simulation** to predict why an ad would land or fail,
- treats **visual production** as a real stage,
- and ships a **launch-ready package** with risk/response thinking.

This plan dedicates one purpose-built workspace to each of those ideas:

- Strategy → three angle lanes,
- Draft → variant matrix per angle,
- Trial → audience simulator with persona reactions,
- Studio → real layered ad composition,
- Launch → press pack with platform variants and risk notes.

It also keeps the seven phases visually present at all times via the PhaseBar, which is the easiest way for a hackathon judge to grasp the product in three seconds: *"Brief → Research → Strategy → Draft → Trial → Studio → Launch — got it."*

---

## 7. Risks and tradeoffs

- **Format is familiar.** This is recognizably a phase-based workspace. Some judges may read it as "another wizard, just nicer." Mitigation: lean hard on the Trial phase as the demo moment, and on the variant matrix as a non-wizard interaction.
- **Per-phase custom layouts increase build cost.** Seven workspaces is more work than one shared template. Mitigation: share a small set of primitives (cards, bylines, action toolbars, status pills) so each phase is composed, not coded from scratch.
- **Soft auto-approval can feel pushy** if the cancel pill is too short, or *passive* if it's too long. Needs tuning during the demo.
- **Density is harder to design.** Removing chrome forces the team to make every block legible without decoration. The visual language has to do the work that gradients and badges did before — through type, spacing, and motion.
- **Trial theatre is double-edged.** If overdone, it feels like a gimmick. The persona reactions must read as *useful* (each reaction must point at an actual flaw or strength), not just cute.
- **Studio is a real engineering surface.** A layered artboard with regeneratable layers is the most ambitious single screen in this plan. It can be scoped down to a "3-up composition picker" for v1 if needed.

---

## 8. One-line summary

> *TrendMind as seven precision tools sharing one disciplined shell — a marketing workstation, not a marketing wizard.*
