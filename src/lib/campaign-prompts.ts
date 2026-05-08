import type {
  CampaignBrief,
  DraftVariant,
  DraftOutput,
  Persona,
  ResearchOutput,
  StrategyOutput,
  TrialOutput,
} from "@/lib/types";

function languageDirection(brief: CampaignBrief) {
  const prefersArabic =
    /arab|عرب|خليج|سعود/i.test(brief.language) ||
    /arab|عرب|خليج|سعود/i.test(brief.audience) ||
    /arab|عرب|خليج|سعود/i.test(brief.platform);

  return prefersArabic
    ? [
        "Write the strategy and campaign copy in natural Arabic by default.",
        "Prefer contemporary Saudi/Gulf-friendly marketing Arabic when it fits the brief.",
        "Avoid stiff translationese, filler, and generic startup phrasing.",
        "Keep claims culturally credible and commercially useful.",
      ].join("\n")
    : [
        "Write in the language implied by the brief.",
        "Keep the copy commercially sharp and presentation-ready.",
      ].join("\n");
}

function roleContext(brief: CampaignBrief) {
  return [
    `Campaign: ${brief.campaignName}`,
    `Brand: ${brief.brandName}`,
    `Product: ${brief.productName}`,
    `Audience: ${brief.audience}`,
    `Goal: ${brief.goal}`,
    `Platform: ${brief.platform}`,
    `Language: ${brief.language}`,
    `Tone: ${brief.tone}`,
    `Value proposition: ${brief.valueProposition}`,
    `CTA: ${brief.callToAction}`,
    `Pillars: ${brief.pillars.join(" | ")}`,
    `Avoid: ${brief.avoid.join(" | ")}`,
    `Guardrails: ${brief.guardrails.join(" | ")}`,
    `Context: ${brief.context}`,
  ].join("\n");
}

export function buildResearchPrompt(brief: CampaignBrief, sources: string[], note?: string | null) {
  return `
You are TrendMind's Trend Scout.

${languageDirection(brief)}

Produce a structured research pack that helps a strategist discover better campaign angles.
Do not write the strategy yet.

Brief:
${roleContext(brief)}

Web signals:
${sources.length > 0 ? sources.join("\n") : "No external sources available. Use the brief and category logic carefully."}

Latest note:
${note?.trim() || "None"}

Return only JSON:
{
  "overview": "string",
  "recommendedFocus": "string",
  "sourceSummary": ["string"],
  "items": [
    {
      "kind": "trend|audience|competitive|risk|fact",
      "title": "string",
      "summary": "string",
      "source": "string",
      "url": "optional string",
      "confidence": 0,
      "tags": ["string"]
    }
  ]
}

Rules:
- 5 to 8 items.
- Surface what matters for a real campaign, not trivia.
- Include factual caution if the category is claim-sensitive.
- Make the observations specific enough to drive strategy.
`.trim();
}

export function buildStrategyPrompt(
  brief: CampaignBrief,
  research: ResearchOutput,
  note?: string | null,
) {
  return `
You are TrendMind's Brand Strategist.

${languageDirection(brief)}

Turn the brief and research into a real campaign strategy with three distinct angles.
This is not a moodboard exercise. It must sound like an actual strategist made choices.

Brief:
${roleContext(brief)}

Research:
${JSON.stringify(research, null, 2)}

Latest note:
${note?.trim() || "None"}

Return only JSON:
{
  "campaignThesis": "string",
  "messageDirection": "string",
  "positioningLogic": "string",
  "toneDirection": "string",
  "strategicConstraints": ["string"],
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
- One grounded lane, one sharper lane, one higher-upside lane.
- The angles must differ in emotional lane, logic, and campaign behavior.
- Avoid generic "discover / elevate / unlock" phrasing unless the brief truly calls for it.
`.trim();
}

export function buildDraftPrompt(
  brief: CampaignBrief,
  strategy: StrategyOutput,
  note?: string | null,
) {
  return `
You are TrendMind's Content Architect with an internal Performance Critic.

${languageDirection(brief)}

Create a serious variation space for each strategy angle.
This is not one draft per angle. Build multiple hooks, bodies, CTAs, and composed variants.

Brief:
${roleContext(brief)}

Strategy:
${JSON.stringify(strategy, null, 2)}

Latest note:
${note?.trim() || "None"}

Return only JSON:
{
  "summary": "string",
  "atoms": [
    {
      "id": "string",
      "angleId": "string",
      "kind": "hook|body|cta",
      "text": "string",
      "note": "optional string"
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
- For each angle, create 3 to 5 hooks, 3 to 5 bodies, and 3 to 5 CTAs.
- Compose at least 2 strong variants per angle.
- Variants should differ in rhythm, proof style, directness, and platform fit.
- Critique notes must be concrete and brief.
`.trim();
}

export function buildTrialPrompt(
  brief: CampaignBrief,
  strategy: StrategyOutput,
  draft: DraftOutput,
) {
  return `
You are TrendMind's Audience Simulator and Performance Critic.

${languageDirection(brief)}

You are validating message performance, not inventing new strategy.
Read the strategy and draft space, then model how a real audience sample would likely respond.

Brief:
${roleContext(brief)}

Strategy:
${JSON.stringify(strategy, null, 2)}

Draft:
${JSON.stringify(draft, null, 2)}

Return only JSON:
{
  "summary": "string",
  "personas": [
    {
      "id": "string",
      "name": "string",
      "archetype": "string",
      "oneLiner": "string",
      "glyph": "string",
      "accent": "string"
    }
  ],
  "reactions": [
    {
      "id": "string",
      "personaId": "string",
      "variantId": "string",
      "sentiment": "love|warm|neutral|cold",
      "quote": "string",
      "why": "string",
      "subScores": {
        "clarity": 0,
        "resonance": 0,
        "intent": 0
      }
    }
  ],
  "recommendedEdits": ["string"],
  "responseRisks": ["string"],
  "audienceSummary": ["string"]
}

Rules:
- Create exactly 8 personas with distinct buying attitudes.
- Write one reaction for each persona against every draft variant.
- Keep each reaction concrete, short, and readable.
- Sub-scores should be integers from 0 to 100.
`.trim();
}

