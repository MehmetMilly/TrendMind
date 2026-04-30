# TrendMind — Workspace Redesign Plan

A bold, structural redesign that turns TrendMind from a five-screen phase wizard with a heavy right rail into a single living *campaign document* where AI agents work continuously in the background and the user supervises, steers, and refines.

---

## 1. Diagnosis — What is structurally wrong

The current product is a collection of beautiful screens stitched into a wizard. The issues are not visual; they are structural.

### 1.1 Structural UX problems

- **The wizard model fights the product idea.** TrendMind is sold as an AI workspace where agents collaborate, but the UX is `fill form → click Continue → wait → click Continue`. That makes the AI feel like a slideshow, not a team. Every "Continue" button in the current build is a confession that the system is passive.
- **Phases are isolated screens, not parts of one artifact.** When the user is on `Strategy`, they cannot see what the brief said, what research surfaced, or what's about to happen in drafting. There is no campaign — there is only the screen they happen to be on.
- **State is opaque.** A user has no sense of "what is the system actually doing right now, on what, by which agent, and how close is it to needing me?" The phase stepper and right rail both hint at this but neither answers it.
- **The agent panel duplicates itself.** Six big avatar tiles + a scrolling activity feed + a composer all describe the same thing: "agents are working." Three surfaces, one signal.
- **Continue/Back buttons are the wrong mental model.** Real campaign work is non-linear — you go back to brief from drafting all the time. The current model treats that as a phase regression.
- **The workspace doesn't feel intelligent.** Nothing the system does surprises or assists the user. The AI is invisible until a phase advances.

### 1.2 Structural UI / spatial problems

- **The "PHASE CANVAS" pattern wastes the top of every screen.** Every phase reuses: outer canvas chrome (40px) → giant `<icon> Title + 2-line description` (≈90px) → `Phase X of 5` pill → another section kicker → then the actual content. That's **~150px of vertical chrome before any campaign content appears**, on every screen. In a 720-tall canvas, that's >20% of vertical space spent on saying "this is the brief phase."
- **The right rail is too wide and always in the way.** 300px on a workspace that already loses 232px to the left sidebar leaves the canvas in the ~700–800px range — too narrow for `Strategy` (8 sub-blocks) and `Drafting` (3 parallel lanes). It is the single biggest cause of the squeezed feeling visible in screenshots 5–10.
- **The brief phase wastes the entire right half of the canvas.** A long single-column form sits in roughly 50% of the canvas width with the other half blank. It looks like an invoice, not a workspace.
- **Decorative chrome is competing with content.** Cream gradients, gold pill badges, kickers, sub-kickers, ribbon banners ("DRAFTING WORKSPACE · CRITIC ACTIVE"), oversized emoji-style icons — each is fine alone, but stacked they push real content below the fold.
- **Hierarchy is performative, not functional.** The most prominent thing on each screen is its own title. The least prominent thing is often what the user has to act on.

### 1.3 Aesthetics in the wrong surface

The current visual language — cream paper, soft greens, gold accents, editorial type — is genuinely strong. But it is being deployed like a *brochure for the product*, not like a workspace tool. That energy belongs on the future homepage / landing. Inside the workspace, the same palette should serve clarity, not perform luxury.

---

## 2. Organizing idea — *Campaign as a living document*

> **TrendMind should not be a five-screen wizard with an agent panel attached. It should be a single, continuously-updating campaign document that AI agents are visibly building, scored against a clear set of stages, with the user as the supervising editor.**

This single shift unlocks everything else:

- The phase navigation becomes **section anchors in one document**, not gates between screens.
- The right rail dies. It is replaced by **inline agent attribution + an ambient activity ribbon + a summoned director drawer**.
- "Continue to Research" buttons disappear. The system **streams forward by default**; the user intervenes only when they want to.
- Every later block is *visible-but-pending* from the start, so the user always sees the full shape of the campaign.

