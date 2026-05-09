import { getCampaign } from "@/lib/campaign-repository";
import { getServerEnv } from "@/lib/env";
import {
  type AnalyticsCriticReport,
  type RiskDetectorReport,
  computeAnalyticsData,
} from "@/lib/analytics-utils";

export type {
  AngleStats,
  PhaseTimingData,
  AnalyticsData,
  AnalyticsCriticReport,
  RiskDetectorReport,
} from "@/lib/analytics-utils";

async function callAI({
  system,
  prompt,
  label,
}: {
  system: string;
  prompt: string;
  label: string;
}): Promise<string> {
  const env = getServerEnv();
  if (!env.OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API key missing.");
  }

  const models = [env.OPENROUTER_MODEL, env.OPENROUTER_FALLBACK_MODEL].filter(Boolean);
  let lastError = "Unknown error";

  for (const model of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), env.OPENROUTER_TIMEOUT_MS);

    try {
      const response = await fetch(`${env.OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": env.NEXT_PUBLIC_APP_URL,
          "X-Title": "TrendMind Analytics",
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        lastError = `${label} on ${model}: HTTP ${response.status}`;
        continue;
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = payload.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim()) return content;
      lastError = `${label} on ${model}: empty response`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Request failed";
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error(lastError);
}

function extractJson(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```json\s*([\s\S]+?)```/i);
  const candidate = fenced?.[1] ?? text.trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function toStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

const CRITIC_SYSTEM = `You are a world-class Data Analyst specializing in advertising campaign performance.
Analyze simulation results and provide a concise Executive Summary explaining why a specific angle won and what specific demographic groups resisted it.
Be specific, evidence-based, and commercially sharp.
Detect the brief language and respond in the same language naturally.
Return only valid JSON - no markdown fences, no prose outside the object.`;

export async function runAnalyticsCritic(campaignId: string): Promise<AnalyticsCriticReport> {
  const workspace = await getCampaign(campaignId);
  const data = computeAnalyticsData(workspace);
  const trial = workspace.phases.trial.data;
  const strategy = workspace.phases.strategy.data;
  const brief = workspace.brief;
  const winningAngle = strategy?.angles.find((angle) => angle.id === data.winningAngleId);

  const reactionSummary = data.angles.map((angle) => ({
    angle: `${angle.letter} - ${angle.title} (${angle.lane})`,
    sentiment: angle.sentiment,
    successRate: `${(angle.successRate * 100).toFixed(0)}%`,
    clarity: angle.avgClarity.toFixed(1),
    resonance: angle.avgResonance.toFixed(1),
    intent: angle.avgIntent.toFixed(1),
    conversionPotential: angle.conversionPotential.toFixed(1),
  }));

  const coldReactions =
    trial?.reactions
      .filter((reaction) => reaction.sentiment === "cold")
      .slice(0, 8)
      .map((reaction) => {
        const persona = trial.personas.find((entry) => entry.id === reaction.personaId);
        return `${persona?.name ?? "Unknown"} (${persona?.archetype ?? ""}): "${reaction.quote}"`;
      }) ?? [];

  const prompt = `Campaign: ${brief.campaignName}
Brand: ${brief.brandName}
Audience: ${brief.audience}
Goal: ${brief.goal}
Platform: ${brief.platform}
Language: ${brief.language}

Winning angle: ${winningAngle?.title ?? "N/A"} (${winningAngle?.lane ?? ""})
Trial summary: ${trial?.summary ?? "No trial data"}
Total personas: ${data.totalPersonas} - Total reactions: ${data.totalReactions}

Angle performance:
${JSON.stringify(reactionSummary, null, 2)}

Resistant reactions (cold sentiment):
${coldReactions.length > 0 ? coldReactions.join("\n") : "None"}

Audience notes: ${data.audienceSummary.join(" | ")}

Return JSON:
{
  "executiveSummary": "2-3 sentence summary of overall simulation performance",
  "winnerRationale": "Why the winning angle resonated - cite specific data",
  "demographicInsights": ["Insight about a group that responded well", "..."],
  "resistanceGroups": ["Specific persona type that resisted and why", "..."],
  "strategicConclusion": "One decisive strategic recommendation for execution"
}`;

  const raw = await callAI({ system: CRITIC_SYSTEM, prompt, label: "Analytical Critic" });
  const parsed = extractJson(raw);

  if (!parsed) {
    return {
      executiveSummary: raw.slice(0, 400),
      winnerRationale: "",
      demographicInsights: [],
      resistanceGroups: [],
      strategicConclusion: "",
    };
  }

  return {
    executiveSummary: String(parsed.executiveSummary ?? ""),
    winnerRationale: String(parsed.winnerRationale ?? ""),
    demographicInsights: toStrings(parsed.demographicInsights),
    resistanceGroups: toStrings(parsed.resistanceGroups),
    strategicConclusion: String(parsed.strategicConclusion ?? ""),
  };
}

const RISK_SYSTEM = `You are a Brand Safety Expert and PR Risk Specialist.
Look for potential PR risks, cultural sensitivities, or negative sentiment trends in the generated drafts based on simulated feedback.
Give a clear Go/No-Go recommendation based on evidence.
Detect the brief language and respond in the same language naturally.
Return only valid JSON - no markdown fences, no prose outside the object.`;

export async function runRiskDetector(campaignId: string): Promise<RiskDetectorReport> {
  const workspace = await getCampaign(campaignId);
  const data = computeAnalyticsData(workspace);
  const trial = workspace.phases.trial.data;
  const draft = workspace.phases.draft.data;
  const brief = workspace.brief;

  const draftTexts = draft?.variants.slice(0, 4).map((variant) => `"${variant.fullText}"`) ?? [];
  const negativeReactions =
    trial?.reactions
      .filter((reaction) => reaction.sentiment === "cold" || reaction.sentiment === "neutral")
      .slice(0, 12)
      .map((reaction) => {
        const persona = trial.personas.find((entry) => entry.id === reaction.personaId);
        return `${persona?.archetype ?? "Unknown"} - "${reaction.quote}" (${reaction.why})`;
      }) ?? [];

  const prompt = `Campaign: ${brief.campaignName}
Brand: ${brief.brandName}
Platform: ${brief.platform}
Audience: ${brief.audience}
Language: ${brief.language}
Guardrails: ${brief.guardrails.join(", ") || "None"}
Avoid: ${brief.avoid.join(", ") || "None"}

Copy drafts reviewed:
${draftTexts.join("\n---\n") || "No drafts available"}

Negative / neutral reactions:
${negativeReactions.join("\n") || "None"}

Response risks flagged by simulation:
${data.responseRisks.join("\n") || "None"}

Angle risk scores: ${data.angles.map((angle) => `${angle.letter} ${angle.title}: ${angle.riskScore.toFixed(1)}/10`).join(", ")}

Return JSON:
{
  "recommendation": "go" | "no-go" | "conditional-go",
  "overallRiskLevel": "low" | "medium" | "high",
  "prRisks": ["Specific PR risk and why it could ignite", "..."],
  "culturalSensitivities": ["Cultural element that may land poorly", "..."],
  "negativeTrends": ["Pattern in negative reactions signaling a structural problem", "..."],
  "conditions": ["Condition required for a conditional-go (empty if go/no-go)", "..."],
  "rationale": "2-sentence summary of the Go/No-Go decision"
}`;

  const raw = await callAI({ system: RISK_SYSTEM, prompt, label: "Risk Detector" });
  const parsed = extractJson(raw);

  if (!parsed) {
    return {
      recommendation: "conditional-go",
      overallRiskLevel: "medium",
      prRisks: [],
      culturalSensitivities: [],
      negativeTrends: [],
      conditions: [],
      rationale: raw.slice(0, 400),
    };
  }

  const recommendation = parsed.recommendation as string;
  const overallRiskLevel = parsed.overallRiskLevel as string;

  return {
    recommendation: (["go", "no-go", "conditional-go"] as const).includes(
      recommendation as "go" | "no-go" | "conditional-go",
    )
      ? (recommendation as "go" | "no-go" | "conditional-go")
      : "conditional-go",
    overallRiskLevel: (["low", "medium", "high"] as const).includes(
      overallRiskLevel as "low" | "medium" | "high",
    )
      ? (overallRiskLevel as "low" | "medium" | "high")
      : "medium",
    prRisks: toStrings(parsed.prRisks),
    culturalSensitivities: toStrings(parsed.culturalSensitivities),
    negativeTrends: toStrings(parsed.negativeTrends),
    conditions: toStrings(parsed.conditions),
    rationale: String(parsed.rationale ?? ""),
  };
}
