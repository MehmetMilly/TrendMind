# PLAN 3 — TrendMind Lab: A Spatial Campaign Theatre

> **Direction:** bold / radical.
> The campaign is not a wizard, not a document — it is a **live spatial board** where AI agents work in front of you like a creative team in a war room. You watch a campaign be *built*, *tested*, and *staged* across a zoomable canvas where ideas, drafts, and audience reactions live as objects you can move, group, and pit against each other.

This is the direction that takes the most risk and offers the most upside. It rejects the form-and-fields format entirely. The product becomes recognizable in two seconds: *"this is a lab where AI runs marketing experiments in front of you."*

The bet: in a hackathon room full of "AI generates marketing copy" submissions, a spatial, theatrical, simulation-driven workspace is the only thing that will be remembered the next morning.

---

## 1. Core interface idea

A single, infinite, zoomable board (think Figma / Miro / tldraw) — but the board is **scripted**: the AI builds out the campaign as a connected graph of nodes, and the user can pan, zoom, edit, branch, kill, and re-run any node.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TopStrip (32px)   campaign · run state · share · export · ⋯              │
├──────────────────────────────────────────────────────────────────────────┤
│  Stage Selector (40px)                                                   │
│   ◉ Map   ○ Brief   ○ Research   ○ Strategy   ○ Draft                    │
│   ○ Trial  ○ Studio  ○ Launch                                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│                       ◯ INFINITE BOARD                                   │
│                       (campaign as a graph)                              │
│                                                                          │
│         agents visible as cursors, building & editing nodes              │
│                                                                          │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ DirectorBar (40px)   ▶ run · ⏸ pause · ⏭ skip · 🎯 focus · 🔁 rerun     │
└──────────────────────────────────────────────────────────────────────────┘
```

The product feels closer to **Cursor's agent mode + Figma multiplayer + a lab simulation tool** than to any current AI marketing tool. There is no left sidebar by default, no right rail, no document — just the board, the stage selector at the top, and the director bar at the bottom.

### The key idea: dual-mode canvas

The board has two modes the user can switch between:

- **Map mode** — zoomed out, the entire campaign is visible as a graph: Brief → Research cluster → 3 Strategy angle nodes → Draft branches per angle → Trial arena → Studio stage → Launch pad. This is the "the whole campaign at a glance" view, which no other product offers.
- **Stage mode** — zoomed into a specific phase. The board reframes itself with a stage-appropriate layout: a research grid, a strategy lineup, a draft matrix, a trial arena, a studio composer, a launch pad.

Switching is one key (`Z` zooms out to map, `1`–`7` jump to a stage, `Space` pans, scroll-zooms). This is gesture-based, not menu-based — which is part of why the product feels like a tool a real creative team would use, not a form.

---

## 2. The board — what each stage looks like

### 2.1 Brief stage — "The Brief Stone"

A single central node — the brief — represented as a tactile card on the board. Filling it spawns the rest of the graph.

```
              ┌──────────────────────────────┐
              │  BRIEF                       │
              │  Brand: Acme Coffee          │
              │  Audience: 25–34 urban       │
              │  Goal: drive cold-brew trial │
              │  Platform: X · IG            │
              │  Tone: dry · confident       │
              └──────────────────────────────┘
                          │
                  (graph spawns from here)
```

- Editing this node ripples the entire graph downstream (visible ripples — animated outline pulse traveling through affected nodes).
- The node itself is dense and editable inline.

### 2.2 Research stage — "Evidence Cloud"

The board fills with a cloud of research cards arranged in three orbits around the brief: Trend Signals, Competitive, Audience.

```
       Trend Signals             Competitive            Audience
         ◯ ◯ ◯                   ◯ ◯ ◯                  ◯ ◯ ◯
           ◯                       ◯                      ◯
                  \  |  /
                  [ BRIEF ]
                  /  |  \
          Brand Memory  Risk Notes  Fact Checks
              ◯ ◯           ◯ ◯           ◯ ◯
