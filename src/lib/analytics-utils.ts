import type { CampaignWorkspace, StrategyLane } from "@/lib/types";

export interface AngleStats {
  angleId: string;
  lane: StrategyLane;
  letter: "A" | "B" | "C";
  title: string;
  strategyScore: number;
  sentiment: { love: number; warm: number; neutral: number; cold: number; total: number };
  successRate: number;
  avgClarity: number;
  avgResonance: number;
  avgIntent: number;
  conversionPotential: number;
  riskScore: number;
}

export interface PhaseTimingData {
  phase: string;
  label: string;
  durationMs: number | null;
  activityCount: number;
}

export interface AnalyticsData {
  campaignId: string;
  campaignName: string;
  brandName: string;
  language: string;
  angles: AngleStats[];
  winningAngleId: string | null;
  trialSummary: string;
  audienceSummary: string[];
  responseRisks: string[];
  phaseTimings: PhaseTimingData[];
  totalPersonas: number;
  totalReactions: number;
  hasTrialData: boolean;
}

export interface AnalyticsCriticReport {
  executiveSummary: string;
  winnerRationale: string;
  demographicInsights: string[];
  resistanceGroups: string[];
  strategicConclusion: string;
}

export interface RiskDetectorReport {
  recommendation: "go" | "no-go" | "conditional-go";
  overallRiskLevel: "low" | "medium" | "high";
  prRisks: string[];
  culturalSensitivities: string[];
  negativeTrends: string[];
  conditions: string[];
  rationale: string;
}

const PHASE_LABELS: Record<string, string> = {
  research: "البحث",
  strategy: "التخطيط",
  draft: "الصياغة",
  trial: "التجربة",
  studio: "الاستوديو",
  launch: "الإطلاق",
};

export function computeAnalyticsData(workspace: CampaignWorkspace): AnalyticsData {
  const trial = workspace.phases.trial.data;
  const strategy = workspace.phases.strategy.data;
  const draft = workspace.phases.draft.data;

  const variantToAngle = new Map<string, string>();
  if (draft) {
    for (const variant of draft.variants) {
      variantToAngle.set(variant.id, variant.angleId);
    }
  }

  const angles: AngleStats[] = [];
  if (strategy) {
    for (const angle of strategy.angles) {
      const sentiment = { love: 0, warm: 0, neutral: 0, cold: 0, total: 0 };
      let sumClarity = 0;
      let sumResonance = 0;
      let sumIntent = 0;
      let count = 0;

      if (trial) {
        for (const reaction of trial.reactions) {
          if (variantToAngle.get(reaction.variantId) === angle.id) {
            sentiment[reaction.sentiment] += 1;
            sentiment.total += 1;
            sumClarity += reaction.subScores.clarity;
            sumResonance += reaction.subScores.resonance;
            sumIntent += reaction.subScores.intent;
            count += 1;
          }
        }
      }

      const avgClarity = count > 0 ? sumClarity / count : 0;
      const avgResonance = count > 0 ? sumResonance / count : 0;
      const avgIntent = count > 0 ? sumIntent / count : 0;
      const conversionPotential = avgClarity * 0.3 + avgResonance * 0.4 + avgIntent * 0.3;
      const successRate =
        sentiment.total > 0 ? (sentiment.love + sentiment.warm) / sentiment.total : 0;

      const angleScores = trial?.scoreboard.filter((score) => score.angleId === angle.id) ?? [];
      const riskScore =
        angleScores.length > 0
          ? angleScores.reduce((sum, score) => sum + score.risk, 0) / angleScores.length
          : 0;

      angles.push({
        angleId: angle.id,
        lane: angle.lane,
        letter: angle.letter,
        title: angle.title,
        strategyScore: angle.score,
        sentiment,
        successRate,
        avgClarity,
        avgResonance,
        avgIntent,
        conversionPotential,
        riskScore,
      });
    }
  }

  const activityByPhase = new Map<string, number>();
  for (const activity of workspace.activities) {
    activityByPhase.set(activity.phase, (activityByPhase.get(activity.phase) ?? 0) + 1);
  }

  const phaseTimings: PhaseTimingData[] = (["research", "strategy", "draft", "trial", "studio", "launch"] as const).map((phase) => {
    const record = workspace.phases[phase];
    let durationMs: number | null = null;
    if (record.startedAt && record.completedAt) {
      durationMs = new Date(record.completedAt).getTime() - new Date(record.startedAt).getTime();
    }
    return {
      phase,
      label: PHASE_LABELS[phase] ?? phase,
      durationMs,
      activityCount: activityByPhase.get(phase) ?? 0,
    };
  });

  const winningAngleId = trial?.angleWinners[0]?.angleId ?? workspace.selectedAngleId ?? null;

  return {
    campaignId: workspace.id,
    campaignName: workspace.name,
    brandName: workspace.brandName,
    language: workspace.brief.language || "ar",
    angles,
    winningAngleId,
    trialSummary: trial?.summary ?? "",
    audienceSummary: trial?.audienceSummary ?? [],
    responseRisks: trial?.responseRisks ?? [],
    phaseTimings,
    totalPersonas: trial?.personas.length ?? 0,
    totalReactions: trial?.reactions.length ?? 0,
    hasTrialData: Boolean(trial && trial.reactions.length > 0),
  };
}
