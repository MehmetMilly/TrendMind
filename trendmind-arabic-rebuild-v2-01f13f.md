# TrendMind Arabic Rebuild v2 — RTL, Per-Phase Pages, Cinematic Polish

A full Arabic (RTL) rebuild that splits the workspace into one page per phase, auto-advances between phases with a cancelable 3-second cinematic overlay, strips demo data and text clutter, and layers in curated "wow" moments (cinematic transitions, command palette, living phase tabs, ambient phase backdrops, agent reasoning peek, launch ceremony) to make the app memorable for hackathon judges without sacrificing clarity.

---

## 1. High-level outcome

- Interface fully in **Arabic, `dir="rtl"`**, with **IBM Plex Sans Arabic** for body and **Cairo 700** for headings. Brand name `TrendMind` stays Latin.
- Seven phases (`الإيجاز`, `البحث`, `التخطيط`, `الصياغة`, `الاختبار`, `الاستوديو`, `الإطلاق`) are **separate pages**, switchable from a compact top bar.
- When the engine finishes the current phase and starts the next, a cinematic 3-second overlay (*"الانتقال إلى {المرحلة}"*) prompts auto-jump. A *"البقاء هنا"* button cancels only the current transition; later transitions in the same run still trigger.
- No demo content: `DEFAULT_BRIEF` is blank Arabic; every phase ships with polished Arabic empty states instead of English placeholders.
- Simplified, moderate-density pages — helper paragraphs, agent footers, and "readout" blocks are removed; detail collapses into chips, inspectors, and hover peeks.
- Curated impressive touches: per-phase cinematic entry animation, per-phase ambient backdrop, living phase tabs, `Cmd/Ctrl+K` command palette + arrow-key phase nav, hover-peek on AI outputs, Launch reveal ceremony.

---

## 2. Architecture changes (shell & routing)

### 2.1 Phase-paged workspace
- `CampaignWorkspace` is reworked into a **phase-page router**: it renders exactly one of `BriefPage` / `ResearchPage` / `StrategyPage` / `DraftPage` / `TrialPage` / `StudioPage` / `LaunchPage` based on `activePhase`.
- Remove the scroll-based `IntersectionObserver` in `@/Users/mehme/Desktop/TrendMind/src/lib/workspace-store.tsx` (~lines 546–578), along with `registerSectionRef`, `scrollToPhase` (replaced by `setActivePhase`), and `PhaseGap` in `campaign-workspace.tsx`.
- Each page owns its own scroll container and mounts/unmounts with `<AnimatePresence>`-style transitions (see §5.1).

### 2.2 Top bar (merges `TopStrip` + `PhaseRibbon`)
- New file `src/components/trendmind/top-bar.tsx` replaces both `top-strip.tsx` and `phase-ribbon.tsx`.
- Compact (~48px), sticky, RTL-aware. Contents (visual right→left in RTL):
  - **Brand mark** `TrendMind` (isolated LTR inside its container).
  - **7 phase tabs** as "living tabs" (see §5.3).
  - **Active campaign name** (truncated, clickable → opens campaign drawer).
  - **Status pill** (`draft` / `running` / `ready` / `attention`).
  - **Actions** as icon buttons with Arabic tooltips: `البدء`, `المُخرج`, `مشاركة`, `تصدير`, and a small `⌘K` hint.
- Old `TopStrip` and `PhaseRibbon` files are deleted.

