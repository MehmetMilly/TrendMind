// ── Campaign data model ─────────────────────────────────────────────
// Static seed data that feeds the TrendMind living-campaign workspace.
// The data is intentionally shaped per phase, not flattened, so each
// section can behave like a real specialized tool.

export type AgentId =
  | 'director'
  | 'scout'
  | 'strategist'
  | 'architects'
  | 'critic'
  | 'visual';

export interface AgentMeta {
  id: AgentId;
  name: string;
  short: string;
  initials: string;
  accent: string; // hex
}

export const AGENTS: Record<AgentId, AgentMeta> = {
  director:  { id: 'director',   name: 'Campaign Director', short: 'Director',  initials: 'CD', accent: '#c8a96e' },
  scout:     { id: 'scout',      name: 'Trend Scout',       short: 'Scout',     initials: 'TS', accent: '#b7863f' },
  strategist:{ id: 'strategist', name: 'Brand Strategist',  short: 'Strategist',initials: 'BS', accent: '#3d7a5f' },
  architects:{ id: 'architects', name: 'Content Architects',short: 'Architects',initials: 'CA', accent: '#4f6e87' },
  critic:    { id: 'critic',     name: 'Performance Critic',short: 'Critic',    initials: 'PC', accent: '#8a6a5a' },
  visual:    { id: 'visual',     name: 'Visual Director',   short: 'Visual',    initials: 'VD', accent: '#7a6b8a' },
};

// ── Phases ───────────────────────────────────────────────────────────

export type PhaseId =
  | 'brief'
  | 'research'
  | 'strategy'
  | 'draft'
  | 'trial'
  | 'studio'
  | 'launch';

export type PhaseStatus = 'ghost' | 'writing' | 'ready' | 'stale';

export interface PhaseDef {
  id: PhaseId;
  index: number;
  label: string;
  role: string; // one-line role of the phase
}

export const PHASES: PhaseDef[] = [
  { id: 'brief',    index: 0, label: 'Brief',    role: 'Source of truth'       },
  { id: 'research', index: 1, label: 'Research', role: 'Evidence & signals'    },
  { id: 'strategy', index: 2, label: 'Strategy', role: 'Three angle bets'      },
  { id: 'draft',    index: 3, label: 'Draft',    role: 'Compose variants'      },
  { id: 'trial',    index: 4, label: 'Trial',    role: 'Audience simulation'   },
  { id: 'studio',   index: 5, label: 'Studio',   role: 'Visual production'     },
  { id: 'launch',   index: 6, label: 'Launch',   role: 'Ready to ship'         },
];

// ── Brief data ───────────────────────────────────────────────────────

export interface BriefState {
  campaign: string;
  brand: string;
  audience: string;
  goal: string;
  platform: string;
  tone: string;
  pillars: string[];
  avoid: string[];
  context: string;
}

export const DEFAULT_BRIEF: BriefState = {
  campaign: 'Q4 Holiday Push',
  brand: 'Northfield Supply Co.',
  audience: 'Style-conscious professionals, 28–44, who treat gifting as an expression of taste rather than obligation.',
  goal: 'Drive premium holiday gifting demand on X with a campaign that feels editorial, warm, and culturally awake — not discount-led.',
  platform: 'X (Twitter)',
  tone: 'Warm, refined, editorial, quietly confident.',
  pillars: ['Intentional gifting', 'Soft luxury', 'Cultural awareness', 'Sustainable craft'],
  avoid: ['hurry now', 'last chance', 'viral hack', 'insane deal'],
  context: 'The campaign should feel earned, not loud. Visuals lean low-key premium with warm light and tactile materials. Copy should sound like a knowing friend, not a sale.',
};

// ── Research items ───────────────────────────────────────────────────

export type ResearchKind = 'trend' | 'competitive' | 'audience' | 'risk' | 'fact';

export interface ResearchItem {
  id: string;
  kind: ResearchKind;
  title: string;
  summary: string;
  source: string;
  confidence: number; // 0-100
  by: AgentId;
}

