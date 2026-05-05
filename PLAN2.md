# PLAN 2 — The Living Campaign Brief

> **Direction:** balanced.
> The campaign is a single, continuously growing artifact — *one document* that the AI team writes top-to-bottom, and the user supervises and edits inline. Phases are not screens; they are sections of one scrolling brief that the system fills in front of the user's eyes.

This plan absorbs the strongest insight from the existing redesign exploration — *campaign as living document* — but corrects two of its weaknesses:

1. it preserves a real *selection-aware Inspector* on the right so deep AI reasoning is one click away (without becoming a permanent agent rail), and
2. it explicitly designs for the new TrendMind 2.0 phases (`Trial`, `Studio`, `Launch`), which the older redesign plan did not fully address.

The bet: this is the most differentiated workflow that a hackathon judge can still understand in 30 seconds, because the product literally *writes itself in front of them*.

---

## 1. Core interface idea

The campaign is one long, scrollable document. As the AI agents run, sections appear, fill themselves in, and stabilize. The user reads, edits inline, pins, dismisses, and asks for changes — never clicks "Continue."

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TopStrip (32px)   campaign · status · share · export · ⋯                 │
├────┬─────────────────────────────────────────────────────────┬───────────┤
│    │ PhaseRibbon (32px)                                      │           │
│    │  Brief · Research · Strategy · Draft · Trial · Studio  │           │
│    │  · Launch                                               │           │
│Nav │                                                         │           │
│Rail├─────────────────────────────────────────────────────────┤ Inspector │
│48  │                                                         │ (selection│
│    │                  CAMPAIGN DOCUMENT                      │  -aware)  │
│    │                  (one scroll, all phases)               │ default:  │
│    │                                                         │  hidden   │
│    │   ▢ Brief block        (filled, editable)               │ peek: 32px│
│    │   ▢ Research block     (filling, agent typing)          │ open: 360 │
│    │   ▢ Strategy block     (skeleton, queued)               │           │
│    │   ▢ Draft block        (skeleton, queued)               │           │
│    │   …                                                     │           │
│    ├─────────────────────────────────────────────────────────┤           │
│    │ PulseBar (24px) · live agent ticker · ▸ open            │           │
└────┴─────────────────────────────────────────────────────────┴───────────┘
```

- **NavRail** — 48px collapsed, 240px on hover. Campaigns, library, analytics. Spine, not wall.
- **TopStrip** — single 32px row.
- **PhaseRibbon** — 32px row of seven anchor pills. Click jumps the document to that section. Each pill shows status (`pending / running / ready / approved / stale`) and a tiny progress ring.
- **Document** — the entire workspace. One scroll, all phases stacked top-to-bottom.
- **Inspector** — the right side has a **selection-aware** panel, not an always-on agent rail. Default: hidden. When the user selects any block, it slides in (360px) showing that block's source agents, reasoning, sources, alternatives, and an inline composer to ask for changes. Click outside → dismiss.
- **PulseBar** — bottom-of-canvas live ticker.

The critical structural difference from the existing PLAN.md is the **Inspector**. The existing plan kills the right rail outright; this plan replaces it with a panel that only exists *while you're inspecting something*. That preserves the depth of an agent panel without the layout cost.

---

## 2. The document — what each section is

The document is the campaign. It has a fixed seven-section spine. Sections are visible as quiet skeletons from the moment the campaign is created — the user can always see the *full shape* of the campaign before it has been filled.

### 2.1 Brief section

A compact, dense, inline-editable block at the top. No giant title. No 2-line description. No "Phase 1 of 7" pill.

```
■ Brief
  Brand:    Acme Coffee
  Audience: 25–34, urban, aesthetic-driven
  Goal:     drive trial of cold-brew SKU
  Platform: X (primary) · IG (secondary)
  Tone:     dry, confident, slightly self-aware
  Refs:     acme.com · @acmecoffee · 2 ads pinned
  ── Brand Strategist & Trend Scout filled this in 6s ──
