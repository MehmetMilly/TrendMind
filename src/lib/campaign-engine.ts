import { randomUUID } from "node:crypto";

import {
  buildDraftPrompt,
  buildLaunchPrompt,
  buildResearchPrompt,
  buildStrategyPrompt,
  buildTrialPrompt,
} from "@/lib/campaign-prompts";
import { PHASE_SEQUENCE } from "@/lib/campaign-data";
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
  TrialAngleWinner,
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

function getRunMap() {
  if (!global.__trendmindActiveRuns) {
    global.__trendmindActiveRuns = new Map();
  }

  return global.__trendmindActiveRuns;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

function makeId(prefix: string) {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

function extractJsonObject(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```json\s*([\s\S]+?)```/i);
  const candidate = fenced?.[1] ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const match = trimmed.match(/.+?[.!?؟](\s|$)/);
  return match ? match[0].trim() : trimmed;
}

function toArrayOfStrings(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function hasArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

function prefersArabic(brief: CampaignBrief) {
  return (
    hasArabic(brief.language) ||
    /arab|arabic|gulf|saudi/i.test(brief.language) ||
    hasArabic(brief.audience) ||
    hasArabic(brief.context)
  );
}

function displayProduct(brief: CampaignBrief) {
  return brief.productName || brief.campaignName || brief.brandName || "المنتج";
}

function displayBrand(brief: CampaignBrief) {
  return brief.brandName || "العلامة";
}

function displayCTA(brief: CampaignBrief) {
  return brief.callToAction || (prefersArabic(brief) ? "ابدأ الآن" : "Get started");
}

function scoreFromText(text: string) {
  return Array.from(text).reduce((sum, character) => sum + character.charCodeAt(0), 0);
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

  const models = [env.OPENROUTER_MODEL, env.OPENROUTER_FALLBACK_MODEL].filter(Boolean);

  for (const model of models) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

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
          temperature: 0.8,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) continue;

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
      };

      const content = payload.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim()) return content;
      if (Array.isArray(content)) {
        const merged = content
          .map((part) => (typeof part?.text === "string" ? part.text : ""))
          .join("\n")
          .trim();
        if (merged) return merged;
      }
    } catch {
      // try the next model
    } finally {
      clearTimeout(timeout);
    }
  }

  console.warn(`TrendMind: ${label} fell back to deterministic generation.`);
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
        search_depth: "advanced",
        max_results: 4,
        include_raw_content: false,
      }),
    });

    if (!response.ok) return [];
    const payload = (await response.json()) as { results?: TavilyResult[] };
    return payload.results ?? [];
  } catch {
    return [];
  }
}

function fallbackResearch(brief: CampaignBrief, tavilyResults: TavilyResult[]): ResearchOutput {
  if (prefersArabic(brief)) {
    const product = displayProduct(brief);
    const brand = displayBrand(brief);

    const baseItems: ResearchItem[] = [
      {
        id: "research_1",
        kind: "audience",
        title: "الجمهور يريد فائدة ملموسة قبل أي زينة لفظية",
        summary: `إذا لم يفهم المتلقي بسرعة لماذا ${product} مفيد له اليوم، فحتى النسخة الجميلة ستبدو عامة.`,
        source: tavilyResults[0]?.title ?? "Brief synthesis",
        url: tavilyResults[0]?.url,
        confidence: tavilyResults[0] ? 85 : 73,
        by: "scout",
        tags: ["وضوح", "نية الشراء", "أولوية الرسالة"],
      },
      {
        id: "research_2",
        kind: "competitive",
        title: "كثير من المنافسين يملكون صورة جميلة، لكنهم لا يملكون زاوية واضحة",
        summary: `الفرصة ليست في تقليد السطح البصري، بل في إعطاء ${brand} موقفا تسويقيا يفهمه الناس بسرعة ويتذكرونه.`,
        source: tavilyResults[1]?.title ?? "Category read",
        url: tavilyResults[1]?.url,
        confidence: tavilyResults[1] ? 81 : 71,
        by: "scout",
        tags: ["تمييز", "زاوية", "فئة مزدحمة"],
      },
      {
        id: "research_3",
        kind: "trend",
        title: "المحتوى الأقوى يبدو أقرب إلى قرار ذكي من كونه إعلاناً صاخباً",
        summary: "النسخ التي تعطي المستهلك طريقة فهم أو اختيار أو مقارنة تميل لأن تبدو أنضج وأكثر إقناعاً.",
        source: tavilyResults[2]?.title ?? "Platform behavior synthesis",
        url: tavilyResults[2]?.url,
        confidence: tavilyResults[2] ? 79 : 70,
        by: "strategist",
        tags: ["لهجة", "سلوك المنصة", "قرار"],
      },
      {
        id: "research_4",
        kind: "risk",
        title: "المبالغة أو الترجمة الحرفية ستفقد الحملة مصداقيتها بسرعة",
        summary: "اللغة العربية يجب أن تبدو أصلية ومقصودة. أي نسخة فضفاضة أو مترجمة ستضعف الانطباع مهما كان التصميم جيداً.",
        source: tavilyResults[3]?.title ?? "TrendMind language guardrail",
        url: tavilyResults[3]?.url,
        confidence: 89,
        by: "critic",
        tags: ["عربية طبيعية", "مصداقية", "خطر لغوي"],
      },
      {
        id: "research_5",
        kind: "fact",
        title: "أفضل أرضية آمنة هي الوصف الدقيق للفائدة والسياق",
        summary: "إذا لم تكن لدينا أدلة صريحة، فالأذكى أن نبني الحجة على التجربة المتوقعة والسياق اليومي والذوق التجاري الواضح.",
        source: "Fact-check baseline",
        confidence: 91,
        by: "factChecker",
        tags: ["مطالبات", "أمان", "صياغة"],
      },
      {
        id: "research_6",
        kind: "trend",
        title: "المنصات الاجتماعية تكافئ الزاوية التي يسهل إعادة قولها",
        summary: "حين يخرج الجمهور بجملة قابلة للتكرار أو إعادة الاقتباس، تزيد قابلية الحملة للانتشار والتذكر.",
        source: "Message portability heuristic",
        confidence: 77,
        by: "scout",
        tags: ["انتشار", "اختصار", "قابلية التذكر"],
      },
    ];

    return {
      overview: `${brand} يحتاج حملة تبدو أذكى من مجرد نسخة جميلة: زاوية واضحة، فائدة قابلة للتصديق، ولهجة عربية تشعر بأنها خرجت من السوق نفسه.`,
      recommendedFocus: "ابن الرسالة حول ما يجعل القرار أسهل أو أوضح أو أذكى للمستهلك، ثم دع التصميم يخدم ذلك لا أن يخبئه.",
      sourceSummary:
        tavilyResults.map((item) => item.title).slice(0, 4).length > 0
          ? tavilyResults.map((item) => item.title).slice(0, 4)
          : ["No external search results were available, so this pack is grounded in the brief and category logic."],
      items: baseItems,
    };
  }

  return {
    overview: `${displayBrand(brief)} needs a campaign that feels sharper than generic AI-brand copy: specific, credible, and clearly aware of the category.`,
    recommendedFocus: "Lead with the most useful point of distinction, then make the campaign feel like a real decision, not just a polished ad.",
    sourceSummary:
      tavilyResults.map((item) => item.title).slice(0, 4).length > 0
        ? tavilyResults.map((item) => item.title).slice(0, 4)
        : ["No external research was available, so the pack was synthesized from the brief."],
    items: [
      {
        id: "research_1",
        kind: "audience",
        title: "The audience wants a reason to care, not just a stylish presentation.",
        summary: `If the value of ${displayProduct(brief)} is not legible quickly, premium presentation alone will not carry the campaign.`,
        source: tavilyResults[0]?.title ?? "Brief synthesis",
        url: tavilyResults[0]?.url,
        confidence: 81,
        by: "scout",
        tags: ["audience", "clarity"],
      },
      {
        id: "research_2",
        kind: "competitive",
        title: "Category polish is table stakes now.",
        summary: "The campaign needs a real point of view, not just tasteful assets and a polished line.",
        source: tavilyResults[1]?.title ?? "Competitive read",
        url: tavilyResults[1]?.url,
        confidence: 79,
        by: "scout",
        tags: ["competitive", "positioning"],
      },
      {
        id: "research_3",
        kind: "risk",
        title: "Weak proof or inflated tone will reduce trust.",
        summary: "The message should feel commercially confident without slipping into hype.",
        source: "TrendMind risk baseline",
        confidence: 87,
        by: "critic",
        tags: ["risk", "trust"],
      },
      {
        id: "research_4",
        kind: "fact",
        title: "Use-case specificity is the safest kind of proof.",
        summary: "If hard evidence is thin, ground the campaign in observable product behavior and customer situations.",
        source: "Fact-check baseline",
        confidence: 90,
        by: "factChecker",
        tags: ["fact", "proof"],
      },
      {
        id: "research_5",
        kind: "trend",
        title: "Portable messaging outperforms decorative language.",
        summary: "The best campaign line should be easy to repeat in conversation or social replies.",
        source: "Message portability heuristic",
        confidence: 76,
        by: "strategist",
        tags: ["message", "portability"],
      },
    ],
  };
}