```

- Cards have visible source chips and confidence rings.
- Trend Scout's cursor moves visibly across the board, dropping cards in real time. Other agent cursors (Brand Strategist, Fact Checker) are visible too.
- The user can lasso-select cards to pin or strike. Pinned cards glow; struck cards fade.

### 2.3 Strategy stage — "The Three Angles"

The board reframes into three vertical lanes — *Safe Bet*, *Sharp Take*, *Viral / Chaos Bet* — each with its angle card at the top and supporting evidence cards (drawn from the Research cloud) attached below.

```
   Safe Bet           Sharp Take         Viral / Chaos
   ┌──────┐          ┌──────┐           ┌──────┐
   │ card │          │ card │           │ card │
   └──┬───┘          └──┬───┘           └──┬───┘
      │                  │                   │
   evidence          evidence           evidence
```

- The user can drag evidence cards between angles to test "what if we ran the same proof under a different angle?"
- Brand Strategist's cursor is visibly assembling these. The user can intervene mid-build.
- Each angle card has a posture, a promise, a score, and a `pin to advance` state.

### 2.4 Draft stage — "The Variant Garden"

For each pinned angle, the board grows a small grove of draft cards. Hooks, angles, tones, and CTAs are nodes that *combine* into composed drafts.

```
   Sharp Take
   ─ Hooks      ◇ ◇ ◇
   ─ Angles     ◇ ◇ ◇
   ─ Tones      ◇ ◇
   ─ CTAs       ◇ ◇

      ↓ drag any combination into the composer ↓
   ┌─────────────────────────────────────────────┐
   │ "We don't sell coffee. We sell a 6am decision."│
   │  Hook A · Angle B · Tone A · CTA B    ★ 84   │
   └─────────────────────────────────────────────┘
```

- The user (or Content Architect's cursor) drags one cell from each row into a *composer slot* to assemble a full draft.
- The Performance Critic's cursor leaves small inline annotations on weak cells.
- Composed drafts become first-class nodes on the board, ready to be sent into Trial.

### 2.5 Trial stage — "The Arena" *(the centerpiece of this plan)*

This is the moment the product earns its place. The board reframes into an arena:

```
                         AUDIENCE ARENA
            (synthetic personas surround the drafts)

   ◯ @sara_27        ◯ @kareem.dev        ◯ @noor.s
        \                 |                   /
         \                |                  /
          \               |                 /
                 ┌──────────────────┐
                 │  DRAFT ① under    │
                 │  test             │
                 └──────────────────┘
          /               |                 \
         /                |                  \
        /                 |                   \
   ◯ @ali.k           ◯ @maya_7            ◯ @joud
   (skeptic)         (target)              (mocker)
```

- The draft sits at the center.
- A panel of synthetic personas (avatars, names, tags: skeptic / target / mocker / detractor / brand-aware) circles it.
- Each persona "speaks" — a speech-bubble card animates from their avatar toward the draft with a star rating, a quote, and a verdict (`would skip · would engage · would mock · would buy`). Reactions appear over ~6–10 seconds. Controlled, cinematic, not chaotic.
- The user can: pin a reaction (it becomes evidence in the verdict), mute a persona, regenerate a persona, swap the draft (the arena snaps to the next draft), escalate (`add 6 more skeptics`).
- A bottom verdict panel scores resonance and risk per draft and suggests a refinement, with a `send back to Draft` arrow that visually animates back upstream into the Draft grove.

This stage is the demo money shot. A judge watches a draft sit in the center while six personas speak about it in real time. Nothing else in the AI marketing tool space looks like this.

### 2.6 Studio stage — "The Composition Stage"

The board reframes into a literal stage: a backdrop area with a layered composition canvas in the middle and an asset shelf at the bottom.

```
   ┌──────────────────────────────────────────────┐
   │  Backdrop (brand-locked palette/type)        │
   │   ┌──────────────────────────┐              │
   │   │   composed ad layout     │              │
   │   │   (1080×1080)            │              │
   │   │   layers: bg · product · │              │
   │   │   headline · CTA · logo  │              │
   │   └──────────────────────────┘              │
   ├──────────────────────────────────────────────┤
   │  Asset shelf:  bg variants  product variants │
   │                headline variants  CTA variants│
   └──────────────────────────────────────────────┘