export const RESEARCH: ResearchItem[] = [
  { id: 'r1', kind: 'trend', title: 'Soft-luxury gifting is replacing loud gifting', summary: 'Engagement on muted, editorial gift posts is outpacing bright promo by ~38% across Q3 on X lifestyle accounts.', source: 'X social listening · 12 accounts, 90d', confidence: 86, by: 'scout' },
  { id: 'r2', kind: 'trend', title: 'Rituals beat discounts in seasonal copy', summary: 'Copy framed around a ritual (wrapping, letter, small ceremony) converts 2.1× better than % off copy in comparable premium categories.', source: 'Internal benchmark · holiday Q4 2024', confidence: 79, by: 'scout' },
  { id: 'r3', kind: 'audience', title: 'The quiet gift-giver persona is growing', summary: '“I want my gift to feel like I thought about them, not like I spent a lot.” — repeated phrasing across 300+ audience replies.', source: 'Audience cluster #gift-2025q4', confidence: 82, by: 'strategist' },
  { id: 'r4', kind: 'competitive', title: 'Aesop-style restraint is the current baseline', summary: 'Three competitors shifted to minimal, object-forward holiday creative. Anyone shouting now looks cheap by comparison.', source: 'Competitive scan · 6 brands', confidence: 74, by: 'scout' },
  { id: 'r5', kind: 'risk', title: '“Holiday” over-saturates by week 3', summary: 'Attention to the word “holiday” in feeds drops sharply after Nov 20. Campaigns that lean on it late underperform.', source: 'Platform attention model', confidence: 68, by: 'critic' },
  { id: 'r6', kind: 'fact', title: 'X premium audiences tolerate long captions', summary: 'Posts 180–260 characters outperform shorter ones by 14% in this category when tone is editorial.', source: 'X native analytics · this brand, 180d', confidence: 88, by: 'critic' },
];

// ── Strategy angles ──────────────────────────────────────────────────

export interface StrategyAngle {
  id: string;
  letter: 'A' | 'B' | 'C';
  name: string;
  stance: string;       // one line posture
  promise: string;      // the emotional promise
  hook: string;         // lead line
  support: string[];    // 2-3 supporting points
  risk: string;
  leadSignal: string;   // which research signal it leans on
}

export const ANGLES: StrategyAngle[] = [
  {
    id: 'a',
    letter: 'A',
    name: 'The Quiet Gift',
    stance: 'Editorial, low-voice, object-forward.',
    promise: 'Giving something small that feels considered.',
    hook: 'Not every gift needs to shout.',
    support: [
      'Leads with a single object in warm light.',
      'Copy reads like a written note, not a promo.',
      'Ends with an invitation, not a CTA.',
    ],
    risk: 'Too quiet — may under-index on first-day reach.',
    leadSignal: 'r1',
  },
  {
    id: 'b',
    letter: 'B',
    name: 'The Ritual',
    stance: 'Season-as-ceremony, warm and tactile.',
    promise: 'Making the act of gifting feel like a small ritual again.',
    hook: 'The giving is the gift.',
    support: [
      'Frames wrapping, handwriting, and delivery as part of the product.',
      'Copy uses “we” and second-person intimacy.',
      'Highest emotional payoff in Trial tests.',
    ],
    risk: 'Can tip sentimental if visuals over-style.',
    leadSignal: 'r2',
  },
  {
    id: 'c',
    letter: 'C',
    name: 'Taste, Not Trend',
    stance: 'Cultural, knowing, quietly superior.',
    promise: 'Rewarding the person who already has taste.',
    hook: 'For the ones who were already paying attention.',
    support: [
      'Leans on a reference-heavy, insider register.',
      'Feels like an inside joke told beautifully.',
      'Polarizes — best for loyalty, not acquisition.',
    ],
    risk: 'Can read as exclusive to audiences outside the core.',
    leadSignal: 'r4',
  },
];

// ── Draft construction kit ───────────────────────────────────────────

export interface DraftAtom {
  id: string;
  kind: 'hook' | 'body' | 'cta';
  text: string;
  note?: string; // critic note
}

export const DRAFT_ATOMS: DraftAtom[] = [
  // hooks
  { id: 'h1', kind: 'hook', text: 'Not every gift needs to shout.' },
  { id: 'h2', kind: 'hook', text: 'The giving is the gift.' },
  { id: 'h3', kind: 'hook', text: 'Some things are better wrapped in restraint.' },
  { id: 'h4', kind: 'hook', text: 'For the ones who were already paying attention.' },
  // bodies
  { id: 'b1', kind: 'body', text: 'A small object, a warm light, and someone who will know exactly what it meant. That is all this season is asking of you.' },
  { id: 'b2', kind: 'body', text: 'We spent this year on the parts you never see — the stitch, the weight, the way it opens. So the wrapping could be the only ceremony.' },
  { id: 'b3', kind: 'body', text: 'A quiet winter object for the person whose taste you are always trying to match.', note: 'Too short. Undercuts the emotional build.' },
  // ctas
  { id: 'c1', kind: 'cta', text: 'See this year’s selects →' },
  { id: 'c2', kind: 'cta', text: 'The gift guide, quietly.' },
  { id: 'c3', kind: 'cta', text: 'Choose slowly. Ship on time.' },
];