This is the same conceptual move as: Notion docs (sectioned single artifact), OpenAI Canvas / Anthropic Artifacts (one editable artifact + side conversation), Linear's issue page (atomic doc with an activity rail), GitHub Copilot Workspace (agent operations inline with the file), Granola (notes + ambient transcript ribbon), Cursor's agent mode (you watch the work happen, you don't click Next). None of those products use a phase wizard.

This idea also resolves the brief's hardest constraint: **the workspace should feel active, intelligent, and product-like, not slideshow-y.** A streaming document is active by definition.

---

## 3. Workspace philosophy — Principles the redesign is bound to

These are the rules the rebuild must obey. They are deliberately strict.

1. **One artifact, many phases.** Every campaign is one scrollable document. Phases are sections, not screens.
2. **The system runs by default.** Buttons are for *intervention*, not *advancement*. Approval is implicit (timed) unless you object.
3. **Agents are inline, not in a panel.** Every block carries the byline of the agent(s) who produced it. Hover/click reveals that agent's reasoning. The agent panel becomes a *summoned* surface, not a layout citizen.
4. **The canvas owns the screen.** Sidebar collapses. Top bar is single row, ~36px. Phase nav is ~32px. Activity ribbon is ~28px. The campaign content gets ≥80% of vertical and ≥75% of horizontal at all times.
5. **Information density is a feature, not a flaw.** Polished doesn't mean spacious. Real workspaces (Linear, Figma, Notion) are dense.
6. **Decorative chrome is taxed.** Every gradient/badge/divider has to defend its existence in pixels.
7. **The premium feeling is in *typography, restraint, and motion*, not in ornaments.** Save expressive design energy for the future landing page.
8. **Collapsibility everywhere.** Sidebar, drawer, every block. Workspace adapts to what the user is doing right now.
9. **Diff-aware updates.** When research updates because the brief changed, the document shows what changed and why, not a silent re-render.
10. **No locked phases.** All sections are visible from second one. Future sections render as quiet skeletons with status; the user can scroll, peek, plan ahead.

---

## 4. Layout system — The new shell

### 4.1 Three-region shell with ambient ribbon

```
┌──────────────────────────────────────────────────────────────────────┐
│ TopBar  (36px)  campaign title · status · share · export · ⋯         │
├────┬────────────────────────────────────────────────────┬────────────┤
│    │ PhaseRibbon (32px)  ● Brief  ● Research  ● Strategy ● Drafting  │
│    │              ● Imagery  ○ Results                                │
│Nav ├────────────────────────────────────────────────────┤  Director  │
│Rail│                                                    │  Drawer    │
│56→ │              CAMPAIGN DOCUMENT                     │  (hidden / │
│256 │              (single scroll, all blocks)           │   peek /   │
│    │                                                    │   open)    │
│    │                                                    │            │
│    ├────────────────────────────────────────────────────┤            │
│    │ ActivityRibbon (28px) · live agent ticker · ▸ open │            │
└────┴────────────────────────────────────────────────────┴────────────┘
```

- **Left NavRail** — replaces the current 232px dark sidebar. Default state: **56px icons-only**. Hover/click expands to **256px**. Holds: logo, Library, Analytics, Campaigns/threads, user. Dark green stays — but as a thin spine, not a wall. **Saves ~176px of horizontal space.**
- **TopBar** — single 36px row. Campaign title (left), thread switcher inline, **live status pill** ("Strategy · drafting in 2m"), share/export/⋯ (right). The current ad-hoc "dark mode toggle" + dot menu cluster is consolidated.
- **PhaseRibbon** — replaces the current `PhaseNav`. Single 32px row with anchor pills. Each anchor shows status (`pending / running / ready / approved`) and an agent count. Click = scroll to that section in the document. No locks. Filled state shows a tiny progress arc per phase.
- **DocumentArea** — the main scrollable region. **All phase blocks render here in order**, top to bottom: Brief → Research → Strategy → Drafting → Imagery → Results. Everything below the active block is visible as a quiet skeleton with state.
- **ActivityRibbon** — replaces the activity feed. A 28px bottom-of-canvas ticker showing the most recent 1–2 agent actions, with a live time stamp. Click expands to a 240px ambient panel with the last ~12 actions. Never wider, never modal.
- **DirectorDrawer** — replaces the right `AgentRail`. Three states: **hidden** (default), **peek** (40px right tab showing a vertical "Director" label + 2 mini-avatars indicating active agents), **open** (380px overlay drawer, shadow over canvas, dismissible). Only opens when summoned. Never permanent.

### 4.2 Layout states

| State                                  | NavRail | Document   | Drawer   | Use                              |
|----------------------------------------|---------|------------|----------|----------------------------------|
| Default (working)                      | 56px    | full       | hidden   | most of the time                 |
| Browsing campaigns                     | 256px   | dimmed     | hidden   | switching threads                |
| Talking to an agent / reviewing reasoning | 56px | full     | open 380 | summoned only                    |
| Watching live agent action             | 56px    | full       | peek 40  | system is busy, user is ambient  |
| Read mode (final review / present)     | 0       | full bleed | hidden   | export-style read-through        |

### 4.3 Space budget (vs. today)

At 1440 wide × 800 tall:

| Region              | Today        | Redesigned (default) | Δ        |
|---------------------|--------------|----------------------|----------|
| Left sidebar        | 232px        | 56px                 | +176px   |
| Right rail          | 300px        | 0px (drawer summoned)| +300px   |
| TopBar height       | 48px         | 36px                 | +12px    |
| PhaseNav height     | 38px         | 32px                 | +6px     |
| Canvas chrome (per phase) | ~150px | ~32px                | +118px   |
| **Net canvas gain** | —            | —                    | **~+476px horizontal, ~+136px vertical** |

That is roughly **40% more usable canvas area** before redesigning a single block.

---

## 5. The agent system redesign

The current `AgentRail` is doing three jobs at once and doing none well: status display, activity log, conversational interface. Split them.

### 5.1 Inline agent attribution (replaces the avatar grid)

Every block in the document has a small byline:

> *Authored by **Brand Strategist** · refined with **Trend Scout** · 4m ago*

with two micro-avatars. Hover = tooltip with current status. Click = opens the **DirectorDrawer** scoped to that agent (their recent thinking, prompts they used, references they leaned on, "ask them" composer).

This collapses the 6-avatar grid into context-relevant cues that exist exactly where the user already needs them.

### 5.2 Activity ribbon (replaces the activity feed)

A 28px strip at the bottom of the canvas. Default content: a single live line.

> `● Performance Critic — re-scoring Variant B (pass 2 of 2) · 12s`

Behavior:
- Rotates through the top 1–2 ongoing actions every ~6s, no flashing.
- Has a tiny segmented progress strip on the right showing aggregate phase progress.
- Click anywhere on the ribbon to expand into a **240px ambient drawer** (slides up over canvas) with the last ~12 actions, grouped by phase.
- Press `Esc` or click outside to dismiss.

This is the equivalent of Linear's bottom toast, Granola's transcript bar, or Figma's presence row — quiet, persistent, never invasive.

### 5.3 Director drawer (replaces composer + agent panel modal)

Right-edge summoned drawer (380px, overlay with backdrop blur, not layout). Three uses:

- **Talk to the Campaign Director** — global ask: "tighten the tone" / "make Variant C punchier" / "swap holiday for winter framing." Director routes to the right specialist agent.
- **Talk to a specific agent** — opened from any inline byline. Scoped to that agent's work.
- **Intervene in a running phase** — if the user opens the drawer while a phase is running, it shows a *steering* affordance: pause, revise the brief, redirect, fork.

Drawer states:

- **Hidden** (default) — 0px.
- **Peek tab** (40px) — a thin vertical strip with a "Director" label and 2 active-agent dots. Appears any time at least one agent is actively working. Single click = open.
- **Open** (380px) — overlay over canvas, never pushes layout.

### 5.4 Why this is better

- Status is shown *where the work lives* (inline bylines), not in a separate column.
- Activity is **ambient**, the way it should be — visible without being demanding.
- Conversation with agents is **summoned**, not always-on.
- Total horizontal cost in the default state: **0 px**. Total horizontal cost when actively talking to an agent: 380 px overlay (canvas dims, content remains). At no point does the right rail steal layout space.

---

## 6. The phase model redesign — From wizard to streaming document

### 6.1 Phases become document sections, not screens

`Brief / Research / Strategy / Drafting / Imagery / Results` are sections in **one** scrollable document. Each section is a **block** with:

- A 28px sticky sub-header (section name + status chip + agent bylines + "collapse" affordance).
- Its body content (redesigned per phase, see §7).
- An optional **inline action bar** at the bottom of the block: `Approve · Refine · Regenerate · Talk to <Agent>`.

States per block: `Pending` (skeleton + placeholder summary), `Running` (live shimmer + agent ticker per block), `Ready` (full content, awaiting acknowledgement), `Approved` (compact "approved" treatment, can re-expand).

### 6.2 Streaming flow, not gated flow

- The moment the brief has the minimum required fields, downstream agents start. No "Continue to Research" button is ever required. The button can be offered as an *accelerator* ("Run all now") but never as a gate.
- As the brief is edited, downstream blocks re-flow with a **diff hint** ("research refreshed because target audience changed — review changes").
- The user can scroll into Strategy while Research is still running — they'll see Strategy's skeleton with the message "waiting on Research insights" and the live ribbon for that block.

### 6.3 Approval is implicit by default

Each "Ready" block auto-approves after a soft cooldown (e.g. 90s, configurable). A subtle countdown is shown on the block's status chip ("auto-approves in 1m 14s"). The user can:

- Approve now.
- Refine inline.
- Pause (block won't auto-approve).
- Regenerate with a steering note.

This eliminates "click Continue" as a UX requirement while preserving control. The user is the editor, not the operator.

### 6.4 Phase ribbon ↔ document

The PhaseRibbon at the top of the canvas:

- Acts as a sticky table of contents.
- Click = smooth-scrolls to that section.
- Each pill shows live state and a 4px progress arc.
- The currently-visible section is highlighted (scroll-spy).
- No phase is locked. Skeletons handle "not yet ready" gracefully.

---

## 7. Per-phase rebuild specs

Per the user's directive: assume current phase implementations are discardable. Each spec below is a **rebuild from zero**.

### 7.1 Brief — *Configuration block, not a form screen*

**Today:** A long, single-column form taking ~50% of canvas width with the other half blank, separated into ~6 vertical sections.

**Rebuild:**

- Render as a **dense 3-column grid** inside one block:
  - Column 1: Identity (title, brand, business type, platform, language)
  - Column 2: Direction (goal, audience, focus)
  - Column 3: Voice & guardrails (tone, brand pillars, banned phrases, extra context)
- Inputs are inline-edit text (Notion / Linear style), not boxed form fields. Click to edit, blur to save.
- A 2-line **summary header** at the top: `"Q4 Holiday Push" · X · English · Premium lifestyle gifting` — auto-generated from current state, always visible when the brief is collapsed.
- The "Save Draft" button dies. Saving is automatic, the timestamp is shown subtly in the block's byline ("auto-saved 8s ago").
- The "Continue to Research" button dies. As soon as required fields exist, the Research block below starts running.
- When the user edits a field after agents have started, the block shows a 14px chip: `↻ Research will refresh on next pass — undo`.

**Why:** Forms in workspaces should feel like docs, not surveys. This pattern recovers ~40% of vertical space and removes wizard semantics.

### 7.2 Research — *Evidence layer, scannable in seconds*

**Today:** Hero audience card, demographic clusters, motivation columns, then four trend reference cards. Strong content. Right rail squeezes it.

**Rebuild:**

- Two-pane block layout, full canvas width:
  - **Left 60%: Audience synthesis.** A single condensed audience card (hero), four demographic chips in a row (not a 2×2), and the three motivation/behavior/preference columns stay but become a single 3-col row, dense.
  - **Right 40%: Trend signals.** A vertical list of trend cards (4–8) with image thumbnail at left, title + 2-line summary, signal strength bar, source tag. Each card is ~80px tall, not 200px tall. Image previews load inline.
- Sticky sub-bar inside the block: `Research · by Trend Scout & Brand Strategist · 4 audiences · 6 trend signals · 3m`.
- "Source" links open the Director drawer with the citation, not a new window.
- Refresh affordance: `↻ Pull more signals` runs Trend Scout again with a steering prompt.

**Why:** Research is a *reference layer* the user scans then forgets. It should be fast to skim and easy to come back to. The current giant cards optimize for first-impression, not for usefulness.

### 7.3 Strategy — *Strategic foundation as a wall, not a stack*

**Today:** Eight sub-blocks (summary, positioning, messaging direction, angle, emotional territory, brand pillars, banned phrases, guardrails, content principles) stacked vertically. Compressed into ~700px because of the right rail.

**Rebuild:**

- Use the recovered ~476px of horizontal width to render strategy as a **full-bleed strategy wall**, in a structured 12-column grid:
  - **Top row: Positioning Statement** (full width, large editorial quote treatment — this is the only place we keep showy typography because it's the campaign's north star).
  - **Row 2: Campaign Angle (8 col) | Emotional Territory (4 col).**
  - **Row 3: Messaging Direction principles (6 col) | Content Principles (6 col).**
  - **Row 4: Creative Guardrails — DO/AVOID** (full width, dense two-column do/avoid table, not card stack).
- The "Campaign Summary" duplicate block is **deleted** — it just restated the brief. Replaced by a single subtle line at the top of the strategy block: `Strategy derived from: Q4 Holiday Push · Premium lifestyle gifting · 6 trend signals · soft luxury mood`.
- All sub-blocks are inline-editable. Edit any of them and a `↻ regenerate downstream` chip appears.
- Each guardrail row shows which agent will enforce it downstream (Performance Critic / Brand Strategist).

**Why:** Strategy is information-dense by nature. It needs the full width. The right rail being gone is what makes this possible.

### 7.4 Drafting — *Three lanes that breathe*

**Today:** Three variant lanes, each a tall stack of: header → score → sub-scores → iteration history → CTA → hashtags → critique. Right rail makes them ~230px wide each.

**Rebuild:**

- Three lanes side-by-side, full width (~440px each at 1440 viewport).
- Each lane is a **vertical column with three collapsible sub-sections**, default state:
  1. **Draft body** (current revision, large, the main thing).
  2. **Score & sub-scores** (collapsed by default into a 32px summary row showing score + delta + a "view sub-scores" affordance).
  3. **Iteration history** (collapsed by default into "2 versions · expand").
  4. **CTA + hashtags + critique** (single dense footer row).
- The hero "DRAFTING WORKSPACE · CRITIC ACTIVE · 3 in flight · 2 of 2 passes · +18 uplift" banner is **deleted**. That information moves into the section sub-header (sticky 28px) where it belongs.
- A new affordance per lane: `Pin as final` / `Reject` / `Fork`. Forking creates a fourth lane.
- Live critique animations: when a critic is scoring, the lane shows a 2px scrolling underline animation, not a flashing badge.

**Why:** The current lanes have 6+ visual sections each in a narrow column — they look like ledgers. Letting the body breathe and pushing meta-info into collapsibles makes drafts feel like writing.

### 7.5 Imagery — *New phase, paired with drafts*

This is the new sixth phase between Drafting and Results.

**Layout:** A block with two tracks:

- **Top: Mood synthesis** (full width, 80–100px) — a single horizontal band of 6–8 reference thumbnails the Visual Director has assembled, with a 1-line synthesis ("warm editorial · paper textures · muted palette · low warmth lighting"). Locked to the strategy mood territory.
- **Body: Variant imagery grid** — for each surviving copy variant (A, B, C — or whichever the user pinned), 3 generated images per variant, in a 3×N grid. Each image has:
  - Hover: prompt used, agent who generated it, regenerate button.
  - Click: opens DirectorDrawer with full prompt, references, regenerate-with-steer.
  - Pin: marks an image as the variant's selected hero image.
- **Sub-header status**: `Imagery · by Visual Director · 3 variants · 9 images · 1 pinned`.

**Pairing rule:** Every copy variant must have at least one pinned image to advance to Results. If no image is pinned, Results' block shows "1 image needed for Variant B."

**Why a separate phase, not a sub-track of Drafting?** The user explicitly chose this. Functionally it makes sense: image generation is its own creative act, with its own references, its own steering, its own outputs. Folding it inside the drafting lanes would crush the lanes (they're already dense) and would conflate two different review cadences (text iteration vs. image curation). A dedicated phase also gives Visual Director a real home in the agent narrative.

### 7.6 Results — *Final assembly, ready-to-ship*

**Today:** Placeholder.

**Rebuild:**

- A block that renders the **final shippable artifacts**, one card per pinned variant:
  - Twitter/X-style preview (real proportions, not cards-of-cards).
  - Pinned hero image.
  - Final copy.
  - CTA + hashtags inline.
  - Per-post critic summary, audience fit score, trend-signal alignment.
- Above the cards: a **comparison table** — variants × dimensions (hook strength, brand fit, emotional resonance, predicted CTR) — read in 5 seconds.
- Top-right of the block: `Export bundle · Schedule · Hand off`. Export = zip with copy, images, prompts, references, agent rationale. Hand off = sends to a downstream tool / generates a brief for a human team.
- A small "campaign retrospective" affordance opens a Director drawer summarizing what each agent contributed.

**Why:** Results should feel like the *deliverable*, not another screen of cards. The post should look like a post.

---

## 8. Workflow choreography — How it feels in motion

A user opens TrendMind:

1. NavRail icons-only. TopBar shows campaign title + status pill (`brief · awaiting input`). PhaseRibbon shows 6 anchors, only Brief is `running`.
2. They fill the brief. The instant required fields exist, the **Research block below quietly turns on**. Activity ribbon: `● Trend Scout — scanning seasonal signals`.
3. They scroll down. They see Research populating block-by-block (audience first, then trends as they come in). No spinner takeover — the block fills as content lands.
4. The user keeps reading. By the time they hit Strategy, Brand Strategist has already started shaping a positioning statement. Strategy block is `running`, with two skeleton blocks and a live positioning quote being typed in.
5. The user disagrees with the positioning. They click `Refine` on that sub-block, type "less editorial, more confident." A regeneration starts. Activity ribbon updates. The downstream Drafting block (which had started) shows: `↻ pausing — strategy is changing`.
6. By the time the user reaches Drafting, three lanes are filled and being scored. They pin Variant A and C, reject B. Imagery block below now generates only for A and C.
7. They scroll into Imagery, look at 6 images, pin one per surviving variant. Results block self-assembles.
8. Done. They click `Export bundle`. No "Continue" was ever pressed.

Throughout: no panel ever pushed the canvas. The Director drawer opened twice (once to read Brand Strategist's reasoning, once to ask for a tone change) and dismissed itself. The ActivityRibbon was always 28px, never more.

This is the difference between a workspace and a wizard.

---

## 9. Visual language — Polished, but disciplined

Keep:
- Cream/paper canvas, dark green spine, gold accent. The palette is genuinely strong.
- The editorial typography on the Positioning Statement and on campaign titles. That's the one place expressive type earns its keep.
- The micro-component vocabulary: pill chips, agent avatars (smaller), score bars, signal-strength bars, banded section labels.

Reduce:
- Gradient surfaces inside content. Confine gradients to the shell (sidebar, top bar) and to the Positioning Statement.
- Decorative kickers ("BRIEF CANVAS", "DRAFTING WORKSPACE — CRITIC ACTIVE"). Replace with one 28px sticky sub-header per block.
- Drop shadows on cards. Use 1px borders + subtle background tint for separation.
- Hero icon tiles next to phase titles. Replaced by the agent byline.

Remove:
- The botanical decoration in the sidebar. Beautiful, but performative; it has no place in a 56px collapsed rail and it's gone in the redesign.
- Any "Phase X of N" badge that just restates the ribbon.
- Per-phase canvas headers ("BRIEF CANVAS", "RESEARCH CANVAS", etc.). The block sub-header replaces them.

Add:
- A subtle **typing/streaming animation** when an agent is generating into a block (a 2px gold underline traveling left to right under the active sub-header).
- A subtle **diff highlight** when a downstream block re-flows because an upstream block changed.
- A **"who touched this last"** micro-byline on every block.

---

## 10. What we keep, simplify, remove, rebuild

### Keep
- Color palette and brand voice.
- Agent identity system (avatars, gradients, statuses).
- Strong micro-components: signal-strength bar, score sub-scores, do/avoid chips, trend cards (with size reduction).
- Editorial Positioning Statement treatment.
- Threads list / multi-campaign concept.

### Simplify
- Sidebar → 56px NavRail with hover-expand.
- TopBar → single 36px row, consolidated controls.
- PhaseNav → 32px PhaseRibbon with state + scroll-spy.
- Trend cards → 80px scannable rows.
- Agent grid → inline bylines on blocks.

### Remove (with conviction)
- The full right `AgentRail` as a layout citizen.
- The activity feed as a vertical list.
- The composer as a permanent surface.
- "Continue to <Phase>" buttons as gates.
- "Save Draft" buttons (auto-save instead).
- Per-phase canvas chrome (BRIEF CANVAS / Phase X of 5 / giant title + description).
- Decorative botanical SVG in sidebar.
- Hero ribbon banners inside phase content.
- The duplicate "Campaign Summary" block in Strategy.

### Rebuild from scratch
- All five existing phases (per the user's directive).
- The shell (`AppShell`, `Sidebar`, `TopBar`, `PhaseNav`, `PhaseCanvas`, `AgentRail`).
- The campaign context model — needs to support streaming block states (`pending / running / ready / approved`), per-block agent attribution, diff hints, auto-approval cooldowns, and inter-block dependencies.

### Add
- `Imagery` as a real sixth phase between Drafting and Results.
- ActivityRibbon component.
- DirectorDrawer component (overlay, summoned).
- Block-level inline action bar (Approve / Refine / Regenerate / Talk to agent).
- Auto-approval cooldown system.
- Diff hint chips on downstream blocks when upstream changes.

---

## 11. Open questions / decisions still to make

These do not block the plan but should be decided before implementation:

1. **Auto-approval default** — 90s? 60s? Off by default? My recommendation: 90s, dismissible, with a workspace-level toggle.
2. **Read mode** — should there be a dedicated "presentation" mode (no chrome, full bleed) for stakeholder review? Recommended: yes, triggered by `Cmd+.`.
3. **Mobile / narrow** — out of scope for this plan, but the redesign assumes ≥1280 width. Below that, NavRail becomes hidden, Drawer becomes a sheet.
4. **Multi-user / presence** — not part of the brief but the ActivityRibbon is a natural place to add it later.
5. **Versioning** — does the user want to fork campaigns? Recommended: yes, from any block ("Fork from here"), but defer to a follow-up.
6. **Agent personality / voice** — the agents currently feel interchangeable. Recommended: give each one a distinct one-line voice that surfaces in their reasoning panels. Defer to implementation.

---

## 12. Implementation phasing (for when approval lands)

Not executing yet. This is the order I would implement it in:

1. **Foundation** — new shell (`AppShell`, NavRail, TopBar, PhaseRibbon) + new campaign context model with block states.
2. **Document container** — the scrollable document with section anchors and scroll-spy.
3. **ActivityRibbon + DirectorDrawer** — the two new agent surfaces; remove the old `AgentRail`.
4. **Brief block rebuild** — dense 3-column inline-edit, auto-save.
5. **Research block rebuild** — left-right split, dense trend rows.
6. **Strategy block rebuild** — full-bleed wall.
7. **Drafting block rebuild** — three lanes with collapsibles.
8. **Imagery phase (new)** — mood band + variant grid.
9. **Results phase (new)** — final post previews + comparison + export.
10. **Streaming + auto-approval polish** — diff hints, cooldown chips, inline action bars.

Each step ships a working workspace; no big-bang rewrite is needed.

---

## 13. Bottom line

The current TrendMind is a beautifully decorated wizard. The redesign turns it into a workspace.

The single biggest move is killing the right rail and the "Continue" buttons. The single biggest gain is treating the campaign as one living document. The single biggest risk is over-keeping current visuals — the rebuild has to be willing to delete chrome the team is proud of.

Done well, the workspace will feel like Linear, Notion, and Cursor had a child that knew marketing.
