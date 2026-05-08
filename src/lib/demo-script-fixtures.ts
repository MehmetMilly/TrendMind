import type {
  CampaignBrief,
  DraftOutput,
  LaunchOutput,
  Persona,
  ResearchOutput,
  StrategyOutput,
  StudioOutput,
  TrialOutput,
  TrialReaction,
} from "@/lib/types";

export interface DemoCampaignScript {
  slug: string;
  headline: string;
  brand: string;
  product: string;
  market: string;
  platform: string;
  demoNarrative: string;
  selectedAngleId: string;
  selectedVariantId: string;
  sourceLinks: Array<{
    label: string;
    url: string;
  }>;
  brief: CampaignBrief;
  research: ResearchOutput;
  strategy: StrategyOutput;
  draft: DraftOutput;
  trial: TrialOutput;
  studio: StudioOutput;
  launch: LaunchOutput;
}

type PersonaSeed = Omit<Persona, "id">;
type ReactionSeed = Omit<TrialReaction, "id">;

function makePersonas(prefix: string, seeds: PersonaSeed[]): Persona[] {
  return seeds.map((seed, index) => ({
    id: `${prefix}_p${index + 1}`,
    ...seed,
  }));
}

function makeReactions(prefix: string, seeds: ReactionSeed[]): TrialReaction[] {
  return seeds.map((seed, index) => ({
    id: `${prefix}_r${index + 1}`,
    ...seed,
  }));
}

const atyabPersonas = makePersonas("atyab", [
  { name: "نورة", archetype: "تحب التفاصيل الأنثوية", oneLiner: "تنتبه لآخر لمسة أكثر من أي شيء", glyph: "نو", accent: "#d97d96" },
  { name: "شهد", archetype: "جمهور تيك توك واعي", oneLiner: "تنجذب للنص القريب والصادق", glyph: "شه", accent: "#b36f82" },
  { name: "أمل", archetype: "عملية لكن ذوقها عالي", oneLiner: "تبغى شيء يضبطها بسرعة", glyph: "أم", accent: "#8f6170" },
  { name: "دانة", archetype: "تحب اللمسات الناعمة", oneLiner: "تنجذب للشي المرتب من غير مبالغة", glyph: "دا", accent: "#d9a3b3" },
  { name: "روان", archetype: "تشتري بعد الإحساس", oneLiner: "إذا حسّت بالجو اشترت", glyph: "رو", accent: "#c27b92" },
  { name: "سارة", archetype: "تقارن الخيارات", oneLiner: "تدور شيء يفرق فعلًا", glyph: "سا", accent: "#9a6e7b" },
  { name: "الجوهرة", archetype: "ذوق خليجي كلاسيكي", oneLiner: "تحب الرقي من غير صخب", glyph: "جو", accent: "#aa6077" },
  { name: "مي", archetype: "تميل للبراندات الشعبية", oneLiner: "تحب الكلام الحقيقي", glyph: "مي", accent: "#cf8ca3" },
]);

const barnsPersonas = makePersonas("barns", [
  { name: "فيصل", archetype: "راعي قهوة بيت", oneLiner: "يحب القهوة اللي تضبط من أول مرة", glyph: "في", accent: "#b78452" },
  { name: "رهف", archetype: "جمهور جلسات", oneLiner: "يهمها الجو كامل أكثر من المنتج وحده", glyph: "ره", accent: "#d0a06c" },
  { name: "أبو ناصر", archetype: "ذوق سعودي كلاسيكي", oneLiner: "يعرف القهوة من ريحتها", glyph: "أن", accent: "#966437" },
  { name: "هند", archetype: "مضيفة مرتبة", oneLiner: "تهمها الخلطة اللي ما تخذلها", glyph: "هن", accent: "#c0905a" },
  { name: "عبدالله", archetype: "عملي ويكرر الشراء", oneLiner: "إذا ضبطت معه رجع لها", glyph: "عب", accent: "#8c6038" },
  { name: "سلمى", archetype: "تحب الأشياء الدافئة", oneLiner: "تنجذب للمنتج اللي له مزاج واضح", glyph: "سل", accent: "#c69b65" },
  { name: "تركي", archetype: "يشوف الإعلان بعين واقعية", oneLiner: "يبغى وصف يذكره بالطعم فعلا", glyph: "تر", accent: "#a06e43" },
  { name: "مشاعل", archetype: "تحب التفاصيل الراقية", oneLiner: "إذا كانت العلبة مرتبة والطعم مضبوط اقتنعت", glyph: "مش", accent: "#d8b27f" },
]);

const oudPersonas = makePersonas("oud", [
  { name: "راكان", archetype: "يعرف العطور العربية", oneLiner: "يلاحظ الفرق بين الهيبة والتصنع", glyph: "را", accent: "#a56a3f" },
  { name: "لجين", archetype: "تشتري الإحساس", oneLiner: "تحب العطر اللي له طابع واضح", glyph: "لج", accent: "#c78854" },
  { name: "محمد", archetype: "عملي لكنه يحب التميز", oneLiner: "يبغى اسمًا واضحًا وأثرًا محترمًا", glyph: "مح", accent: "#8d5837" },
  { name: "بدور", archetype: "تميل للفخامة الهادية", oneLiner: "تحب العطر اللي فيه عمق بدون استعراض", glyph: "بد", accent: "#b97948" },
  { name: "سعود", archetype: "جمهور براندات معروفة", oneLiner: "يشتري إذا حس أن البراند واثق من نفسه", glyph: "سع", accent: "#9b633d" },
  { name: "ريم", archetype: "تنجذب للجمل القابلة للتذكر", oneLiner: "تحب الإعلان اللي يثبت بسرعة", glyph: "ري", accent: "#d29763" },
  { name: "عبدالمجيد", archetype: "يحب العود المعاصر", oneLiner: "يبغى شيء عربي لكن مو ثقيل زيادة", glyph: "عم", accent: "#7d4f31" },
  { name: "غلا", archetype: "تشتري بالإحساس", oneLiner: "إذا لمسها الجو اشترت", glyph: "غلا", accent: "#b06f42" },
]);

