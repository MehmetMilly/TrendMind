import { randomUUID } from "node:crypto";

import {
  PHASE_SEQUENCE,
  RESEARCH_KIND_META,
} from "@/lib/campaign-data";
import {
  appendActivity,
  createRunRecord,
  getCampaign,
  getRunById,
  savePhaseOutput,
  setPhaseError,
  setPhaseRunning,
  setRunCompleted,
  setRunFailed,
  setRunStarted,
} from "@/lib/campaign-repository";
import { withTransaction } from "@/lib/db";
import { getServerEnv } from "@/lib/env";
import type {
  AgentId,
  CampaignBrief,
  CampaignWorkspace,
  DraftAtom,
  DraftOutput,
  DraftVariant,
  LaunchOutput,
  Persona,
  PhaseId,
  ResearchItem,
  ResearchKind,
  ResearchOutput,
  RunRequest,
  StrategyAngle,
  StrategyOutput,
  StudioLayer,
  StudioOutput,
  TrialOutput,
  TrialReaction,
  TrialScore,
} from "@/lib/types";

declare global {
  var __trendmindActiveRuns: Map<string, Promise<void>> | undefined;
}

type TavilyResult = {
  title: string;
  url: string;
  content: string;
  score?: number;
};

function getRunMap() {
  if (!global.__trendmindActiveRuns) {
    global.__trendmindActiveRuns = new Map<string, Promise<void>>();
  }

  return global.__trendmindActiveRuns;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function makeId(prefix: string) {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const match = trimmed.match(/.+?[.!?](\s|$)/);
  return match ? match[0].trim() : trimmed;
}

function extractJsonObject(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```json\s*([\s\S]+?)```/i);
  const candidate = fenced?.[1] ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function callOpenRouter({
  system,
  prompt,
  label,
}: {
  system: string;
  prompt: string;
  label: string;
}) {
  const env = getServerEnv();
  if (!env.OPENROUTER_API_KEY) return null;

  const models = [
    env.OPENROUTER_MODEL,
    env.OPENROUTER_FALLBACK_MODEL,
  ].filter(Boolean);

  for (const model of models) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${env.OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": env.NEXT_PUBLIC_APP_URL,
          "X-Title": "TrendMind",
        },
        body: JSON.stringify({
          model,
          temperature: 0.85,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
      };

      const content = payload.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim()) {
        return content;
      }

      if (Array.isArray(content)) {
        const merged = content
          .map((part) => (typeof part?.text === "string" ? part.text : ""))
          .join("\n")
          .trim();
        if (merged) return merged;
      }
    } catch {
      // fall through to the next model
    } finally {
      clearTimeout(timeout);
    }
  }

  console.warn(`TrendMind: ${label} fell back because OpenRouter returned no usable response.`);
  return null;
}

async function searchTavily(query: string) {
  const env = getServerEnv();
  if (!env.TAVILY_API_KEY) return [];

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: env.TAVILY_API_KEY,
        query,
        search_depth: "basic",
        max_results: 4,
        include_raw_content: false,
      }),
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as {
      results?: TavilyResult[];
    };

    return payload.results ?? [];
  } catch {
    return [];
  }
}

function fallbackResearch(brief: CampaignBrief, tavilyResults: TavilyResult[]) {
  const references = tavilyResults.slice(0, 4);
  const baseItems: Array<Omit<ResearchItem, "id">> = [
    {
      kind: "trend",
      title: `${brief.platform} rewards campaign language that feels culturally aware, not promo-heavy.`,
      summary:
        "Signals around taste, restraint, and useful specificity tend to outperform generic hype when premium brands are trying to earn attention.",
      source: references[0]?.title ?? "TrendMind baseline premium-social benchmark",
      url: references[0]?.url,
      confidence: references.length > 0 ? 84 : 72,
      by: "scout",
      tags: ["tone", "platform", "premium"],
    },
    {
      kind: "audience",
      title: "The audience wants proof of taste and intention more than loud urgency.",
      summary: `For ${brief.audience}, the message needs to feel like it understands why someone would choose ${brief.productName} in the first place.`,
      source: references[1]?.title ?? "Audience synthesis from the campaign brief",
      url: references[1]?.url,
      confidence: references.length > 1 ? 82 : 70,
      by: "strategist",
      tags: ["audience", "motivation"],
    },
    {
      kind: "competitive",
      title: "Competitors are likely winning with polish, which means generic polish is no longer enough.",
      summary:
        "A launch-ready direction needs a sharper angle than just 'beautiful product photography and a nice line' or it will blend into the existing category mood.",
      source: references[2]?.title ?? "Competitive category read",
      url: references[2]?.url,
      confidence: references.length > 2 ? 77 : 68,
      by: "scout",
      tags: ["competitive", "positioning"],
    },
    {
      kind: "risk",
      title: "Pushy calls to action will weaken the brand signal.",
      summary:
        "Language that sounds rushed, loud, or discount-led would fight the brief and make the campaign feel more transactional than intentional.",
      source: references[3]?.title ?? "Performance critic risk scan",
      url: references[3]?.url,
      confidence: references.length > 3 ? 75 : 71,
      by: "critic",
      tags: ["risk", "cta"],
    },
    {
      kind: "fact",
      title: "The safest factual ground is to emphasize craft, taste, and use-case clarity.",
      summary:
        "Unless the brand gives specific proof points, claims should stay grounded in observable product qualities and real customer situations.",
      source: "Fact Checker baseline guidance",
      confidence: 88,
      by: "factChecker",
      tags: ["fact-check", "brand safety"],
    },
  ];

  return {
    overview: `${brief.brandName} should show up as a brand with taste, not a brand begging for attention. The campaign has permission to be memorable if it stays specific and emotionally credible.`,
    recommendedFocus:
      "Lead with intentionality, then let the product and audience self-recognition do the heavy lifting.",
    sourceSummary: references.map((result) => result.title).slice(0, 4),
    items: baseItems.map((item, index) => ({
      id: `research_${index + 1}`,
      ...item,
    })),
  } satisfies ResearchOutput;
}