function normalizeResearchOutput(value: unknown, fallback: ResearchOutput) {
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
          const kind = String(record.kind ?? fallback.items[index % fallback.items.length].kind);
          const normalizedKind: ResearchKind = (
            ["trend", "audience", "competitive", "risk", "fact"].includes(kind)
              ? kind
              : fallback.items[index % fallback.items.length].kind
          ) as ResearchKind;

          return {
            id: `research_${index + 1}`,
            kind: normalizedKind,
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
            url: typeof record.url === "string" ? record.url.trim() : undefined,
            confidence: clamp(
              typeof record.confidence === "number"
                ? record.confidence
                : fallback.items[index % fallback.items.length].confidence,
              55,
              96,
            ),
            by:
              normalizedKind === "fact"
                ? "factChecker"
                : normalizedKind === "risk"
                  ? "critic"
                  : normalizedKind === "audience"
                    ? "strategist"
                    : "scout",
            tags:
              toArrayOfStrings(record.tags).length > 0
                ? toArrayOfStrings(record.tags)
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
      typeof candidate.recommendedFocus === "string" && candidate.recommendedFocus.trim()
        ? candidate.recommendedFocus.trim()
        : fallback.recommendedFocus,
    sourceSummary:
      toArrayOfStrings(candidate.sourceSummary).length > 0
        ? toArrayOfStrings(candidate.sourceSummary)
        : fallback.sourceSummary,
    items: items.length > 0 ? items.slice(0, 8) : fallback.items,
  };
}

async function generateResearch(workspace: CampaignWorkspace, note?: string | null) {
  const brief = workspace.brief;
  const queries = prefersArabic(brief)
    ? [
        `${brief.productName} ${brief.platform} السعودية اتجاهات شراء الجمهور`,
        `${brief.productName} منافسين اعتراضات جمهور ${brief.platform}`,
      ]
    : [
        `${brief.productName} ${brief.platform} audience campaign trends`,
        `${brief.productName} competitor objections ${brief.platform}`,
      ];

  const tavilyResults = (await Promise.all(queries.map((query) => searchTavily(query))))
    .flat()
    .slice(0, 6);
  const fallback = fallbackResearch(brief, tavilyResults);

  const aiText = await callOpenRouter({
    label: "research generation",
    system:
      "You are TrendMind's Trend Scout. Return only valid JSON and keep the pack concrete.",
    prompt: buildResearchPrompt(
      brief,
      tavilyResults.map(
        (entry) => `- ${entry.title} | ${entry.url} | ${entry.content.slice(0, 240)}`,
      ),
      note,
    ),
  });

  const parsed = aiText ? extractJsonObject(aiText) : null;
  const output = normalizeResearchOutput(parsed, fallback);

  return {
    output,
    headline: prefersArabic(brief) ? "ملف البحث جاهز" : "Research pack ready",
    summary: firstSentence(output.recommendedFocus),
    generatedBy: "scout" as AgentId,
  };
}

function fallbackStrategy(brief: CampaignBrief, research: ResearchOutput): StrategyOutput {
  if (prefersArabic(brief)) {
    const product = displayProduct(brief);
    const brand = displayBrand(brief);
    return {
      campaignThesis: `${brand} لا يحتاج أن يبدو أعلى صوتاً من السوق، بل أوضح موقفاً: لماذا ${product} يستحق الانتباه الآن، وبأي زاوية يمكن للناس تكرارها بعد المشاهدة؟`,
      messageDirection: "ابدأ من الفائدة أو الإشارة أو القرار الذي يهم الجمهور فعلاً، ثم امنح الرسالة طبقة من الذوق والثقة لا طبقة من الزخرفة.",
      positioningLogic: "نحتاج مساراً يثبت الوضوح، ومساراً يشحذ التمييز، ومساراً يختبر قابلية المشاركة. بهذه الطريقة لا نخمن ما قد ينجح؛ نحن نقارنه.",
      toneDirection: brief.tone || "عربية معاصرة، واثقة، قريبة، نظيفة من الحشو",
      strategicConstraints: [
        "تجنب الوعود غير المثبتة أو الادعاءات التي تبدو مبالغاً فيها.",
        "اجعل العربية أصلية وقابلة للاستخدام التجاري، لا مترجمة.",
        "يجب أن تبدو كل زاوية مختلفة في منطقها لا في مفرداتها فقط.",
      ],
      decisionFrame: research.recommendedFocus,
      recommendedAngleId: "angle_b",
      angles: [
        {
          id: "angle_a",
          lane: "safe",
          letter: "A",
          title: "الوضوح الذي يسهّل القرار",
          thesis: `هذه الزاوية تقدم ${product} كخيار يجعل القرار أبسط وأهدأ، من دون استعراض أو ضوضاء.`,
          stance: "عملي، واضح، منخفض المخاطر",
          promise: "تفهم القيمة بسرعة وتعرف لماذا قد يهمك المنتج.",
          hook: `${product} لا يحتاج شرحاً طويلاً. يحتاج جملة تفهمها من أول مرة.`,
          rationale: [
            "مناسب لبداية إطلاق تحتاج ثقة سريعة.",
            "يدعم الفائدة قبل الزينة.",
            "يخفض مقاومة الجمهور المتشكك.",
          ],
          risks: ["قد يبدو محافظاً إذا لم ندعمه بصورة أو مشهد قوي."],
          fit: `أفضل مسار حين نريد أن نفوز على التردد والالتباس داخل ${brief.platform}.`,
          tone: "واضح، مطمئن، ذكي",
          score: 86,
        },
        {
          id: "angle_b",
          lane: "sharp",
          letter: "B",
          title: "من الإعجاب إلى القرار",
          thesis: `بدلاً من أن تبدو الحملة كإعجاب عام بـ ${product}، تجعل الناس يرون أين يحسم المنتج قرارهم ولماذا هو أذكى من البدائل العادية.`,
          stance: "أشد تمييزاً وأكثر ثقة",
          promise: "الرسالة لا تكتفي بوصف المنتج؛ بل تعطيه موقفاً.",
          hook: `ليس كل ${product} يترك انطباعاً. بعضه فقط يغيّر طريقة الاختيار.`,
          rationale: [
            "يبني تمييزاً حقيقياً لا شكلياً.",
            "يُظهر ذكاء المنتج أو العلامة بوضوح.",
            "أقوى للمشهد التنافسي وللعرض أمام الحكام.",
          ],
          risks: ["يحتاج ضبطاً جيداً حتى لا ينزلق إلى نبرة متعالية."],
          fit: "الأقوى عندما نريد للحملة أن تبدو كمنتج لديه وجهة نظر، لا كمولد نسخ جميل.",
          tone: "حاد، واثق، محسوب",
          score: 92,
        },
        {
          id: "angle_c",
          lane: "viral",
          letter: "C",
          title: "إشارة اجتماعية قابلة للتكرار",
          thesis: `هذه الزاوية تبحث عن جملة أو موقف يجعل ${product} قابلاً للمشاركة والاقتباس، من دون أن يفقد جوهره أو قيمته.`,
          stance: "أخف وأقرب للمحادثة",
          promise: "الحملة تعيش داخل التعليقات وإعادة النشر، لا في المنشور فقط.",
          hook: `الناس لا يشاركون المنتج فقط. يشاركون الإشارة التي فهموها منه.`,
          rationale: [
            "ترفع احتمال الانتشار والتذكر.",
            "تعطي المنصة شيئاً قابلاً لإعادة القول.",
            "توسّع الحملة خارج الإطار الإعلاني المباشر.",
          ],
          risks: ["قد تسبق الخفة وضوح الفائدة إذا لم نربطها بسبب ملموس."],
          fit: "مفيد كمسار جريء عندما تكون المنصة تحتاج عبارة ذكية قابلة للالتقاط.",
          tone: "خفيف، اجتماعي، لامع",
          score: 84,
        },
      ],
    };
  }

  return {
    campaignThesis: `${displayBrand(brief)} should feel like it understands what actually moves the audience, not like another polished brand speaking in generic abstractions.`,
    messageDirection: "Make the message commercially legible first, then give it enough texture and confidence to stand apart.",
    positioningLogic: "Test one clarity-led lane, one sharper differentiation lane, and one more socially portable lane.",
    toneDirection: brief.tone || "Clear, premium, credible.",
    strategicConstraints: [
      "Avoid generic AI-sounding phrasing.",
      "Keep claims grounded in believable product reality.",
      "Each angle must operate differently, not just sound different.",
    ],
    decisionFrame: research.recommendedFocus,
    recommendedAngleId: "angle_b",
    angles: [
      {
        id: "angle_a",
        lane: "safe",
        letter: "A",
        title: "Clear Value",
        thesis: `Show ${displayProduct(brief)} as the option that makes the benefit easy to understand and easy to trust.`,
        stance: "Calm, premium, legible.",
        promise: "The audience understands why this matters without working for it.",
        hook: "The value should land before the styling does.",
        rationale: ["Low-risk clarity.", "Strong platform legibility.", "Easy to scale across assets."],
        risks: ["Could feel too conservative if the execution is visually soft."],
        fit: `Useful when ${brief.platform} rewards quick comprehension.`,
        tone: "Clear and assured",
        score: 85,
      },
      {
        id: "angle_b",
        lane: "sharp",
        letter: "B",
        title: "Smarter Choice",
        thesis: `Frame ${displayProduct(brief)} as the sharper decision, not just the prettier object.`,
        stance: "Confident, discriminating, commercially sharp.",
        promise: "The campaign gives the audience a reason to choose, not just admire.",
        hook: "This is where taste becomes a decision.",
        rationale: ["Stronger differentiation.", "Better demo story.", "More durable message."],
        risks: ["Needs discipline to avoid overstatement."],
        fit: "Best when the campaign needs a real point of view.",
        tone: "Sharp and controlled",
        score: 91,
      },
      {
        id: "angle_c",
        lane: "viral",
        letter: "C",
        title: "Signal Worth Sharing",
        thesis: `Give the audience a line that is easy to repeat, socialise, and attach identity to.`,
        stance: "Lighter, more referential, higher-upside.",
        promise: "The message travels beyond the first post.",
        hook: "People share the signal before they share the spec.",
        rationale: ["Portable message.", "Higher social upside.", "More distinctive conversational energy."],
        risks: ["Can outrun the proof if not grounded."],
        fit: "Useful when the platform rewards social carry.",
        tone: "Bright and socially aware",
        score: 83,
      },
    ],
  };
}

