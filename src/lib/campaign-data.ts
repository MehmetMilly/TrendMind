import {
  AgentMeta,
  CampaignBrief,
  PhaseDef,
  PhaseId,
  PhaseStatus,
  ResearchKind,
} from "@/lib/types";

export const AGENTS: Record<string, AgentMeta> = {
  director: {
    id: "director",
    name: "المخرج",
    short: "المخرج",
    initials: "CD",
    accent: "#c8a96e",
    role: "يحافظ على إيقاع الحملة ويحوّل المخرجات إلى قرارات واضحة.",
  },
  scout: {
    id: "scout",
    name: "كاشف الإشارات",
    short: "الكاشف",
    initials: "TS",
    accent: "#b7863f",
    role: "يلتقط إشارات السوق والجمهور والمنافسين.",
  },
  strategist: {
    id: "strategist",
    name: "المخطط",
    short: "المخطط",
    initials: "BS",
    accent: "#3d7a5f",
    role: "يحوّل البحث إلى زوايا حملة قابلة للاختبار.",
  },
  architect: {
    id: "architect",
    name: "مهندس المحتوى",
    short: "المهندس",
    initials: "CA",
    accent: "#4f6e87",
    role: "يبني نسخا متعددة بدل إعلان واحد عام.",
  },
  simulator: {
    id: "simulator",
    name: "محاكي الجمهور",
    short: "المحاكي",
    initials: "AS",
    accent: "#7a6b8a",
    role: "يحاكي ردود فعل شرائح جمهور مختلفة.",
  },
  critic: {
    id: "critic",
    name: "ناقد الأداء",
    short: "الناقد",
    initials: "PC",
    accent: "#8a6a5a",
    role: "يقيس القوة والوضوح ومخاطر التحويل.",
  },
  factChecker: {
    id: "factChecker",
    name: "مدقق الحقائق",
    short: "المدقق",
    initials: "FC",
    accent: "#6b6560",
    role: "يراجع الادعاءات ويقلل مخاطر الوعود غير المدعومة.",
  },
  influencer: {
    id: "influencer",
    name: "Influencer Agent",
    short: "Influencer",
    initials: "IA",
    accent: "#3d7a5f",
    role: "يحلل المنتج والجمهور ثم يرشح المؤثرين الأعلى توافقًا مع الحملة.",
  },
  packaging: {
    id: "packaging",
    name: "Packaging Agent",
    short: "Packaging",
    initials: "PA",
    accent: "#a68b4b",
    role: "يطور اتجاه التغليف والمواد والنصوص وتكلفة الإنتاج وموجهات الموك أب.",
  },
  visual: {
    id: "visual",
    name: "المخرج البصري",
    short: "البصري",
    initials: "VD",
    accent: "#5d7688",
    role: "يحوّل الرسالة المختارة إلى اتجاه بصري قابل للإطلاق.",
  },
};

export const PHASES: PhaseDef[] = [
  { id: "brief", index: 0, label: "الإيجاز", role: "مصدر الحقيقة" },
  { id: "research", index: 1, label: "البحث", role: "الإشارات والأدلة" },
  { id: "strategy", index: 2, label: "التخطيط", role: "اختيار الزاوية" },
  { id: "draft", index: 3, label: "الصياغة", role: "توليد النسخ" },
  { id: "trial", index: 4, label: "الاختبار", role: "محاكاة الجمهور" },
  { id: "studio", index: 5, label: "الاستوديو", role: "الاتجاه البصري" },
  { id: "launch", index: 6, label: "الإطلاق", role: "حزمة الإطلاق" },
];

export const PHASE_SEQUENCE: PhaseId[] = PHASES.map((phase) => phase.id);

export const EMPTY_PHASE_STATUSES: Record<PhaseId, PhaseStatus> = {
  brief: "ready",
  research: "idle",
  strategy: "idle",
  draft: "idle",
  trial: "idle",
  studio: "idle",
  launch: "idle",
};

export const DEFAULT_BRIEF: CampaignBrief = {
  campaignName: "حملة عربية جديدة",
  brandName: "",
  productName: "",
  audience: "",
  goal: "",
  platform: "تيك توك",
  language: "العربية",
  tone: "",
  valueProposition: "",
  callToAction: "",
  pillars: [],
  avoid: [],
  guardrails: [],
  brandLinks: [],
  socialAccounts: [],
  references: [],
  context: "",
};

export const RESEARCH_KIND_META: Record<
  ResearchKind,
  { label: string; accent: string; background: string }
> = {
  trend: {
    label: "تريند",
    accent: "#a68b4b",
    background: "rgba(200,169,110,0.08)",
  },
  audience: {
    label: "جمهور",
    accent: "#3d7a5f",
    background: "rgba(61,122,95,0.08)",
  },
  competitive: {
    label: "منافسة",
    accent: "#4f6e87",
    background: "rgba(79,110,135,0.08)",
  },
  risk: {
    label: "مخاطر",
    accent: "#8a6a5a",
    background: "rgba(138,106,90,0.08)",
  },
  fact: {
    label: "حقيقة",
    accent: "#6b6560",
    background: "rgba(107,101,96,0.08)",
  },
};