function normalizeResearchOutput(
  value: unknown,
  brief: CampaignBrief,
  tavilyResults: TavilyResult[],
): ResearchOutput {
  const fallback = fallbackResearch(brief, tavilyResults);
  if (!value || typeof value !== "object") return fallback;

  const candidate = value as {
    overview?: unknown;
    recommendedFocus?: unknown;
    sourceSummary?: unknown;
    items?: unknown;
  };

  const items = Array.isArray(candidate.items)
    ? candidate.items
        .map((item, index) => {
          if (!item || typeof item !== "object") return null;
          const record = item as Record<string, unknown>;
          const kind = record.kind;
          const validKind = Object.keys(RESEARCH_KIND_META).includes(String(kind))
            ? (kind as ResearchKind)
            : fallback.items[index % fallback.items.length].kind;

          return {
            id: `research_${index + 1}`,
            kind: validKind,
            title:
              typeof record.title === "string" && record.title.trim()
                ? record.title.trim()
                : fallback.items[index % fallback.items.length].title,
            summary:
              typeof record.summary === "string" && record.summary.trim()
                ? record.summary.trim()
                : fallback.items[index % fallback.items.length].summary,
            source:
              typeof record.source === "string" && record.source.trim()
                ? record.source.trim()
                : fallback.items[index % fallback.items.length].source,
            url:
              typeof record.url === "string" && record.url.trim()
                ? record.url.trim()
                : undefined,
            confidence: clamp(
              typeof record.confidence === "number"
                ? record.confidence
                : fallback.items[index % fallback.items.length].confidence,
              55,
              96,
            ),
            by:
              validKind === "fact"
                ? "factChecker"
                : validKind === "risk"
                  ? "critic"
                  : validKind === "audience"
                    ? "strategist"
                    : "scout",
            tags: Array.isArray(record.tags)
              ? record.tags.filter((entry): entry is string => typeof entry === "string")
              : fallback.items[index % fallback.items.length].tags,
          } satisfies ResearchItem;
        })
        .filter(Boolean) as ResearchItem[]
    : fallback.items;

  return {
    overview:
      typeof candidate.overview === "string" && candidate.overview.trim()
        ? candidate.overview.trim()
        : fallback.overview,
    recommendedFocus:
      typeof candidate.recommendedFocus === "string" &&
      candidate.recommendedFocus.trim()
        ? candidate.recommendedFocus.trim()
        : fallback.recommendedFocus,
    sourceSummary: Array.isArray(candidate.sourceSummary)
      ? candidate.sourceSummary.filter((entry): entry is string => typeof entry === "string")
      : fallback.sourceSummary,
    items: items.length > 0 ? items.slice(0, 8) : fallback.items,
  };
}

async function generateResearch(workspace: CampaignWorkspace) {
  const brief = workspace.brief;
  const searches = await Promise.all([
    searchTavily(
      `${brief.brandName} ${brief.productName} ${brief.platform} audience campaign trend`,
    ),
    searchTavily(
      `${brief.productName} premium campaign examples ${brief.platform} objections audience`,
    ),
  ]);
  const tavilyResults = searches.flat().slice(0, 6);
  const output = normalizeResearchOutput(null, brief, tavilyResults);

  return {
    output,
    headline: "Research pack ready",
    summary: firstSentence(output.recommendedFocus),
    generatedBy: "scout" as AgentId,
  };
}

function fallbackStrategy(
  brief: CampaignBrief,
  research: ResearchOutput | null,
): StrategyOutput {
  const audience = brief.audience.toLowerCase();
  const angles: StrategyAngle[] = [
    {
      id: "safe-bet",
      lane: "safe",
      letter: "A",
      title: "The Considered Gift",
      thesis: `${brief.productName} becomes the tasteful choice for people who want their gift to feel intentional, not performative.`,
      stance: "Grounded, premium, and immediately legible to the target audience.",
      promise: "You can buy something quietly beautiful and still make it feel meaningful.",
      hook: "Not every gift needs to shout.",
      rationale: [
        "Best match for the brief's warm editorial tone.",
        "Lets the product do the persuading.",
        "Low cultural risk and strong clarity.",
      ],
      risks: ["May feel too reserved if the feed is noisy that week."],
      fit: `Strong fit for ${brief.platform} because it feels native to high-taste product storytelling.`,
      tone: brief.tone,
      score: 89,
    },
    {
      id: "sharp-take",
      lane: "sharp",
      letter: "B",
      title: "The Ritual",
      thesis: `The campaign sells the act of giving ${brief.productName} as a ritual of taste, not just a purchase.`,
      stance: "A little smarter, more emotionally charged, still brand-safe.",
      promise: "The giving itself becomes part of the story.",
      hook: "The giving is the gift.",
      rationale: [
        "Adds a stronger emotional frame without becoming sentimental mush.",
        "Gives Trial something interesting to test emotionally.",
        "Works well if the product has tactile or craft cues.",
      ],
      risks: ["Can tip soft or over-styled if the copy loses specificity."],
      fit: `Strong fit when ${audience.includes("professional") ? "busy professionals" : "the target audience"} still want their taste to show up in the gesture.`,
      tone: "Warm, cinematic, tactile.",
      score: 92,
    },
    {
      id: "viral-bet",
      lane: "viral",
      letter: "C",
      title: "Taste Is the Signal",
      thesis: `${brief.brandName} stops speaking like a brand and speaks like an insider who knows what counts as real taste.`,
      stance: "Sharper, more referential, higher upside with higher cultural risk.",
      promise: "You are not buying hype. You are buying the right signal.",
      hook: "For the ones who were already paying attention.",
      rationale: [
        "Differentiates the campaign from category-safe polish.",
        "Could travel farther if the audience enjoys the confidence.",
        "Lets the brand sound pointed without becoming loud.",
      ],
      risks: ["May read exclusive or too clever if the product proof is weak."],
      fit: "Best used when the brand wants a more opinionated posture.",
      tone: "Knowing, crisp, and a little provocative.",
      score: 85,
    },
  ];

  return {
    campaignThesis:
      research?.recommendedFocus ??
      `Lead with intention, hold the premium signal, and make the audience feel understood.`,
    decisionFrame:
      "TrendMind should test one safe lane, one emotionally richer lane, and one sharper high-upside lane so the campaign can compare clarity against memorability.",
    recommendedAngleId: "sharp-take",
    angles,
  };
}