function normalizeStrategyOutput(value: unknown, fallback: StrategyOutput): StrategyOutput {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as {
    campaignThesis?: unknown;
    messageDirection?: unknown;
    positioningLogic?: unknown;
    toneDirection?: unknown;
    strategicConstraints?: unknown;
    decisionFrame?: unknown;
    recommendedAngleId?: unknown;
    angles?: unknown;
  };

  const angles = Array.isArray(candidate.angles)
    ? candidate.angles
        .map((item, index) => {
          if (!item || typeof item !== "object") return null;
          const record = item as Record<string, unknown>;
          const backup = fallback.angles[index] ?? fallback.angles[0];
          const lane = record.lane;

          return {
            id: typeof record.id === "string" && record.id.trim() ? record.id.trim() : backup.id,
            lane:
              lane === "safe" || lane === "sharp" || lane === "viral"
                ? lane
                : backup.lane,
            letter:
              record.letter === "A" || record.letter === "B" || record.letter === "C"
                ? record.letter
                : backup.letter,
            title:
              typeof record.title === "string" && record.title.trim()
                ? record.title.trim()
                : backup.title,
            thesis:
              typeof record.thesis === "string" && record.thesis.trim()
                ? record.thesis.trim()
                : backup.thesis,
            stance:
              typeof record.stance === "string" && record.stance.trim()
                ? record.stance.trim()
                : backup.stance,
            promise:
              typeof record.promise === "string" && record.promise.trim()
                ? record.promise.trim()
                : backup.promise,
            hook:
              typeof record.hook === "string" && record.hook.trim()
                ? record.hook.trim()
                : backup.hook,
            rationale:
              toArrayOfStrings(record.rationale).length > 0
                ? toArrayOfStrings(record.rationale)
                : backup.rationale,
            risks:
              toArrayOfStrings(record.risks).length > 0
                ? toArrayOfStrings(record.risks)
                : backup.risks,
            fit:
              typeof record.fit === "string" && record.fit.trim()
                ? record.fit.trim()
                : backup.fit,
            tone:
              typeof record.tone === "string" && record.tone.trim()
                ? record.tone.trim()
                : backup.tone,
            score: clamp(
              typeof record.score === "number" ? record.score : backup.score,
              70,
              96,
            ),
          } satisfies StrategyAngle;
        })
        .filter(Boolean) as StrategyAngle[]
    : fallback.angles;

  const recommendedAngleId =
    typeof candidate.recommendedAngleId === "string" &&
    angles.some((angle) => angle.id === candidate.recommendedAngleId)
      ? candidate.recommendedAngleId
      : fallback.recommendedAngleId;

  return {
    campaignThesis:
      typeof candidate.campaignThesis === "string" && candidate.campaignThesis.trim()
        ? candidate.campaignThesis.trim()
        : fallback.campaignThesis,
    messageDirection:
      typeof candidate.messageDirection === "string" && candidate.messageDirection.trim()
        ? candidate.messageDirection.trim()
        : fallback.messageDirection,
    positioningLogic:
      typeof candidate.positioningLogic === "string" && candidate.positioningLogic.trim()
        ? candidate.positioningLogic.trim()
        : fallback.positioningLogic,
    toneDirection:
      typeof candidate.toneDirection === "string" && candidate.toneDirection.trim()
        ? candidate.toneDirection.trim()
        : fallback.toneDirection,
    strategicConstraints:
      toArrayOfStrings(candidate.strategicConstraints).length > 0
        ? toArrayOfStrings(candidate.strategicConstraints)
        : fallback.strategicConstraints,
    decisionFrame:
      typeof candidate.decisionFrame === "string" && candidate.decisionFrame.trim()
        ? candidate.decisionFrame.trim()
        : fallback.decisionFrame,
    recommendedAngleId,
    angles: angles.length === 3 ? angles : fallback.angles,
  };
}

async function generateStrategy(workspace: CampaignWorkspace, note?: string | null) {
  const research = workspace.phases.research.data;
  if (!research) {
    throw new Error("Research output is required before Strategy can run.");
  }

  const fallback = fallbackStrategy(workspace.brief, research);
  const aiText = await callOpenRouter({
    label: "strategy generation",
    system:
      "You are TrendMind's Brand Strategist. Return only valid JSON and make the angles meaningfully different.",
    prompt: buildStrategyPrompt(workspace.brief, research, note),
  });

  const parsed = aiText ? extractJsonObject(aiText) : null;
  const output = normalizeStrategyOutput(parsed, fallback);

  return {
    output,
    headline: prefersArabic(workspace.brief) ? "تم تثبيت الاستراتيجية" : "Strategy locked",
    summary: firstSentence(output.campaignThesis),
    generatedBy: "strategist" as AgentId,
  };
}

function draftLengths(index: number): DraftVariant["length"] {
  return index % 3 === 0 ? "short" : index % 3 === 1 ? "medium" : "long";
}

function buildAngleAtoms(brief: CampaignBrief, angle: StrategyAngle, index: number) {
  if (prefersArabic(brief)) {
    const product = displayProduct(brief);
    const benefit = brief.valueProposition || `قيمة ${product}`;
    const cta = displayCTA(brief);

    const hooks = [
      angle.hook,
      `ليس المهم أن ترى ${product}. المهم أن تعرف لماذا قد تختاره.`,
      `حين تبدو الفكرة أوضح، يصبح ${product} أسهل في التفضيل.`,
      angle.lane === "viral"
        ? `الجملة الجيدة لا تشرح كل شيء. تترك الناس يكملونها عنك.`
        : `النسخة الأقوى لا ترفع الصوت. ترفع المعنى.`,
    ];
    const bodies = [
      `${benefit}. ${angle.thesis} لهذا يجب أن تبدو الرسالة كقرار ذكي لا كإعجاب عام.`,
      `${product} هنا ليس تفصيلاً جميلاً فقط. هو سبب مقنع يمكن للجمهور أن يكرره بعد المشاهدة.`,
      `الحملة تحتاج مثالاً أو مشهداً يجعل الوعد قابلاً للتصديق: ما الذي يلاحظه المستخدم، وما الذي يتغيّر في إحساسه أو اختياره؟`,
      angle.lane === "sharp"
        ? `هذه الزاوية تكسب حين تقول بوضوح ما الذي يجعل ${product} أذكى من الطريق المعتاد، ثم تتوقف قبل المبالغة.`
        : `هذه الزاوية تكسب حين تبقي اللغة نظيفة، وتترك للمنتج أو السياق أن يحملا الثقة.`,
    ];
    const ctas = [
      cta,
      brief.platform.includes("سناب") ? "جرّب الفكرة وادخل القائمة" : "سجّل اهتمامك الآن",
      "خذ الخطوة الأولى قبل الإطلاق",
      angle.lane === "viral" ? "شاركها مع شخص سيلتقط الفكرة فوراً" : "اعرف هل هذا المسار يناسبك",
    ];

    return { hooks, bodies, ctas };
  }

  const product = displayProduct(brief);
  const hooks = [
    angle.hook,
    `The point is not just to see ${product}. It is to know why it deserves a choice.`,
    `When the angle is clearer, ${product} becomes easier to want.`,
    angle.lane === "viral"
      ? "The best line invites repetition before it invites explanation."
      : "The strongest copy raises meaning before it raises volume.",
  ];
  const bodies = [
    `${angle.promise} ${angle.thesis} The body should make the campaign sound like a decision, not a decorative caption.`,
    `${product} needs one sentence of believable proof so the message can travel without collapsing.`,
    `Use a real customer situation or moment of recognition to make the message feel grounded and commercially usable.`,
    angle.lane === "sharp"
      ? `This lane wins when it shows why ${product} is the smarter choice without becoming smug.`
      : `This lane wins when it stays clean, specific, and easy to hold onto.`,
  ];
  const ctas = [displayCTA(brief), "Join the waitlist", "See the direction", "Get early access"];
  void index;
  return { hooks, bodies, ctas };
}