```

- The Visual Director's cursor is visibly placing layers.
- Each layer is regeneratable individually (right-click on layer → regenerate).
- Brand panel enforces palette/type — the AI cannot drift outside it.
- "Show me 3" generates three full compositions for the same draft; they sit as sibling nodes that can be promoted.

### 2.7 Launch stage — "The Launch Pad"

The final stage frames the campaign as a press readout / pre-show:

```
   ┌──────────────────────────────────────────────────┐
   │   CAMPAIGN: <name>             Status: Ready     │
   │                                                   │
   │   Hero  ┌────────┐    Why this won (Trial)       │
   │        │ ad img │                                │
   │        └────────┘                                │
   │                                                   │
   │   Alternates: B  C                                │
   │   Platforms:  X · LinkedIn · Instagram · TikTok   │
   │                                                   │
   │   Risk & Response notes (from Trial)              │
   │   · objection #1   →  pre-written reply           │
   │   · mocker line    →  pre-written reply           │
   │                                                   │
   │   [Publish ▸]   [Export ▸]   [Share read-only ▸] │
   └──────────────────────────────────────────────────┘
```

- The Launch pad is the only stage that looks like a "page" rather than a board — it's the deliverable the user hands off.
- Risk & response notes come from the Trial stage automatically.

### 2.8 Map mode — "The Whole Campaign"

Pressing `Z` zooms the user out to the whole graph:

```
   [Brief] → [Research cloud] → [3 Angles] →
            [Draft groves]   →  [Trial arena] →
            [Studio stage]   →  [Launch pad]