function normalizeStrategyOutput(
  value: unknown,
  brief: CampaignBrief,
  research: ResearchOutput | null,
): StrategyOutput {
  const fallback = fallbackStrategy(brief, research);
  if (!value || typeof value !== "object") return fallback;

  const candidate = value as {
    campaignThesis?: unknown;
    decisionFrame?: unknown;
    recommendedAngleId?: unknown;
    angles?: unknown;
  };

  const laneFallbacks = fallback.angles;
  const angles = Array.isArray(candidate.angles)
    ? candidate.angles
        .map((angle, index) => {
          if (!angle || typeof angle !== "object") return null;
          const record = angle as Record<string, unknown>;
          const fallbackAngle = laneFallbacks[index] ?? laneFallbacks[0];
          const lane = record.lane;
          const validLane =
            lane === "safe" || lane === "sharp" || lane === "viral"
              ? lane
              : fallbackAngle.lane;

          return {
            id:
              typeof record.id === "string" && record.id.trim()
                ? record.id.trim()
                : fallbackAngle.id,
            lane: validLane,
            letter: (record.letter === "A" || record.letter === "B" || record.letter === "C"
              ? record.letter
              : fallbackAngle.letter) as StrategyAngle["letter"],
            title:
              typeof record.title === "string" && record.title.trim()
                ? record.title.trim()
                : fallbackAngle.title,
            thesis:
              typeof record.thesis === "string" && record.thesis.trim()
                ? record.thesis.trim()
                : fallbackAngle.thesis,
            stance:
              typeof record.stance === "string" && record.stance.trim()
                ? record.stance.trim()
                : fallbackAngle.stance,
            promise:
              typeof record.promise === "string" && record.promise.trim()
                ? record.promise.trim()
                : fallbackAngle.promise,
            hook:
              typeof record.hook === "string" && record.hook.trim()
                ? record.hook.trim()
                : fallbackAngle.hook,
            rationale: Array.isArray(record.rationale)
              ? record.rationale.filter((entry): entry is string => typeof entry === "string")
              : fallbackAngle.rationale,
            risks: Array.isArray(record.risks)
              ? record.risks.filter((entry): entry is string => typeof entry === "string")
              : fallbackAngle.risks,
            fit:
              typeof record.fit === "string" && record.fit.trim()
                ? record.fit.trim()
                : fallbackAngle.fit,
            tone:
              typeof record.tone === "string" && record.tone.trim()
                ? record.tone.trim()
                : fallbackAngle.tone,
            score: clamp(
              typeof record.score === "number" ? record.score : fallbackAngle.score,
              70,
              96,
            ),
          } satisfies StrategyAngle;
        })
        .filter(Boolean) as StrategyAngle[]
    : fallback.angles;

  const recommended =
    typeof candidate.recommendedAngleId === "string"
      ? candidate.recommendedAngleId
      : fallback.recommendedAngleId;

  return {
    campaignThesis:
      typeof candidate.campaignThesis === "string" && candidate.campaignThesis.trim()
        ? candidate.campaignThesis.trim()
        : fallback.campaignThesis,
    decisionFrame:
      typeof candidate.decisionFrame === "string" && candidate.decisionFrame.trim()
        ? candidate.decisionFrame.trim()
        : fallback.decisionFrame,
    recommendedAngleId:
      angles.find((angle) => angle.id === recommended)?.id ?? angles[1]?.id ?? angles[0].id,
    angles: angles.length >= 3 ? angles.slice(0, 3) : fallback.angles,
  };
}

async function generateStrategy(
  workspace: CampaignWorkspace,
  note?: string | null,
) {
  const research = workspace.phases.research.data;
  const aiText = await callOpenRouter({
    label: "strategy generation",
    system:
      "You are TrendMind's Brand Strategist. Return only valid JSON and make the three angles meaningfully different.",
    prompt: `
Turn this research pack into three campaign angles for TrendMind.

Brief:
${JSON.stringify(workspace.brief, null, 2)}

Research:
${JSON.stringify(research, null, 2)}

Latest note:
${note ?? "None"}

Return JSON with this shape:
{
  "campaignThesis": "string",
  "decisionFrame": "string",
  "recommendedAngleId": "string",
  "angles": [
    {
      "id": "string",
      "lane": "safe|sharp|viral",
      "letter": "A|B|C",
      "title": "string",
      "thesis": "string",
      "stance": "string",
      "promise": "string",
      "hook": "string",
      "rationale": ["string"],
      "risks": ["string"],
      "fit": "string",
      "tone": "string",
      "score": 0
    }
  ]
}

Rules:
- Exactly three angles.
- One safe lane, one sharp lane, one viral lane.
- Make them commercially usable, not just poetic.
- Avoid generic AI-marketing phrasing.
`,
  });

  const parsed = aiText ? extractJsonObject(aiText) : null;
  const output = normalizeStrategyOutput(parsed, workspace.brief, research);

  return {
    output,
    headline: "Strategy set across three lanes",
    summary: firstSentence(output.campaignThesis),
    generatedBy: "strategist" as AgentId,
  };
}