```

- Each field is a single inline editable line.
- AI suggestions are written in the same field, lightly styled until the user accepts (one click).
- The block has a small "this is the source of truth — change this and downstream sections will update" affordance.

### 2.2 Research section

A three-column research grid embedded in the document.

```
■ Research                                          [Trend Scout · live]
  ┌──────────────┬──────────────┬──────────────┐
  │ Trend Signals│ Competitive  │ Audience     │
  │ • signal     │ • ad sample  │ • archetype  │
  │ • signal     │ • ad sample  │ • objection  │
  └──────────────┴──────────────┴──────────────┘
  ┌──────────────┬──────────────┬──────────────┐
  │ Brand Memory │ Risk Notes   │ Fact Checks  │
  └──────────────┴──────────────┴──────────────┘
  Show 12 more sources ▸
```

- Cards stream in one at a time with a brief shimmer; the user sees the research happening.
- Each card has a source chip and confidence bar.
- Click a card → Inspector opens with that card's source content, agent reasoning, and a `pin / strike / merge / ask for more` toolbar.

### 2.3 Strategy section

Three angle cards inline.

```
■ Strategy                                [Brand Strategist · 12s ago]
  ┌──────────┬──────────┬──────────┐
  │ Safe Bet │ Sharp    │ Viral    │
  │ posture  │ Take     │ Bet      │
  │ promise  │ posture  │ posture  │
  │ proof×3  │ promise  │ promise  │
  │ score 78 │ proof×3  │ proof×3  │
  │          │ score 84 │ score 71 │
  └──────────┴──────────┴──────────┘
  Pin which advance to Draft:  [✓ Safe] [✓ Sharp] [✓ Viral]
```

- Three lanes are physically parallel and equal-weight.
- A single bottom toggle row decides which advance. Default: all three.

### 2.4 Draft section

Per advancing angle, a compact variant block.

```
■ Draft / Sharp Take                       [Content Architect · live]
  Hook       [A]  [B]  [+]
  Angle      [A]  [B]  [+]
  Tone       [A]  [B]  [+]
  CTA        [A]  [B]  [+]

  Composed drafts:
    ① "We don't sell coffee. We sell a 6am decision."  ★84
    ② "Your espresso is a personality test. Pass it."   ★79
```

- Each dimension shows two AI variants by default with a `+` to request more.
- "Composed drafts" are full ads built by mixing one cell per dimension. Click ★ to compare side-by-side.
- Critic is *inline*: a one-line note appears under any draft below threshold (`Hook lands too generic — try a number`). Single auto-rewrite loop runs by default.

### 2.5 Trial section *(the showpiece)*

The Trial section is where the document becomes *alive*. It's still inline in the document, but it expands into a small theatre:

```
■ Trial                                    [Audience Simulator · live]
  Drafts under test:  ① ② ③          Personas: 12 (mix)

  ┌─────────────────────────────────────────────────────────┐
  │ Reaction stream (live)                                   │
  │  @sara_27   ★★★☆☆   "I'd skip this — sounds like every    │
  │                       other ad" → re: ②                   │
  │  @kareem.dev ★★★★★  "Actually funny, I'd RT" → re: ①      │
  │  @noor.s    ★★☆☆☆  "This makes me cringe" → re: ③         │
  │  …                                                        │
  └─────────────────────────────────────────────────────────┘

  Verdict per draft
  ① Resonance 78 · Risk 32 · why it works · why it fails
  ② Resonance 41 · Risk 60 · ✱ refine                      [Send back ▸]
  ③ Resonance 64 · Risk 71 · ✱ tone too hot