function buildFallbackDraft(brief: CampaignBrief, strategy: StrategyOutput): DraftOutput {
  const atoms: DraftAtom[] = [];
  const variants: DraftVariant[] = [];

  strategy.angles.forEach((angle, angleIndex) => {
    const atomSets = buildAngleAtoms(brief, angle, angleIndex);
    atomSets.hooks.forEach((text, index) => {
      atoms.push({
        id: `${angle.id}_hook_${index + 1}`,
        angleId: angle.id,
        kind: "hook",
        text,
        note:
          index === 0
            ? prefersArabic(brief)
              ? "الخط الأساسي للمسار"
              : "Primary lead line"
            : undefined,
      });
    });
    atomSets.bodies.forEach((text, index) => {
      atoms.push({
        id: `${angle.id}_body_${index + 1}`,
        angleId: angle.id,
        kind: "body",
        text,
      });
    });
    atomSets.ctas.forEach((text, index) => {
      atoms.push({
        id: `${angle.id}_cta_${index + 1}`,
        angleId: angle.id,
        kind: "cta",
        text,
      });
    });

    for (let variantIndex = 0; variantIndex < 3; variantIndex += 1) {
      const hookId = `${angle.id}_hook_${variantIndex + 1}`;
      const bodyId = `${angle.id}_body_${((variantIndex + angleIndex) % 4) + 1}`;
      const ctaId = `${angle.id}_cta_${((variantIndex + 1) % 4) + 1}`;
      const hook = atoms.find((atom) => atom.id === hookId)?.text ?? angle.hook;
      const body = atoms.find((atom) => atom.id === bodyId)?.text ?? angle.thesis;
      const cta = atoms.find((atom) => atom.id === ctaId)?.text ?? displayCTA(brief);
      const baseScore =
        angle.score + (variantIndex === 0 ? 2 : variantIndex === 1 ? 0 : -2) - angleIndex;

      variants.push({
        id: `${angle.id}_variant_${variantIndex + 1}`,
        angleId: angle.id,
        name:
          prefersArabic(brief)
            ? `${angle.title} - نسخة ${variantIndex + 1}`
            : `${angle.title} - Variant ${variantIndex + 1}`,
        hookId,
        bodyId,
        ctaId,
        tone:
          variantIndex === 0
            ? angle.tone
            : variantIndex === 1
              ? prefersArabic(brief)
                ? "أكثر مباشرة"
                : "More direct"
              : prefersArabic(brief)
                ? "أكثر دفئاً"
                : "Warmer",
        length: draftLengths(variantIndex),
        score: clamp(baseScore, 74, 95),
        critique: [
          {
            agent: "critic",
            note: prefersArabic(brief)
              ? variantIndex === 0
                ? "النسخة الأقوى توازن بين الوضوح والتمييز."
                : variantIndex === 1
                  ? "تحتاج دليلاً صغيراً حتى لا تبدو عامة."
                  : "لطيفة الإيقاع، لكن يجب ألا تسبق الفائدة."
              : variantIndex === 0
                ? "Best balance of clarity and distinction."
                : variantIndex === 1
                  ? "Needs one small proof point."
                  : "Good rhythm, but the benefit must stay legible.",
          },
          {
            agent: "strategist",
            note: prefersArabic(brief)
              ? `تحافظ على منطق زاوية ${angle.letter} من دون تكرار حرفي.`
              : `Stays inside the logic of angle ${angle.letter} without feeling repetitive.`,
          },
        ],
        fullText: `${hook}\n\n${body}\n\n${cta}`,
      });
    }
  });

  const recommendedVariant =
    variants.toSorted((left, right) => right.score - left.score)[0] ?? variants[0];

  return {
    summary: prefersArabic(brief)
      ? "جهّزنا لكل زاوية أكثر من عنوان وجسم ودعوة، ثم اعتمدنا ثلاث صيغ جاهزة للاختبار."
      : "A real variation space was built for every angle, with multiple hooks, bodies, CTAs, and composed variants.",
    atoms,
    variants,
    recommendedVariantId: recommendedVariant.id,
  };
}

function normalizeDraftOutput(value: unknown, fallback: DraftOutput): DraftOutput {
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as {
    summary?: unknown;
    atoms?: unknown;
    variants?: unknown;
    recommendedVariantId?: unknown;
  };

  const atoms = Array.isArray(candidate.atoms)
    ? candidate.atoms
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const record = item as Record<string, unknown>;
          const kind = record.kind;
          if (kind !== "hook" && kind !== "body" && kind !== "cta") return null;

          const atom: DraftAtom = {
            id: typeof record.id === "string" && record.id.trim() ? record.id.trim() : makeId("atom"),
            angleId: typeof record.angleId === "string" && record.angleId.trim() ? record.angleId.trim() : "",
            kind,
            text: typeof record.text === "string" ? record.text.trim() : "",
            note: typeof record.note === "string" ? record.note.trim() : undefined,
          };

          return atom;
        })
        .filter((item): item is DraftAtom => Boolean(item && item.angleId && item.text))
    : [];

  const variants = Array.isArray(candidate.variants)
    ? candidate.variants
        .map((item, index) => {
          if (!item || typeof item !== "object") return null;
          const record = item as Record<string, unknown>;
          const backup = fallback.variants[index % fallback.variants.length];
          const length = record.length;

          return {
            id:
              typeof record.id === "string" && record.id.trim() ? record.id.trim() : backup.id,
            angleId:
              typeof record.angleId === "string" && record.angleId.trim()
                ? record.angleId.trim()
                : backup.angleId,
            name:
              typeof record.name === "string" && record.name.trim()
                ? record.name.trim()
                : backup.name,
            hookId:
              typeof record.hookId === "string" && record.hookId.trim()
                ? record.hookId.trim()
                : backup.hookId,
            bodyId:
              typeof record.bodyId === "string" && record.bodyId.trim()
                ? record.bodyId.trim()
                : backup.bodyId,
            ctaId:
              typeof record.ctaId === "string" && record.ctaId.trim()
                ? record.ctaId.trim()
                : backup.ctaId,
            tone:
              typeof record.tone === "string" && record.tone.trim()
                ? record.tone.trim()
                : backup.tone,
            length:
              length === "short" || length === "medium" || length === "long"
                ? length
                : backup.length,
            score: clamp(
              typeof record.score === "number" ? record.score : backup.score,
              70,
              97,
            ),
            critique: Array.isArray(record.critique)
              ? record.critique
                  .map((critique) => {
                    if (!critique || typeof critique !== "object") return null;
                    const entry = critique as Record<string, unknown>;
                    const agent = entry.agent;
                    if (
                      agent !== "critic" &&
                      agent !== "architect" &&
                      agent !== "strategist" &&
                      agent !== "simulator"
                    ) {
                      return null;
                    }

                    return {
                      agent,
                      note:
                        typeof entry.note === "string" && entry.note.trim()
                          ? entry.note.trim()
                          : backup.critique[0]?.note ?? "",
                    };
                  })
                  .filter(Boolean) as DraftVariant["critique"]
              : backup.critique,
            fullText:
              typeof record.fullText === "string" && record.fullText.trim()
                ? record.fullText.trim()
                : backup.fullText,
          } satisfies DraftVariant;
        })
        .filter(Boolean) as DraftVariant[]
    : [];

  const normalizedAtoms = atoms.length >= 9 ? atoms : fallback.atoms;
  const normalizedVariants = variants.length >= 6 ? variants : fallback.variants;
  const recommendedVariantId =
    typeof candidate.recommendedVariantId === "string" &&
    normalizedVariants.some((variant) => variant.id === candidate.recommendedVariantId)
      ? candidate.recommendedVariantId
      : fallback.recommendedVariantId;

  return {
    summary:
      typeof candidate.summary === "string" && candidate.summary.trim()
        ? candidate.summary.trim()
        : fallback.summary,
    atoms: normalizedAtoms,
    variants: normalizedVariants,
    recommendedVariantId,
  };
}

async function generateDraft(workspace: CampaignWorkspace, note?: string | null) {
  const strategy = workspace.phases.strategy.data;
  if (!strategy) {
    throw new Error("Strategy output is required before Draft can run.");
  }

  const fallback = buildFallbackDraft(workspace.brief, strategy);
  const aiText = await callOpenRouter({
    label: "draft generation",
    system:
      "You are TrendMind's Content Architect and Performance Critic. Return only valid JSON and build real variation space.",
    prompt: buildDraftPrompt(workspace.brief, strategy, note),
  });

  const parsed = aiText ? extractJsonObject(aiText) : null;
  const output = normalizeDraftOutput(parsed, fallback);

  return {
    output,
    headline: prefersArabic(workspace.brief) ? "تم توليد مساحة الصياغة" : "Draft space generated",
    summary: firstSentence(output.summary),
    generatedBy: "architect" as AgentId,
  };
}

type PersonaSeed = {
  baseName: string;
  archetypeAr: string;
  archetypeEn: string;
  oneLinerAr: string;
  oneLinerEn: string;
  clarityBias: number;
  proofBias: number;
  noveltyBias: number;
  premiumBias: number;
  intentBias: number;
  socialBias: number;
  skepticism: number;
  glyph: string;
  accent: string;
};