function fallbackDraft(strategy: StrategyOutput): DraftOutput {
  const atoms: DraftAtom[] = [];
  const variants: DraftVariant[] = strategy.angles.map((angle, index) => {
    const hookTexts = [
      angle.hook,
      angle.lane === "safe" ? "اختيار هادئ يقول الكثير." : angle.lane === "sharp" ? "الهدية تبدأ قبل أن تفتح." : "الذوق ليس صاخبا.",
      angle.promise,
      angle.lane === "viral" ? "لمن يفهمون الإشارة قبل الشرح." : "لمن يريدون معنى بلا مبالغة.",
    ];
    const bodyTexts = [
      angle.lane === "safe"
        ? angle.promise + " " + angle.thesis + " النسخة يجب أن تبدو مطمئنة وواضحة، وتترك المنتج يثبت قيمته بدون ضغط."
        : angle.lane === "sharp"
          ? angle.promise + " " + angle.thesis + " امنح اللغة حركة عاطفية محسوبة، مع جملة إثبات واحدة تجعل الفكرة قابلة للتصديق."
          : angle.promise + " " + angle.thesis + " اجعل الموقف واثقا وقابلا للمشاركة، لكن اربطه بسبب ملموس يجعل المنتج حاضرا.",
      angle.stance,
      angle.fit,
    ];
    const ctaTexts = [
      angle.lane === "viral"
        ? "شاهد الاختيار الذي يستحق المشاركة."
        : angle.lane === "sharp"
          ? "اختر ما يبدو مقصودا."
          : "تصفح الاختيارات الهادئة.",
      "اكتشف المجموعة الآن.",
      "ابدأ من الاختيار الأقرب لك.",
    ];

    hookTexts.forEach((itemText, itemIndex) => atoms.push({ id: "hook_" + (index + 1) + "_" + (itemIndex + 1), angleId: angle.id, kind: "hook", text: itemText }));
    bodyTexts.forEach((itemText, itemIndex) => atoms.push({ id: "body_" + (index + 1) + "_" + (itemIndex + 1), angleId: angle.id, kind: "body", text: itemText }));
    ctaTexts.forEach((itemText, itemIndex) => atoms.push({ id: "cta_" + (index + 1) + "_" + (itemIndex + 1), angleId: angle.id, kind: "cta", text: itemText }));

    const hookId = "hook_" + (index + 1) + "_1";
    const bodyId = "body_" + (index + 1) + "_1";
    const ctaId = "cta_" + (index + 1) + "_1";
    const hook = hookTexts[0];
    const body = bodyTexts[0];
    const cta = ctaTexts[0];

    return {
      id: "variant_" + (index + 1),
      angleId: angle.id,
      name: angle.title,
      hookId,
      bodyId,
      ctaId,
      tone: angle.tone,
      length: index === 0 ? "medium" : index === 1 ? "long" : "short",
      score: clamp(angle.score - (index === 2 ? 3 : 0), 74, 95),
      critique: [
        {
          agent: "critic",
          note:
            angle.lane === "viral"
              ? "قابلة للانتشار، لكنها تحتاج إثباتا واضحا للمنتج."
              : angle.lane === "sharp"
                ? "الأقوى عاطفيا إذا بقيت الجملة الوسطى محددة."
                : "واضحة وآمنة للبراند، ويمكن دفع الافتتاح قليلا.",
        },
        {
          agent: "architect",
          note:
            angle.lane === "safe"
              ? "أنظف مسار لإطلاق Premium مفهوم بسرعة."
              : "الفكرة المركزية قوية بما يكفي للانتقال إلى الاختبار.",
        },
      ],
      fullText: hook + "\n\n" + body + "\n\n" + cta,
    };
  });

  const recommendedVariantId =
    variants.find((variant) => variant.angleId === strategy.recommendedAngleId)?.id ?? variants[0].id;

  return {
    summary:
      "TrendMind وسع كل زاوية إلى عدة خطافات وأجسام ودعوات، ثم ركب أفضل نسخة مبدئية لكل مسار قبل الاختبار.",
    atoms,
    variants,
    recommendedVariantId,
  };
}