export const TRENDMIND_DEMO_SCRIPTS: DemoCampaignScript[] = [
  {
    slug: "atyab-al-marshoud-khasla-al-wardi-x",
    headline: "أطياب المرشود - خصلة الوردي",
    brand: "أطياب المرشود",
    product: "خصلة الوردي",
    market: "السعودية والخليج",
    platform: "X",
    demoNarrative:
      "هذه الحملة تقرّب المنتج من الناس من غير ما تنزل من قيمة البراند. الفكرة الأساسية هي تحويل خصلة الوردي من مجرد معطر شعر إلى آخر لمسة تضبط الشكل كله.",
    selectedAngleId: "atyab_sharp",
    selectedVariantId: "atyab_sharp_v2",
    sourceLinks: [
      {
        label: "أطياب المرشود - خصلة الوردي",
        url: "https://www.atyabalmarshoud.com/ar/%D8%AE%D8%B5%D9%84%D8%A9-%D8%A7%D9%84%D9%88%D8%B1%D8%AF%D9%8A/p1104989941",
      },
    ],
    brief: {
      campaignName: "الفرق يبان في آخر لمسة",
      brandName: "أطياب المرشود",
      productName: "خصلة الوردي",
      audience:
        "نساء 20-38 في السعودية والخليج يحبون التفاصيل الأنثوية القريبة، ويبحثون عن شيء يضبط اللوك ويكمل الترتيب من غير تكلف.",
      goal:
        "رفع رغبة التجربة والشراء عبر تقديم خصلة الوردي كمنتج يومي يضيف فرقًا واضحًا وملموسًا في الشكل والإحساس.",
      platform: "X",
      language: "العربية",
      tone: "أنثوي، قريب، سعودي، مرتب",
      valueProposition:
        "معطر شعر بلمسة وردية ناعمة يضيف للشعر إحساسًا مرتبًا ويخلي اللوك كله أهدى وأكمل من غير ثقل.",
      callToAction: "خليه من أساسياتك",
      pillars: [
        "آخر لمسة أحيانًا هي اللي تضبط كل شيء",
        "الشيء اليومي إذا كان مضبوط يبان",
        "القرب من الناس أهم من الزينة اللفظية",
      ],
      avoid: [
        "المبالغة الرومانسية",
        "أي claim طبي أو علاجي",
        "اللغة المتعالية أو المصطنعة",
      ],
      guardrails: [
        "يجب أن يبقى الكلام قريبًا من البنات والواقع اليومي",
        "لا نحول المنتج إلى شعرية فارغة",
        "التركيز على الإحساس واللوك أكثر من الوصف التقني",
      ],
      brandLinks: ["https://www.atyabalmarshoud.com/ar/%D8%AE%D8%B5%D9%84%D8%A9-%D8%A7%D9%84%D9%88%D8%B1%D8%AF%D9%8A/p1104989941"],
      socialAccounts: [],
      references: ["https://www.atyabalmarshoud.com/ar/%D8%AE%D8%B5%D9%84%D8%A9-%D8%A7%D9%84%D9%88%D8%B1%D8%AF%D9%8A/p1104989941"],
      context:
        "في عرض الهاكاثون نحتاج مثالًا يثبت أن TrendMind يقدر ينتج إعلانًا قريبًا من الناس من غير ما يبدو بسيطًا أو مولدًا.",
    },
    research: {
      overview:
        "أقوى نقطة في هذا المنتج أنه قريب من روتين البنات اليومي، لكنه يحمل فرقًا محسوسًا في الشكل والإحساس. الرسالة يجب أن تبيع هذا الفرق لا أن تشرح الأنوثة بشكل عام.",
      recommendedFocus:
        "ابن الرسالة حول آخر لمسة تضبط اللوك، مع إبقاء الكلام قريبًا من البنات ولغتهم.",
      sourceSummary: [
        "الصفحة الرسمية تقدمه باسم واضح ومباشر ويرتبط بعالم العطور الأنثوي.",
        "اسم خصلة نفسه يفتح مساحة مرتبطة بالشعر واللمسة الأخيرة.",
        "الاسم الوردي يدعم بناء عالم بصري ناعم ومفهوم بسرعة.",
      ],
      items: [
        {
          id: "atyab_research_1",
          kind: "fact",
          title: "اسم المنتج نفسه يعطي زاوية إعلانية جاهزة",
          summary:
            "المنتج اسمه خصلة الوردي، وهذا يمنح الحملة لغة طبيعية مرتبطة بالشعر واللمسة الأخيرة من غير احتياج لقصة بعيدة.",
          source: "أطياب المرشود - الصفحة الرسمية",
          url: "https://www.atyabalmarshoud.com/ar/%D8%AE%D8%B5%D9%84%D8%A9-%D8%A7%D9%84%D9%88%D8%B1%D8%AF%D9%8A/p1104989941",
          confidence: 93,
          by: "factChecker",
          tags: ["اسم المنتج", "هوية", "مصدر رسمي"],
        },
        {
          id: "atyab_research_2",
          kind: "audience",
          title: "هذا النوع من المنتجات ينجح إذا حسّ الناس أنه يدخل يومهم بسهولة",
          summary:
            "الجمهور لا يبحث هنا عن عطر معقد بقدر ما يبحث عن شيء يضبط شكله بسرعة ويعطيه إحساس ترتيب واضح.",
          source: "TrendMind audience synthesis",
          confidence: 88,
          by: "strategist",
          tags: ["روتين يومي", "سهولة", "شراء سريع"],
        },
        {
          id: "atyab_research_3",
          kind: "competitive",
          title: "السوق مليان وعود عامة عن الأنوثة والجاذبية",
          summary:
            "إذا كررنا لغة الجاذبية العامة سنضيع داخل الزحمة. الأفضل ربط المنتج بلحظة بسيطة: آخر لمسة تخلّي كل شيء بمكانه.",
          source: "TrendMind category read",
          confidence: 86,
          by: "scout",
          tags: ["تمييز", "صياغة", "ازدحام السوق"],
        },
        {
          id: "atyab_research_4",
          kind: "trend",
          title: "الإعلانات القوية في الجمال اليوم تبدأ بالمشهد ثم تشرح الفرق",
          summary:
            "الهوك الأفضل هو جملة تمسك الإحساس بسرعة، ثم body يذكر شيئًا يراه الناس في أنفسهم فعلًا.",
          source: "TrendMind ad pattern synthesis",
          confidence: 84,
          by: "scout",
          tags: ["نمط إعلان", "مباشرة", "قرب"],
        },
        {
          id: "atyab_research_5",
          kind: "risk",
          title: "أي مبالغة في الرقة ستجعل النص يبدو مولدًا",
          summary:
            "المنتج أنثوي بطبيعته، لذلك لسنا بحاجة لمضاعفة الأنوثة لغويًا. يكفي نص مرتب وقريب حتى يظهر الفرق.",
          source: "TrendMind critic pass",
          confidence: 91,
          by: "critic",
          tags: ["مخاطر", "AI tone", "مبالغة"],
        },
        {
          id: "atyab_research_6",
          kind: "audience",
          title: "الجمهور يشتري هذا النوع بالانطباع أكثر من المنطق",
          summary:
            "قرار الشراء هنا شعوري في المقام الأول. إذا أحسسنا المتلقي أن المنتج يضبط شكلها بدون تكلف، نقترب جدًا من نية الشراء.",
          source: "TrendMind purchase logic",
          confidence: 87,
          by: "strategist",
          tags: ["نية الشراء", "إحساس", "لوك"],
        },
      ],
    },
    strategy: {
      campaignThesis:
        "حين يكون المنتج صغيرًا في حجمه وكبيرًا في الفرق الذي يتركه، يجب أن نبيعه كلقطة تضبط الشكل لا كشرح طويل عن العطر.",
      messageDirection:
        "نقدّم خصلة الوردي بوصفه آخر لمسة تضبط اللوك وتعطي الشعر إحساسًا مرتبًا وناعمًا من غير مبالغة.",
      positioningLogic:
        "بدل أن نقول إنه منتج جميل فقط، نقول إنه الفرق البسيط الذي يبان إذا كان موجود ويبان أكثر إذا غاب.",
      toneDirection:
        "لغة قريبة، سعودية، أنثوية، غير متفاصحة. لازم تبدو كأن البراند يعرف جمهوره فعلًا.",
      strategicConstraints: [
        "لا نكتب كلامًا غائمًا عن السحر والجاذبية",
        "لا نحمّل المنتج أكثر مما يحتمل",
        "يجب أن تبقى الصياغة صالحة للنشر فورًا",
      ],
      angles: [
        {
          id: "atyab_safe",
          lane: "safe",
          letter: "A",
          title: "لمسة يومية مرتبة",
          thesis: "المنتج هنا جزء من الروتين اليومي ويعطي إحساسًا مرتبًا وناعمًا.",
          stance: "مطمئن",
          promise: "شيء سهل الاستخدام ويعطي فرقًا واضحًا في شكلك اليومي.",
          hook: "اللمسة الصغيرة تفرق.",
          rationale: ["قريب من الاستخدام الفعلي", "سهل الفهم", "مناسب للديمو السريع"],
          risks: ["قد يبدو عامًا إذا لم نحسن الصياغة", "أقل تميزًا من الزاوية الأعمق"],
          fit: "يناسب جمهور الروتين اليومي والشراء العملي.",
          tone: "مرتب وقريب",
          score: 84,
        },
        {
          id: "atyab_sharp",
          lane: "sharp",
          letter: "B",
          title: "الفرق يبان في آخر لمسة",
          thesis: "خصلة الوردي ليس فقط ريحة للشعر، بل اللمسة الأخيرة التي ترفع شكل اليوم كله.",
          stance: "واثق وقريب",
          promise: "إحساس مرتب وناعم يبان من غير ما يبدو متصنعًا.",
          hook: "في أشياء بسيطة، لكن إذا غابت يبان الفرق.",
          rationale: ["أقرب للناس", "يحوّل المنتج إلى فرق واضح", "مناسب جدًا للعامية السعودية"],
          risks: ["يحتاج ضبطًا حتى يبقى راقيًا", "أي مبالغة ستجعله يبدو مصطنعًا"],
          fit: "الأقوى للمنصات الاجتماعية والجمهور الشعبي الواعي بالجمال.",
          tone: "سعودي أنيق",
          score: 94,
        },
        {
          id: "atyab_viral",
          lane: "viral",
          letter: "C",
          title: "الشيء اللي يضبطك",
          thesis: "نبيع المنتج على فكرة أنه يصير ثابتًا في الروتين لأنه يفرق فعلًا.",
          stance: "ملفت",
          promise: "شيء صغير لكن يرجع له الناس لأنهم يحسون بغيابه.",
          hook: "بعض الأشياء ما تحسين بقيمتها إلا إذا غابت.",
          rationale: ["قابل للانتشار", "يمسك الإحساس بسرعة", "قريب من الواقع"],
          risks: ["أقل مباشرة", "يحتاج صورة تدعمه"],
          fit: "جيد للقصير والستوري.",
          tone: "مختصر",
          score: 80,
        },
      ],
      recommendedAngleId: "atyab_sharp",
      decisionFrame:
        "الزاوية الفائزة هي التي تجمع القرب من الناس مع إحساس حقيقي بالفرق، من دون جمل محفوظة أو زينة زائدة.",
    },
    draft: {
      summary:
        "أفضل المسودات كانت التي تتكلم عن اللوك والفرق، لا عن الرائحة وحدها. هذا جعل المنتج أقرب للحياة اليومية وأبعد عن كليشيهات العطور النسائية.",
      atoms: [
        { id: "atyab_safe_hook_1", angleId: "atyab_safe", kind: "hook", text: "اللمسة الصغيرة تفرق." },
        { id: "atyab_safe_body_1", angleId: "atyab_safe", kind: "body", text: "خصلة الوردي من أطياب المرشود يضيف للشعر لمسة مرتبة وناعمة تخلي الشكل كله أهدى وأكمل." },
        { id: "atyab_safe_cta_1", angleId: "atyab_safe", kind: "cta", text: "جرّبيه في يومك." },
        { id: "atyab_sharp_hook_1", angleId: "atyab_sharp", kind: "hook", text: "في أشياء بسيطة، لكن إذا غابت يبان الفرق." },
        { id: "atyab_sharp_body_1", angleId: "atyab_sharp", kind: "body", text: "خصلة الوردي من أطياب المرشود يعطي الشعر لمسة وردية ناعمة تخلي اللوك كله أرتب وأهدى من غير ما تكون ثقيلة." },
        { id: "atyab_sharp_body_2", angleId: "atyab_sharp", kind: "body", text: "ريحته قريبة وحلوة، وتضيف للشعر آخر لمسة تحسسك أن كل شيء بمكانه." },
        { id: "atyab_sharp_cta_1", angleId: "atyab_sharp", kind: "cta", text: "خليه من أساسياتك." },
        { id: "atyab_viral_hook_1", angleId: "atyab_viral", kind: "hook", text: "بعض الأشياء ما تحسين بقيمتها إلا إذا غابت." },
        { id: "atyab_viral_body_1", angleId: "atyab_viral", kind: "body", text: "وخصلة الوردي من الأشياء اللي تضبطك بصمت، لكن فرقها يبان." },
        { id: "atyab_viral_cta_1", angleId: "atyab_viral", kind: "cta", text: "جرّبيه وخليه ثابتًا عندك." },
      ],
      variants: [
        {
          id: "atyab_safe_v1",
          angleId: "atyab_safe",
          name: "A1 - يومي ومرتب",
          hookId: "atyab_safe_hook_1",
          bodyId: "atyab_safe_body_1",
          ctaId: "atyab_safe_cta_1",
          tone: "هادئ",
          length: "medium",
          score: 83,
          critique: [
            { agent: "critic", note: "مريح وواضح لكنه أقل تميزًا." },
            { agent: "strategist", note: "يناسب جمهور الاستخدام اليومي." },
          ],
          fullText:
            "اللمسة الصغيرة تفرق.\n\nخصلة الوردي من أطياب المرشود يضيف للشعر لمسة مرتبة وناعمة تخلي الشكل كله أهدى وأكمل.\n\nجرّبيه في يومك.",
        },
        {
          id: "atyab_sharp_v1",
          angleId: "atyab_sharp",
          name: "B1 - لوك مرتب",
          hookId: "atyab_sharp_hook_1",
          bodyId: "atyab_sharp_body_1",
          ctaId: "atyab_sharp_cta_1",
          tone: "قريب",
          length: "medium",
          score: 92,
          critique: [
            { agent: "critic", note: "قريب جدًا من الناس ويحافظ على الذوق." },
            { agent: "scout", note: "سهل التخيل كسطر إعلان على X." },
          ],
          fullText:
            "في أشياء بسيطة، لكن إذا غابت يبان الفرق.\n\nخصلة الوردي من أطياب المرشود يعطي الشعر لمسة وردية ناعمة تخلي اللوك كله أرتب وأهدى من غير ما تكون ثقيلة.\n\nخليه من أساسياتك.",
        },
        {
          id: "atyab_sharp_v2",
          angleId: "atyab_sharp",
          name: "B2 - آخر لمسة",
          hookId: "atyab_sharp_hook_1",
          bodyId: "atyab_sharp_body_2",
          ctaId: "atyab_sharp_cta_1",
          tone: "أنثوي سعودي",
          length: "medium",
          score: 95,
          critique: [
            { agent: "critic", note: "هذه النسخة الأكثر قربًا والأقل افتعالًا." },
            { agent: "strategist", note: "تحول المنتج إلى تفصيلة لا تنسى." },
          ],
          fullText:
            "في أشياء بسيطة، لكن إذا غابت يبان الفرق.\n\nريحته قريبة وحلوة، وتضيف للشعر آخر لمسة تحسسك أن كل شيء بمكانه.\n\nخليه من أساسياتك.",
        },
        {
          id: "atyab_viral_v1",
          angleId: "atyab_viral",
          name: "C1 - إذا غاب",
          hookId: "atyab_viral_hook_1",
          bodyId: "atyab_viral_body_1",
          ctaId: "atyab_viral_cta_1",
          tone: "ملفت",
          length: "short",
          score: 79,
          critique: [
            { agent: "critic", note: "لطيف لكنه أقل رسوخًا من B2." },
            { agent: "scout", note: "يعمل أكثر مع صورة قوية." },
          ],
          fullText:
            "بعض الأشياء ما تحسين بقيمتها إلا إذا غابت.\n\nوخصلة الوردي من الأشياء اللي تضبطك بصمت، لكن فرقها يبان.\n\nجرّبيه وخليه ثابتًا عندك.",
        },
      ],
      recommendedVariantId: "atyab_sharp_v2",
    },
    trial: {
      summary:
        "الاختبار أوضح أن الناس أحبوا النسخ التي تبيع الفرق في الشكل والإحساس، لا النسخ التي تشرح الأنوثة بشكل عام. B2 فازت لأنها أقرب وأصدق.",
      personas: atyabPersonas,
      reactions: makeReactions("atyab", [
        { personaId: "atyab_p1", variantId: "atyab_safe_v1", sentiment: "warm", quote: "حلوة ومرتبة، بس عادية شوي.", why: "واضحة لكنها ما علقت كثير.", subScores: { clarity: 88, resonance: 75, intent: 76 } },
        { personaId: "atyab_p2", variantId: "atyab_safe_v1", sentiment: "warm", quote: "مناسبة، لكن أبي شيء أحسّه أقرب لي.", why: "تبحث عن صوت أشد قربًا.", subScores: { clarity: 87, resonance: 77, intent: 75 } },
        { personaId: "atyab_p3", variantId: "atyab_sharp_v1", sentiment: "love", quote: "هذا فعلا كلام أحسني أقوله.", why: "لغة قريبة جدًا من الواقع.", subScores: { clarity: 90, resonance: 91, intent: 89 } },
        { personaId: "atyab_p4", variantId: "atyab_sharp_v2", sentiment: "love", quote: "آخر لمسة تحسسك أن كل شيء بمكانه ممتازة.", why: "جملة بشرية جدًا.", subScores: { clarity: 93, resonance: 96, intent: 92 } },
        { personaId: "atyab_p5", variantId: "atyab_sharp_v2", sentiment: "love", quote: "النسخة هذه تبيعني الإحساس مو المنتج بس.", why: "تخلق رغبة من غير شرح زائد.", subScores: { clarity: 91, resonance: 95, intent: 93 } },
        { personaId: "atyab_p6", variantId: "atyab_sharp_v2", sentiment: "love", quote: "هذه قابلة للنشر مباشرة.", why: "واضحة وسهلة الاقتباس.", subScores: { clarity: 92, resonance: 90, intent: 91 } },
        { personaId: "atyab_p7", variantId: "atyab_viral_v1", sentiment: "neutral", quote: "مو سيئة، بس محتاجة صورة قوية.", why: "الفكرة جيدة لكنها أقل اكتمالًا.", subScores: { clarity: 82, resonance: 68, intent: 67 } },
        { personaId: "atyab_p8", variantId: "atyab_sharp_v2", sentiment: "love", quote: "أخيرًا إعلان ما يحسسني أنه AI.", why: "النبرة بشرية جدًا.", subScores: { clarity: 94, resonance: 97, intent: 92 } },
      ]),
      scoreboard: [
        { variantId: "atyab_safe_v1", angleId: "atyab_safe", average: 79, resonance: 76, risk: 18, verdict: "مرتب لكنه أقرب للعام." },
        { variantId: "atyab_sharp_v1", angleId: "atyab_sharp", average: 90, resonance: 91, risk: 12, verdict: "قوي وقريب." },
        { variantId: "atyab_sharp_v2", angleId: "atyab_sharp", average: 94, resonance: 95, risk: 10, verdict: "الفائزة. أقرب نسخة للناس وأجملها." },
        { variantId: "atyab_viral_v1", angleId: "atyab_viral", average: 72, resonance: 69, risk: 24, verdict: "مقبولة لكنها تحتاج دعما بصريا أكبر." },
      ],
      angleWinners: [
        { angleId: "atyab_safe", variantId: "atyab_safe_v1", average: 79, verdict: "أفضل خيار محافظ." },
        { angleId: "atyab_sharp", variantId: "atyab_sharp_v2", average: 94, verdict: "المسار الفائز بوضوح." },
        { angleId: "atyab_viral", variantId: "atyab_viral_v1", average: 72, verdict: "الأفضل في المسار السريع." },
      ],
      winningVariantId: "atyab_sharp_v2",
      recommendedEdits: [
        "الإبقاء على الجمل القصيرة والواضحة لأنها سر الفوز هنا.",
        "عدم المبالغة في وصف الورد أو الأنوثة.",
        "التركيز على آخر لمسة كفكرة مركزية.",
      ],
      responseRisks: [
        "أي رجوع إلى الفصحى الثقيلة سيكسر القرب.",
        "كثرة الوصف العاطفي ستعيد النص إلى منطقة الإعلانات المتشابهة.",
      ],
      audienceSummary: [
        "الجمهور أحب الإعلانات التي تبدو كلامًا فعليًا.",
        "الفرق بين الجيد والممتاز هنا كان في النبرة أكثر من الفكرة.",
        "النسخ التي تتكلم عن اللوك والفرق كانت الأعلى.",
      ],
    },
    studio: {
      summary:
        "الاتجاه البصري يجب أن يكون ناعمًا وقريبًا، كأنه لقطة من روتين حقيقي لكن بمستوى إخراج فاخر.",
      selectedVariantId: "atyab_sharp_v2",
      imagePrompt:
        "Premium Arabic beauty campaign for Atyab Al Marshoud Khasla Al Wardi, feminine Saudi-Gulf mood, soft pink hair perfume styling, close-up of glossy healthy hair with one elegant highlighted strand, warm daylight, rose-toned reflections, intimate beauty editorial, realistic hair texture, no heavy retouching, clean negative space for Arabic headline, modern and soft.",
      composition:
        "لقطة قريبة للشعر مع خصلة بارزة وعبوة المنتج ظاهرة بشكل أنيق. الخلفية فاتحة ودافئة. المساحة النصية تكون واضحة من غير زحمة.",
      palette: ["Dusty Rose", "Soft Blush", "Warm Beige", "Cream", "Muted Berry"],
      typography: ["Display عربي ناعم", "Sans عربي واضح وقريب"],
      layers: [
        { id: "atyab_layer_bg", kind: "background", name: "خلفية وردية هادئة", note: "تدعم المنتج من غير مبالغة." },
        { id: "atyab_layer_subject", kind: "subject", name: "الشعر والعبوة", note: "الشعر هو البطل البصري." },
        { id: "atyab_layer_headline", kind: "headline", name: "عنوان قصير", note: "يوضع بخط واضح وهادئ." },
        { id: "atyab_layer_logo", kind: "logo", name: "شعار البراند", note: "صغير وواثق." },
      ],
      formats: [
        { id: "atyab_x", name: "X Post", ratio: "4:5", size: "1600x2000", layoutNote: "مثالي للعنوان والجسم المختصر." },
        { id: "atyab_story", name: "Story", ratio: "9:16", size: "1080x1920", layoutNote: "يركز على الشعر والعبوة." },
      ],
      assetChecklist: [
        "صورة شعر حقيقية غير مبالغ في تنعيمها",
        "عبوة المنتج بوضوح كاف",
        "مساحة نصية بيضاء أو فاتحة",
        "ألوان قريبة من الوردي الناعم لا الفوشي الصاخب",
      ],
    },
    launch: {
      summary:
        "النسخة النهائية تبيع المنتج كلقطة تكمّل الشكل لا ككلام كبير عن الأنوثة. هذا خلاها أقرب وأصدق.",
      winningAngleId: "atyab_sharp",
      winningVariantId: "atyab_sharp_v2",
      finalCaption:
        "في أشياء بسيطة، لكن إذا غابت يبان الفرق.\n\nخصلة الوردي من أطياب المرشود يعطي الشعر لمسة وردية ناعمة تخلي اللوك كله أرتب وأهدى. ريحته قريبة وحلوة، وتعطيك إحساس مرتب من غير ما تكون ثقيلة أو مبالغ فيها.\n\nخليه من أساسياتك إذا تحبين اللمسة اللي تضبط كل شيء.",
      alternates: [
        "آخر لمسة أحيانًا هي اللي تضبط كل شيء.",
        "إذا تحبين اللوك المرتب من غير تكلف، خصلة الوردي له مكان ثابت.",
        "لمسة ناعمة على الشعر تفرق أكثر مما تتوقعين.",
      ],
      responsePlan: [
        { scenario: "سؤال عن الاستخدام", response: "الفكرة هنا مبنية على أنه جزء من الروتين، لذلك ركزنا على الفرق اللي يبان في الشكل والإحساس.", tone: "مفيد وقريب" },
        { scenario: "تعليق على النبرة", response: "تعمدنا نخلي النص قريب من البنات والواقع، لأن المنتج نفسه يعيش في التفاصيل اليومية.", tone: "واثق" },
      ],
      riskNotes: [
        "لا نضيف جمل مبالغ فيها أثناء النشر.",
        "الصورة يجب أن تبقى طبيعية حتى لا يتعارض الإخراج مع قرب النص.",
      ],
      launchChecklist: [
        "اعتماد العنوان القصير كما هو",
        "تجنب الإيموجي",
        "تثبيت صورة شعر واضحة",
        "استخدام نسخة X المختصرة إذا كان السياق سريعًا",
      ],
      packages: [
        { id: "atyab_pkg_1", name: "X Main", ratio: "4:5", headline: "الفرق يبان في آخر لمسة", caption: "في أشياء بسيطة، لكن إذا غابت يبان الفرق.", cta: "جرّبيه الآن", visualCue: "شعر وعبوة بإضاءة وردية ناعمة" },
        { id: "atyab_pkg_2", name: "Story", ratio: "9:16", headline: "آخر لمسة تضبطك", caption: "لمسة ناعمة تفرق من أول طلعة.", cta: "اسحبي للأعلى", visualCue: "قرب أعلى على خصلة الشعر" },
        { id: "atyab_pkg_3", name: "Quote Post", ratio: "1:1", headline: "إذا غابت يبان الفرق", caption: "خصلة الوردي من أساسياتك.", cta: "اكتشفيه", visualCue: "خلفية بسيطة مع العبوة" },
      ],
      nextSteps: [
        "تجهيز نسخة أقصر للستوري",
        "اختبار صورتين: لقطة شعر فقط ولقطة شعر مع وجه جزئي",
        "الحفاظ على التعليقات الأولى بنفس النبرة القريبة",
      ],
    },
  },
  {
    slug: "barns-saudi-coffee-golden-blend-x",
    headline: "بارنز - قهوه سعودية خلطة ذهبية",
    brand: "بارنز",
    product: "قهوه سعودية - خلطة ذهبية (علبة معدنية)",
    market: "السعودية والخليج",
    platform: "X",
    demoNarrative:
      "هذه الحملة تكسر تكرار العطور وتعطي الديمو مثالًا أقرب للبيت والجمعات. القوة هنا في بيع الجو والطعم والضيافة بلغة قريبة، لا في وصف منتج بشكل جامد.",
    selectedAngleId: "barns_sharp",
    selectedVariantId: "barns_sharp_v2",
    sourceLinks: [
      {
        label: "بارنز - قهوه سعودية خلطة ذهبية",
        url: "https://barns.com.sa/ar/store/product/%D9%82%D9%87%D9%88%D8%A9-%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-%D9%85%D8%B9-%D8%A7%D9%84%D9%87%D9%8A%D9%84-%D8%B9%D9%84%D8%A8-%D9%85%D8%B9%D8%AF%D9%86%D9%8A%D9%87",
      },
      {
        label: "بارنز - من نحن",
        url: "https://barns.com.sa/ar/about-us",
      },
    ],
    brief: {
      campaignName: "الضيافة تضبط من الخلطة",
      brandName: "بارنز",
      productName: "قهوه سعودية - خلطة ذهبية (علبة معدنية)",
      audience:
        "رجال ونساء 24-45 في السعودية يحبون القهوة السعودية في البيت والجلسات، ويبحثون عن خلطة مضمونة تعطيهم طعمًا مرتبًا من أول فنجال.",
      goal:
        "رفع رغبة الشراء عبر تقديم الخلطة كخيار جاهز ومضبوط للبيت والجمعات، مع إبراز الطعم والهيل والطابع السعودي بشكل قريب وعملي.",
      platform: "X",
      language: "العربية",
      tone: "دافئ، سعودي، قريب، مرتب",
      valueProposition:
        "قهوة سعودية محمصة بعناية بخلطتها الذهبية مع الهيل في علبة معدنية أنيقة تحفظ الطزاجة وتسهّل عليك فنجالًا يضبط من أول مرة.",
      callToAction: "خل الفنجال الجاي من بارنز",
      pillars: [
        "الخلطة المضبوطة توفر عليك كثير",
        "الضيافة تبدأ من أول ريحة تطلع من الدلة",
        "القهوة السعودية الجيدة تبان من أول رشفة",
      ],
      avoid: [
        "المبالغة التراثية",
        "الوصف الفخم الفارغ",
        "أي نبرة بعيدة عن البيت والجمعات",
      ],
      guardrails: [
        "ذكر عناصر ملموسة مثل الهيل والتحميص والعلبة",
        "ربط المنتج بلحظات فعلية لا مجرد شعارات",
        "الحفاظ على نبرة قريبة من أهل القهوة في السعودية",
      ],
      brandLinks: ["https://barns.com.sa/ar/store/product/%D9%82%D9%87%D9%88%D8%A9-%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-%D9%85%D8%B9-%D8%A7%D9%84%D9%87%D9%8A%D9%84-%D8%B9%D9%84%D8%A8-%D9%85%D8%B9%D8%AF%D9%86%D9%8A%D9%87"],
      socialAccounts: [],
      references: [
        "https://barns.com.sa/ar/store/product/%D9%82%D9%87%D9%88%D8%A9-%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-%D9%85%D8%B9-%D8%A7%D9%84%D9%87%D9%8A%D9%84-%D8%B9%D9%84%D8%A8-%D9%85%D8%B9%D8%AF%D9%86%D9%8A%D9%87",
        "https://barns.com.sa/ar/about-us",
      ],
      context:
        "هذه الحملة مهمة للديمو لأنها تثبت أن TrendMind لا يشتغل فقط على العطور والجمال، بل يقدر يطلع إعلانًا غذائيًا أو منزليًا بنفس القوة والذكاء.",
    },
    research: {
      overview:
        "المنتج هنا ينجح إذا جعلنا الناس تتخيل الفنجال فعلًا. الكلام الأقوى في القهوة ليس كلمة أصالة وحدها، بل الخلطة المضبوطة والطعم الذي يضبط من أول مرة.",
      recommendedFocus:
        "ابن الإعلان على مشهد البيت والجمعات والريحة الأولى، مع استخدام تفاصيل فعلية من الصفحة مثل الهيل والخلطة الذهبية والعلبة المعدنية.",
      sourceSummary: [
        "الصفحة الرسمية تذكر أنها قهوة سعودية فاخرة محمصة بعناية بخلطتها الذهبية مع الهيل.",
        "تؤكد الصفحة أن العلبة المعدنية تحافظ على الطزاجة والنكهة.",
        "صفحة من نحن تربط بارنز بعلاقة طويلة مع القهوة في المملكة وتجربة لا تنسى.",
      ],
      items: [
        {
          id: "barns_research_1",
          kind: "fact",
          title: "التفصيل الأقوى هو الخلطة الذهبية مع الهيل",
          summary:
            "هذا ليس بنًا عامًا. الصفحة الرسمية تضع الخلطة الذهبية والهيل في صلب القيمة، وهذا يعطي الإعلان نقطة بيع واضحة وسهلة الفهم.",
          source: "بارنز - صفحة المنتج",
          url: "https://barns.com.sa/ar/store/product/%D9%82%D9%87%D9%88%D8%A9-%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-%D9%85%D8%B9-%D8%A7%D9%84%D9%87%D9%8A%D9%84-%D8%B9%D9%84%D8%A8-%D9%85%D8%B9%D8%AF%D9%86%D9%8A%D9%87",
          confidence: 95,
          by: "factChecker",
          tags: ["هيل", "خلطة", "مصدر رسمي"],
        },
        {
          id: "barns_research_2",
          kind: "fact",
          title: "العلبة المعدنية ليست شكلًا فقط",
          summary:
            "الصفحة تذكر أن العبوة المحكمة الإغلاق تحفظ الطزاجة والنكهة فترة أطول، لذلك يمكن استخدامها كبرهان عملي داخل الإعلان لا كإكسسوار بصري فقط.",
          source: "بارنز - صفحة المنتج",
          url: "https://barns.com.sa/ar/store/product/%D9%82%D9%87%D9%88%D8%A9-%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-%D9%85%D8%B9-%D8%A7%D9%84%D9%87%D9%8A%D9%84-%D8%B9%D9%84%D8%A8-%D9%85%D8%B9%D8%AF%D9%86%D9%8A%D9%87",
          confidence: 92,
          by: "factChecker",
          tags: ["عبوة", "طزاجة", "فائدة عملية"],
        },
        {
          id: "barns_research_3",
          kind: "audience",
          title: "جمهور القهوة السعودية يشتري الطمأنينة بقدر ما يشتري الطعم",
          summary:
            "جزء كبير من قرار الشراء هنا هو أن الخلطة تضبط، لا أن يفاجأ بها. لذلك الإعلان الأفضل يبيع الثقة والنتيجة المضمونة، لا المغامرة.",
          source: "TrendMind audience synthesis",
          confidence: 89,
          by: "strategist",
          tags: ["ثقة", "شراء متكرر", "نتيجة مضمونة"],
        },
        {
          id: "barns_research_4",
          kind: "trend",
          title: "الإعلانات الأقوى في الأغذية والمشروبات تبدأ بلقطة حسية ثم تعطي سببًا للشراء",
          summary:
            "الهوك القوي هنا ليس وصفًا ثقافيًا عامًا، بل شيء يشبه أول ريحة تطلع من الدلة أو أول رشفة تضبط مزاجك، ثم يأتي البرهان العملي.",
          source: "TrendMind ad pattern synthesis",
          confidence: 84,
          by: "scout",
          tags: ["حسي", "إقناع", "أسلوب إعلان"],
        },
        {
          id: "barns_research_5",
          kind: "risk",
          title: "الخطر الأكبر هو الوقوع في خطاب الضيافة العام",
          summary:
            "إذا اكتفينا بكلمات مثل الكرم والأصالة، سيبدو الإعلان مثل عشرات الإعلانات الأخرى. الفرق الحقيقي في الخلطة والطعم وسهولة الاعتماد عليها.",
          source: "TrendMind critic pass",
          confidence: 91,
          by: "critic",
          tags: ["مخاطر", "تكرار", "خطاب عام"],
        },
        {
          id: "barns_research_6",
          kind: "fact",
          title: "بارنز يربط نفسه بتجربة قهوة ثابتة ومعروفة في المملكة",
          summary:
            "صفحة من نحن تتكلم عن تجربة قهوة مميزة وطعم لا ينسى عبر المملكة، وهذا يدعم كتابة إعلان يتكلم بثقة عن الاعتمادية لا الادعاء.",
          source: "بارنز - من نحن",
          url: "https://barns.com.sa/ar/about-us",
          confidence: 87,
          by: "scout",
          tags: ["ثقة البراند", "خبرة", "سياق سعودي"],
        },
      ],
    },
    strategy: {
      campaignThesis:
        "القهوة السعودية القوية لا تُباع بالنوستالجيا وحدها، بل بإحساس فنجال مضبوط وخلطة ترجع لها مرة ثانية.",
      messageDirection:
        "نكتب إعلانًا يجعل الناس تشم الهيل وتتخيل الفنجال، ثم نعطيهم سببًا عمليًا للشراء: الخلطة، التحميص، والعلبة.",
      positioningLogic:
        "بدل أن نبيع المنتج كرمز عام للضيافة، نبيعه كخلطة تعتمد عليها في البيت والجمعات وتطلع باسمها من أول مرة.",
      toneDirection:
        "لغة سعودية قريبة ودافئة. لازم تبدو كأنها طالعة من ناس يشربون القهوة فعلًا.",
      strategicConstraints: [
        "عدم المبالغة التراثية",
        "التركيز على تفاصيل حقيقية من المنتج",
        "الابتعاد عن الجمل التي تصلح لأي قهوة",
      ],
      angles: [
        {
          id: "barns_safe",
          lane: "safe",
          letter: "A",
          title: "فنجال يضبط من أول مرة",
          thesis: "نقدّم المنتج كقهوة جاهزة الاعتماد تعطي نتيجة مرتبة ومضمونة.",
          stance: "مطمئن",
          promise: "قهوة سعودية مضبوطة للبيت والجلسات.",
          hook: "بعض الخلطات ترتاح لها من أول فنجال.",
          rationale: ["واضح", "عملي", "قريب من قرار الشراء"],
          risks: ["أقل تميزًا", "يحتاج صورة قوية"],
          fit: "مناسب للجمهور العملي.",
          tone: "مباشر",
          score: 85,
        },
        {
          id: "barns_sharp",
          lane: "sharp",
          letter: "B",
          title: "الضيافة تضبط من الخلطة",
          thesis: "المنتج هنا ليس مجرد قهوة، بل الخلطة التي تجعل الجلسة كلها أرتب من أول ريحة.",
          stance: "دافئ وواثق",
          promise: "طعم سعودي مرتب يبان من أول رشفة.",
          hook: "مو كل قهوة سعودية تضبط من أول فنجال.",
          rationale: ["حسي", "محدد", "بعيد عن العموميات"],
          risks: ["يحتاج body أطول ومتوازن"],
          fit: "الأفضل للديمو والنشر الفعلي.",
          tone: "سعودي دافئ",
          score: 95,
        },
        {
          id: "barns_viral",
          lane: "viral",
          letter: "C",
          title: "ريحة الدلة تكفي",
          thesis: "نركّز على الريحة الأولى كمدخل سريع وقابل للتذكر.",
          stance: "ملفت",
          promise: "قهوة تعرف نفسها من أول ريحة.",
          hook: "أحيانًا أول ريحة تكفي.",
          rationale: ["حسي وسريع", "قابل للاقتباس", "سهل بصريًا"],
          risks: ["قد يكون عامًا إذا لم يدعمه النص"],
          fit: "جيد للبوستات المختصرة.",
          tone: "مقتضب",
          score: 80,
        },
      ],
      recommendedAngleId: "barns_sharp",
      decisionFrame:
        "النسخة الفائزة هي التي تجعل الناس تتخيل الفنجال فعلًا، وفي الوقت نفسه تعطيهم سببًا منطقيًا للشراء والاعتماد عليها.",
    },
    draft: {
      summary:
        "المسار الأفضل بدأ بمشهد حسي واضح ثم دعم نفسه بتفاصيل حقيقية عن الخلطة والهيل والعلبة. هذا جعله أقرب لإعلان يُنشر فعلًا.",
      atoms: [
        { id: "barns_safe_hook_1", angleId: "barns_safe", kind: "hook", text: "بعض الخلطات ترتاح لها من أول فنجال." },
        { id: "barns_safe_body_1", angleId: "barns_safe", kind: "body", text: "قهوه سعودية - خلطة ذهبية من بارنز تعطيك فنجالًا مرتبًا بطعم متوازن يناسب البيت والجلسات." },
        { id: "barns_safe_cta_1", angleId: "barns_safe", kind: "cta", text: "خلها قهوتك الجاهزة." },
        { id: "barns_sharp_hook_1", angleId: "barns_sharp", kind: "hook", text: "مو كل قهوة سعودية تضبط من أول فنجال." },
        { id: "barns_sharp_body_1", angleId: "barns_sharp", kind: "body", text: "قهوه سعودية - خلطة ذهبية من بارنز محمصة بعناية وفيها هيل واضح بطعم متوازن، لذلك تعطيك فنجالًا يشرح نفسه من أول رشفة." },
        { id: "barns_sharp_body_2", angleId: "barns_sharp", kind: "body", text: "مناسبة للبيت والجمعات، وعلبتها المعدنية تحفظ النكهة والطزاجة، فتصير من الخلطات اللي ترجع لها وأنت مرتاح." },
        { id: "barns_sharp_cta_1", angleId: "barns_sharp", kind: "cta", text: "إذا ودك بفنجال يطلع باسمك، هذه خلطة ترجع لها." },
        { id: "barns_viral_hook_1", angleId: "barns_viral", kind: "hook", text: "أحيانًا أول ريحة تكفي." },
        { id: "barns_viral_body_1", angleId: "barns_viral", kind: "body", text: "ومع الخلطة الذهبية من بارنز، الهيل يسبقك والباقي يكمله الفنجال." },
        { id: "barns_viral_cta_1", angleId: "barns_viral", kind: "cta", text: "جرّبها في الجلسة الجاية." },
      ],
      variants: [
        {
          id: "barns_safe_v1",
          angleId: "barns_safe",
          name: "A1 - خلطة مضمونة",
          hookId: "barns_safe_hook_1",
          bodyId: "barns_safe_body_1",
          ctaId: "barns_safe_cta_1",
          tone: "عملي",
          length: "medium",
          score: 84,
          critique: [
            { agent: "strategist", note: "واضحة وتؤدي الغرض لكنها ليست الأجمل." },
            { agent: "critic", note: "مناسبة كنسخة محافظة." },
          ],
          fullText:
            "بعض الخلطات ترتاح لها من أول فنجال.\n\nقهوه سعودية - خلطة ذهبية من بارنز تعطيك فنجالًا مرتبًا بطعم متوازن يناسب البيت والجلسات.\n\nخلها قهوتك الجاهزة.",
        },
        {
          id: "barns_sharp_v1",
          angleId: "barns_sharp",
          name: "B1 - يشرح نفسه",
          hookId: "barns_sharp_hook_1",
          bodyId: "barns_sharp_body_1",
          ctaId: "barns_sharp_cta_1",
          tone: "دافئ",
          length: "medium",
          score: 91,
          critique: [
            { agent: "critic", note: "الهوك قوي والمنتج واضح." },
            { agent: "scout", note: "جيد جدًا لكن B2 أكمل." },
          ],
          fullText:
            "مو كل قهوة سعودية تضبط من أول فنجال.\n\nقهوه سعودية - خلطة ذهبية من بارنز محمصة بعناية وفيها هيل واضح بطعم متوازن، لذلك تعطيك فنجالًا يشرح نفسه من أول رشفة.\n\nإذا ودك بفنجال يطلع باسمك، هذه خلطة ترجع لها.",
        },
        {
          id: "barns_sharp_v2",
          angleId: "barns_sharp",
          name: "B2 - ترجع لها",
          hookId: "barns_sharp_hook_1",
          bodyId: "barns_sharp_body_2",
          ctaId: "barns_sharp_cta_1",
          tone: "قريب ومقنع",
          length: "medium",
          score: 95,
          critique: [
            { agent: "critic", note: "هذه أقرب إعلان فعلي بين كل النسخ." },
            { agent: "strategist", note: "تربط الطعم بالاعتمادية والجو." },
          ],
          fullText:
            "مو كل قهوة سعودية تضبط من أول فنجال.\n\nمناسبة للبيت والجمعات، وعلبتها المعدنية تحفظ النكهة والطزاجة، فتصير من الخلطات اللي ترجع لها وأنت مرتاح.\n\nإذا ودك بفنجال يطلع باسمك، هذه خلطة ترجع لها.",
        },
        {
          id: "barns_viral_v1",
          angleId: "barns_viral",
          name: "C1 - أول ريحة",
          hookId: "barns_viral_hook_1",
          bodyId: "barns_viral_body_1",
          ctaId: "barns_viral_cta_1",
          tone: "حسي",
          length: "short",
          score: 79,
          critique: [
            { agent: "critic", note: "جميلة لكنها أقل اكتمالًا." },
            { agent: "scout", note: "تعتمد على الصورة أكثر من النص." },
          ],
          fullText:
            "أحيانًا أول ريحة تكفي.\n\nومع الخلطة الذهبية من بارنز، الهيل يسبقك والباقي يكمله الفنجال.\n\nجرّبها في الجلسة الجاية.",
        },
      ],
      recommendedVariantId: "barns_sharp_v2",
    },
    trial: {
      summary:
        "المختبرون تجاوبوا أكثر مع النسخ التي تشبه كلام الناس عن القهوة فعليًا: تضبط أو لا تضبط، ترجع لها أو لا. هذا أعطى الحملة صدقًا واضحًا.",
      personas: barnsPersonas,
      reactions: makeReactions("barns", [
        { personaId: "barns_p1", variantId: "barns_safe_v1", sentiment: "warm", quote: "واضحة ومريحة.", why: "تفهمه المنتج بسرعة.", subScores: { clarity: 90, resonance: 78, intent: 79 } },
        { personaId: "barns_p2", variantId: "barns_sharp_v1", sentiment: "love", quote: "فنجال يشرح نفسه من أول رشفة ممتازة.", why: "حسية وواضحة.", subScores: { clarity: 92, resonance: 90, intent: 89 } },
        { personaId: "barns_p3", variantId: "barns_sharp_v2", sentiment: "love", quote: "هذه فعلا تخليني أبي أجربها في البيت.", why: "فيها اعتمادية وراحة.", subScores: { clarity: 94, resonance: 94, intent: 93 } },
        { personaId: "barns_p4", variantId: "barns_sharp_v2", sentiment: "love", quote: "أحببت فكرة ترجع لها وأنت مرتاح.", why: "قريبة من قرار الشراء الحقيقي.", subScores: { clarity: 93, resonance: 95, intent: 92 } },
        { personaId: "barns_p5", variantId: "barns_viral_v1", sentiment: "neutral", quote: "حلوة، بس أبي شيء أشبع.", why: "تشده البداية لكن تنقصها التفاصيل.", subScores: { clarity: 82, resonance: 71, intent: 69 } },
        { personaId: "barns_p6", variantId: "barns_sharp_v2", sentiment: "love", quote: "هذه تشبه إعلان قهوة فعلي.", why: "فيها جو وطعم وفائدة.", subScores: { clarity: 94, resonance: 93, intent: 92 } },
        { personaId: "barns_p7", variantId: "barns_sharp_v2", sentiment: "love", quote: "أقدر أشم الهيل وأنا أقرأ.", why: "النص حسي بلا مبالغة.", subScores: { clarity: 92, resonance: 94, intent: 91 } },
        { personaId: "barns_p8", variantId: "barns_sharp_v1", sentiment: "warm", quote: "B1 قوية، لكن B2 أقرب للبيت والجمعات.", why: "B2 أدفى.", subScores: { clarity: 90, resonance: 87, intent: 86 } },
      ]),
      scoreboard: [
        { variantId: "barns_safe_v1", angleId: "barns_safe", average: 82, resonance: 78, risk: 15, verdict: "واضحة وعملية." },
        { variantId: "barns_sharp_v1", angleId: "barns_sharp", average: 89, resonance: 89, risk: 11, verdict: "قوية وحسية." },
        { variantId: "barns_sharp_v2", angleId: "barns_sharp", average: 94, resonance: 94, risk: 8, verdict: "الفائزة. أقرب إعلان فعلي للشراء." },
        { variantId: "barns_viral_v1", angleId: "barns_viral", average: 74, resonance: 71, risk: 19, verdict: "ملفتة لكنها أقل اكتمالًا." },
      ],
      angleWinners: [
        { angleId: "barns_safe", variantId: "barns_safe_v1", average: 82, verdict: "أفضل خيار محافظ." },
        { angleId: "barns_sharp", variantId: "barns_sharp_v2", average: 94, verdict: "المسار الفائز بوضوح." },
        { angleId: "barns_viral", variantId: "barns_viral_v1", average: 74, verdict: "أفضل نسخة قصيرة." },
      ],
      winningVariantId: "barns_sharp_v2",
      recommendedEdits: [
        "الحفاظ على كلمة ترجع لها لأنها مفتاح الإقناع.",
        "إظهار الدلة أو الفنجال مع العلبة لدعم الجو.",
        "عدم المبالغة في الخطاب التراثي.",
      ],
      responseRisks: [
        "أي وصف عام عن الكرم سيضعف تميز الحملة.",
        "إذا فقد النص التفاصيل الحسية سيصبح مثل أي إعلان قهوة.",
      ],
      audienceSummary: [
        "الجمهور أحب الإعلانات التي تذكره بالبيت والجلسات فعلًا.",
        "التفاصيل العملية مثل العلبة والطزاجة رفعت الثقة.",
        "المزيج بين الجو والفائدة هو سر الفوز هنا.",
      ],
    },
    studio: {
      summary:
        "المشهد البصري يجب أن يبدو سعوديًا ودافئًا وحقيقيًا. نحتاج إحساس جلسة مرتبة لا إعلان بن جامد.",
      selectedVariantId: "barns_sharp_v2",
      imagePrompt:
        "Premium Saudi coffee campaign for Barns golden blend Arabic coffee in metal tin, warm majlis mood, elegant dallah and small cups, soft steam, cardamom cues, golden-brown palette, realistic tabletop scene, tasteful Saudi hospitality, product tin visible and premium, rich but uncluttered, strong negative space for Arabic copy, editorial food photography.",
      composition:
        "العلبة المعدنية ظاهرة بوضوح مع دلة وفناجيل صغيرة على سطح دافئ. البخار أو الإحساس الساخن مهم جدًا. النص العربي يوضع في مساحة نظيفة من اليمين أو الأعلى.",
      palette: ["Cardamom Gold", "Coffee Brown", "Warm Sand", "Soft Cream", "Brass"],
      typography: ["Display عربي دافئ", "Sans عربي واضح"],
      layers: [
        { id: "barns_layer_bg", kind: "background", name: "خلفية دافئة", note: "تدعم جو الضيافة من غير زحمة." },
        { id: "barns_layer_subject", kind: "subject", name: "العلبة والدلة والفنجال", note: "المشهد لازم يبيع الطعم والجو." },
        { id: "barns_layer_headline", kind: "headline", name: "عنوان حسي", note: "قصير وواضح." },
        { id: "barns_layer_logo", kind: "logo", name: "شعار بارنز", note: "صغير وواضح." },
      ],
      formats: [
        { id: "barns_x", name: "X Post", ratio: "4:5", size: "1600x2000", layoutNote: "مثالي للعلبة مع الدلة والعنوان." },
        { id: "barns_story", name: "Story", ratio: "9:16", size: "1080x1920", layoutNote: "تركز على الدلة والبخار والعلبة." },
      ],
      assetChecklist: [
        "علبة بارنز المعدنية بوضوح كاف",
        "فنجال أو دلة لدعم الجو",
        "إحساس بخار أو حرارة",
        "إضاءة دافئة وألوان غير معتمة",
      ],
    },
    launch: {
      summary:
        "النسخة النهائية تبيع القهوة بطريقة تشبه الإعلانات القوية فعلًا: هوك واضح، تفاصيل محسوسة، ثم سبب عملي يخلي الشراء منطقيًا.",
      winningAngleId: "barns_sharp",
      winningVariantId: "barns_sharp_v2",
      finalCaption:
        "مو كل قهوة سعودية تضبط من أول فنجال.\n\nقهوه سعودية - خلطة ذهبية من بارنز محمصة بعناية وفيها هيل واضح بطعم متوازن، لذلك تعطيك فنجالًا يشرح نفسه من أول رشفة. ومادامت محفوظة في علبة معدنية، تبقى نكهتها وطزاجتها أقرب للمرة الأولى.\n\nإذا ودك بقهوة للبيت والجمعات ترجع لها وأنت مرتاح، هذه خلطة ترجع لها.",
      alternates: [
        "إذا كانت القهوة عندك مزاج وضيافة، الخلطة تفرق.",
        "من أول ريحة تعرف إذا القهوة مضبوطة أو لا.",
        "قهوة سعودية بطعم مرتب وخلطة ترجع لها.",
      ],
      responsePlan: [
        { scenario: "سؤال عن الفرق", response: "ركزنا على الخلطة والهيل والعلبة لأنها الأشياء التي تعيش مع العميل فعلًا، لا مجرد كلام عام عن الضيافة.", tone: "واضح" },
        { scenario: "تعليق على طول النص", response: "في القهوة، body أطول قليلًا يخدم المنتج لأنه يربط الجو بالطعم وبسبب الشراء.", tone: "واثق" },
      ],
      riskNotes: [
        "عدم حشو النص بمفردات تراثية عامة.",
        "الصورة يجب أن تبدو حقيقية وشهية لا ديكورية فقط.",
      ],
      launchChecklist: [
        "إظهار العلبة والدلة معًا",
        "الإبقاء على كلمة تضبط في الهوك",
        "عدم الإطالة أكثر من هذا",
        "استخدام ألوان دافئة وحسية",
      ],
      packages: [
        { id: "barns_pkg_1", name: "X Main", ratio: "4:5", headline: "الضيافة تضبط من الخلطة", caption: "مو كل قهوة سعودية تضبط من أول فنجال.", cta: "اطلبها الآن", visualCue: "علبة مع دلة وفنجال" },
        { id: "barns_pkg_2", name: "Story", ratio: "9:16", headline: "من أول ريحة", caption: "تعرف إذا القهوة مضبوطة أو لا.", cta: "اسحب للأعلى", visualCue: "بخار وفنجال قريب" },
        { id: "barns_pkg_3", name: "Quote Post", ratio: "1:1", headline: "خلطة ترجع لها", caption: "لأن الطعم إذا ضبط، يتكرر.", cta: "جرّبها", visualCue: "خلفية دافئة مع العلبة" },
      ],
      nextSteps: [
        "اختبار نسخة تركّز على البيت ونسخة تركّز على الجمعات",
        "التقاط صورة بخار واضح يدعم الحس",
        "تجهيز ردود قصيرة على أسئلة الطعم والتحضير",
      ],
    },
  },
  {
    slug: "alarabia-liloud-diwan-x",
    headline: "العربية للعود - ديوان",
    brand: "العربية للعود",
    product: "ديوان",
    market: "السعودية والخليج",
    platform: "X",
    demoNarrative:
      "هذا هو المثال الأقرب لخاتمة عرض قوية. البراند عربي والاسم عربي، والمنتج يسمح بإعلان راقٍ جدًا لكنه ما يزال مفهومًا وقابلًا للبيع للجمهور الشعبي أيضًا.",
    selectedAngleId: "oud_sharp",
    selectedVariantId: "oud_sharp_v2",
    sourceLinks: [
      {
        label: "العربية للعود - ديوان 50 مل",
        url: "https://sa.arabianoud.com/ar/5051867067085-diwan-eau-de-parfum-50-ml.html",
      },
    ],
    brief: {
      campaignName: "اسم له طابعه",
      brandName: "العربية للعود",
      productName: "ديوان",
      audience:
        "رجال ونساء 25-45 في السعودية والخليج يحبون العطر العربي المعاصر، ويبحثون عن عطر له شخصية واضحة من غير استعراض.",
      goal:
        "بناء رغبة شراء عالية عبر تقديم ديوان كعطر له طابع واضح ومفهوم، وربطه بالذوق والشخصية لا بالشعارات الكبيرة.",
      platform: "X",
      language: "العربية",
      tone: "فخم، قريب، عربي حديث، واثق",
      valueProposition:
        "عطر عربي باسم عربي من براند معروف، يقدّم طابعًا واضحًا من أول مرة لمن يحب الشخصية في العطر لا الضجيج.",
      callToAction: "إذا كان هذا ذوقك، ديوان يستحق تجربتك",
      pillars: [
        "الذوق الواضح أقوى من الكلام الكثير",
        "العطر العربي يمكن أن يكون معاصرًا وقريبًا",
        "الاسم نفسه جزء من جاذبية المنتج",
      ],
      avoid: [
        "الشاعرية المفرطة",
        "الكلام النخبوي المستفز",
        "المبالغة في وصف الفخامة",
      ],
      guardrails: [
        "يبقى النص مفهومًا من أول قراءة",
        "نستفيد من اسم ديوان من غير تكلف ثقافي زائد",
        "لا نكتب كأننا نصف قصيدة",
      ],
      brandLinks: ["https://sa.arabianoud.com/ar/5051867067085-diwan-eau-de-parfum-50-ml.html"],
      socialAccounts: [],
      references: ["https://sa.arabianoud.com/ar/5051867067085-diwan-eau-de-parfum-50-ml.html"],
      context:
        "هذه الحملة مناسبة جدًا لنهاية عرض المحكمين لأنها تثبت أن TrendMind يقدر يطلع نصًا عربيًا فيه هيبة فعلًا لكن ما ينعزل عن الناس.",
    },
    research: {
      overview:
        "القيمة هنا في الاسم والبراند معًا. ديوان اسم ثقيل وجميل، والعربية للعود براند مفهوم عند الجمهور. نحتاج إعلانًا يستثمر هذه القوة بدون تكلف.",
      recommendedFocus:
        "ابن الرسالة على الشخصية والطابع الواضح، مع الاستفادة من النوتات الرسمية بوصفها برهانًا لا حشوًا.",
      sourceSummary: [
        "المنتج موجود رسميًا باسم ديوان.",
        "العربية للعود تحمل رصيدًا عربيًا واضحًا في أذهان الجمهور.",
        "الصفحة تعرض النوتات، وهذا يسمح بbody أكثر تحديدًا وأقل عمومية.",
      ],
      items: [
        {
          id: "oud_research_1",
          kind: "fact",
          title: "الاسم نفسه جزء من الحملة",
          summary:
            "وجود اسم مثل ديوان يختصر علينا كثيرًا. الاسم يحمل وقارًا وهيبة ويصلح أن يكون مركزًا للرسالة.",
          source: "العربية للعود - الصفحة الرسمية",
          url: "https://sa.arabianoud.com/ar/5051867067085-diwan-eau-de-parfum-50-ml.html",
          confidence: 95,
          by: "factChecker",
          tags: ["اسم المنتج", "هوية", "عربي"],
        },
        {
          id: "oud_research_2",
          kind: "fact",
          title: "النوتات الرسمية تساعد على جعل الإعلان أكثر إقناعًا",
          summary:
            "وجود الهيل والعود مع التونكا والباتشولي يمنحنا مادة ملموسة نستخدمها لإعطاء النص شخصية، بدل الاكتفاء بكلمات عامة عن الفخامة.",
          source: "العربية للعود - الصفحة الرسمية",
          url: "https://sa.arabianoud.com/ar/5051867067085-diwan-eau-de-parfum-50-ml.html",
          confidence: 90,
          by: "factChecker",
          tags: ["نوتات", "برهان", "تفصيل"],
        },
        {
          id: "oud_research_3",
          kind: "audience",
          title: "الجمهور يحب العطر العربي إذا شعر أنه معاصر ومفهوم",
          summary:
            "الذوق الخليجي يحب العمق، لكنه لا يحب الغموض المصطنع. هذا يوجّهنا إلى نص فيه هيبة ووضوح في الوقت نفسه.",
          source: "TrendMind audience synthesis",
          confidence: 89,
          by: "strategist",
          tags: ["عطر عربي", "وضوح", "معاصرة"],
        },
        {
          id: "oud_research_4",
          kind: "competitive",
          title: "كثير من العطور العربية تقع في فخ التعالي",
          summary:
            "إذا كتبنا بنبرة ترى نفسها فوق الناس، سنخسر جزءًا كبيرًا من الجاذبية. المطلوب هيبة قريبة لا هيبة متكبرة.",
          source: "TrendMind category read",
          confidence: 87,
          by: "scout",
          tags: ["نبرة", "تعالي", "تمييز"],
        },
        {
          id: "oud_research_5",
          kind: "trend",
          title: "الإعلانات الأقوى في العطور الفاخرة اليوم توازن بين الهوك الحاد والتفصيل الحسي",
          summary:
            "الجملة الافتتاحية تمسك القارئ بسرعة، لكن الbody يحتاج ملمسًا أو نوتات أو إحساسًا محددًا حتى يصير مقنعًا لا مجرد مزاج.",
          source: "TrendMind ad pattern synthesis",
          confidence: 85,
          by: "scout",
          tags: ["أسلوب إعلان", "هوك", "حسية"],
        },
        {
          id: "oud_research_6",
          kind: "risk",
          title: "الشاعرية الزائدة قد تجعل النص جميلًا لكنه بارد بيعيًا",
          summary:
            "هذا النوع من المنتجات يغري بالإنشاء. لكن النجاح الحقيقي أن نخلي النص جميلًا ومفهومًا وبيعيًا في وقت واحد.",
          source: "TrendMind critic pass",
          confidence: 92,
          by: "critic",
          tags: ["مخاطر", "شاعرية", "بيع"],
        },
      ],
    },
    strategy: {
      campaignThesis:
        "العطر العربي الحديث ينجح حين يشعر الناس أنه واثق من نفسه إلى درجة لا يحتاج معها للمبالغة.",
      messageDirection:
        "نقدّم ديوان كعطر له شخصية واضحة من أول مرة، بتركيبة تعطي فخامة مفهومة ومحبوبة لا غموضًا فارغًا.",
      positioningLogic:
        "بدل بيع الفخامة ككلمة، نبيعها كطابع وشخصية يمكن للمتلقي أن يتخيلها ويختارها.",
      toneDirection:
        "لغة عربية حديثة تميل للعامية السعودية الخفيفة في الإيقاع، مع حفاظ واضح على الوقار.",
      strategicConstraints: [
        "لا نكتب نصًا نخبويًا",
        "لا نبالغ في الغموض",
        "العنوان يجب أن يكون قابلاً للحفظ من أول مرة",
      ],
      angles: [
        {
          id: "oud_safe",
          lane: "safe",
          letter: "A",
          title: "عطر عربي بثقة",
          thesis: "تقديم مباشر وآمن يربط الاسم بالثقة والطابع الواضح.",
          stance: "ثابت",
          promise: "عطر عربي واضح من براند معروف.",
          hook: "بعض الأسماء تدخل بثقة من أول مرة.",
          rationale: ["آمن", "مفهوم", "سريع"],
          risks: ["قد يبدو تقليديًا"],
          fit: "جيد كنسخة واضحة.",
          tone: "مباشر",
          score: 82,
        },
        {
          id: "oud_sharp",
          lane: "sharp",
          letter: "B",
          title: "اسم له طابعه",
          thesis: "ديوان من الأسماء التي تعطيك انطباعًا من أول مرة، وهذا هو سر جاذبيته.",
          stance: "واثق",
          promise: "عطر عربي بطابع واضح وفخم من غير تعقيد.",
          hook: "مو كل عطر يحتاج يعرّف عن نفسه كثير.",
          rationale: ["راقي وقريب", "مناسب للذوق الخليجي", "قابل للنشر بقوة"],
          risks: ["يحتاج توازنًا لغويًا دقيقًا"],
          fit: "الأفضل للديمو وللإعلان الفعلي.",
          tone: "فخم قريب",
          score: 95,
        },
        {
          id: "oud_viral",
          lane: "viral",
          letter: "C",
          title: "من أول مرة",
          thesis: "نركّز على أن الاسم والطابع يثبتان بسرعة.",
          stance: "مختصر",
          promise: "عطر يوضح نفسه من أول مرة.",
          hook: "في عطور من أول مرة تعرف إنها على ذوقك.",
          rationale: ["قصير", "سهل المشاركة", "يعتمد على الانطباع"],
          risks: ["أقل عمقًا", "يحتاج صورة قوية"],
          fit: "يناسب بوستات الاقتباس.",
          tone: "مقتضب",
          score: 79,
        },
      ],
      recommendedAngleId: "oud_sharp",
      decisionFrame:
        "المسار الأفضل هو الذي يعطي ديوان طابعًا ملموسًا لكنه يظل أقرب للناس من أن يتحول إلى قطعة أدب مغلقة.",
    },
    draft: {
      summary:
        "المسودات الأنجح كانت التي تكلّمت عن الطابع والشخصية، ثم دعمت نفسها بالنوتات. هذا حرر البراند من التوقع التقليدي وخلّى النص أذكى وأقرب.",
      atoms: [
        { id: "oud_safe_hook_1", angleId: "oud_safe", kind: "hook", text: "بعض الأسماء تدخل بثقة من أول مرة." },
        { id: "oud_safe_body_1", angleId: "oud_safe", kind: "body", text: "ديوان من العربية للعود عطر عربي واضح من براند يعرفه الناس ويثقون فيه." },
        { id: "oud_safe_cta_1", angleId: "oud_safe", kind: "cta", text: "جرّب طابعه." },
        { id: "oud_sharp_hook_1", angleId: "oud_sharp", kind: "hook", text: "مو كل عطر يحتاج يعرّف عن نفسه كثير." },
        { id: "oud_sharp_body_1", angleId: "oud_sharp", kind: "body", text: "ديوان من العربية للعود يجمع الهيل والعود مع التونكا والباتشولي بتركيبة تعطي فخامة واضحة من أول مرة، لكن بأسلوب مرتب بعيد عن الصخب." },
        { id: "oud_sharp_body_2", angleId: "oud_sharp", kind: "body", text: "هذا النوع اللي يلفت لأن له طابع، مو لأنه أعلى من غيره." },
        { id: "oud_sharp_cta_1", angleId: "oud_sharp", kind: "cta", text: "إذا كان هذا ذوقك، ديوان يستحق تجربتك." },
        { id: "oud_viral_hook_1", angleId: "oud_viral", kind: "hook", text: "في عطور من أول مرة تعرف إنها على ذوقك." },
        { id: "oud_viral_body_1", angleId: "oud_viral", kind: "body", text: "وديوان واحد من الأسماء اللي تثبت بسرعة لأنها واضحة من أول لحظة." },
        { id: "oud_viral_cta_1", angleId: "oud_viral", kind: "cta", text: "خله ضمن خياراتك الجاية." },
      ],
      variants: [
        {
          id: "oud_safe_v1",
          angleId: "oud_safe",
          name: "A1 - ثقة عربية",
          hookId: "oud_safe_hook_1",
          bodyId: "oud_safe_body_1",
          ctaId: "oud_safe_cta_1",
          tone: "مباشر",
          length: "medium",
          score: 82,
          critique: [
            { agent: "strategist", note: "واضح لكنه تقليدي نسبيًا." },
            { agent: "critic", note: "مفيد كمرجع لا كفائز." },
          ],
          fullText:
            "بعض الأسماء تدخل بثقة من أول مرة.\n\nديوان من العربية للعود عطر عربي واضح من براند يعرفه الناس ويثقون فيه.\n\nجرّب طابعه.",
        },
        {
          id: "oud_sharp_v1",
          angleId: "oud_sharp",
          name: "B1 - طابع واضح",
          hookId: "oud_sharp_hook_1",
          bodyId: "oud_sharp_body_1",
          ctaId: "oud_sharp_cta_1",
          tone: "راقي",
          length: "medium",
          score: 92,
          critique: [
            { agent: "critic", note: "قوية ومحددة." },
            { agent: "scout", note: "متوازنة جدًا على X." },
          ],
          fullText:
            "مو كل عطر يحتاج يعرّف عن نفسه كثير.\n\nديوان من العربية للعود يجمع الهيل والعود مع التونكا والباتشولي بتركيبة تعطي فخامة واضحة من أول مرة، لكن بأسلوب مرتب بعيد عن الصخب.\n\nإذا كان هذا ذوقك، ديوان يستحق تجربتك.",
        },
        {
          id: "oud_sharp_v2",
          angleId: "oud_sharp",
          name: "B2 - له طابع",
          hookId: "oud_sharp_hook_1",
          bodyId: "oud_sharp_body_2",
          ctaId: "oud_sharp_cta_1",
          tone: "عربي حديث",
          length: "medium",
          score: 96,
          critique: [
            { agent: "critic", note: "هذه الأقرب للبراند والأقرب للناس معًا." },
            { agent: "strategist", note: "تبني ذوقًا وهوية من غير نبرة فوقية." },
          ],
          fullText:
            "مو كل عطر يحتاج يعرّف عن نفسه كثير.\n\nهذا النوع اللي يلفت لأن له طابع، مو لأنه أعلى من غيره.\n\nإذا كان هذا ذوقك، ديوان يستحق تجربتك.",
        },
        {
          id: "oud_viral_v1",
          angleId: "oud_viral",
          name: "C1 - على ذوقك",
          hookId: "oud_viral_hook_1",
          bodyId: "oud_viral_body_1",
          ctaId: "oud_viral_cta_1",
          tone: "قصير",
          length: "short",
          score: 78,
          critique: [
            { agent: "critic", note: "يعتمد على الانطباع أكثر من التفصيل." },
            { agent: "scout", note: "جيد للبوستات السريعة." },
          ],
          fullText:
            "في عطور من أول مرة تعرف إنها على ذوقك.\n\nوديوان واحد من الأسماء اللي تثبت بسرعة لأنها واضحة من أول لحظة.\n\nخله ضمن خياراتك الجاية.",
        },
      ],
      recommendedVariantId: "oud_sharp_v2",
    },
    trial: {
      summary:
        "B2 حسمت الاختبار لأنها تعطي المتلقي شعورًا بالذوق والطابع من غير تعالٍ، بينما B1 أضافت الطبقة الحسية التي تجعل الإعلان أكثر إقناعًا.",
      personas: oudPersonas,
      reactions: makeReactions("oud", [
        { personaId: "oud_p1", variantId: "oud_safe_v1", sentiment: "warm", quote: "واضحة ومريحة.", why: "لكنها ما فاجأته.", subScores: { clarity: 89, resonance: 76, intent: 78 } },
        { personaId: "oud_p2", variantId: "oud_sharp_v1", sentiment: "love", quote: "النوتات هنا خدمت الإعلان.", why: "أحبت أنه صار ملموسًا.", subScores: { clarity: 92, resonance: 91, intent: 89 } },
        { personaId: "oud_p3", variantId: "oud_sharp_v2", sentiment: "love", quote: "هذه تشبه العطر العربي الحديث فعلا.", why: "فيها ثقة بلا صخب.", subScores: { clarity: 94, resonance: 95, intent: 92 } },
        { personaId: "oud_p4", variantId: "oud_sharp_v2", sentiment: "love", quote: "له طابع أقوى من كلمة حضور.", why: "أقل عمومية.", subScores: { clarity: 92, resonance: 96, intent: 91 } },
        { personaId: "oud_p5", variantId: "oud_viral_v1", sentiment: "neutral", quote: "قصيرة، لكن ناقصها سبب.", why: "تحتاج دعمًا أكبر.", subScores: { clarity: 80, resonance: 67, intent: 69 } },
        { personaId: "oud_p6", variantId: "oud_sharp_v2", sentiment: "love", quote: "هذه إعلان يبيع ذوق، مو بس عطر.", why: "ترفع القيمة فعلًا.", subScores: { clarity: 93, resonance: 95, intent: 92 } },
        { personaId: "oud_p7", variantId: "oud_sharp_v2", sentiment: "love", quote: "عربي ومعاصر بنفس الوقت.", why: "هذا التوازن نادر.", subScores: { clarity: 94, resonance: 94, intent: 90 } },
        { personaId: "oud_p8", variantId: "oud_sharp_v1", sentiment: "warm", quote: "B1 جميلة، بس B2 تلمس أكثر.", why: "B2 أكثر قربًا.", subScores: { clarity: 90, resonance: 87, intent: 85 } },
      ]),
      scoreboard: [
        { variantId: "oud_safe_v1", angleId: "oud_safe", average: 80, resonance: 76, risk: 18, verdict: "واضحة لكنها تقليدية نسبيًا." },
        { variantId: "oud_sharp_v1", angleId: "oud_sharp", average: 90, resonance: 90, risk: 11, verdict: "قوية ومقنعة." },
        { variantId: "oud_sharp_v2", angleId: "oud_sharp", average: 95, resonance: 95, risk: 9, verdict: "الفائزة. عربية ومعاصرة وتبيع فعلا." },
        { variantId: "oud_viral_v1", angleId: "oud_viral", average: 72, resonance: 68, risk: 21, verdict: "صالحة للاقتباس لكن أقل عمقًا." },
      ],
      angleWinners: [
        { angleId: "oud_safe", variantId: "oud_safe_v1", average: 80, verdict: "أفضل خيار مباشر." },
        { angleId: "oud_sharp", variantId: "oud_sharp_v2", average: 95, verdict: "المسار الفائز بلا جدال." },
        { angleId: "oud_viral", variantId: "oud_viral_v1", average: 72, verdict: "أفضل اختصار لكنه ليس الأقوى." },
      ],
      winningVariantId: "oud_sharp_v2",
      recommendedEdits: [
        "الحفاظ على كلمة طابع لأنها مركز الفوز.",
        "دعم النسخة الفائزة بصورة نظيفة وغير مزدحمة.",
        "استخدام النوتات في النص الطويل فقط لا في كل نسخة.",
      ],
      responseRisks: [
        "أي نبرة نخبوية ستكسر قرب الإعلان.",
        "إذا صار النص شعريًا أكثر من اللازم سيقل أثره البيعي.",
      ],
      audienceSummary: [
        "الجمهور أحب الطابع الواضح أكثر من الفخامة المعلنة.",
        "النسخ الأقصر والأذكى كانت الأنجح.",
        "النوتات خدمت الإقناع حين استُخدمت باعتدال.",
      ],
    },
    studio: {
      summary:
        "البصرية هنا يجب أن تبدو عربية وواثقة، لكن خالية من الفوضى والزخرفة الثقيلة. الهيبة تأتي من التكوين لا من كثرة العناصر.",
      selectedVariantId: "oud_sharp_v2",
      imagePrompt:
        "Modern Arabic luxury fragrance campaign for Al Arabia Lil Oud Diwan, deep amber and wood tones, elegant bottle hero shot, quiet authority, Saudi-Gulf premium aesthetic, subtle texture inspired by majlis wood or leather without cliché, cinematic warm light, sophisticated Arabic negative space, strong but restrained, no clutter, no ornate overload.",
      composition:
        "العبوة في مركز المشهد مع خلفية داكنة دافئة وخامات عربية حديثة مثل الخشب أو الجلد بشكل خفيف. العنوان العربي كبير وواثق على اليمين أو الأعلى.",
      palette: ["Dark Amber", "Walnut Brown", "Burnished Gold", "Shadow Bronze", "Soft Sand"],
      typography: ["Display عربي قوي", "Sans عربي منضبط"],
      layers: [
        { id: "oud_layer_bg", kind: "background", name: "خلفية داكنة دافئة", note: "تعطي هيبة من غير زحمة." },
        { id: "oud_layer_subject", kind: "subject", name: "العبوة كبطل بصري", note: "حضور واضح ومركزي." },
        { id: "oud_layer_headline", kind: "headline", name: "عنوان ثابت", note: "قصير ويعيش بصريًا." },
        { id: "oud_layer_logo", kind: "logo", name: "شعار العربية للعود", note: "واضح وصغير." },
      ],
      formats: [
        { id: "oud_x", name: "X Post", ratio: "4:5", size: "1600x2000", layoutNote: "يعطي مساحة للعنوان مع العبوة." },
        { id: "oud_story", name: "Story", ratio: "9:16", size: "1080x1920", layoutNote: "ممتاز للخاتمة القوية." },
      ],
      assetChecklist: [
        "عبوة ديوان بجودة عالية",
        "إضاءة دافئة لا مظلمة جدًا",
        "خامات عربية خفيفة وراقية",
        "عنوان قصير من سطر أو سطرين فقط",
      ],
    },
    launch: {
      summary:
        "النسخة النهائية تنقل ديوان من فكرة عامة عن الفخامة إلى عطر له طابع واضح وشخصية سهلة الفهم.",
      winningAngleId: "oud_sharp",
      winningVariantId: "oud_sharp_v2",
      finalCaption:
        "مو كل عطر يحتاج يعرّف عن نفسه كثير.\n\nديوان من العربية للعود يجمع الهيل والعود مع التونكا والباتشولي بتركيبة تعطي فخامة واضحة من أول مرة، لكن بأسلوب مرتب بعيد عن الصخب. هذا النوع اللي يلفت لأن له طابع، مو لأنه يحاول كثير.\n\nإذا كان هذا ذوقك، ديوان يستحق تجربتك.",
      alternates: [
        "في عطور من أول مرة تعرف أنها على ذوقك. ديوان واحد منها.",
        "ديوان عطر عربي بطابع واضح من غير تكلف.",
        "إذا تميل للعطر اللي له شخصية، ديوان يستحق مكانه عندك.",
      ],
      responsePlan: [
        { scenario: "سؤال عن معنى الإعلان", response: "الفكرة أن ديوان يلفت لأنه واضح وله شخصية، لا لأنه يبالغ في لفت النظر.", tone: "شارح وواثق" },
        { scenario: "تعليق على بساطة النص", response: "تعمدنا البساطة لأن اسم ديوان نفسه قوي، وكان الأهم أن نقرّبه من الناس بدل ما نغلقه بنبرة نخبوية.", tone: "هادئ" },
      ],
      riskNotes: [
        "لا نضيف عناصر تراثية كثيرة في التصميم.",
        "لا نطيل الكابشن أكثر لأن القوة هنا في الإيقاع المختصر النسبي.",
      ],
      launchChecklist: [
        "تثبيت العنوان كما هو",
        "استخدام صورة عبوة واضحة ومهيبة",
        "تجنب أي رموز أو إيموجي",
        "الحفاظ على ردود مختصرة وواثقة",
      ],
      packages: [
        { id: "oud_pkg_1", name: "X Main", ratio: "4:5", headline: "اسم له طابعه", caption: "إذا كان هذا ذوقك، ديوان يستحق تجربتك.", cta: "جرّبه الآن", visualCue: "عبوة مع خلفية خشبية داكنة" },
        { id: "oud_pkg_2", name: "Story", ratio: "9:16", headline: "مو كل عطر يحتاج يعرّف عن نفسه كثير", caption: "طابع واضح من أول مرة.", cta: "اسحب للأعلى", visualCue: "لقطة عبوة بإضاءة دافئة" },
        { id: "oud_pkg_3", name: "Quote Post", ratio: "1:1", headline: "له طابع", caption: "مو لأنه أعلى من غيره.", cta: "اكتشفه", visualCue: "خلفية داكنة مع عنوان فقط" },
      ],
      nextSteps: [
        "تحضير نسخة أقصر جدًا للستوري",
        "اختبار خلفية جلدية مقابل خلفية خشبية",
        "الإبقاء على نبرة الردود بنفس الثقة الهادية",
      ],
    },
  },
];