const PERSONA_SEEDS: PersonaSeed[] = [
  {
    baseName: "Abeer",
    archetypeAr: "مشتري عملي",
    archetypeEn: "practical buyer",
    oneLinerAr: "يبحث عن قيمة واضحة يمكن تبريرها بسرعة.",
    oneLinerEn: "Wants value that can be justified quickly.",
    clarityBias: 9,
    proofBias: 8,
    noveltyBias: -3,
    premiumBias: 1,
    intentBias: 7,
    socialBias: -2,
    skepticism: 4,
    glyph: "AB",
    accent: "#3d7a5f",
  },
  {
    baseName: "Faisal",
    archetypeAr: "محب للذوق",
    archetypeEn: "taste-led buyer",
    oneLinerAr: "يهتم بأن يبدو المنتج أو الرسالة محسوبين لا عاديين.",
    oneLinerEn: "Cares whether the brand feels considered rather than generic.",
    clarityBias: 4,
    proofBias: 3,
    noveltyBias: 5,
    premiumBias: 9,
    intentBias: 4,
    socialBias: 2,
    skepticism: 3,
    glyph: "FA",
    accent: "#c8a96e",
  },
  {
    baseName: "Noor",
    archetypeAr: "متشككة ذكية",
    archetypeEn: "skeptical observer",
    oneLinerAr: "تلتقط المبالغة بسرعة وتختبر المصداقية قبل الاهتمام.",
    oneLinerEn: "Spots overstatement fast and tests credibility before caring.",
    clarityBias: 6,
    proofBias: 9,
    noveltyBias: -4,
    premiumBias: 0,
    intentBias: 2,
    socialBias: -2,
    skepticism: 9,
    glyph: "NO",
    accent: "#8a6a5a",
  },
  {
    baseName: "Rakan",
    archetypeAr: "متابع للترند",
    archetypeEn: "trend-sensitive scroller",
    oneLinerAr: "يهتم بأن تكون الفكرة قابلة للمشاركة والالتقاط بسرعة.",
    oneLinerEn: "Responds to ideas that feel easy to share and repeat.",
    clarityBias: 1,
    proofBias: -1,
    noveltyBias: 9,
    premiumBias: 3,
    intentBias: 1,
    socialBias: 9,
    skepticism: 2,
    glyph: "RA",
    accent: "#7a6b8a",
  },
  {
    baseName: "Lama",
    archetypeAr: "باحثة عن هدية",
    archetypeEn: "gift buyer",
    oneLinerAr: "تفكر في الإحساس الذي ستتركه القطعة أو الرسالة عند الطرف الآخر.",
    oneLinerEn: "Cares about the meaning the product leaves with someone else.",
    clarityBias: 3,
    proofBias: 2,
    noveltyBias: 3,
    premiumBias: 7,
    intentBias: 6,
    socialBias: 1,
    skepticism: 2,
    glyph: "LA",
    accent: "#4f6e87",
  },
  {
    baseName: "Sultan",
    archetypeAr: "حساس للسعر",
    archetypeEn: "price-sensitive buyer",
    oneLinerAr: "لن يتفاعل إذا شعر أن الحملة تتكلم فوق حاجته الحقيقية.",
    oneLinerEn: "Pulls back if the brand sounds expensive without substance.",
    clarityBias: 8,
    proofBias: 7,
    noveltyBias: -2,
    premiumBias: -3,
    intentBias: 5,
    socialBias: -1,
    skepticism: 6,
    glyph: "SU",
    accent: "#5d7688",
  },
  {
    baseName: "Maha",
    archetypeAr: "محبة للعلامات الراقية",
    archetypeEn: "premium-brand fan",
    oneLinerAr: "تنجذب للثقة والاتزان بشرط ألا تبدو الرسالة مستنسخة.",
    oneLinerEn: "Likes confidence and polish if the message still feels original.",
    clarityBias: 2,
    proofBias: 2,
    noveltyBias: 4,
    premiumBias: 8,
    intentBias: 4,
    socialBias: 2,
    skepticism: 3,
    glyph: "MA",
    accent: "#d0ad6d",
  },
  {
    baseName: "Hamad",
    archetypeAr: "خبير فئة",
    archetypeEn: "category expert",
    oneLinerAr: "يعرف اللغة السطحية بسرعة ويحتاج فروقاً حقيقية.",
    oneLinerEn: "Needs real distinction and can detect surface-level marketing fast.",
    clarityBias: 6,
    proofBias: 8,
    noveltyBias: 1,
    premiumBias: 2,
    intentBias: 3,
    socialBias: -3,
    skepticism: 8,
    glyph: "HA",
    accent: "#6b6560",
  },
  {
    baseName: "Jood",
    archetypeAr: "متصفحة عابرة",
    archetypeEn: "casual scroller",
    oneLinerAr: "تحتاج سبباً سريعاً للتوقف قبل أن تكمل التمرير.",
    oneLinerEn: "Needs a fast reason to stop scrolling.",
    clarityBias: 7,
    proofBias: 1,
    noveltyBias: 5,
    premiumBias: 1,
    intentBias: 1,
    socialBias: 5,
    skepticism: 2,
    glyph: "JO",
    accent: "#b7863f",
  },
  {
    baseName: "Saad",
    archetypeAr: "مشارك اجتماعي",
    archetypeEn: "social sharer",
    oneLinerAr: "يلتقط العبارة أو الفكرة التي يمكن أن يعيد قولها للناس.",
    oneLinerEn: "Grabs onto the line that is easiest to repeat socially.",
    clarityBias: 2,
    proofBias: 0,
    noveltyBias: 8,
    premiumBias: 2,
    intentBias: 2,
    socialBias: 10,
    skepticism: 1,
    glyph: "SA",
    accent: "#a68b4b",
  },
  {
    baseName: "Dalia",
    archetypeAr: "مشتري هادئ",
    archetypeEn: "quiet decider",
    oneLinerAr: "لا يتكلم كثيراً لكنه يلتقط النسخة المتزنة بسرعة.",
    oneLinerEn: "Quietly notices when the copy feels balanced and mature.",
    clarityBias: 7,
    proofBias: 5,
    noveltyBias: -1,
    premiumBias: 4,
    intentBias: 5,
    socialBias: -2,
    skepticism: 4,
    glyph: "DA",
    accent: "#3d7a5f",
  },
  {
    baseName: "Yousef",
    archetypeAr: "باحث عن فائدة مباشرة",
    archetypeEn: "benefit-first buyer",
    oneLinerAr: "يتفاعل عندما يرى المنفعة قبل أي أسلوب.",
    oneLinerEn: "Responds when the benefit appears before the style.",
    clarityBias: 9,
    proofBias: 6,
    noveltyBias: -2,
    premiumBias: 0,
    intentBias: 6,
    socialBias: -1,
    skepticism: 5,
    glyph: "YO",
    accent: "#4f6e87",
  },
];

function personaModifiers(arabic: boolean) {
  return arabic
    ? [
        "من الرياض",
        "من جدة",
        "من الخبر",
        "يشتري لنفسه",
        "يشتري هدية",
        "يتأثر بالتجربة البصرية",
        "يتأثر بالدليل العملي",
        "يهتم بالخصوصية",
        "يكره النسخ المعلبة",
      ]
    : [
        "urban",
        "mobile-first",
        "gift-oriented",
        "proof-led",
        "privacy-aware",
        "taste-led",
        "share-prone",
        "category-aware",
        "busy",
      ];
}

function buildPersonas(brief: CampaignBrief): Persona[] {
  const arabic = prefersArabic(brief);
  const modifiers = personaModifiers(arabic);
  const personas: Persona[] = [];

  for (const seed of PERSONA_SEEDS) {
    modifiers.forEach((modifier, modifierIndex) => {
      const id = `${seed.baseName.toLowerCase()}_${modifierIndex + 1}`;
      personas.push({
        id,
        name: arabic ? `${seed.baseName} ${modifierIndex + 1}` : `${seed.baseName} ${modifierIndex + 1}`,
        archetype: arabic ? seed.archetypeAr : seed.archetypeEn,
        oneLiner: arabic
          ? `${seed.oneLinerAr} ${modifier}.`
          : `${seed.oneLinerEn} ${modifier}.`,
        glyph: seed.glyph,
        accent: seed.accent,
      });
    });
  }

  return personas;
}

function personaSeedForId(personaId: string) {
  const [baseName, modifierIndexRaw] = personaId.split("_");
  const seed =
    PERSONA_SEEDS.find((entry) => entry.baseName.toLowerCase() === baseName) ?? PERSONA_SEEDS[0];
  const modifierIndex = Number(modifierIndexRaw ?? "1") - 1;
  const modifiers = personaModifiers(true);
  return {
    seed,
    modifierIndex: clamp(modifierIndex, 0, modifiers.length - 1),
  };
}