function normalizeDraftOutput(
  value: unknown,
  strategy: StrategyOutput,
): DraftOutput {
  const fallback = fallbackDraft(strategy);
  if (!value || typeof value !== "object") return fallback;

  const candidate = value as {
    summary?: unknown;
    atoms?: unknown;
    variants?: unknown;
    recommendedVariantId?: unknown;
  };

  const atoms = Array.isArray(candidate.atoms)
    ? candidate.atoms
        .map((atom, index) => {
          if (!atom || typeof atom !== "object") return null;
          const record = atom as Record<string, unknown>;
          const fallbackAtom = fallback.atoms[index % fallback.atoms.length];
          return {
            id:
              typeof record.id === "string" && record.id.trim()
                ? record.id.trim()
                : fallbackAtom.id,
            angleId:
              typeof record.angleId === "string" && record.angleId.trim()
                ? record.angleId.trim()
                : fallbackAtom.angleId,
            kind:
              record.kind === "hook" || record.kind === "body" || record.kind === "cta"
                ? record.kind
                : fallbackAtom.kind,
            text:
              typeof record.text === "string" && record.text.trim()
                ? record.text.trim()
                : fallbackAtom.text,
            note:
              typeof record.note === "string" && record.note.trim()
                ? record.note.trim()
                : undefined,
          } satisfies DraftAtom;
        })
        .filter(Boolean) as DraftAtom[]
    : fallback.atoms;

  const variants = Array.isArray(candidate.variants)
    ? candidate.variants
        .map((variant, index) => {
          if (!variant || typeof variant !== "object") return null;
          const record = variant as Record<string, unknown>;
          const fallbackVariant = fallback.variants[index % fallback.variants.length];
          return {
            id:
              typeof record.id === "string" && record.id.trim()
                ? record.id.trim()
                : fallbackVariant.id,
            angleId:
              typeof record.angleId === "string" && record.angleId.trim()
                ? record.angleId.trim()
                : fallbackVariant.angleId,
            name:
              typeof record.name === "string" && record.name.trim()
                ? record.name.trim()
                : fallbackVariant.name,
            hookId:
              typeof record.hookId === "string" && record.hookId.trim()
                ? record.hookId.trim()
                : fallbackVariant.hookId,
            bodyId:
              typeof record.bodyId === "string" && record.bodyId.trim()
                ? record.bodyId.trim()
                : fallbackVariant.bodyId,
            ctaId:
              typeof record.ctaId === "string" && record.ctaId.trim()
                ? record.ctaId.trim()
                : fallbackVariant.ctaId,
            tone:
              typeof record.tone === "string" && record.tone.trim()
                ? record.tone.trim()
                : fallbackVariant.tone,
            length:
              record.length === "short" || record.length === "medium" || record.length === "long"
                ? record.length
                : fallbackVariant.length,
            score: clamp(
              typeof record.score === "number" ? record.score : fallbackVariant.score,
              70,
              96,
            ),
            critique: Array.isArray(record.critique)
              ? record.critique
                  .map((entry) => {
                    if (!entry || typeof entry !== "object") return null;
                    const note = entry as Record<string, unknown>;
                    return {
                      agent:
                        note.agent === "critic" ||
                        note.agent === "architect" ||
                        note.agent === "strategist"
                          ? (note.agent as AgentId)
                          : "critic",
                      note:
                        typeof note.note === "string" && note.note.trim()
                          ? note.note.trim()
                          : "Keep this copy precise and concrete.",
                    };
                  })
                  .filter(Boolean) as DraftVariant["critique"]
              : fallbackVariant.critique,
            fullText:
              typeof record.fullText === "string" && record.fullText.trim()
                ? record.fullText.trim()
                : fallbackVariant.fullText,
          } satisfies DraftVariant;
        })
        .filter(Boolean) as DraftVariant[]
    : fallback.variants;

  return {
    summary:
      typeof candidate.summary === "string" && candidate.summary.trim()
        ? candidate.summary.trim()
        : fallback.summary,
    atoms: atoms.length > 0 ? atoms : fallback.atoms,
    variants: variants.length >= 3 ? variants.slice(0, 3) : fallback.variants,
    recommendedVariantId:
      typeof candidate.recommendedVariantId === "string" &&
      variants.some((variant) => variant.id === candidate.recommendedVariantId)
        ? candidate.recommendedVariantId
        : fallback.recommendedVariantId,
  };
}

async function generateDraft(
  workspace: CampaignWorkspace,
  note?: string | null,
) {
  const strategy = workspace.phases.strategy.data;
  if (!strategy) {
    throw new Error("Strategy output is required before Draft can run.");
  }

  const aiText = await callOpenRouter({
    label: "draft generation",
    system:
      "You are TrendMind's Content Architect and Performance Critic. Return only valid JSON.",
    prompt: `
Generate three campaign draft variants from this TrendMind strategy.

Brief:
${JSON.stringify(workspace.brief, null, 2)}

Strategy:
${JSON.stringify(strategy, null, 2)}

Latest note:
${note ?? "None"}

Return JSON with this shape:
{
  "summary": "string",
  "atoms": [
    {
      "id": "string",
      "angleId": "string",
      "kind": "hook|body|cta",
      "text": "string",
      "note": "string optional"
    }
  ],
  "variants": [
    {
      "id": "string",
      "angleId": "string",
      "name": "string",
      "hookId": "string",
      "bodyId": "string",
      "ctaId": "string",
      "tone": "string",
      "length": "short|medium|long",
      "score": 0,
      "fullText": "string",
      "critique": [
        { "agent": "critic|architect|strategist", "note": "string" }
      ]
    }
  ],
  "recommendedVariantId": "string"
}

Rules:
- Exactly three variants, one per strategy angle.
- Each variant should feel meaningfully different.
- Keep the copy presentation-ready, not placeholder-y.
- Critique notes should be short and sharp.
`,
  });

  const parsed = aiText ? extractJsonObject(aiText) : null;
  const output = normalizeDraftOutput(parsed, strategy);

  return {
    output,
    headline: "Draft variants assembled",
    summary: firstSentence(output.summary),
    generatedBy: "architect" as AgentId,
  };
}

function buildPersonas(brief: CampaignBrief): Persona[] {
  return [
    {
      id: "persona_1",
      name: "The Curator",
      archetype: "taste-led buyer",
      oneLiner: `Pays attention to design cues and wants ${brief.productName} to feel quietly excellent.`,
      glyph: "CU",
      accent: "#c8a96e",
    },
    {
      id: "persona_2",
      name: "The Quiet Giver",
      archetype: "emotional buyer",
      oneLiner: "Wants the gift to say something thoughtful without over-explaining itself.",
      glyph: "QG",
      accent: "#3d7a5f",
    },
    {
      id: "persona_3",
      name: "The Skeptic",
      archetype: "ad-resistant observer",
      oneLiner: "Needs proof that the brand is saying something real, not just dressing up an ad.",
      glyph: "SK",
      accent: "#8a6a5a",
    },
    {
      id: "persona_4",
      name: "The Returner",
      archetype: "warm existing customer",
      oneLiner: "Already likes the brand and just needs a credible reason to re-engage.",
      glyph: "RE",
      accent: "#4f6e87",
    },
    {
      id: "persona_5",
      name: "The Culture Kid",
      archetype: "share-prone observer",
      oneLiner: `Cares whether ${brief.brandName} feels current enough to talk about.`,
      glyph: "CK",
      accent: "#7a6b8a",
    },
  ];
}

