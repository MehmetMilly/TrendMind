export type AgentId =
  | "director"
  | "scout"
  | "strategist"
  | "architect"
  | "simulator"
  | "critic"
  | "factChecker"
  | "influencer"
  | "packaging"
  | "visual";

export interface AgentMeta {
  id: AgentId;
  name: string;
  short: string;
  initials: string;
  accent: string;
  role: string;
}

export type PhaseId =
  | "brief"
  | "research"
  | "strategy"
  | "draft"
  | "trial"
  | "studio"
  | "launch";

export type PhaseStatus =
  | "idle"
  | "pending"
  | "running"
  | "ready"
  | "stale"
  | "error";

export type CampaignStatus = "draft" | "running" | "ready" | "attention";
export type RunMode = "full" | "phase";
export type RunStatus = "queued" | "running" | "completed" | "failed";

export interface PhaseDef {
  id: PhaseId;
  index: number;
  label: string;
  role: string;
}

export interface CampaignBrief {
  campaignName: string;
  brandName: string;
  productName: string;
  audience: string;
  goal: string;
  platform: string;
  language: string;
  tone: string;
  valueProposition: string;
  callToAction: string;
  pillars: string[];
  avoid: string[];
  guardrails: string[];
  brandLinks: string[];
  socialAccounts: string[];
  references: string[];
  context: string;
}

export type ResearchKind =
  | "trend"
  | "audience"
  | "competitive"
  | "risk"
  | "fact";

export interface ResearchItem {
  id: string;
  kind: ResearchKind;
  title: string;
  summary: string;
  source: string;
  url?: string;
  confidence: number;
  by: AgentId;
  tags: string[];
}

export interface ResearchOutput {
  overview: string;
  items: ResearchItem[];
  sourceSummary: string[];
  recommendedFocus: string;
}

export type StrategyLane = "safe" | "sharp" | "viral";

export interface StrategyAngle {
  id: string;
  lane: StrategyLane;
  letter: "A" | "B" | "C";
  title: string;
  thesis: string;
  stance: string;
  promise: string;
  hook: string;
  rationale: string[];
  risks: string[];
  fit: string;
  tone: string;
  score: number;
}

export interface StrategyOutput {
  campaignThesis: string;
  messageDirection: string;
  positioningLogic: string;
  toneDirection: string;
  strategicConstraints: string[];
  angles: StrategyAngle[];
  recommendedAngleId: string;
  decisionFrame: string;
}

export interface DraftAtom {
  id: string;
  angleId: string;
  kind: "hook" | "body" | "cta";
  text: string;
  note?: string;
}

export interface CriticNote {
  agent: AgentId;
  note: string;
}

export interface DraftVariant {
  id: string;
  angleId: string;
  name: string;
  hookId: string;
  bodyId: string;
  ctaId: string;
  tone: string;
  length: "short" | "medium" | "long";
  score: number;
  critique: CriticNote[];
  fullText: string;
}

export interface DraftOutput {
  summary: string;
  atoms: DraftAtom[];
  variants: DraftVariant[];
  recommendedVariantId: string;
}

export interface Persona {
  id: string;
  name: string;
  archetype: string;
  oneLiner: string;
  glyph: string;
  accent: string;
}

export interface TrialReaction {
  id: string;
  personaId: string;
  variantId: string;
  sentiment: "love" | "warm" | "neutral" | "cold";
  quote: string;
  why: string;
  subScores: {
    clarity: number;
    resonance: number;
    intent: number;
  };
}

export interface TrialScore {
  variantId: string;
  angleId: string;
  average: number;
  resonance: number;
  risk: number;
  verdict: string;
}

export interface TrialAngleWinner {
  angleId: string;
  variantId: string;
  average: number;
  verdict: string;
}

export interface TrialOutput {
  summary: string;
  personas: Persona[];
  reactions: TrialReaction[];
  scoreboard: TrialScore[];
  angleWinners: TrialAngleWinner[];
  winningVariantId: string;
  recommendedEdits: string[];
  responseRisks: string[];
  audienceSummary: string[];
}

export interface StudioLayer {
  id: string;
  kind: "background" | "subject" | "headline" | "body" | "cta" | "logo";
  name: string;
  note: string;
}

export interface StudioFormat {
  id: string;
  name: string;
  ratio: string;
  size: string;
  layoutNote: string;
}

export interface StudioOutput {
  summary: string;
  selectedVariantId: string;
  imagePrompt: string;
  composition: string;
  palette: string[];
  typography: string[];
  layers: StudioLayer[];
  formats: StudioFormat[];
  assetChecklist: string[];
}

export interface LaunchResponse {
  scenario: string;
  response: string;
  tone: string;
}

export interface LaunchPackage {
  id: string;
  name: string;
  ratio: string;
  headline: string;
  caption: string;
  cta: string;
  visualCue: string;
}

export interface LaunchOutput {
  summary: string;
  winningAngleId: string;
  winningVariantId: string;
  finalCaption: string;
  alternates: string[];
  responsePlan: LaunchResponse[];
  riskNotes: string[];
  launchChecklist: string[];
  packages: LaunchPackage[];
  nextSteps: string[];
}

export interface PhaseOutputMap {
  brief: CampaignBrief;
  research: ResearchOutput;
  strategy: StrategyOutput;
  draft: DraftOutput;
  trial: TrialOutput;
  studio: StudioOutput;
  launch: LaunchOutput;
}

export interface PhaseRecord<T = unknown> {
  phase: PhaseId;
  status: PhaseStatus;
  version: number;
  headline: string | null;
  summary: string | null;
  data: T | null;
  generatedBy: AgentId | null;
  updatedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  staleReason: string | null;
  error: string | null;
}

export interface CampaignActivity {
  id: string;
  phase: PhaseId | "system";
  actor: AgentId;
  kind: "info" | "progress" | "decision" | "warning" | "error";
  message: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface CampaignRun {
  id: string;
  campaignId: string;
  mode: RunMode;
  startPhase: PhaseId;
  status: RunStatus;
  note: string | null;
  error: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface CampaignRevision {
  id: string;
  phase: PhaseId;
  note: string;
  status: "pending" | "applied";
  createdAt: string;
}

export interface CampaignSummary {
  id: string;
  name: string;
  brandName: string;
  platform: string;
  status: CampaignStatus;
  updatedAt: string;
  lastRunStatus: RunStatus | null;
}

export interface CampaignWorkspace {
  id: string;
  name: string;
  brandName: string;
  status: CampaignStatus;
  activePhase: PhaseId;
  selectedAngleId: string | null;
  selectedVariantId: string | null;
  brief: CampaignBrief;
  phases: { [K in PhaseId]: PhaseRecord<PhaseOutputMap[K]> };
  activities: CampaignActivity[];
  runs: CampaignRun[];
  revisions: CampaignRevision[];
  health: {
    ai: boolean;
    research: boolean;
  };
  updatedAt: string;
}

export interface CampaignBootstrap {
  campaigns: CampaignSummary[];
  activeCampaignId: string | null;
  activeCampaign: CampaignWorkspace | null;
}

export interface CreateCampaignInput {
  campaignName: string;
  brandName: string;
  productName: string;
  platform?: string;
}

export type BriefPatch = Partial<CampaignBrief>;

export interface RunRequest {
  startPhase: PhaseId;
  note?: string;
  mode?: RunMode;
}

export interface SelectionPatch {
  selectedAngleId?: string | null;
  selectedVariantId?: string | null;
}

export interface RevisionRequest {
  phase: PhaseId;
  note: string;
}