```

- Reactions stream in over ~6–8 seconds with a typing pulse — controlled drama, not fake delay.
- Personas filter (skeptic / target / mocker / detractor / brand-aware). The user can mute, pin, regenerate.
- Each draft gets a verdict with a "Send back to Draft" pill that opens a *one-step* refinement loop without leaving the document.

### 2.6 Studio section

The visual stage rendered inline. The composed ad is built **into the document** so the user sees the campaign in its real form.

```
■ Studio                                   [Visual Director · live]
  Selected draft: ②  "We don't sell coffee. We sell a 6am decision."

  ┌──────────────────────────────────────────────┐
  │  [composed ad preview, 1080×1080]            │
  │                                               │
  │  layers:  bg · product · headline · CTA · logo│
  └──────────────────────────────────────────────┘
  Variants:  ▢ A   ▢ B   ▢ C    Brand-locked palette ✓
  Click any layer to regenerate or edit
```

- The composed ad sits inside the document — there is no separate Studio screen. Scrolling through the campaign feels like reading the brief and seeing the actual ads inside it.
- Layer interactions happen via the Inspector when a layer is selected.

### 2.7 Launch section

The bottom of the document is the deliverable.

```
■ Launch                                    [Campaign Director · ready]
  Hero variant      ┌──────────┐   Why this won (Trial verdict)
                    │  ad img  │
                    └──────────┘

  Alternates: B  C
  Platform versions: X · LinkedIn · Instagram · TikTok

  Risk & Response notes
  · expected objection #1   →  pre-written reply
  · expected objection #2   →  pre-written reply
  · expected mocker line    →  pre-written reply

  [Publish ▸]   [Export ▸]   [Share read-only ▸]