### 2.3 Drawers & rail
- `NavRail` stays, but its absolute-positioned active indicator is mirrored for RTL.
- `Inspector` flips to open from the **left** edge (since it's the "opposite" side in RTL — details panel).
- `CampaignDrawer` keeps opening from the right side of the screen (which is the *start* in RTL, next to the nav rail).
- `DirectorDrawer` mirrors direction, translated copy.
- `PulseBar` translated, shortened, kept at the bottom.

### 2.4 Auto-advance state machine (scoped cancel)
Added to `workspace-store.tsx`:

- `phaseTransitionTarget: PhaseId | null` — phase a countdown is currently aiming at.
- `lastReadyVersions: Record<PhaseId, number>` — last-seen `phases[id].version` per phase; seeded on initial load from the bootstrap so already-completed campaigns don't fire overlays.
- `suppressTransitionFrom: PhaseId | null` — the single phase whose completion the user opted out of. Cleared once `activePhase` actually changes.

Flow when a new campaign state arrives:
1. For each phase, if `status === "ready"` and `version > lastReadyVersions[id]`, record the fresh completion.
2. If the freshly-completed phase equals `activePhase` **and** the next phase in `PHASE_SEQUENCE` exists and is `running`/`pending`/`ready` **and** `suppressTransitionFrom !== activePhase` → set `phaseTransitionTarget = next`.
3. `<PhaseTransitionOverlay>` (new component) watches `phaseTransitionTarget`. It renders:
   - Subtitle: *"اكتملت مرحلة {current}"*
   - Title: *"الانتقال إلى {next}"* (Cairo 700, large)
   - A 3-second circular countdown SVG
   - Buttons: *"الانتقال الآن"* (skip to target immediately) and *"البقاء هنا"* (cancel this transition only)
4. On countdown finish or "Go now" → `setActivePhase(target)`, clear target, clear `suppressTransitionFrom`.
5. On *"البقاء هنا"* → set `suppressTransitionFrom = activePhase`, clear target. Overlay won't re-trigger for *this* phase, but the moment the user manually navigates elsewhere and the next phase completes, auto-advance resumes.
6. If the user manually navigates (tab click, arrow key) during the overlay, treat it as an implicit cancel for that transition only — same as *"البقاء هنا"*, scoped to the phase they were leaving.
7. Initial bootstrap never fires an overlay (versions seeded on mount).

### 2.5 Remove demo / seed content
- `DEFAULT_BRIEF` in `src/lib/campaign-data.ts` becomes blank:
  - All strings `""`, all arrays `[]`.
  - `campaignName: "حملة جديدة"`, `platform: "X"` (platform codes stay Latin for consistency with platform names).
- `createCampaign` in `campaign-repository.ts` still auto-creates on first launch but now creates a blank Arabic campaign.
- Any hardcoded English user-visible fallback inside `campaign-engine.ts` (activity messages, default summaries, error strings) is translated to Arabic.
- All `EmptyState` / `EmptyPhase` components rewritten with short Arabic one-liner + primary CTA (`بدء المرحلة`).

---

## 3. Arabic & RTL foundation

### 3.1 Setup
- `src/app/layout.tsx`: add `dir="rtl" lang="ar"` on `<html>`; update metadata to Arabic (`TrendMind — استوديو الحملات الذكية`).
- `src/app/globals.css`:
  - Replace the current Google Fonts import with **IBM Plex Sans Arabic** (400/500/600/700) and **Cairo** (600/700).
  - `--font-body: 'IBM Plex Sans Arabic', system-ui, sans-serif`
  - `--font-heading: 'Cairo', 'IBM Plex Sans Arabic', serif`
  - Keep `DM Serif Display` only for the `TrendMind` wordmark via a new `--font-wordmark` variable.
  - Add RTL-friendly scrollbar using `inline-start` / `inline-end`.
- Tailwind: sweep every `left-*`, `right-*`, `pl-*`, `pr-*`, `ml-*`, `mr-*`, `text-left`, `text-right` for directional intent and replace with logical counterparts (`start-*`, `end-*`, `ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`, `text-end`). Decorative absolute positioning that should NOT flip (e.g. spotlight gradients in `trial.tsx`) stays explicit.
- Numerals: Western Arabic (0–9) — chosen for scan-ability in compact tabular data.
- Logo wordmark wrapped in `<span dir="ltr">TrendMind</span>`.

### 3.2 Translation glossary (user-approved)

| English | Arabic |
| --- | --- |
| Workspace / Campaign workspace | `مساحة العمل` |
| Brief | `الإيجاز` |
| Research | `البحث` |
| Strategy | `التخطيط` |
| Draft | `الصياغة` |
| Trial | `الاختبار` |
| Studio | `الاستوديو` |
| Launch | `الإطلاق` |
| Run | `البدء` |
| Re-run | `إعادة البدء` |
| Director | `المُخرج` |
| Share | `مشاركة` |
| Export | `تصدير` |
| Commit / Committed | `اعتماد` / `تم الاعتماد` |
| Inspect | `استعراض` |
| Stay here | `البقاء هنا` |
| Go now | `الانتقال الآن` |
| Moving to {phase} | `الانتقال إلى {المرحلة}` |
| Audience | `الجمهور` |
| Verdict | `الحُكم النهائي` |
| Confidence | `الثقة` |
| Risk | `المخاطر` |
| Source | `المصدر` |

Everything not in the glossary is translated in the same thoughtful, product-marketing style (idiomatic, concise), not literally. The brand name `TrendMind` stays Latin.

---

## 4. Simplification pass (moderate density)

Summary of per-phase changes. Each page gains a concise Arabic page header (one line max), removes "readout" summary cards, collapses secondary info to inspectors.

### 4.1 `الإيجاز` (Brief)
- Three visual zones: Identity row (Campaign / Brand / Platform), Voice card (Goal + Audience + Tone), Constraints (Pillars default-open; Avoid & Guardrails collapsed).
- Remove the `Director · source of truth` footer line and `All downstream phases read from this brief` helper.
- Arabic placeholders on every field.

### 4.2 `البحث` (Research)
- Drop the `Research readout` card. Overview becomes a single editorial line at the top of the page.
- Show top 6 items (sorted by `confidence`) by default; `عرض الكل` reveals the rest.
- Filter pills become icon-only with Arabic tooltips.
- Summary line-clamp reduced to 2; third line moves to the Inspector.

### 4.3 `التخطيط` (Strategy)
- Keep three-angle poster layout.
- Remove the `decisionFrame` paragraph; keep a quiet single-line campaign thesis.
- Risk text collapses to a chip → full text appears in the Inspector.
- `Inspect →` becomes an icon button.

### 4.4 `الصياغة` (Draft)
- Three atom columns → a single **tabbed kit panel** (`الخطافات` / `المحتوى` / `الدعوات`).
- Three variant posters remain the page's hero.
- Critique: max 2 chips inline, rest behind `+N`.
- Remove the two agent tag strings from the header; agents appear only in the new reasoning peek (§5.5).

### 4.5 `الاختبار` (Trial)
- Keep the dark stage centerpiece.
- Collapse the `Synthetic persona model · not real users` string to a small `i` hover icon.
- Two controls only: `تشغيل الاختبار` / `إعادة الاختبار`.

### 4.6 `الاستوديو` (Studio)
- Artboard dominates. Layer list hidden in a slide-out triggered by a `الطبقات` button.
- Asset checklist + palette become two compact chip rows under the artboard.

### 4.7 `الإطلاق` (Launch)
- Winning variant hero-card front and center.
- Alternates, response plan, risk notes hidden behind a `بدائل ومخاطر` toggle.
- Response plan items become single-line accordion entries.

---

## 5. Curated "wow" layer (user-selected)

### 5.1 Cinematic phase transitions
Each phase gets its own entry animation, keyed to the phase's identity. Implemented via CSS keyframes + a small motion primitive (no framer-motion addition unless needed; reuse `animate-*` classes already in `globals.css` extended with phase-specific ones).

| Phase | Entry motion |
| --- | --- |
| Brief (`الإيجاز`) | Paper unfold — sections rise and expand in sequence from the center outward (≈400ms stagger). |
| Research (`البحث`) | Signal bloom — faint scanning horizontal line sweeps once, then cards fade-in staggered by confidence. |
| Strategy (`التخطيط`) | Three posters slide in from right to left (RTL-native), one every 80ms. |
| Draft (`الصياغة`) | Kit assembly — atoms drop into their columns with a subtle bounce, then variants build beneath. |
| Trial (`الاختبار`) | Curtain rise — dim background fades, spotlight warms up, stage quote appears, personas light up one by one. |
| Studio (`الاستوديو`) | Artboard materializes — faint grid lines draw in, then layers compose on top. |
| Launch (`الإطلاق`) | Gallery lights-on — dark → warm reveal, winner card lifts slightly (see §5.6). |

Animations only play on *first* entry to the phase in a session (tracked in `workspace-store` via `visitedPhases: Set<PhaseId>`), so repeat visits stay snappy.

### 5.2 Per-phase ambient backdrop
A new `<PhaseBackdrop phase={activePhase}>` component renders a subtle, slowly-moving SVG/CSS gradient behind each page. Light GPU use only.

| Phase | Backdrop |
| --- | --- |
| Brief | Warm ivory gradient with a very slow drifting golden bloom in the top corner. |
| Research | Thin radar-like scan lines moving vertically at low opacity; faint constellation dots. |
| Strategy | Three vertical lanes in barely-visible tints (safe/sharp/viral). |
| Draft | Warm paper grain with a subtle grid. |
| Trial | Already dark — kept, with the existing spotlight animation strengthened. |
| Studio | Artboard grid + a soft vignette. |
| Launch | Gallery spotlight centered; embers drifting at very low opacity. |

All backdrops respect `prefers-reduced-motion` and fall back to static gradients.

### 5.3 Living phase tabs
The 7 phase tabs in the top bar gain status-aware behavior:
- **Idle**: muted label, no dot.
- **Running / pending**: a 1.5px gold arc progresses around the tab (SVG stroke-dasharray animation), accompanied by a gentle breathing glow.
- **Ready**: small solid dot + soft persistent underline accent.
- **Stale**: warm amber ring pulsing slowly (calls attention without alarming).
- **Active**: slightly raised, Cairo-700 label, subtle gold halo.
The total progress line (currently a bottom underline that grows) is retained and tuned.

### 5.4 Command palette + keyboard navigation
- New `src/components/trendmind/command-palette.tsx`.
- Triggered by **`Cmd+K` / `Ctrl+K`** or the `⌘K` hint in the top bar.
- RTL modal centered on screen (IBM Plex Sans Arabic, Cairo accent). Single Arabic search input, grouped results:
  - **الانتقال إلى مرحلة** → 7 phase jumps.
  - **أوامر** → `بدء الحملة`, `إعادة بدء المرحلة الحالية`, `فتح لوحة المُخرج`, `مشاركة`, `تصدير`, `فتح الحملات`.
  - **البحث في الحملة** → fuzzy-searches research items and strategy angle titles; picking a result jumps to the phase and opens the Inspector on it.
- Keyboard shortcuts (registered globally, respect typing focus):
  - `←` / `→` : previous / next phase (flipped in RTL so `←` feels natural visually — actually goes to *next* in the sequence since visual left-arrow = logical forward in RTL).
  - `Esc` : close overlays / drawers / command palette.
  - `G` then a digit 1–7 : jump to that phase (Gmail-style).
  - `R` : re-run current phase.
- A small `?` button in the top bar opens a shortcut cheatsheet in Arabic.

### 5.5 Agent reasoning peek
- Add a lightweight `<AgentPeek agent={id} reasoning={string}>` wrapper used on research items, strategy angles, draft variants, persona reactions, and launch copy.
- On hover (or focus) after 250ms, a compact tooltip slides out showing:
  - Agent accent dot + Arabic name.
  - One Arabic sentence of reasoning (pulled from existing engine outputs where available, else a templated one like *"اختاره «المخطط» لأن نبرة الإيجاز تُرجّح هذا الاتجاه"*).
- Tooltip is keyboard-accessible and respects `prefers-reduced-motion`.
- Removes the need for the verbose agent-attribution rows currently in `draft.tsx` and `strategy.tsx`.

### 5.6 Launch reveal ceremony
- The Launch page, when entered for the first time with a `ready` state, plays a one-time reveal:
  1. Backdrop fades from dim → warm gallery (~600ms).
  2. Winning variant card scales from 0.96 → 1 and lifts 6px with a soft shadow bloom.
  3. Subtle ember particles drift upward at <10% opacity for ≈2s (pure CSS keyframes, 10–15 particles, no JS physics).
  4. Alternates strip fades in beneath after the main reveal.
- Replayable via a small `إعادة العرض` button near the page header (useful for demos / judge replays).
- Skipped when the launch phase is re-entered later in the session (unless explicitly replayed).

---

## 6. File-by-file change list

| File | Change |
| --- | --- |
| `src/app/layout.tsx` | `dir="rtl" lang="ar"`, Arabic metadata. |
| `src/app/globals.css` | Fonts (IBM Plex Sans Arabic + Cairo), extra keyframes (`phaseSlideRtl`, `signalSweep`, `curtainRise`, `artboardDraw`, `galleryLights`, `emberDrift`, `arcProgress`), logical-property scrollbar. |
| `src/components/trendmind/app-shell.tsx` | Renders new `TopBar`, single phase page, `<PhaseTransitionOverlay>`, `<CommandPalette>`, `<PhaseBackdrop>` layer. |
| `src/components/trendmind/campaign-workspace.tsx` | Phase-page router with entrance transitions. |
| `src/components/trendmind/top-bar.tsx` *(new)* | Replaces `top-strip.tsx` + `phase-ribbon.tsx` — living tabs, Arabic copy, icon actions. |
| `src/components/trendmind/top-strip.tsx` | Delete. |
| `src/components/trendmind/phase-ribbon.tsx` | Delete. |
| `src/components/trendmind/phase-transition-overlay.tsx` *(new)* | 3-second countdown + cancel / skip controls. |
| `src/components/trendmind/phase-backdrop.tsx` *(new)* | Renders per-phase ambient backdrop behind the active page. |
| `src/components/trendmind/command-palette.tsx` *(new)* | Cmd/Ctrl+K Arabic palette with groups. |
| `src/components/trendmind/keyboard-shortcuts.tsx` *(new)* | Global shortcut listener + `?` cheatsheet dialog. |
| `src/components/trendmind/agent-peek.tsx` *(new)* | Hover tooltip wrapper for AI outputs. |
| `src/components/trendmind/sections/section-shell.tsx` → `page-shell.tsx` | Full-page shell, owns scroll, drives entrance animation, Arabic phase header. Removes `registerSectionRef`. |
| `src/components/trendmind/sections/brief.tsx` | Translate, restructure to three zones, Arabic placeholders. |
| `src/components/trendmind/sections/research.tsx` | Translate, drop readout, top-6 default, icon filters. |
| `src/components/trendmind/sections/strategy.tsx` | Translate, drop decisionFrame, risk-to-chip, icon inspect. |
| `src/components/trendmind/sections/draft.tsx` | Translate, tabbed kit, chip cap, remove agent tags. |
| `src/components/trendmind/sections/trial.tsx` | Translate, collapse disclaimer, two controls. |
| `src/components/trendmind/sections/studio.tsx` | Translate, layers slide-out, chip strips. |
| `src/components/trendmind/sections/launch.tsx` | Translate, hero card, collapse alternates, reveal ceremony. |
| `src/components/trendmind/nav-rail.tsx` | Translate tooltips, RTL-aware active indicator. |
| `src/components/trendmind/campaign-drawer.tsx` | Translate, RTL, Arabic list. |
| `src/components/trendmind/inspector.tsx` | Translate, mirror open side, Arabic labels. |
| `src/components/trendmind/director-drawer.tsx` | Translate, RTL. |
| `src/components/trendmind/pulse-bar.tsx` | Translate, shorter format. |
| `src/components/trendmind/logo.tsx` | Force LTR isolation for wordmark. |
| `src/lib/workspace-store.tsx` | Auto-advance state machine (`phaseTransitionTarget`, `lastReadyVersions`, `suppressTransitionFrom`), `visitedPhases`, palette open state, shortcut registration, remove IO observer. |
| `src/lib/campaign-data.ts` | Blank `DEFAULT_BRIEF`; translate `PHASES[].label` and `role`; translate `AGENTS` names/short labels; translate `RESEARCH_KIND_META` labels. |
| `src/lib/campaign-engine.ts` | Translate user-visible fallback strings; inject instruction into AI prompts to respond in Arabic. |

---

## 7. Risks & tradeoffs

- **RTL sweep** touches most components. Mitigation: commit directional sweep as a focused pass before animation work.
- **Cancel-scope semantics**: cancelling only the current transition means if a phase completes *while the user is looking away*, they might miss the transition. Acceptable — the next completion will still prompt, and the phase tabs show `ready` state clearly.
- **First-entry animation tracking** relies on a session-level `visitedPhases` Set. If the user refreshes, animations replay — considered a feature.
- **Command palette in RTL**: fuzzy search on Arabic strings requires careful normalization (strip tashkeel, unify alef forms). Plan handles this with a small normalizer helper.
- **Cairo + IBM Plex Sans Arabic** = two font families loaded. Both are Google Fonts, cached, and together ≈120KB gzipped — acceptable.
- **Auto-advance race conditions**: polling happens every 2.2s; two phases could complete between polls. Mitigation: only target the phase directly after current `activePhase` in `PHASE_SEQUENCE`; if a later phase is already ready the overlay still points at the correct *next* one.
- **Reduced motion**: every new animation respects `@media (prefers-reduced-motion: reduce)` — backdrops freeze, transitions become simple fades, particle embers disable.

---

## 8. Out of scope for this pass

- Mobile responsive.
- Demo mode / scripted run.
- Guided first-run chat builder.
- Reworking the palette (keep warm ivory / gold / forest).
- New phases, new agents, new AI logic.
- Auth / multi-user.

---

## 9. Manual verification checklist

1. Page loads in `dir="rtl"`, Arabic fonts active, `TrendMind` wordmark stays Latin.
2. Each phase tab swaps to a distinct full-page view (no stacked sections).
3. Each first-visit phase plays its unique entry animation; subsequent visits do not.
4. Ambient backdrop changes per phase.
5. Running a full campaign fires the 3-second overlay at each phase boundary.
6. Clicking *"البقاء هنا"* cancels the current overlay only. Confirmed by running again and seeing the next transition prompt fire.
7. Manual tab clicks during overlay cancel just the current overlay.
8. Clicking *"الانتقال الآن"* skips countdown.
9. Arrow keys switch phases; `Cmd+K` opens the palette; `?` opens shortcut help.
10. Hovering any AI output reveals the reasoning peek.
11. Launch page plays the reveal ceremony on first entry when `ready`.
12. Creating a new campaign yields a fully blank Arabic brief (no English anywhere).
13. `prefers-reduced-motion: reduce` disables all heavy animations.
14. No hydration / RTL console errors.