function personaWeights(personaId: string, lane: StrategyAngle["lane"]) {
  const base = {
    clarity: 76,
    resonance: 78,
    intent: 74,
  };

  const adjustments: Record<string, Record<StrategyAngle["lane"], [number, number, number]>> = {
    persona_1: {
      safe: [8, 10, 4],
      sharp: [4, 12, 2],
      viral: [0, 7, -2],
    },
    persona_2: {
      safe: [4, 8, 6],
      sharp: [5, 11, 7],
      viral: [-1, 3, 1],
    },
    persona_3: {
      safe: [2, -1, 0],
      sharp: [6, 5, 3],
      viral: [-4, 1, -5],
    },
    persona_4: {
      safe: [5, 5, 10],
      sharp: [4, 9, 9],
      viral: [-2, 4, 3],
    },
    persona_5: {
      safe: [2, 3, 1],
      sharp: [3, 7, 2],
      viral: [0, 10, 5],
    },
  };

  const [clarity, resonance, intent] = adjustments[personaId][lane];
  return {
    clarity: base.clarity + clarity,
    resonance: base.resonance + resonance,
    intent: base.intent + intent,
  };
}

function quoteForSentiment(
  persona: Persona,
  variant: DraftVariant,
  sentiment: TrialReaction["sentiment"],
) {
  if (sentiment === "love") {
    return `This feels like ${variant.name.toLowerCase()} knows exactly how I want a brand to sound.`;
  }
  if (sentiment === "warm") {
    return `${variant.name} lands for me. I can see the audience leaning in if the visual carries it too.`;
  }
  if (sentiment === "neutral") {
    return `I get what ${variant.name.toLowerCase()} is doing, but it still needs one sharper proof point.`;
  }

  return `${persona.name} would question whether ${variant.name.toLowerCase()} is saying enough about the actual offer.`;
}

function generateTrial(workspace: CampaignWorkspace) {
  const draft = workspace.phases.draft.data;
  const strategy = workspace.phases.strategy.data;
  if (!draft || !strategy) {
    throw new Error("Draft and Strategy outputs are required before Trial can run.");
  }

  const personaList = buildPersonas(workspace.brief);
  const reactions: TrialReaction[] = [];

  for (const variant of draft.variants) {
    const angle = strategy.angles.find((entry) => entry.id === variant.angleId) ?? strategy.angles[0];

    for (const persona of personaList) {
      const weights = personaWeights(persona.id, angle.lane);
      const clarity = clamp(weights.clarity + Math.round((variant.score - 82) * 0.35), 55, 96);
      const resonance = clamp(
        weights.resonance + (angle.lane === "sharp" ? 3 : angle.lane === "viral" ? 4 : 0),
        52,
        97,
      );
      const intent = clamp(
        weights.intent + (variant.length === "long" ? 2 : variant.length === "short" ? -1 : 0),
        50,
        96,
      );
      const overall = average([clarity, resonance, intent]);
      const sentiment: TrialReaction["sentiment"] =
        overall >= 89 ? "love" : overall >= 79 ? "warm" : overall >= 68 ? "neutral" : "cold";

      reactions.push({
        id: makeId("reaction"),
        personaId: persona.id,
        variantId: variant.id,
        sentiment,
        quote: quoteForSentiment(persona, variant, sentiment),
        why:
          sentiment === "love"
            ? "The message feels emotionally legible and brand-right."
            : sentiment === "warm"
              ? "The idea connects, though execution details still matter."
              : sentiment === "neutral"
                ? "There is interest, but not enough conviction yet."
                : "The copy creates friction before it creates desire.",
        subScores: {
          clarity,
          resonance,
          intent,
        },
      });
    }
  }

  const scoreboard: TrialScore[] = draft.variants.map((variant) => {
    const related = reactions.filter((reaction) => reaction.variantId === variant.id);
    const averageScore = Math.round(
      average(
        related.map((reaction) =>
          average([
            reaction.subScores.clarity,
            reaction.subScores.resonance,
            reaction.subScores.intent,
          ]),
        ),
      ),
    );

    const resonance = Math.round(
      average(related.map((reaction) => reaction.subScores.resonance)),
    );
    const risk = clamp(100 - averageScore + (variant.length === "short" ? 4 : 0), 8, 44);
    return {
      variantId: variant.id,
      average: averageScore,
      resonance,
      risk,
      verdict:
        averageScore >= 88
          ? "Strong winner if the visual execution stays disciplined."
          : averageScore >= 80
            ? "Viable with one more pass on clarity or proof."
            : "Interesting, but not yet the safest launch choice.",
    };
  });

  const winningVariant =
    scoreboard.sort((left, right) => right.average - left.average)[0] ?? scoreboard[0];

  const responseRisks = reactions
    .filter((reaction) => reaction.sentiment === "cold")
    .slice(0, 3)
    .map((reaction) => reaction.why);

  return {
    summary:
      "Trial pressure-tested each draft against synthetic audience personas so the team could see where the message resonates, stalls, or attracts risk before launch.",
    personas: personaList,
    reactions,
    scoreboard,
    winningVariantId: winningVariant.variantId,
    recommendedEdits: [
      "Keep the winning hook, but sharpen one proof-bearing sentence in the body.",
      "Make the CTA feel intentional rather than purely transactional.",
      "Carry the best audience phrasing into Studio so the visual and copy feel like one idea.",
    ],
    responseRisks:
      responseRisks.length > 0
        ? responseRisks
        : ["No major response risk surfaced beyond the usual risk of sounding too polished and too generic."],
  } satisfies TrialOutput;
}