export interface DraftVariant {
  id: string;
  angleId: 'a' | 'b' | 'c';
  hookId: string;
  bodyId: string;
  ctaId: string;
  score: number; // 0-100
  critiques: { agent: AgentId; note: string }[];
}

export const DRAFT_VARIANTS: DraftVariant[] = [
  {
    id: 'v1',
    angleId: 'a',
    hookId: 'h1',
    bodyId: 'b1',
    ctaId: 'c1',
    score: 91,
    critiques: [
      { agent: 'critic', note: 'Strong restraint. CTA could be a touch warmer.' },
      { agent: 'strategist', note: 'Reads true to the brand’s editorial register.' },
    ],
  },
  {
    id: 'v2',
    angleId: 'b',
    hookId: 'h2',
    bodyId: 'b2',
    ctaId: 'c3',
    score: 87,
    critiques: [
      { agent: 'critic', note: 'Best emotional arc. Slightly long — tighten line 2.' },
      { agent: 'architects', note: '“The wrapping could be the only ceremony” is the line.' },
    ],
  },
  {
    id: 'v3',
    angleId: 'c',
    hookId: 'h4',
    bodyId: 'b3',
    ctaId: 'c2',
    score: 78,
    critiques: [
      { agent: 'critic', note: 'Sharp but thin. Body undercuts the hook.' },
      { agent: 'strategist', note: 'Risk of feeling superior — soften middle line.' },
    ],
  },
];

// ── Trial personas ───────────────────────────────────────────────────

export interface Persona {
  id: string;
  name: string;
  oneLiner: string;
  glyph: string; // short text glyph in avatar
  accent: string;
}

export const PERSONAS: Persona[] = [
  { id: 'p1', name: 'The Curator',      oneLiner: '34, design lead, pays for taste.',        glyph: 'CU', accent: '#c8a96e' },
  { id: 'p2', name: 'The Quiet Giver',  oneLiner: '41, gives small, means it.',               glyph: 'QG', accent: '#3d7a5f' },
  { id: 'p3', name: 'The Skeptic',      oneLiner: '29, allergic to marketing.',               glyph: 'SK', accent: '#8a6a5a' },
  { id: 'p4', name: 'The Returner',     oneLiner: '36, bought last year, on the edge.',       glyph: 'RE', accent: '#4f6e87' },
  { id: 'p5', name: 'The Culture Kid',  oneLiner: '25, posts what they like, loudly.',        glyph: 'CK', accent: '#7a6b8a' },
];

export interface TrialReaction {
  personaId: string;
  variantId: string;
  sentiment: 'love' | 'warm' | 'neutral' | 'cold';
  quote: string;
  subScores: { clarity: number; feel: number; intent: number };
}