```

- The Launch section is the natural end of the document — scrolling to the bottom *is* arriving at the deliverable.
- Risk & response notes are produced from the Trial section, so the document literally *closes the loop* on the audience simulator.

---

## 3. Workflow model

The system streams the document forward by default. The user is an editor, not a clicker.

- **Open a campaign → the document begins writing itself.** Brief auto-suggests, Research starts, Strategy queues, Draft queues. Each section's skeleton is visible from second one.
- **The PhaseRibbon is a navigator.** Clicking a phase pill scrolls the document to that section. There is no concept of being "locked out" of a phase.
- **Soft auto-advance.** When a section is ready, a small inline pill appears (`Strategy ready · advancing to Draft in 5s · hold`). The user holds, edits, or lets it pass.
- **Edits propagate as diffs.** Editing a Brief field marks downstream sections `stale` (amber dot in the ribbon, amber outline on affected blocks). The user clicks `refresh affected` to re-run only what changed — Trend Scout doesn't redo work that's still valid.
- **Iteration is in-document.** Trial → Send back to Draft happens without navigation; the Draft section pulses, regenerates the targeted variant, and Trial re-runs against the new draft.
- **Read mode.** A `Read` toggle in the TopStrip hides the NavRail and PhaseRibbon and presents the document as a clean export-style read-through. Useful for demoing and for the final hand-off to a stakeholder.

The user's mental model: *"I'm reading and editing a campaign brief that the AI team is writing in front of me. I scroll to see what's next, I select to dig in, I never click Continue."*

---

## 4. How the AI shows up

- **Inline bylines on every block.** `Trend Scout · 14:02 · 42 sources`. Click → Inspector opens with that agent's reasoning trail.
- **Live "typing" effect on streaming blocks.** When a section is being filled, you see content appearing — controlled, not chaotic. This is the single most important affordance for "the AI is alive in this document."
- **Inspector (selection-aware).** The right panel is the deep view. Selecting a draft cell, a research card, a layer, a persona reaction — all open the Inspector with that thing's reasoning, sources, alternatives, and a composer. Closing the Inspector returns the canvas to full width.
- **PulseBar at the bottom.** A live ticker of the most recent agent action. Click → expands to a 200px ambient panel.
- **Director Drawer (rare).** A separate, summoned drawer for "talk to the Campaign Director" — used when the user wants to give a global instruction (`make the whole campaign more provocative`). Distinct from the Inspector, which is per-block.
- **Trial humanizes the AI.** In the Trial section, agents stop being utility roles and briefly become *named personas*. The contrast between the rest of the document (utility roles) and Trial (humans with reactions) is the emotional spike of the product.

---

## 5. What makes this direction special

- **The document writes itself.** This is the single most demoable behavior in the entire product. A judge opens the campaign and watches Brief → Research → Strategy → Draft → Trial → Studio → Launch fill in front of them. No other AI marketing tool does this.
- **Phases are sections, not gates.** The seven-phase mental model is preserved (so the product is still legible) but the wizard tax is gone — the user can scroll, scrub, peek, and edit anywhere.
- **The Inspector saves the right side.** Today's permanent right rail is the layout's biggest problem. Replacing it with a selection-aware panel keeps depth without cost — most of the time the document has the full canvas, but the moment the user wants reasoning, it's one click away.
- **The campaign is a real artifact.** Because everything lives in one document, the user can scroll to the bottom and *see the launch-ready deliverable* sitting at the end of the same scroll where the brief is at the top. The product visibly produces something.
- **Trial is dramatic without being a separate screen.** The audience-simulator theatre lives inline in the document, which means the demo flow is one continuous scroll instead of a series of jumps. That makes the demo feel inevitable.
- **Stale propagation makes the product feel intelligent.** Edits to the Brief don't silently re-render — they highlight what's affected. That single behavior makes the system feel like it understands cause and effect, which generic AI tools don't.

---

## 6. Why this fits the PDF

The PDF describes TrendMind 2.0 as a system where the campaign is a *single coherent piece of work* that goes through Brief → Research → Strategy → Draft → Trial → Studio → Launch, with parallel angle exploration, audience simulation, real visual production, and a launch-ready deliverable.

A living document model fits this because:

- A *campaign* is a thing — a deliverable — and the document model makes it look like one.
- The seven phases of the PDF map cleanly to seven sections.
- The three angle lanes from Strategy fit naturally side-by-side inside one section.
- The audience simulator in Trial is dramatic *because* it's inline — the user has just scrolled past the drafts and now sees the audience react to them.
- The final Launch section being literally at the bottom of the document means the campaign visibly *resolves* into a deliverable, which is exactly what the PDF describes.

The PDF's emphasis on *not being just a content generator* is captured by the fact that the document does Research, Strategy, Trial, and Launch around the generation — generation is one section out of seven, not the whole product.

---

## 7. Risks and tradeoffs

- **Long scroll.** A 7-section document can become unwieldy. Mitigation: collapsible sections, sticky PhaseRibbon, "focus mode" that dims non-active sections, and a `Read` mode.
- **Demo legibility.** Judges have to grasp "this is one document and the phases are sections" quickly. Mitigation: the PhaseRibbon at the top shows the seven anchors permanently, so the structure is always visible.
- **Inline Trial may underwhelm.** Inside a document, the Trial theatre is constrained. Mitigation: when the user enters the Trial section, the section can briefly become full-bleed (sticky, document dims around it) for ~10 seconds, then settles back. This gives Trial the cinematic moment without making it a separate screen.
- **Inspector vs Director Drawer overlap.** Two right-side panels (selection-aware Inspector, summoned Director Drawer) risk confusing the user. Mitigation: they share the same right gutter; only one is open at a time; the Director Drawer is reached by a single explicit button in the TopStrip.
- **Streaming UX is hard to get right.** Streaming has to feel intentional, not glitchy. Mitigation: every section reveals its skeleton first, then fills with controlled timing — never mid-section reflows.
- **Stale propagation is technically real work.** The product has to actually know which downstream sections are affected by which Brief edits. Mitigation: in v1, mark *all* downstream as stale on any Brief edit, and refine the granularity later.
- **The Studio section is the smallest part of the document.** Visual production deserves more space than a single block. Mitigation: clicking the Studio block expands it to a full-canvas mode (still inside the document, still scrollable above and below) so the user gets a real composition surface when they need it.

---

## 8. One-line summary

> *TrendMind as one living campaign brief that writes itself top-to-bottom — read it, edit it, watch it become a launch-ready deliverable.*