function generateStudio(workspace: CampaignWorkspace) {
  const trial = workspace.phases.trial.data;
  const draft = workspace.phases.draft.data;
  const strategy = workspace.phases.strategy.data;
  if (!trial || !draft || !strategy) {
    throw new Error("Trial, Draft, and Strategy outputs are required before Studio can run.");
  }

  const selectedVariantId = workspace.selectedVariantId ?? trial.winningVariantId;
  const variant =
    draft.variants.find((entry) => entry.id === selectedVariantId) ?? draft.variants[0];
  const angle =
    strategy.angles.find((entry) => entry.id === variant.angleId) ?? strategy.angles[0];

  const layers: StudioLayer[] = [
    {
      id: "layer_background",
      kind: "background",
      name: "Background",
      note: "Warm tactile backdrop with natural material texture and negative space for premium breathing room.",
    },
    {
      id: "layer_subject",
      kind: "subject",
      name: "Product hero",
      note: `Frame ${workspace.brief.productName} as the unmistakable focal object with considered lighting.`,
    },
    {
      id: "layer_headline",
      kind: "headline",
      name: "Headline",
      note: variant.fullText.split("\n")[0]?.replace(/"/g, "") ?? angle.hook,
    },
    {
      id: "layer_body",
      kind: "body",
      name: "Support copy",
      note: "Use one supporting sentence only. Do not crowd the composition.",
    },
    {
      id: "layer_cta",
      kind: "cta",
      name: "CTA",
      note: variant.fullText.split("\n").at(-1) ?? workspace.brief.callToAction,
    },
    {
      id: "layer_logo",
      kind: "logo",
      name: "Brand mark",
      note: `${workspace.brief.brandName} mark placed quietly with low-opacity confidence.`,
    },
  ];

  return {
    summary:
      "Studio translated the winning message into a controlled visual system so the output feels like a presentable ad direction rather than a block of text.",
    selectedVariantId: variant.id,
    imagePrompt: `Premium campaign ad for ${workspace.brief.brandName}. Product: ${workspace.brief.productName}. Mood: ${angle.tone}. Composition: single hero object, tactile materials, warm side light, negative space, editorial typography, premium restraint. Headline idea: ${angle.hook}. Avoid loud promo tropes, discount cues, and stock-photo energy.`,
    composition:
      "Single hero composition with one dominant object, one strong headline line, a supporting line, and restrained brand sign-off. Let the whitespace and material texture carry the luxury signal.",
    palette: ["#F4EADB", "#C8A96E", "#18251F", "#4F6E87"],
    typography: ["DM Serif Display", "Inter Medium", "Inter Regular"],
    layers,
    formats: [
      {
        id: "format_feed",
        name: "Feed hero",
        ratio: "4/5",
        size: "1080x1350",
        layoutNote: "Primary social asset with the largest headline treatment.",
      },
      {
        id: "format_quote",
        name: "Quote composite",
        ratio: "16/9",
        size: "1200x675",
        layoutNote: "Pull one reaction insight into a slimmer card-led social format.",
      },
      {
        id: "format_pin",
        name: "Pinned header",
        ratio: "3/1",
        size: "1500x500",
        layoutNote: "Keep the message distilled and object-led.",
      },
    ],
    assetChecklist: [
      "Verify that the headline does not overpower the product.",
      "Keep one tactile material cue in frame.",
      "Use one warm highlight color and one dark grounding tone.",
      "Make sure CTA placement feels editorial, not button-like.",
    ],
  } satisfies StudioOutput;
}

function generateLaunch(workspace: CampaignWorkspace) {
  const draft = workspace.phases.draft.data;
  const trial = workspace.phases.trial.data;
  const strategy = workspace.phases.strategy.data;
  if (!draft || !trial || !strategy) {
    throw new Error("Draft, Trial, and Strategy outputs are required before Launch can run.");
  }

  const winningVariant =
    draft.variants.find((entry) => entry.id === trial.winningVariantId) ?? draft.variants[0];
  const winningAngle =
    strategy.angles.find((entry) => entry.id === winningVariant.angleId) ?? strategy.angles[0];

  return {
    summary:
      "Launch packaged the best-performing campaign direction into a final delivery set with alternates, response guidance, and rollout notes.",
    winningAngleId: winningAngle.id,
    winningVariantId: winningVariant.id,
    finalCaption: winningVariant.fullText.replace(/\n{2,}/g, "\n\n"),
    alternates: draft.variants
      .filter((entry) => entry.id !== winningVariant.id)
      .map((entry) => entry.fullText),
    responsePlan: [
      {
        scenario: "Audience asks what makes the product worth gifting.",
        response:
          "Answer with one concrete proof point and one emotional reason the product feels considered.",
        tone: "Warm, specific, lightly editorial.",
      },
      {
        scenario: "Someone frames the campaign as too polished or too self-serious.",
        response:
          "Acknowledge the tone intentionally and bring the answer back to usefulness, quality, and the real customer situation.",
        tone: "Calm, self-aware, never defensive.",
      },
      {
        scenario: "The post gets strong positive resonance and requests for more formats.",
        response:
          "Roll the winning line into the slimmer quote-card format and post within the same visual system.",
        tone: "Confident and responsive.",
      },
    ],
    riskNotes: trial.responseRisks,
    launchChecklist: [
      "Approve final caption and legal-safe claims.",
      "Confirm the visual system holds up across all three launch formats.",
      "Prepare one audience-facing response for praise and one for skepticism.",
      "Watch early comments for whether the hook is landing as intended.",
    ],
    packages: [
      {
        id: "package_feed",
        name: "Primary X post",
        ratio: "4/5",
        headline: winningAngle.hook,
        caption: winningVariant.fullText,
        cta: workspace.brief.callToAction,
        visualCue: "Hero object with generous negative space and warm editorial light.",
      },
      {
        id: "package_quote",
        name: "Quote-led follow-up",
        ratio: "16/9",
        headline: "The giving is the signal.",
        caption:
          "Follow the winning line with one concise reaction-led social proof statement.",
        cta: "Read the guide.",
        visualCue: "Tighter crop, more graphic hierarchy, stronger typography.",
      },
      {
        id: "package_pin",
        name: "Pinned profile asset",
        ratio: "3/1",
        headline: winningAngle.title,
        caption: "Use the cleanest line and strongest product shot only.",
        cta: "Browse.",
        visualCue: "Wide banner, minimal copy, object-first composition.",
      },
    ],
    nextSteps: [
      "Use the strongest alternate as an A/B follow-up if early response is soft.",
      "Carry the best-performing reaction language into replies and follow-on posts.",
      "Re-run Trial after the first performance read if the audience behavior diverges from the simulation.",
    ],
  } satisfies LaunchOutput;
}

type GeneratedPhase = {
  output:
    | ResearchOutput
    | StrategyOutput
    | DraftOutput
    | TrialOutput
    | StudioOutput
    | LaunchOutput;
  headline: string;
  summary: string;
  generatedBy: AgentId;
};

async function buildPhase(
  workspace: CampaignWorkspace,
  phase: PhaseId,
  note?: string | null,
): Promise<GeneratedPhase> {
  switch (phase) {
    case "research":
      return generateResearch(workspace);
    case "strategy":
      return generateStrategy(workspace, note);
    case "draft":
      return generateDraft(workspace, note);
    case "trial": {
      const output = generateTrial(workspace);
      return {
        output,
        headline: "Audience simulation complete",
        summary: firstSentence(output.summary),
        generatedBy: "simulator",
      };
    }
    case "studio": {
      const output = generateStudio(workspace);
      return {
        output,
        headline: "Studio direction locked",
        summary: firstSentence(output.summary),
        generatedBy: "visual",
      };
    }
    case "launch": {
      const output = generateLaunch(workspace);
      return {
        output,
        headline: "Launch package prepared",
        summary: firstSentence(output.summary),
        generatedBy: "director",
      };
    }
    default:
      throw new Error(`Unsupported phase: ${phase}`);
  }
}

async function updateAutoSelection(
  campaignId: string,
  phase: PhaseId,
  output: GeneratedPhase["output"],
) {
  await withTransaction(async (client) => {
    if (phase === "strategy") {
      const strategy = output as StrategyOutput;
      await client.query(
        `
          UPDATE campaigns
          SET selected_angle_id = $2, updated_at = NOW()
          WHERE id = $1
        `,
        [campaignId, strategy.recommendedAngleId],
      );
    }

    if (phase === "draft") {
      const draft = output as DraftOutput;
      await client.query(
        `
          UPDATE campaigns
          SET selected_variant_id = $2, updated_at = NOW()
          WHERE id = $1
        `,
        [campaignId, draft.recommendedVariantId],
      );
    }

    if (phase === "trial") {
      const trial = output as TrialOutput;
      await client.query(
        `
          UPDATE campaigns
          SET selected_variant_id = $2, updated_at = NOW()
          WHERE id = $1
        `,
        [campaignId, trial.winningVariantId],
      );
    }
  });
}

async function processRun(runId: string) {
  const run = await getRunById(runId);
  if (!run) return;

  let currentPhase = run.startPhase;

  await withTransaction(async (client) => {
    await setRunStarted(client, run.id, run.campaignId, run.startPhase);
    await appendActivity(client, {
      campaignId: run.campaignId,
      runId: run.id,
      phase: run.startPhase,
      actor: "director",
      kind: "progress",
      message: `Run started from ${run.startPhase}.`,
      metadata: run.note ? { note: run.note } : {},
    });
  });

  try {
    const startIndex = Math.max(PHASE_SEQUENCE.indexOf(run.startPhase), 1);
    const phases = PHASE_SEQUENCE.slice(startIndex);

    for (const phase of phases) {
      currentPhase = phase;

      await withTransaction(async (client) => {
        await setPhaseRunning(client, run.campaignId, phase);
        await appendActivity(client, {
          campaignId: run.campaignId,
          runId: run.id,
          phase,
          actor:
            phase === "trial"
              ? "simulator"
              : phase === "studio"
                ? "visual"
                : phase === "launch"
                  ? "director"
                  : phase === "draft"
                    ? "architect"
                    : phase === "strategy"
                      ? "strategist"
                      : "scout",
          kind: "progress",
          message: `Working on ${phase}.`,
        });
      });

      const workspace = await getCampaign(run.campaignId);
      const generated = await buildPhase(workspace, phase, run.note);

      await withTransaction(async (client) => {
        await savePhaseOutput(client, {
          campaignId: run.campaignId,
          phase,
          headline: generated.headline,
          summary: generated.summary,
          generatedBy: generated.generatedBy,
          data: generated.output as never,
        });
        await appendActivity(client, {
          campaignId: run.campaignId,
          runId: run.id,
          phase,
          actor: generated.generatedBy,
          kind: "decision",
          message: generated.summary,
        });
      });

      await updateAutoSelection(run.campaignId, phase, generated.output);
    }

    await withTransaction(async (client) => {
      await setRunCompleted(client, run.campaignId, run.id);
      await appendActivity(client, {
        campaignId: run.campaignId,
        runId: run.id,
        phase: "launch",
        actor: "director",
        kind: "decision",
        message: "Campaign pipeline completed successfully.",
      });
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "TrendMind run failed unexpectedly.";

    await withTransaction(async (client) => {
      await setPhaseError(client, run.campaignId, currentPhase, message);
      await setRunFailed(client, run.campaignId, run.id, message);
      await appendActivity(client, {
        campaignId: run.campaignId,
        runId: run.id,
        phase: currentPhase,
        actor: "director",
        kind: "error",
        message,
      });
    });
  } finally {
    getRunMap().delete(runId);
  }
}

export async function startCampaignRun(campaignId: string, request: RunRequest) {
  const runId = await createRunRecord(campaignId, request);
  const runPromise = processRun(runId);
  getRunMap().set(runId, runPromise);
  void runPromise;
  return runId;
}

export async function waitForInFlightRuns() {
  await Promise.allSettled(Array.from(getRunMap().values()));
}