export function buildTrialPersonaRepairPrompt(
  brief: CampaignBrief,
  strategy: StrategyOutput,
  draft: DraftOutput,
  existingPersonas: Persona[],
  missingCount: number,
) {
  return `
You are TrendMind's Audience Simulator.

${languageDirection(brief)}

You already created part of the audience set. Generate only the missing personas.

Brief:
${roleContext(brief)}

Strategy:
${JSON.stringify(strategy, null, 2)}

Draft:
${JSON.stringify(draft, null, 2)}

Existing personas:
${JSON.stringify(existingPersonas, null, 2)}

Return only JSON:
{
  "personas": [
    {
      "id": "string",
      "name": "string",
      "archetype": "string",
      "oneLiner": "string",
      "glyph": "string",
      "accent": "string"
    }
  ]
}

Rules:
- Return exactly ${missingCount} new personas.
- Do not reuse any existing id, name, or archetype.
- Keep the same campaign context and audience quality bar.
`.trim();
}

export function buildTrialReactionRepairPrompt(
  brief: CampaignBrief,
  variant: DraftVariant,
  personas: Persona[],
) {
  return `
You are TrendMind's Audience Simulator.

${languageDirection(brief)}

Generate only the missing reactions for this one draft variant.

Brief:
${roleContext(brief)}

Variant:
${JSON.stringify(variant, null, 2)}

Personas that still need reactions:
${JSON.stringify(personas, null, 2)}

Return only JSON:
{
  "reactions": [
    {
      "id": "string",
      "personaId": "string",
      "variantId": "${variant.id}",
      "sentiment": "love|warm|neutral|cold",
      "quote": "string",
      "why": "string",
      "subScores": {
        "clarity": 0,
        "resonance": 0,
        "intent": 0
      }
    }
  ]
}

Rules:
- Return exactly one reaction for each listed persona.
- Every reaction must use variantId "${variant.id}".
- personaId values must match the listed personas exactly.
- Keep each reaction concrete, short, and readable.
- Sub-scores should be integers from 0 to 100.
`.trim();
}

export function buildStudioPrompt(
  brief: CampaignBrief,
  strategy: StrategyOutput,
  draft: DraftOutput,
  trial: TrialOutput,
  selectedVariantId: string,
) {
  return `
You are TrendMind's Visual Director.

${languageDirection(brief)}

Turn the winning variant into a production-ready visual direction.
This should feel like a real art direction pass, not a generic prompt.

Brief:
${roleContext(brief)}

Strategy:
${JSON.stringify(strategy, null, 2)}

Draft:
${JSON.stringify(draft, null, 2)}

Trial:
${JSON.stringify(trial, null, 2)}

Current selected variant:
${selectedVariantId}

Return only JSON:
{
  "summary": "string",
  "selectedVariantId": "string",
  "imagePrompt": "string",
  "composition": "string",
  "palette": ["string"],
  "typography": ["string"],
  "layers": [
    {
      "id": "string",
      "kind": "background|subject|headline|body|cta|logo",
      "name": "string",
      "note": "string"
    }
  ],
  "formats": [
    {
      "id": "string",
      "name": "string",
      "ratio": "string",
      "size": "string",
      "layoutNote": "string"
    }
  ],
  "assetChecklist": ["string"]
}

Rules:
- Make the composition feel production-ready and specific.
- Keep the palette and typography concise but deliberate.
- Describe a scene that could actually be designed.
- Keep the output platform-aware and launch-oriented.
`.trim();
}

export function buildLaunchPrompt(
  brief: CampaignBrief,
  strategy: StrategyOutput,
  draft: DraftOutput,
  trial: TrialOutput,
) {
  return `
You are TrendMind's Launch Packager.

${languageDirection(brief)}

Package the winning direction into a polished launch-ready output.

Brief:
${roleContext(brief)}

Strategy:
${JSON.stringify(strategy, null, 2)}

Draft:
${JSON.stringify(draft, null, 2)}

Trial:
${JSON.stringify(trial, null, 2)}

Return only JSON:
{
  "summary": "string",
  "winningAngleId": "string",
  "winningVariantId": "string",
  "finalCaption": "string",
  "alternates": ["string"],
  "responsePlan": [
    {
      "scenario": "string",
      "response": "string",
      "tone": "string"
    }
  ],
  "riskNotes": ["string"],
  "launchChecklist": ["string"],
  "packages": [
    {
      "id": "string",
      "name": "string",
      "ratio": "string",
      "headline": "string",
      "caption": "string",
      "cta": "string",
      "visualCue": "string"
    }
  ],
  "nextSteps": ["string"]
}

Rules:
- Keep the launch pack concise but complete.
- Preserve the winning angle and variant logic from the trial.
- Make every package feel immediately usable.
- Ensure the response plan sounds like a real team handoff.
`.trim();
}