function variantSignals(variant: DraftVariant, strategyAngle: StrategyAngle) {
  const textScore = scoreFromText(variant.fullText);
  const proofSignal = /دليل|إثبات|سبب|specific|proof|لأن|because/i.test(variant.fullText) ? 6 : 1;
  const socialSignal = /شارك|story|share|viral|تعليق|quote/i.test(variant.fullText) ? 5 : 1;
  const directnessSignal =
    /الآن|today|now|سجّل|join|ابدأ|choose/i.test(variant.fullText) ? 5 : 2;
  const premiumSignal =
    /ذوق|taste|premium|quiet|هادئ|editorial|أنيق/i.test(variant.fullText) ? 6 : 2;
  const noveltySignal = strategyAngle.lane === "viral" ? 7 : strategyAngle.lane === "sharp" ? 5 : 2;
  return {
    proofSignal,
    socialSignal,
    directnessSignal,
    premiumSignal,
    noveltySignal,
    microVariance: textScore % 5,
  };
}

function reactionCopy(
  brief: CampaignBrief,
  persona: Persona,
  variant: DraftVariant,
  sentiment: TrialReaction["sentiment"],
  winningAngleTitle: string,
) {
  const arabic = prefersArabic(brief);
  if (arabic) {
    if (sentiment === "love") {
      return `هذه النسخة من ${winningAngleTitle} تبدو كأنها فهمتني من أول جملة.`;
    }
    if (sentiment === "warm") {
      return `${variant.name} مقنعة، لكني أريد أن يحمل المشهد البصري نفس الثقة.`;
    }
    if (sentiment === "neutral") {
      return `فهمت الفكرة، لكن ما زلت أحتاج سبباً أوضح لأتوقف عندها.`;
    }
    return `${persona.name} سيشعر أن النسخة تقول أكثر مما تثبت.`;
  }

  if (sentiment === "love") {
    return `This version of ${winningAngleTitle} feels immediately worth paying attention to.`;
  }
  if (sentiment === "warm") {
    return `${variant.name} works, though the visual execution still matters.`;
  }
  if (sentiment === "neutral") {
    return "I understand the idea, but I still need a clearer reason to stop.";
  }
  return `${persona.name} would feel the message overreaches before it persuades.`;
}

