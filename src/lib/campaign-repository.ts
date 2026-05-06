import { randomUUID } from "node:crypto";

import { PHASE_SEQUENCE } from "@/lib/campaign-data";
import type {
  AgentId,
  BriefPatch,
  CampaignActivity,
  CampaignBootstrap,
  CampaignBrief,
  CampaignRun,
  CampaignSummary,
  CampaignWorkspace,
  CreateCampaignInput,
  DraftOutput,
  LaunchOutput,
  PhaseId,
  PhaseOutputMap,
  PhaseRecord,
  RevisionRequest,
  RunRequest,
  SelectionPatch,
  StrategyOutput,
  StudioOutput,
  TrialOutput,
  ResearchOutput,
} from "@/lib/types";

type MutableWorkspace = CampaignWorkspace;

function id(prefix: string) {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

function now(offsetMinutes = 0) {
  return new Date(Date.now() + offsetMinutes * 60_000).toISOString();
}

function phaseRecord<K extends PhaseId>(
  phase: K,
  input: {
    version?: number;
    headline: string;
    summary: string;
    data: PhaseOutputMap[K];
    generatedBy: AgentId;
    updatedAt?: string;
  },
): PhaseRecord<PhaseOutputMap[K]> {
  const timestamp = input.updatedAt ?? now();
  return {
    phase,
    status: "ready",
    version: input.version ?? 1,
    headline: input.headline,
    summary: input.summary,
    data: input.data,
    generatedBy: input.generatedBy,
    updatedAt: timestamp,
    startedAt: timestamp,
    completedAt: timestamp,
    staleReason: null,
    error: null,
  };
}

const demoBrief: CampaignBrief = {
  campaignName: "إطلاق سوار نبض",
  brandName: "نبض",
  productName: "سوار نبض الذكي",
  audience: "شباب وشابات في السعودية والخليج يهتمون بالصحة اليومية، النوم، النشاط، والمظهر العصري.",
  goal: "بناء رغبة واضحة حول السوار قبل الإطلاق وتحويل الاهتمام إلى تسجيلات انتظار.",
  platform: "تيك توك، إنستغرام، وسناب شات",
  language: "العربية",
  tone: "ذكي، قريب، واثق، غير متكلف",
  valueProposition: "سوار أنيق يترجم بيانات جسمك إلى قرارات يومية بسيطة.",
  callToAction: "انضم إلى قائمة الانتظار",
  pillars: ["صحة يومية مفهومة", "تصميم يصلح لكل يوم", "تنبيهات ذكية بلا إزعاج"],
  avoid: ["الوعود الطبية", "المبالغة في الخوف", "لغة تقنية باردة"],
  guardrails: ["كل ادعاء صحي يحتاج صياغة حذرة", "لا نعد بتشخيص أو علاج", "نحافظ على لهجة عربية طبيعية"],
  brandLinks: ["https://example.com/nabd"],
  socialAccounts: ["@nabd.sa", "instagram.com/nabd"],
  references: ["تعليقات مستخدمين عن تتبع النوم", "مقارنات بين الساعات والسوارات الذكية"],
  context: "الفئة مزدحمة، لكن الناس لا يريدون لوحة أرقام معقدة. يريدون إشارة واضحة: ماذا أفعل اليوم؟",
};

const researchData: ResearchOutput = {
  overview:
    "الفرصة الأقوى ليست في بيع جهاز جديد، بل في بيع شعور السيطرة الهادئة على اليوم. الجمهور يتفاعل مع الرسائل التي تجعل البيانات شخصية وقابلة للفعل، لا مع استعراض المواصفات.",
  items: [
    {
      id: "res_sleep",
      kind: "audience",
      title: "النوم أصبح مدخل الحديث اليومي عن الصحة",
      summary: "المستخدمون يتحدثون عن الإرهاق، جودة النوم، والاستيقاظ بطاقة أكثر من حديثهم عن عدد الخطوات.",
      source: "تحليل محادثات اجتماعية تجريبي",
      confidence: 84,
      by: "scout",
      tags: ["النوم", "العافية", "روتين يومي"],
    },
    {
      id: "res_style",
      kind: "trend",
      title: "الجهاز الصحي يجب أن يبدو كإكسسوار",
      summary: "القبول اليومي يرتفع عندما يبدو المنتج جزءا من اللبس، لا أداة رياضية منفصلة.",
      source: "رصد بصري لحملات أجهزة قابلة للارتداء",
      confidence: 78,
      by: "scout",
      tags: ["تصميم", "موضة", "استخدام يومي"],
    },
    {
      id: "res_risk",
      kind: "risk",
      title: "الخطر الأكبر هو وعد صحي أكبر من اللازم",
      summary: "الرسائل التي توحي بالتشخيص أو العلاج قد تضعف الثقة وتخلق اعتراضا مبكرا.",
      source: "مراجعة ادعاءات تسويقية شائعة",
      confidence: 91,
      by: "factChecker",
      tags: ["امتثال", "ثقة", "صياغة"],
    },
  ],
  sourceSummary: [
    "تم التعامل مع البحث كإشارات تجريبية لا كدراسة نهائية.",
    "أقوى زاوية متكررة: تحويل البيانات إلى خطوة واحدة مفهومة.",
    "الأداء المتوقع أفضل مع فيديو قصير يربط السوار بلحظة يومية محددة.",
  ],
  recommendedFocus: "ركز على لحظة الصباح: السوار لا يخبرك بكل شيء، بل يخبرك ما الذي يستحق انتباهك اليوم.",
};

const strategyData: StrategyOutput = {
  campaignThesis:
    "نبض يربح عندما يظهر كرفيق يومي يفهم الجسم بهدوء، لا كجهاز آخر يضيف أرقاما وضغطا.",
  recommendedAngleId: "angle_b",
  decisionFrame: "نختار الزاوية التي تجمع الوضوح العاطفي، قابلية التصوير، وانخفاض مخاطر الادعاءات الطبية.",
  angles: [
    {
      id: "angle_a",
      lane: "safe",
      letter: "A",
      title: "اعرف يومك من أول نبضة",
      thesis: "كل صباح يحمل إشارة صغيرة تساعدك تختار إيقاع يومك.",
      stance: "هادئة وموثوقة",
      promise: "فهم أبسط لطاقة اليوم.",
      hook: "قبل ما تبدأ يومك، اسأل جسمك.",
      rationale: ["واضحة للقضاة", "سهلة التحويل إلى فيديو", "تقلل المخاطر الصحية"],
      risks: ["قد تبدو مألوفة إن لم تنفذ بصريا بقوة"],
      fit: "مناسبة لإطلاق واسع ومباشر.",
      tone: "مطمئن",
      score: 82,
    },
    {
      id: "angle_b",
      lane: "sharp",
      letter: "B",
      title: "لا تجمع أرقاما، التقط قرارا",
      thesis: "المشكلة ليست نقص البيانات، بل كثرتها. نبض يحولها إلى قرار واضح.",
      stance: "ذكية وحادة",
      promise: "بيانات أقل ضجيجا وأكثر فائدة.",
      hook: "جسمك لا يحتاج لوحة قيادة. يحتاج إشارة.",
      rationale: ["تميز واضح عن المنافسين", "يعطي المنتج رأيا", "يناسب ديمو هاكاثون بقوة"],
      risks: ["يحتاج شرحا بصريا حتى لا يبدو مجرد شعار"],
      fit: "أفضل زاوية لإظهار أن TrendMind وجد موقفا تسويقيا حقيقيا.",
      tone: "واثق",
      score: 91,
    },
    {
      id: "angle_c",
      lane: "viral",
      letter: "C",
      title: "مزاج جسمك اليوم",
      thesis: "نحول مؤشرات الجسم إلى لغة اجتماعية سريعة وقابلة للمشاركة.",
      stance: "مرحة وسريعة",
      promise: "قراءة خفيفة لما يحتاجه جسمك.",
      hook: "لو جسمك أرسل لك ستوري اليوم، ماذا سيقول؟",
      rationale: ["قابلة للانتشار", "ممتعة بصريا", "تفتح سلسلة محتوى"],
      risks: ["قد تبدو أقل جدية للمنتج إن بالغنا في المرح"],
      fit: "جيدة كمسار اجتماعي ثانوي بعد تثبيت الرسالة الأساسية.",
      tone: "خفيف",
      score: 86,
    },
  ],
};

const draftData: DraftOutput = {
  summary: "تم بناء ثلاث نسخ حول الزاوية المختارة، مع اختلاف في الحدة والطول ومباشرة الدعوة.",
  recommendedVariantId: "variant_b1",
  atoms: [
    { id: "hook_b", angleId: "angle_b", kind: "hook", text: "جسمك لا يحتاج لوحة قيادة. يحتاج إشارة.", note: "الخطاف الأكثر تميزا" },
    { id: "body_b", angleId: "angle_b", kind: "body", text: "سوار نبض يقرأ مؤشراتك اليومية ويحوّلها إلى تنبيه بسيط: خفف، تحرك، أو أعط نومك حقه.", note: "يوضح القيمة دون وعد طبي" },
    { id: "cta_b", angleId: "angle_b", kind: "cta", text: "انضم إلى قائمة الانتظار وكن من أوائل من يجربون نبض.", note: "دعوة إطلاق مناسبة" },
  ],
  variants: [
    {
      id: "variant_b1",
      angleId: "angle_b",
      name: "نسخة القرار الواضح",
      hookId: "hook_b",
      bodyId: "body_b",
      ctaId: "cta_b",
      tone: "واثق وذكي",
      length: "medium",
      score: 92,
      critique: [
        { agent: "critic", note: "القوة في أنها تهاجم فوضى البيانات لا المنافسين." },
        { agent: "factChecker", note: "الصياغة آمنة لأنها لا تعد بتشخيص أو علاج." },
      ],
      fullText:
        "جسمك لا يحتاج لوحة قيادة. يحتاج إشارة.\n\nسوار نبض يقرأ مؤشراتك اليومية ويحوّلها إلى تنبيه بسيط: خفف، تحرك، أو أعط نومك حقه.\n\nانضم إلى قائمة الانتظار وكن من أوائل من يجربون نبض.",
    },
    {
      id: "variant_b2",
      angleId: "angle_b",
      name: "نسخة الصباح",
      hookId: "hook_b",
      bodyId: "body_b",
      ctaId: "cta_b",
      tone: "قريب وهادئ",
      length: "short",
      score: 87,
      critique: [{ agent: "simulator", note: "ستعمل جيدا في فيديو يبدأ بلقطة استيقاظ واقعية." }],
      fullText:
        "قبل ما يبدأ يومك، خذ إشارة واحدة من جسمك.\n\nنبض يساعدك تفهم نومك ونشاطك بدون ضجيج الأرقام.\n\nسجل اهتمامك الآن.",
    },
  ],
};

const trialData: TrialOutput = {
  summary: "المحاكاة ترجح نسخة القرار الواضح لأنها تشرح لماذا المنتج مختلف بسرعة وتحافظ على مصداقية عالية.",
  winningVariantId: "variant_b1",
  personas: [
    { id: "persona_busy", name: "سارة", archetype: "موظفة مشغولة", oneLiner: "تريد مؤشرا سريعا دون تحليل طويل.", glyph: "س", accent: "#3d7a5f" },
    { id: "persona_fit", name: "ماجد", archetype: "مهتم باللياقة", oneLiner: "يريد قياسا مفيدا لا مظهرا فقط.", glyph: "م", accent: "#4f6e87" },
    { id: "persona_skeptic", name: "نورة", archetype: "متشككة من الأجهزة", oneLiner: "تخاف من وعود صحية مبالغ فيها.", glyph: "ن", accent: "#8a6a5a" },
  ],
  reactions: [
    {
      id: "react_1",
      personaId: "persona_busy",
      variantId: "variant_b1",
      sentiment: "love",
      quote: "أعجبني أنه لا يطلب مني أفهم كل رقم. يعطيني خلاصة.",
      why: "ترى القيمة في تقليل الضجيج.",
      subScores: { clarity: 93, resonance: 91, intent: 86 },
    },
    {
      id: "react_2",
      personaId: "persona_fit",
      variantId: "variant_b1",
      sentiment: "warm",
      quote: "الفكرة قوية، لكن أحتاج أعرف ما نوع المؤشرات التي يقيسها.",
      why: "يريد دليلا وظيفيا إضافيا.",
      subScores: { clarity: 86, resonance: 84, intent: 79 },
    },
    {
      id: "react_3",
      personaId: "persona_skeptic",
      variantId: "variant_b1",
      sentiment: "warm",
      quote: "طالما أنه لا يعد بعلاج، الرسالة مقبولة ومقنعة.",
      why: "الصياغة حذرة بما يكفي.",
      subScores: { clarity: 88, resonance: 82, intent: 74 },
    },
  ],
  scoreboard: [
    { variantId: "variant_b1", average: 88, resonance: 86, risk: 18, verdict: "الأقوى للإطلاق" },
    { variantId: "variant_b2", average: 82, resonance: 84, risk: 22, verdict: "جيدة كنسخة فيديو قصيرة" },
  ],
  recommendedEdits: [
    "أضف مثالا واحدا على الإشارة اليومية: نوم أقل، حركة أقل، أو إجهاد أعلى.",
    "اجعل الدعوة واضحة ومباشرة في آخر ثانية من الفيديو.",
    "تجنب أي جملة توحي بأن السوار يقدم نصيحة طبية.",
  ],
  responseRisks: ["أسئلة حول دقة القياس", "مقارنات مباشرة مع ساعات ذكية معروفة", "حساسية تجاه جمع البيانات الشخصية"],
};

const studioData: StudioOutput = {
  summary: "الاتجاه البصري المقترح: صباح هادئ، ضوء طبيعي، السوار كإشارة صغيرة على المعصم، والنص يأخذ دور القرار لا الزينة.",
  selectedVariantId: "variant_b1",
  imagePrompt:
    "مشهد عربي عصري لشخص يستعد ليومه في ضوء صباح طبيعي، سوار ذكي أنيق على المعصم، واجهة بسيطة تعرض إشارة واحدة فقط، أسلوب إعلاني واقعي ونظيف.",
  composition: "لقطة قريبة للمعصم بجانب كوب قهوة ونافذة مضيئة، مع مساحة نص واضحة في الثلث الأيمن.",
  palette: ["أخضر عميق", "عاجي دافئ", "رمادي حجري", "ذهبي خافت"],
  typography: ["عنوان عربي هندسي واضح", "نص ثانوي خفيف", "زر دعوة عالي التباين"],
  layers: [
    { id: "layer_bg", kind: "background", name: "صباح هادئ", note: "ضوء طبيعي ومساحة نظيفة للرسالة." },
    { id: "layer_subject", kind: "subject", name: "السوار على المعصم", note: "المنتج ظاهر كجزء من اليوم." },
    { id: "layer_headline", kind: "headline", name: "الإشارة", note: "جسمك لا يحتاج لوحة قيادة. يحتاج إشارة." },
    { id: "layer_cta", kind: "cta", name: "قائمة الانتظار", note: "زر واضح في نهاية التصميم." },
  ],
  formats: [
    { id: "fmt_story", name: "ستوري", ratio: "9:16", size: "1080×1920", layoutNote: "العنوان في الأعلى والمنتج في منتصف الإطار." },
    { id: "fmt_feed", name: "منشور", ratio: "4:5", size: "1080×1350", layoutNote: "النص يمين والصورة يسار بنظام RTL واضح." },
    { id: "fmt_landscape", name: "عرض هاكاثون", ratio: "16:9", size: "1920×1080", layoutNote: "يناسب شاشة العرض مع إبراز منطق TrendMind." },
  ],
  assetChecklist: ["صورة المنتج", "لقطة صباحية", "نسخة قصيرة", "شعار نبض", "زر قائمة الانتظار"],
};

const launchData: LaunchOutput = {
  summary: "الحزمة جاهزة كإطلاق تجريبي: زاوية حادة، نسخة آمنة، محاكاة ردود، واتجاه بصري قابل للإنتاج.",
  winningAngleId: "angle_b",
  winningVariantId: "variant_b1",
  finalCaption:
    "جسمك لا يحتاج لوحة قيادة. يحتاج إشارة.\n\nسوار نبض يحوّل مؤشراتك اليومية إلى تنبيه بسيط يساعدك تفهم إيقاع يومك بدون ضجيج.\n\nانضم إلى قائمة الانتظار.",
  alternates: [
    "ابدأ يومك بإشارة واحدة واضحة من جسمك.",
    "بيانات أقل ضجيجا. قرار يومي أوضح.",
    "نبض: عندما تصبح مؤشراتك اليومية أسهل فهما.",
  ],
  responsePlan: [
    { scenario: "سؤال عن الدقة", response: "نبض يساعدك قراءة مؤشرات يومية عامة، وسنشارك تفاصيل القياس عند الإطلاق.", tone: "شفاف" },
    { scenario: "اعتراض على الخصوصية", response: "الخصوصية جزء أساسي من التجربة، والبيانات مصممة لتبقى تحت تحكم المستخدم.", tone: "مطمئن" },
  ],
  riskNotes: ["لا تستخدم كلمة تشخيص", "لا تقارن المنتج طبيا بأجهزة معتمدة", "اشرح الخصوصية مبكرا"],
  launchChecklist: ["تثبيت الرسالة النهائية", "إنتاج فيديو 15 ثانية", "تحضير صفحة انتظار", "تجهيز ردود التعليقات"],
  packages: [
    {
      id: "pkg_story",
      name: "ستوري الإطلاق",
      ratio: "9:16",
      headline: "جسمك يحتاج إشارة",
      caption: "سجل اهتمامك بسوار نبض.",
      cta: "انضم الآن",
      visualCue: "معصم يلتقط ضوء الصباح مع واجهة إشارة واحدة.",
    },
    {
      id: "pkg_feed",
      name: "منشور التعريف",
      ratio: "4:5",
      headline: "لا تجمع أرقاما، التقط قرارا",
      caption: "نبض يحوّل مؤشراتك اليومية إلى معنى أبسط.",
      cta: "ادخل قائمة الانتظار",
      visualCue: "تصميم نظيف يوازن بين المنتج والجملة الرئيسية.",
    },
  ],
  nextSteps: ["اختبار النسخة مع 10 مستخدمين محتملين", "تصوير نموذج فيديو سريع", "تحويل الاعتراضات المتكررة إلى FAQ"],
};

function buildWorkspace(input: CampaignBrief = demoBrief): CampaignWorkspace {
  const updatedAt = now(-4);
  return {
    id: "cmp_demo_ar",
    name: input.campaignName,
    brandName: input.brandName,
    status: "ready",
    activePhase: "launch",
    selectedAngleId: "angle_b",
    selectedVariantId: "variant_b1",
    brief: input,
    phases: {
      brief: phaseRecord("brief", {
        headline: input.campaignName,
        summary: input.goal,
        data: input,
        generatedBy: "director",
        updatedAt,
      }),
      research: phaseRecord("research", {
        headline: "إشارات السوق والجمهور",
        summary: researchData.overview,
        data: researchData,
        generatedBy: "scout",
        updatedAt,
      }),
      strategy: phaseRecord("strategy", {
        headline: "ثلاث زوايا قابلة للاختبار",
        summary: strategyData.campaignThesis,
        data: strategyData,
        generatedBy: "strategist",
        updatedAt,
      }),
      draft: phaseRecord("draft", {
        headline: "نسخ مبنية على زاوية القرار",
        summary: draftData.summary,
        data: draftData,
        generatedBy: "architect",
        updatedAt,
      }),
      trial: phaseRecord("trial", {
        headline: "محاكاة رد فعل الجمهور",
        summary: trialData.summary,
        data: trialData,
        generatedBy: "simulator",
        updatedAt,
      }),
      studio: phaseRecord("studio", {
        headline: "اتجاه بصري جاهز للإنتاج",
        summary: studioData.summary,
        data: studioData,
        generatedBy: "visual",
        updatedAt,
      }),
      launch: phaseRecord("launch", {
        headline: "حزمة إطلاق عربية كاملة",
        summary: launchData.summary,
        data: launchData,
        generatedBy: "director",
        updatedAt,
      }),
    },
    activities: [
      {
        id: "act_launch",
        phase: "launch",
        actor: "director",
        kind: "decision",
        message: "تم تجهيز حزمة إطلاق تجريبية كاملة باستخدام بيانات عربية وهمية.",
        metadata: {},
        createdAt: now(-3),
      },
      {
        id: "act_trial",
        phase: "trial",
        actor: "simulator",
        kind: "progress",
        message: "تمت محاكاة ردود ثلاث شرائح جمهور على النسخ المقترحة.",
        metadata: {},
        createdAt: now(-8),
      },
      {
        id: "act_strategy",
        phase: "strategy",
        actor: "strategist",
        kind: "decision",
        message: "تم ترشيح زاوية: لا تجمع أرقاما، التقط قرارا.",
        metadata: { selectedAngleId: "angle_b" },
        createdAt: now(-14),
      },
    ],
    runs: [
      {
        id: "run_demo",
        campaignId: "cmp_demo_ar",
        mode: "full",
        startPhase: "research",
        status: "completed",
        note: "تشغيل عربي تجريبي",
        error: null,
        createdAt: now(-30),
        startedAt: now(-29),
        completedAt: now(-4),
      },
    ],
    revisions: [
      {
        id: "rev_demo",
        phase: "draft",
        note: "اجعل النسخة أكثر وضوحا حول فائدة الإشارة اليومية.",
        status: "applied",
        createdAt: now(-18),
      },
    ],
    health: { ai: true, research: true },
    updatedAt,
  };
}

const workspaces = new Map<string, MutableWorkspace>([
  ["cmp_demo_ar", buildWorkspace()],
]);

function cloneWorkspace(workspace: CampaignWorkspace): CampaignWorkspace {
  return structuredClone(workspace) as CampaignWorkspace;
}

function summarize(workspace: CampaignWorkspace): CampaignSummary {
  return {
    id: workspace.id,
    name: workspace.name,
    brandName: workspace.brandName,
    platform: workspace.brief.platform,
    status: workspace.status,
    updatedAt: workspace.updatedAt,
    lastRunStatus: workspace.runs[0]?.status ?? null,
  };
}

function getMutableCampaign(campaignId: string) {
  const workspace = workspaces.get(campaignId) ?? workspaces.get("cmp_demo_ar");
  if (!workspace) throw new Error("لم يتم العثور على الحملة التجريبية.");
  return workspace;
}

export async function createCampaign(input?: Partial<CreateCampaignInput>) {
  const brief: CampaignBrief = {
    ...demoBrief,
    campaignName: input?.campaignName?.trim() || "حملة عربية تجريبية",
    brandName: input?.brandName?.trim() || "علامة تجريبية",
    productName: input?.productName?.trim() || "منتج تجريبي",
    platform: input?.platform?.trim() || demoBrief.platform,
  };
  const workspace = buildWorkspace(brief);
  workspace.id = id("cmp_demo");
  workspace.runs = workspace.runs.map((run) => ({ ...run, campaignId: workspace.id }));
  workspaces.set(workspace.id, workspace);
  return cloneWorkspace(workspace);
}

export async function listCampaigns(): Promise<CampaignSummary[]> {
  return Array.from(workspaces.values()).map(summarize);
}

export async function getCampaign(campaignId: string) {
  return cloneWorkspace(getMutableCampaign(campaignId));
}

export async function getCampaignBootstrap(
  requestedCampaignId?: string | null,
): Promise<CampaignBootstrap> {
  const campaigns = await listCampaigns();
  const activeCampaignId =
    requestedCampaignId && workspaces.has(requestedCampaignId)
      ? requestedCampaignId
      : campaigns[0]?.id ?? null;

  return {
    campaigns,
    activeCampaignId,
    activeCampaign: activeCampaignId ? await getCampaign(activeCampaignId) : null,
  };
}

export async function updateCampaignBrief(campaignId: string, patch: BriefPatch) {
  const workspace = getMutableCampaign(campaignId);
  workspace.brief = {
    ...workspace.brief,
    ...patch,
    pillars: patch.pillars ?? workspace.brief.pillars,
    avoid: patch.avoid ?? workspace.brief.avoid,
    guardrails: patch.guardrails ?? workspace.brief.guardrails,
    brandLinks: patch.brandLinks ?? workspace.brief.brandLinks,
    socialAccounts: patch.socialAccounts ?? workspace.brief.socialAccounts,
    references: patch.references ?? workspace.brief.references,
  };
  workspace.name = workspace.brief.campaignName || "حملة عربية تجريبية";
  workspace.brandName = workspace.brief.brandName;
  workspace.updatedAt = now();
  workspace.phases.brief = phaseRecord("brief", {
    headline: workspace.brief.campaignName,
    summary: workspace.brief.goal,
    data: workspace.brief,
    generatedBy: "director",
    version: workspace.phases.brief.version + 1,
  });
  workspace.activities.unshift({
    id: id("act"),
    phase: "brief",
    actor: "director",
    kind: "decision",
    message: "تم تحديث الإيجاز محليا داخل بيانات وهمية عربية.",
    metadata: {},
    createdAt: now(),
  });
  return cloneWorkspace(workspace);
}

export async function updateSelection(campaignId: string, patch: SelectionPatch) {
  const workspace = getMutableCampaign(campaignId);
  workspace.selectedAngleId = patch.selectedAngleId ?? workspace.selectedAngleId;
  workspace.selectedVariantId = patch.selectedVariantId ?? workspace.selectedVariantId;
  workspace.updatedAt = now();
  workspace.activities.unshift({
    id: id("act"),
    phase: patch.selectedVariantId ? "draft" : "strategy",
    actor: patch.selectedVariantId ? "architect" : "strategist",
    kind: "decision",
    message: patch.selectedVariantId
      ? "تم اختيار النسخة المرشحة داخل التجربة الوهمية."
      : "تم اختيار الزاوية المرشحة داخل التجربة الوهمية.",
    metadata: { ...patch },
    createdAt: now(),
  });
  return cloneWorkspace(workspace);
}

export async function addRevisionNote(campaignId: string, input: RevisionRequest) {
  const workspace = getMutableCampaign(campaignId);
  workspace.revisions.unshift({
    id: id("rev"),
    phase: input.phase,
    note: input.note.trim(),
    status: "pending",
    createdAt: now(),
  });
  workspace.activities.unshift({
    id: id("act"),
    phase: input.phase,
    actor: "director",
    kind: "decision",
    message: "تم حفظ توجيه جديد ضمن البيانات الوهمية.",
    metadata: { note: input.note.trim() },
    createdAt: now(),
  });
  return cloneWorkspace(workspace);
}

export async function startDummyRun(campaignId: string, request: RunRequest) {
  const workspace = getMutableCampaign(campaignId);
  const runId = id("run_demo");
  workspace.status = "ready";
  workspace.activePhase = "launch";
  workspace.updatedAt = now();
  workspace.runs.unshift({
    id: runId,
    campaignId: workspace.id,
    mode: request.mode ?? "full",
    startPhase: request.startPhase,
    status: "completed",
    note: request.note?.trim() || "تشغيل وهمي مكتمل فورا",
    error: null,
    createdAt: now(-1),
    startedAt: now(-1),
    completedAt: now(),
  });
  for (const phase of PHASE_SEQUENCE) {
    workspace.phases[phase].status = "ready";
    workspace.phases[phase].version += 1;
    workspace.phases[phase].updatedAt = now();
    workspace.phases[phase].completedAt = now();
    workspace.phases[phase].staleReason = null;
    workspace.phases[phase].error = null;
  }
  workspace.activities.unshift({
    id: id("act"),
    phase: request.startPhase,
    actor: "director",
    kind: "progress",
    message: "تم تشغيل المسار باستخدام بيانات عربية وهمية بدلا من قاعدة البيانات أو نماذج الذكاء الاصطناعي.",
    metadata: { mode: request.mode ?? "full" },
    createdAt: now(),
  });
  return { runId, campaign: cloneWorkspace(workspace) };
}

export async function getActiveRun() {
  return null;
}

export async function createRunRecord(campaignId: string, request: RunRequest) {
  const result = await startDummyRun(campaignId, request);
  return result.runId;
}

export async function getRunById(runId: string): Promise<CampaignRun | null> {
  for (const workspace of workspaces.values()) {
    const run = workspace.runs.find((entry) => entry.id === runId);
    if (run) return { ...run };
  }
  return null;
}

export async function appendActivity(
  _client: unknown,
  input: {
    campaignId: string;
    runId?: string | null;
    phase: PhaseId | "system";
    actor: AgentId;
    kind: CampaignActivity["kind"];
    message: string;
    metadata?: Record<string, unknown>;
  },
) {
  const workspace = getMutableCampaign(input.campaignId);
  workspace.activities.unshift({
    id: id("act"),
    phase: input.phase,
    actor: input.actor,
    kind: input.kind,
    message: input.message,
    metadata: input.metadata ?? {},
    createdAt: now(),
  });
}

export async function setRunStarted(..._args: unknown[]) {
  void _args;
}
export async function setPhaseRunning(..._args: unknown[]) {
  void _args;
}
export async function savePhaseOutput(..._args: unknown[]) {
  void _args;
}
export async function setPhaseError(..._args: unknown[]) {
  void _args;
}
export async function setRunCompleted(..._args: unknown[]) {
  void _args;
}
export async function setRunFailed(..._args: unknown[]) {
  void _args;
}