export const TRIAL_REACTIONS: TrialReaction[] = [
  { personaId: 'p1', variantId: 'v1', sentiment: 'love',    quote: '“Finally, a brand that understands restraint as a luxury.”', subScores: { clarity: 88, feel: 94, intent: 82 } },
  { personaId: 'p1', variantId: 'v2', sentiment: 'warm',    quote: '“The ritual framing is tasteful. I’d screenshot this.”',      subScores: { clarity: 82, feel: 90, intent: 76 } },
  { personaId: 'p1', variantId: 'v3', sentiment: 'warm',    quote: '“Sharp, but the middle line loses me a little.”',            subScores: { clarity: 72, feel: 80, intent: 70 } },

  { personaId: 'p2', variantId: 'v1', sentiment: 'warm',    quote: '“This sounds like me when I’m buying for my sister.”',       subScores: { clarity: 84, feel: 88, intent: 80 } },
  { personaId: 'p2', variantId: 'v2', sentiment: 'love',    quote: '“Yes — the giving is the gift. That’s the whole thing.”',    subScores: { clarity: 86, feel: 96, intent: 88 } },
  { personaId: 'p2', variantId: 'v3', sentiment: 'neutral', quote: '“A bit too clever. I want it warmer.”',                       subScores: { clarity: 70, feel: 68, intent: 64 } },

  { personaId: 'p3', variantId: 'v1', sentiment: 'neutral', quote: '“Fine. Still an ad though.”',                                  subScores: { clarity: 74, feel: 66, intent: 58 } },
  { personaId: 'p3', variantId: 'v2', sentiment: 'warm',    quote: '“This one actually reads like a person wrote it.”',           subScores: { clarity: 78, feel: 80, intent: 70 } },
  { personaId: 'p3', variantId: 'v3', sentiment: 'cold',    quote: '“Says a lot about taste, not much about the thing.”',         subScores: { clarity: 60, feel: 58, intent: 52 } },

  { personaId: 'p4', variantId: 'v1', sentiment: 'warm',    quote: '“I’d open this. I already own two things from them.”',       subScores: { clarity: 82, feel: 80, intent: 84 } },
  { personaId: 'p4', variantId: 'v2', sentiment: 'love',    quote: '“Ritual, wrapping, the whole thing — I am the audience.”',    subScores: { clarity: 86, feel: 92, intent: 90 } },
  { personaId: 'p4', variantId: 'v3', sentiment: 'neutral', quote: '“Tight, but I want to feel invited, not tested.”',            subScores: { clarity: 70, feel: 72, intent: 66 } },

  { personaId: 'p5', variantId: 'v1', sentiment: 'warm',    quote: '“Quiet flex. I’d repost.”',                                   subScores: { clarity: 80, feel: 86, intent: 72 } },
  { personaId: 'p5', variantId: 'v2', sentiment: 'warm',    quote: '“Feels like an older sibling said it. Good.”',                subScores: { clarity: 78, feel: 84, intent: 72 } },
  { personaId: 'p5', variantId: 'v3', sentiment: 'love',    quote: '“This one has teeth. I respect it.”',                          subScores: { clarity: 76, feel: 86, intent: 78 } },
];

// ── Studio layers ────────────────────────────────────────────────────

export interface StudioLayer {
  id: string;
  name: string;
  kind: 'bg' | 'subject' | 'headline' | 'cta' | 'logo';
  note: string;
}

export const STUDIO_LAYERS: StudioLayer[] = [
  { id: 'l1', kind: 'bg',       name: 'Background',  note: 'Warm linen, soft low-side light.' },
  { id: 'l2', kind: 'subject',  name: 'Subject',     note: 'Single object, quarter-wrapped.' },
  { id: 'l3', kind: 'headline', name: 'Headline',    note: '“The giving is the gift.”' },
  { id: 'l4', kind: 'cta',      name: 'CTA',         note: 'Choose slowly. Ship on time.' },
  { id: 'l5', kind: 'logo',     name: 'Mark',        note: 'Bottom-right, 40% opacity.' },
];

// ── Launch platform adaptations ──────────────────────────────────────

export interface LaunchFormat {
  id: string;
  name: string;
  sizeNote: string;
  ratio: string;
}

export const LAUNCH_FORMATS: LaunchFormat[] = [
  { id: 'f1', name: 'X · feed post',       sizeNote: '1080×1350',  ratio: '4/5'   },
  { id: 'f2', name: 'X · quote composite', sizeNote: '1200×675',   ratio: '16/9'  },
  { id: 'f3', name: 'X · profile pin',     sizeNote: '1500×500',   ratio: '3/1'   },
];

// ── Ambient activity ticker ─────────────────────────────────────────

export interface ActivityTick {
  id: string;
  by: AgentId;
  text: string;
  age: string;
}

export const ACTIVITY: ActivityTick[] = [
  { id: 't1', by: 'scout',      text: 'pulled 6 new signals from last week’s feed', age: 'just now' },
  { id: 't2', by: 'strategist', text: 'hardened the audience thesis around “quiet giver”', age: '1m' },
  { id: 't3', by: 'architects', text: 'composed 3 variants across angles A, B, C',  age: '2m' },
  { id: 't4', by: 'critic',     text: 'scored variants · A 91 · B 87 · C 78',       age: '3m' },
  { id: 't5', by: 'visual',     text: 'locked mood: warm linen, low side light',    age: '5m' },
  { id: 't6', by: 'director',   text: 'advanced the campaign to Trial',              age: '5m' },
];