function deterministicTrial(
  brief: CampaignBrief,
  strategy: StrategyOutput,
  draft: DraftOutput,
  aiSuggestion?: {
    summary?: string;
    recommendedEdits?: string[];
    responseRisks?: string[];
    audienceSummary?: string[];
  } | null,
): TrialOutput {
  const personas = buildPersonas(brief);
  const reactions: TrialReaction[] = [];

  for (const variant of draft.variants) {
    const angle = strategy.angles.find((entry) => entry.id === variant.angleId) ?? strategy.angles[0];
    const signals = variantSignals(variant, angle);

    for (const persona of personas) {
      const { seed, modifierIndex } = personaSeedForId(persona.id);
      const modifierWeight = modifierIndex - 4;
      const clarity = clamp(
        70 +
          seed.clarityBias +
          (angle.lane === "safe" ? 5 : angle.lane === "sharp" ? 2 : -2) +
          signals.directnessSignal +
          Math.round(variant.score * 0.08) -
          Math.max(0, seed.skepticism - signals.proofSignal) +
          modifierWeight,
        48,
        97,
      );
      const resonance = clamp(
        69 +
          seed.noveltyBias +
          seed.premiumBias / 2 +
          signals.noveltySignal +
          signals.premiumSignal / 2 +
          (angle.lane === "sharp" ? 3 : angle.lane === "viral" ? 5 : 1) +
          (signals.microVariance - 2),
        46,
        98,
      );
      const intent = clamp(
        66 +
          seed.intentBias +
          signals.proofSignal +
          signals.directnessSignal +
          (angle.lane === "safe" ? 3 : angle.lane === "sharp" ? 4 : 1) -
          Math.round(seed.skepticism / 2) +
          Math.round(seed.socialBias / 3),
        42,
        97,
      );
      const overall = average([clarity, resonance, intent]);
      const sentiment: TrialReaction["sentiment"] =
        overall >= 88 ? "love" : overall >= 79 ? "warm" : overall >= 67 ? "neutral" : "cold";

      reactions.push({
        id: makeId("reaction"),
        personaId: persona.id,
        variantId: variant.id,
        sentiment,
        quote: reactionCopy(brief, persona, variant, sentiment, angle.title),
        why: prefersArabic(brief)
          ? sentiment === "love"
            ? "الفكرة واضحة ومقنعة وتحمل نبرة مناسبة."
            : sentiment === "warm"
              ? "هناك اتصال جيد، لكن التنفيذ يحتاج لمسة أدق."
              : sentiment === "neutral"
                ? "النسخة تثير اهتماماً أولياً من دون حسم كاف."
                : "توجد مقاومة بسبب نقص الإثبات أو زيادة النبرة."
          : sentiment === "love"
            ? "The message lands with strong clarity, resonance, and purchase intent."
            : sentiment === "warm"
              ? "The idea connects, though the execution still needs precision."
              : sentiment === "neutral"
                ? "There is mild interest, but not enough conviction yet."
                : "Friction appears before the value is fully earned.",
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
    const angleId = variant.angleId;
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
    const risk = clamp(
      100 -
        averageScore +
        Math.max(0, 5 - variantSignals(
          variant,
          strategy.angles.find((entry) => entry.id === angleId) ?? strategy.angles[0],
        ).proofSignal),
      8,
      42,
    );

    return {
      variantId: variant.id,
      angleId,
      average: averageScore,
      resonance,
      risk,
      verdict: prefersArabic(brief)
        ? averageScore >= 88
          ? "جاهزة للإطلاق مع مساحة تحسين بسيطة فقط."
          : averageScore >= 80
            ? "قوية، لكنها تحتاج صقلاً صغيراً قبل الاعتماد."
            : "الفكرة مثيرة، لكن النسخة ليست جاهزة بعد."
        : averageScore >= 88
          ? "Strong enough to launch with minor refinement only."
          : averageScore >= 80
            ? "Strong, but still wants one more tightening pass."
            : "Interesting, but not launch-ready yet.",
    };
  });

  const angleWinners: TrialAngleWinner[] = strategy.angles.map((angle) => {
    const winner =
      scoreboard
        .filter((entry) => entry.angleId === angle.id)
        .toSorted((left, right) => right.average - left.average)[0] ??
      scoreboard[0];

    return {
      angleId: angle.id,
      variantId: winner.variantId,
      average: winner.average,
      verdict: winner.verdict,
    };
  });

  const winningVariantId =
    angleWinners.toSorted((left, right) => right.average - left.average)[0]?.variantId ??
    draft.recommendedVariantId;

  const fallbackRisks = prefersArabic(brief)
    ? [
        "إذا زادت البلاغة على الفائدة، ستضعف الثقة بسرعة.",
        "أي ترجمة حرفية أو CTA جامد سيكسر الإيقاع العربي.",
        "المسار الفيروسي يحتاج سبباً ملموساً حتى لا يبدو أجوف.",
      ]
    : [
        "If the tone outruns the proof, trust will drop fast.",
        "The sharp lane needs discipline so it does not turn smug.",
        "The more social lane still needs a concrete reason to believe.",
      ];

  const fallbackEdits = prefersArabic(brief)
    ? [
        "أبقِ الخطاف الفائز، لكن أضف سطراً واحداً يحمل دليلاً أو مشهداً أوضح.",
        "اجعل الدعوة للإجراء طبيعية ومحددة لا مترجمة أو آلية.",
        "انقل أفضل لغة لاقت قبولاً إلى الاستوديو البصري حتى تتكلم الصورة والنسخة بصوت واحد.",
      ]
    : [
        "Keep the winning hook, but add one sentence of proof or scene-setting.",
        "Make the CTA feel native rather than mechanically urgent.",
        "Carry the most-resonant audience phrasing into Studio so the visual and copy feel unified.",
      ];

  const fallbackAudienceSummary = prefersArabic(brief)
    ? [
        "الوضوح العالي يرفع النية الشرائية حتى لدى الشخصيات المتشككة.",
        "المسار الحاد غالباً يربح عندما يقترن بسبب ملموس لا بمجرد ثقة لغوية.",
        "الشخصيات الاجتماعية تتجاوب أكثر مع النسخ التي تحمل عبارة قابلة للتكرار.",
      ]
    : [
        "High clarity consistently improves intent even among skeptical personas.",
        "The sharper lane wins when it carries one believable reason, not just swagger.",
        "Share-prone personas respond best when the campaign has a portable line.",
      ];

  return {
    summary:
      aiSuggestion?.summary?.trim() ||
      (prefersArabic(brief)
        ? "اختبر TrendMind مساحة الصياغة على أكثر من مئة شخصية مركبة حتى يعرف أي نسخة ترفع التفاعل وأيها تصطدم بالتردد أو الشك."
        : "TrendMind pressure-tested the draft space across more than one hundred synthetic personas to reveal what wins attention, intent, and trust."),
    personas,
    reactions,
    scoreboard,
    angleWinners,
    winningVariantId,
    recommendedEdits:
      aiSuggestion?.recommendedEdits?.filter(Boolean).slice(0, 4) ?? fallbackEdits,
    responseRisks:
      aiSuggestion?.responseRisks?.filter(Boolean).slice(0, 4) ?? fallbackRisks,
    audienceSummary:
      aiSuggestion?.audienceSummary?.filter(Boolean).slice(0, 4) ?? fallbackAudienceSummary,
  };
}

async function generateTrial(workspace: CampaignWorkspace) {
  const strategy = workspace.phases.strategy.data;
  const draft = workspace.phases.draft.data;
  if (!strategy || !draft) {
    throw new Error("Strategy and Draft outputs are required before Trial can run.");
  }

  const aiText = await callOpenRouter({
    label: "trial summary generation",
    system:
      "You are TrendMind's Audience Simulator. Return only valid JSON and keep the output concise.",
    prompt: buildTrialPrompt(workspace.brief, strategy, draft),
  });

  const parsed = aiText ? extractJsonObject(aiText) : null;
  const aiSuggestion =
    parsed && typeof parsed === "object"
      ? {
          summary:
            typeof (parsed as Record<string, unknown>).summary === "string"
              ? ((parsed as Record<string, unknown>).summary as string).trim()
              : undefined,
          recommendedEdits: toArrayOfStrings(
            (parsed as Record<string, unknown>).recommendedEdits,
          ),
          responseRisks: toArrayOfStrings(
            (parsed as Record<string, unknown>).responseRisks,
          ),
          audienceSummary: toArrayOfStrings(
            (parsed as Record<string, unknown>).audienceSummary,
          ),
        }
      : null;

  const output = deterministicTrial(workspace.brief, strategy, draft, aiSuggestion);

  return {
    output,
    headline: prefersArabic(workspace.brief) ? "اكتمل الاختبار" : "Trial complete",
    summary: firstSentence(output.summary),
    generatedBy: "simulator" as AgentId,
  };
}

function generateStudio(workspace: CampaignWorkspace): GeneratedPhase {
  const strategy = workspace.phases.strategy.data;
  const draft = workspace.phases.draft.data;
  const trial = workspace.phases.trial.data;
  if (!strategy || !draft || !trial) {
    throw new Error("Strategy, Draft, and Trial outputs are required before Studio can run.");
  }

  const selectedVariantId = workspace.selectedVariantId ?? trial.winningVariantId;
  const variant = draft.variants.find((entry) => entry.id === selectedVariantId) ?? draft.variants[0];
  const angle = strategy.angles.find((entry) => entry.id === variant.angleId) ?? strategy.angles[0];
  const headline = variant.fullText.split("\n")[0] ?? angle.hook;

  const layers: StudioLayer[] = prefersArabic(workspace.brief)
    ? [
        {
          id: "layer_background",
          kind: "background",
          name: "خلفية هادئة",
          note: "خامة أو سطح يعطي ثقة بصرية، مع مساحة سلبية كافية للنص العربي.",
        },
        {
          id: "layer_subject",
          kind: "subject",
          name: "بطل المنتج",
          note: `اجعل ${displayProduct(workspace.brief)} مركز المشهد من دون ازدحام.`,
        },
        {
          id: "layer_headline",
          kind: "headline",
          name: "العنوان",
          note: headline.replace(/"/g, ""),
        },
        {
          id: "layer_body",
          kind: "body",
          name: "سطر داعم",
          note: "جملة واحدة فقط تحمل الدليل أو الفائدة، بخط أصغر وإيقاع واضح.",
        },
        {
          id: "layer_cta",
          kind: "cta",
          name: "الدعوة للإجراء",
          note: displayCTA(workspace.brief),
        },
        {
          id: "layer_logo",
          kind: "logo",
          name: "شعار العلامة",
          note: "يوضع بهدوء في مساحة لا تنافس الخطاف الرئيسي.",
        },
      ]
    : [
        {
          id: "layer_background",
          kind: "background",
          name: "Backdrop",
          note: "Use one tactile surface and keep enough negative space for the headline.",
        },
        {
          id: "layer_subject",
          kind: "subject",
          name: "Product hero",
          note: `Keep ${displayProduct(workspace.brief)} unmistakably central.`,
        },
        {
          id: "layer_headline",
          kind: "headline",
          name: "Headline",
          note: headline.replace(/"/g, ""),
        },
        {
          id: "layer_body",
          kind: "body",
          name: "Support line",
          note: "Use one line only. The layout should still breathe.",
        },
        {
          id: "layer_cta",
          kind: "cta",
          name: "CTA",
          note: displayCTA(workspace.brief),
        },
        {
          id: "layer_logo",
          kind: "logo",
          name: "Brand mark",
          note: "Quiet placement, low drama, high confidence.",
        },
      ];

  const output: StudioOutput = {
    summary: prefersArabic(workspace.brief)
      ? "حوّل الاستوديو النسخة الفائزة إلى اتجاه بصري جاهز للإنتاج: عنوان واضح، بطل بصري واحد، وإرشادات تخدم القراءة العربية وطبقات الرسالة."
      : "Studio translated the winning variant into a production-ready visual direction with one clear hero, one clear line, and disciplined hierarchy.",
    selectedVariantId: variant.id,
    imagePrompt: prefersArabic(workspace.brief)
      ? `إعلان عربي فاخر لعلامة ${displayBrand(workspace.brief)} حول ${displayProduct(workspace.brief)}. تكوين نظيف، بطل بصري واحد، ضوء دافئ جانبي، خامات هادئة، مساحة واضحة لعنوان عربي RTL، لا أيقونات تقنية مزعجة، لا عرض مبيعات صاخب. النبرة: ${angle.tone}.`
      : `Premium campaign ad for ${displayBrand(workspace.brief)} featuring ${displayProduct(workspace.brief)}. One hero object, warm directional light, tactile surface, negative space, clear hierarchy, restrained typography, no loud promo behavior. Tone: ${angle.tone}.`,
    composition: prefersArabic(workspace.brief)
      ? "اعتمد تكويناً RTL واضحاً: العنوان في مساحة تقرأ بسهولة، والجسم الداعم أقصر منه بكثير، والمنتج حاضر لا مزاحم. اجعل الفراغ جزءاً من الإقناع."
      : "Use a restrained composition with one dominant object, one strong headline, one supporting line, and enough whitespace to make the work feel intentional.",
    palette: ["#F4EADB", "#C8A96E", "#173126", "#546A7B"],
    typography: prefersArabic(workspace.brief)
      ? ["Display Arabic serif", "Contemporary Arabic sans", "Compact CTA weight"]
      : ["DM Serif Display", "Inter Medium", "Inter Regular"],
    layers,
    formats: prefersArabic(workspace.brief)
      ? [
          {
            id: "format_story",
            name: "ستوري",
            ratio: "9:16",
            size: "1080x1920",
            layoutNote: "احفظ أعلى الشاشة للخطاف، واترك المنتج في منتصف التكوين مع CTA منخفض.",
          },
          {
            id: "format_feed",
            name: "منشور",
            ratio: "4:5",
            size: "1080x1350",
            layoutNote: "أفضل صيغة للعرض الرئيسي، مع حضور واضح للعنوان العربي.",
          },
          {
            id: "format_landscape",
            name: "عرض",
            ratio: "16:9",
            size: "1920x1080",
            layoutNote: "مناسب للعرض أمام الحكام أو كشريحة إطلاق رئيسية.",
          },
        ]
      : [
          {
            id: "format_feed",
            name: "Feed",
            ratio: "4:5",
            size: "1080x1350",
            layoutNote: "Primary asset with the strongest headline treatment.",
          },
          {
            id: "format_story",
            name: "Story",
            ratio: "9:16",
            size: "1080x1920",
            layoutNote: "Tighter hierarchy and larger product silhouette.",
          },
          {
            id: "format_landscape",
            name: "Landscape",
            ratio: "16:9",
            size: "1920x1080",
            layoutNote: "Presentation-friendly version for demo use.",
          },
        ],
    assetChecklist: prefersArabic(workspace.brief)
      ? [
          "تأكد أن العنوان العربي مقروء من أول نظرة.",
          "لا تدع الخط أو الزخرفة يسرقان مركزية المنتج.",
          "حافظ على CTA بسيطاً وطبيعياً.",
          "اختبر الاتزان بين الفخامة والوضوح على شاشات الجوال.",
        ]
      : [
          "Make sure the headline is legible at first glance.",
          "Do not let styling overpower the product story.",
          "Keep the CTA simple and native to the platform.",
          "Check that the composition holds on mobile-sized crops.",
        ],
  };

  return {
    output,
    headline: prefersArabic(workspace.brief) ? "الاتجاه البصري جاهز" : "Studio direction ready",
    summary: firstSentence(output.summary),
    generatedBy: "visual",
  };
}

function buildLaunchOutput(workspace: CampaignWorkspace): LaunchOutput {
  const strategy = workspace.phases.strategy.data;
  const draft = workspace.phases.draft.data;
  const trial = workspace.phases.trial.data;
  if (!strategy || !draft || !trial) {
    throw new Error("Strategy, Draft, and Trial outputs are required before Launch can run.");
  }

  const winningVariant =
    draft.variants.find((entry) => entry.id === trial.winningVariantId) ?? draft.variants[0];
  const winningAngle =
    strategy.angles.find((entry) => entry.id === winningVariant.angleId) ?? strategy.angles[0];
  const alternates = draft.variants
    .filter((entry) => entry.id !== winningVariant.id)
    .toSorted((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((entry) => entry.fullText);

  if (prefersArabic(workspace.brief)) {
    return {
      summary: "رتّب الإطلاق النسخة الفائزة داخل حزمة جاهزة للعرض والتنفيذ: نص نهائي، بدائل، خطة ردود، مخاطر، وتغليفات مناسبة للمنصة.",
      winningAngleId: winningAngle.id,
      winningVariantId: winningVariant.id,
      finalCaption: winningVariant.fullText,
      alternates,
      responsePlan: [
        {
          scenario: "سؤال عن سبب الاختلاف عن الخيارات العادية",
          response: `اربط الإجابة مباشرة بمنطق الزاوية الفائزة: ${winningAngle.promise}`,
          tone: "واثق، مختصر، مفيد",
        },
        {
          scenario: "اعتراض على أن النسخة تبدو أنيقة أكثر من اللازم",
          response: "أعد الجمهور إلى الفائدة أو الدليل العملي داخل النص، ثم اجعل النبرة أقل زينة وأكثر تقريراً.",
          tone: "هادئ، غير دفاعي",
        },
        {
          scenario: "طلب صيغة أسرع أو أبسط",
          response: "استخدم أفضل بديل من البدائل الجاهزة وحافظ على نفس الخطاف البصري العام.",
          tone: "مرن وواضح",
        },
      ],
      riskNotes: trial.responseRisks,
      launchChecklist: [
        "راجع سلامة الادعاءات قبل النشر النهائي.",
        "ثبّت العنوان والCTA في جميع المقاسات.",
        "احفظ نسخة مختصرة للردود السريعة أو التعليقات.",
        "راقب ما إذا كانت الزاوية تُفهم من أول مشاهدة.",
      ],
      packages: [
        {
          id: "package_primary",
          name: "المنشور الرئيسي",
          ratio: workspace.brief.platform.includes("سناب") ? "9:16" : "4:5",
          headline: winningAngle.hook,
          caption: winningVariant.fullText,
          cta: displayCTA(workspace.brief),
          visualCue: "منتج واحد واضح، عنوان عربي قوي، ومساحة بيضاء محسوبة.",
        },
        {
          id: "package_quote",
          name: "نسخة بديلة سريعة",
          ratio: "16:9",
          headline: firstSentence(winningAngle.promise),
          caption: alternates[0] ?? winningVariant.fullText,
          cta: "اعرف أكثر",
          visualCue: "تكوين أخف مع اعتماد أكبر على العبارة لا على التفاصيل.",
        },
        {
          id: "package_reply",
          name: "حزمة الردود",
          ratio: "1:1",
          headline: "ردود جاهزة",
          caption: trial.audienceSummary.join(" "),
          cta: "فعّل الرد",
          visualCue: "لوحات نصية صغيرة أو بطاقات إرشاد للفريق.",
        },
      ],
      nextSteps: [
        "اختبر النسخة الفائزة مع جمهور صغير قبل توسيع الإنفاق.",
        "حوّل أفضل بديل إلى متابعة لاحقة أو رد مثبت.",
        "أعد الاختبار إذا اختلف الأداء الحقيقي عن الفرضية الأساسية.",
      ],
    };
  }

  return {
    summary: "Launch packaged the winning direction into a polished delivery set with a final caption, alternates, response guidance, and rollout notes.",
    winningAngleId: winningAngle.id,
    winningVariantId: winningVariant.id,
    finalCaption: winningVariant.fullText,
    alternates,
    responsePlan: [
      {
        scenario: "The audience asks why this is meaningfully different.",
        response: `Answer with the winning promise directly: ${winningAngle.promise}`,
        tone: "Clear and confident",
      },
      {
        scenario: "Someone says the campaign feels too polished.",
        response: "Return to the concrete benefit or use-case proof and lower the ornament, not the confidence.",
        tone: "Calm and specific",
      },
      {
        scenario: "The audience wants a shorter version.",
        response: "Use the strongest alternate and keep the same strategic line.",
        tone: "Flexible",
      },
    ],
    riskNotes: trial.responseRisks,
    launchChecklist: [
      "Confirm claim safety before publishing.",
      "Lock the headline and CTA across all primary formats.",
      "Prepare one short social reply version.",
      "Watch whether the angle is understood at first glance.",
    ],
    packages: [
      {
        id: "package_primary",
        name: "Primary asset",
        ratio: "4:5",
        headline: winningAngle.hook,
        caption: winningVariant.fullText,
        cta: displayCTA(workspace.brief),
        visualCue: "One clear product hero, disciplined hierarchy, premium whitespace.",
      },
      {
        id: "package_follow_up",
        name: "Follow-up alternate",
        ratio: "16:9",
        headline: firstSentence(winningAngle.promise),
        caption: alternates[0] ?? winningVariant.fullText,
        cta: "Learn more",
        visualCue: "Slimmer message-led composition.",
      },
      {
        id: "package_response",
        name: "Response kit",
        ratio: "1:1",
        headline: "Reply guidance",
        caption: trial.audienceSummary.join(" "),
        cta: "Use in comments",
        visualCue: "Text-card system for quick team use.",
      },
    ],
    nextSteps: [
      "Test the winner against one alternate before scaling spend.",
      "Convert the strongest alternate into a follow-up asset.",
      "Re-run Trial if real-world feedback diverges from the core hypothesis.",
    ],
  };
}

async function generateLaunch(workspace: CampaignWorkspace) {
  const strategy = workspace.phases.strategy.data;
  const draft = workspace.phases.draft.data;
  const trial = workspace.phases.trial.data;
  if (!strategy || !draft || !trial) {
    throw new Error("Strategy, Draft, and Trial outputs are required before Launch can run.");
  }

  const fallback = buildLaunchOutput(workspace);
  const aiText = await callOpenRouter({
    label: "launch enhancement",
    system:
      "You are TrendMind's Launch Packager. If you return JSON, keep it short and only improve the summary, response risks, and next steps.",
    prompt: buildLaunchPrompt(workspace.brief, strategy, draft, trial),
  });
  const parsed = aiText ? extractJsonObject(aiText) : null;

  if (!parsed || typeof parsed !== "object") {
    return {
      output: fallback,
      headline: prefersArabic(workspace.brief) ? "حزمة الإطلاق جاهزة" : "Launch package ready",
      summary: firstSentence(fallback.summary),
      generatedBy: "director" as AgentId,
    };
  }

  const candidate = parsed as Record<string, unknown>;
  const output: LaunchOutput = {
    ...fallback,
    summary:
      typeof candidate.summary === "string" && candidate.summary.trim()
        ? candidate.summary.trim()
        : fallback.summary,
    riskNotes:
      toArrayOfStrings(candidate.riskNotes).length > 0
        ? toArrayOfStrings(candidate.riskNotes)
        : fallback.riskNotes,
    nextSteps:
      toArrayOfStrings(candidate.nextSteps).length > 0
        ? toArrayOfStrings(candidate.nextSteps)
        : fallback.nextSteps,
  };

  return {
    output,
    headline: prefersArabic(workspace.brief) ? "حزمة الإطلاق جاهزة" : "Launch package ready",
    summary: firstSentence(output.summary),
    generatedBy: "director" as AgentId,
  };
}

async function buildPhase(
  workspace: CampaignWorkspace,
  phase: PhaseId,
  note?: string | null,
): Promise<GeneratedPhase> {
  switch (phase) {
    case "research":
      return generateResearch(workspace, note);
    case "strategy":
      return generateStrategy(workspace, note);
    case "draft":
      return generateDraft(workspace, note);
    case "trial":
      return generateTrial(workspace);
    case "studio":
      return generateStudio(workspace);
    case "launch":
      return generateLaunch(workspace);
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
      const variant = draft.variants.find((entry) => entry.id === draft.recommendedVariantId);
      await client.query(
        `
          UPDATE campaigns
          SET
            selected_angle_id = COALESCE($2, selected_angle_id),
            selected_variant_id = $3,
            updated_at = NOW()
          WHERE id = $1
        `,
        [campaignId, variant?.angleId ?? null, draft.recommendedVariantId],
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

function actorForPhase(phase: PhaseId): AgentId {
  switch (phase) {
    case "research":
      return "scout";
    case "strategy":
      return "strategist";
    case "draft":
      return "architect";
    case "trial":
      return "simulator";
    case "studio":
      return "visual";
    case "launch":
      return "director";
    default:
      return "director";
  }
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
      message: `Campaign run started from ${run.startPhase}.`,
      metadata: run.note ? { note: run.note } : {},
    });
  });

  try {
    const phases = phaseRange(run.startPhase);

    for (const phase of phases) {
      currentPhase = phase;

      await withTransaction(async (client) => {
        await setPhaseRunning(client, run.campaignId, phase);
        await appendActivity(client, {
          campaignId: run.campaignId,
          runId: run.id,
          phase,
          actor: actorForPhase(phase),
          kind: "progress",
          message: `Working through ${phase}.`,
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
          data: generated.output,
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

function phaseRange(startPhase: PhaseId) {
  const startIndex = Math.max(PHASE_SEQUENCE.indexOf(startPhase), 1);
  return PHASE_SEQUENCE.slice(startIndex);
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