```

- Every node's status is visible at a glance.
- Stale nodes (downstream of a recent Brief edit) glow amber.
- The user can click any node to zoom into it and edit.

This is the product's hero shot. It is what the user screenshots and shares. It is what makes a judge say "wait, what is this?"

---

## 3. Workflow model

The campaign is a **scripted run** through the graph. The Director Bar at the bottom controls it.

- **Run** (`▶`) — the system advances autonomously: Trend Scout populates Research, Brand Strategist builds the three Angles, Content Architect grows the Draft groves, Audience Simulator runs Trial, Visual Director composes Studio, Campaign Director assembles Launch.
- **Pause** (`⏸`) — freeze all agent cursors. Useful when the user wants to edit without the system racing ahead.
- **Skip** (`⏭`) — accept the current stage as-is and move on.
- **Focus** (`🎯`) — pin the user's view to whatever the system is currently working on (auto-pan/zoom). Great for demo mode.
- **Rerun** (`🔁`) — re-run any selected node (a single research cloud, a single angle, a single draft, a single composition).

Because the entire campaign is one graph, **iteration is just dragging arrows back upstream**. Send a draft back from Trial to Draft → the Draft grove pulses, regenerates, and Trial automatically re-runs against the new draft. The visible animation of work flowing back upstream and re-flowing downstream is the product's most powerful "this system is alive" signal.

The user's mental model: *"I am running an experiment. The AI team is the lab. I can pause, intervene, branch, or send things back. The board shows me everything."*

---

## 4. How the AI shows up

- **Agents are cursors.** Every agent has a named, colored cursor visible on the board. Trend Scout has a search-glass icon, Audience Simulator has a face icon, Visual Director has a paintbrush icon. They move, stop, and edit in real time. This is the product's strongest aesthetic — it looks and feels exactly like Figma multiplayer, except the multiplayer is your AI team.
- **Reasoning is on the node.** Hover any node → a small reasoning popover appears with the agent's chain of thought, sources, and confidence. Click → it pins.
- **Director Bar.** Run / pause / skip / focus / rerun. The user is the conductor; the agents are the orchestra.
- **The Director Drawer is rare.** Used only when the user wants to give a global instruction (`make the whole campaign more provocative`). Reachable from a single button in the TopStrip.
- **Trial humanizes the AI.** In Trial, the AI explicitly stops being utility roles and becomes *people*. The contrast between the cursor-based agents (utility) and the persona avatars (humans) is intentional and dramatic.
- **Cinematic timing.** Every stage has controlled animation timing (≈6–10 seconds of work visible per stage during a fresh run). It is *fast enough to feel useful*, *slow enough to be theatrical*. This is the part that needs the most design polish to avoid feeling either glitchy or staged.

---

## 5. What makes this direction special

- **It is unmistakable.** A judge looking at the screen for two seconds will know this is not a generic AI marketing tool. The board, the cursors, the arena, the map view — none of those exist anywhere else in the AI marketing space.
- **The whole campaign is a single object.** Map mode shows the entire campaign as a graph, which is something neither wizards nor documents can do. The user can literally see their campaign as a thing.
- **The Trial arena is a hackathon-winning demo.** A draft in the center, six personas around it speaking in real time — this is a 20-second video clip that wins a hackathon by itself. The Trial phase from the PDF was always the most distinctive idea; this plan gives it the staging it deserves.
- **Iteration is visual.** Sending a draft back from Trial to Draft becomes an animated upstream flow. The user *sees* the system reason about cause and effect. Generic AI tools never do this.
- **Agents-as-cursors is a visual vocabulary that scales.** It naturally explains "specialists working in parallel" without any text — the user sees four cursors moving simultaneously and instantly understands "there are four specialists working on this."
- **Map view is the marketing asset.** A screenshot of the full campaign graph, with brief at the top and launch pad at the bottom, is a beautiful, distinctive image that the team can use to market the product itself.

---

## 6. Why this fits the PDF

The PDF's defining claims about TrendMind 2.0 are:

- it does not just *write* — it *discovers angles*, *tests them*, *refines them*, *produces visuals*, and *ships a launch package*;
- the unique parts are the parallel angle exploration, the audience simulation, and the real visual production stage;
- the product should feel meaningfully different from generic AI marketing tools.

A spatial campaign theatre captures all of this:

- Parallel angle exploration is *literally* visible as three lanes on the board.
- Audience simulation is a dedicated arena with reacting personas — the most distinctive idea in the PDF gets the most cinematic treatment.
- Studio is a real composition stage with regeneratable layers, which matches the PDF's call for actual visual production over stock attachments.
- Launch is the readout at the end of the run — the PDF's "press pack" idea.
- The board is the embodiment of "campaign as a system," not "campaign as a copy file."

The PDF asks for the product to *feel* like more than a generator. This plan answers that not with words but with form: a board, a run, an arena, a stage, a launch pad.

---

## 7. Risks and tradeoffs

- **Highest implementation cost of the three plans.** A real spatial board with multiplayer-style cursors, animated stage transitions, and per-stage layouts is the most ambitious surface to build. Mitigation: build the Trial arena first (the demo money shot), then map mode, then progressively richer stages. A v1 can ship with simplified stages for Brief / Research / Studio while the Trial arena is fully polished.
- **Spatial canvases can become illegible.** Users get lost zooming. Mitigation: stage-mode reframing snaps the camera to a known layout per stage; `Z` always returns to map; mini-map in the corner; clear breadcrumb at the top.
- **Cinematic timing has to be perfect.** Too slow and it feels staged; too fast and the user misses the show. Mitigation: every animation has a `skip` action; demo mode runs at presenter pace, normal mode runs at working pace.
- **Discoverability of gestures.** Spatial UIs rely on pan/zoom/select gestures. New users may not find them. Mitigation: a permanent overlay hint strip on first run (`Space to pan · scroll to zoom · Z for map · 1–7 for stages`), dismissed after first successful gesture.
- **Aesthetic risk.** A board can look like a busy mood board if not held together by strong typography, controlled motion, and a tight palette. Mitigation: dark mode as primary aesthetic; minimal node decoration; saturated agent cursor colors as the only loud visual element.
- **The deliverable can feel hidden.** The Launch pad is one stage in a board — the user might not realize it's the deliverable. Mitigation: a permanent `Launch` pill in the TopStrip that pulses when Launch is ready; one-click jumps to it from anywhere.
- **Mobile / small screens.** This plan does not target small screens well. Mitigation: a stripped read-only mobile view that shows the Launch pad and a static map snapshot — explicitly not a working mobile workspace.
- **Demo failure mode is loud.** If the agent cursors lag or the Trial arena stutters, the failure is theatrical. Mitigation: all animation has a *deterministic fallback* — if the live stream is delayed, the system falls back to a pre-staged sequence so the demo never freezes mid-arena.

---

## 8. One-line summary

> *TrendMind as a live spatial lab where AI agents run a campaign as an experiment in front of you — discover, test, refine, stage, launch — on a single board you can see, pan, and conduct.*
