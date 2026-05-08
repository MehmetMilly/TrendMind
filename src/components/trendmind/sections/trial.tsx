"use client";

import { useMemo } from "react";

import { SectionShell } from "@/components/trendmind/sections/section-shell";
import { useStore } from "@/lib/workspace-store";

export function TrialSection() {
  const {
    campaign,
    openInspector,
    rerunPhase,
    runPending,
    startTrialReplay,
    resetTrialReplay,
    trialPlaybackState,
    trialPlaybackTick,
  } = useStore();

  const draft = campaign?.phases.draft.data;
  const trial = campaign?.phases.trial.data;
  const selectedVariantId = campaign?.selectedVariantId ?? trial?.winningVariantId ?? null;
  const variant = draft?.variants.find((entry) => entry.id === selectedVariantId) ?? draft?.variants[0];

  const hook = draft?.atoms.find((atom) => atom.id === variant?.hookId)?.text ?? "";
  const body = draft?.atoms.find((atom) => atom.id === variant?.bodyId)?.text ?? "";
  const cta = draft?.atoms.find((atom) => atom.id === variant?.ctaId)?.text ?? "";

  const reactions = useMemo(
    () =>
      trial?.reactions.filter((reaction) => reaction.variantId === variant?.id) ?? [],
    [trial?.reactions, variant?.id],
  );

  const revealed =
    trialPlaybackState === "complete" ? reactions.length : Math.min(trialPlaybackTick, reactions.length);

  const verdict = useMemo(() => {
    if (!trial || !variant) return null;
    return trial.scoreboard.find((entry) => entry.variantId === variant.id) ?? null;
  }, [trial, variant]);

  const right = (
    <div className="flex items-center gap-2">
      {!trial ? (
        <button
          onClick={() => void rerunPhase("trial")}
          disabled={runPending}
          className="rounded-md px-3 py-[5px] text-[10.5px] font-medium tracking-[0.04em]"
          style={{
            color: "#0f1a15",
            background: "linear-gradient(160deg, #dcc487, #a68b4b)",
            opacity: runPending ? 0.65 : 1,
          }}
        >
          Run trial
        </button>
      ) : trialPlaybackState === "running" ? (
        <button
          onClick={resetTrialReplay}
          className="rounded-md border px-3 py-[5px] text-[10.5px] font-medium"
          style={{
            color: "#dcc487",
            background: "rgba(200,169,110,0.08)",
            borderColor: "rgba(200,169,110,0.25)",
          }}
        >
          Pause
        </button>
      ) : (
        <button
          onClick={startTrialReplay}
          className="rounded-md px-3 py-[5px] text-[10.5px] font-medium tracking-[0.04em]"
          style={{
            color: "#0f1a15",
            background: "linear-gradient(160deg, #dcc487, #a68b4b)",
          }}
        >
          {trialPlaybackState === "idle" ? "Replay trial" : "Replay again"}
        </button>
      )}
      <button
        onClick={() => void rerunPhase("trial")}
        disabled={runPending}
        className="rounded-md border px-3 py-[5px] text-[10.5px] font-medium"
        style={{
          color: "#dcc487",
          background: "rgba(200,169,110,0.08)",
          borderColor: "rgba(200,169,110,0.25)",
          opacity: runPending ? 0.65 : 1,
        }}
      >
        Regenerate
      </button>
    </div>
  );

  return (
    <SectionShell id="trial" rightSlot={right} dark>
      {trial && variant ? (
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background:
              "radial-gradient(900px 450px at 50% 8%, rgba(200,169,110,0.14), transparent 60%), linear-gradient(180deg, #162b22 0%, #0f1a15 50%, #0c1610 100%)",
            border: "1px solid rgba(200,169,110,0.18)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(200,169,110,0.12)",
          }}
        >
          <div
            className="pointer-events-none absolute left-[20%] top-0 h-[200px] w-[350px] animate-spotlight"
            style={{ background: "radial-gradient(ellipse at top, rgba(220,196,135,0.18), transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute right-[20%] top-0 h-[200px] w-[350px] animate-spotlight"
            style={{
              background: "radial-gradient(ellipse at top, rgba(61,122,95,0.1), transparent 70%)",
              animationDelay: "1.5s",
            }}
          />

          <div className="relative px-6 pb-6 pt-8">
            <div className="mb-5 flex items-center justify-center">
              <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.25em]" style={{ color: "#dcc487" }}>
                <span className="h-[5px] w-[5px] rounded-full animate-stage-glow" style={{ background: "#dcc487" }} />
                On stage
                <span style={{ color: "rgba(220,196,135,0.35)" }}>·</span>
                {variant.name}
              </div>
            </div>

            <div className="mx-auto max-w-[640px] space-y-4 text-center">
              <p
                className="text-[28px] italic leading-[1.2] tracking-[-0.015em]"
                style={{ fontFamily: "var(--font-heading)", color: "#f5e8c8" }}
              >
                “{hook}”
              </p>
              <p className="text-[13px] leading-[1.7]" style={{ color: "rgba(240,232,216,0.7)" }}>
                {body}
              </p>
              <p className="pt-1 text-[11.5px] font-medium tracking-[0.05em]" style={{ color: "#c8a96e" }}>
                {cta}
              </p>
            </div>

            {verdict ? (
              <div className="mt-6 flex items-center justify-center">
                <VerdictMeter verdict={verdict} running={trialPlaybackState === "running"} />
              </div>
            ) : null}
          </div>

          <div
            className="relative px-5 pb-5 pt-4"
            style={{
              borderTop: "1px solid rgba(200,169,110,0.1)",
              background: "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, transparent 100%)",
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[9px] font-medium uppercase tracking-[0.25em]" style={{ color: "rgba(220,196,135,0.6)" }}>
                Audience · {trial.personas.length} personas
              </span>
              <span className="text-[9px] tabular-nums" style={{ color: "rgba(220,196,135,0.45)" }}>
                {revealed}/{reactions.length} reactions
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {trial.personas.map((persona, order) => {
                const reaction = reactions.find((entry) => entry.personaId === persona.id);
                const reactionIndex = reactions.findIndex((entry) => entry.personaId === persona.id);
                const hasSpoken = reactionIndex > -1 && reactionIndex < revealed;
                return (
                  <PersonaCard
                    key={persona.id}
                    name={persona.name}
                    oneLiner={persona.oneLiner}
                    glyph={persona.glyph}
                    accent={persona.accent}
                    hasSpoken={hasSpoken}
                    sentiment={hasSpoken && reaction ? reaction.sentiment : "idle"}
                    quote={hasSpoken ? reaction?.quote : undefined}
                    subScores={hasSpoken ? reaction?.subScores : undefined}
                    onOpen={() => openInspector("persona", persona.id)}
                    order={order}
                  />
                );
              })}
            </div>
          </div>

          <div
            className="flex items-center justify-between px-5 py-2"
            style={{ borderTop: "1px solid rgba(200,169,110,0.1)", background: "rgba(0,0,0,0.18)" }}
          >
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.18em]" style={{ color: "rgba(220,196,135,0.5)" }}>
              <span className="inline-flex items-center gap-1">
                <span
                  className={`h-[4px] w-[4px] rounded-full ${trialPlaybackState !== "idle" ? "animate-pulse-dot" : ""}`}
                  style={{ background: trialPlaybackState !== "idle" ? "#4a9070" : "rgba(220,196,135,0.35)" }}
                />
                {trialPlaybackState === "idle"
                  ? "Ready"
                  : trialPlaybackState === "running"
                    ? "Playing"
                    : "Complete"}
              </span>
              <span>{trial.scoreboard.length} variants scored</span>
            </div>
              <span className="text-[9px]" style={{ color: "rgba(220,196,135,0.35)" }}>
              AI-modeled audience sample · not real users
            </span>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No audience simulation yet"
          body="Run Draft and Trial to pressure-test your variants against an AI-modeled audience sample and reveal the strongest angle."
        />
      )}
    </SectionShell>
  );
}

function PersonaCard({
  name,
  oneLiner,
  glyph,
  accent,
  hasSpoken,
  sentiment,
  quote,
  subScores,
  onOpen,
  order,
}: {
  name: string;
  oneLiner: string;
  glyph: string;
  accent: string;
  hasSpoken: boolean;
  sentiment: "love" | "warm" | "neutral" | "cold" | "idle";
  quote?: string;
  subScores?: { clarity: number; resonance: number; intent: number };
  onOpen: () => void;
  order: number;
}) {
  const sentimentColor = resolveSentimentColor(sentiment);

  return (
    <button
      onClick={onOpen}
      className="group flex flex-col gap-1.5 rounded-xl p-2.5 text-left transition-all duration-300"
      style={{
        background: hasSpoken
          ? "linear-gradient(180deg, rgba(200,169,110,0.08) 0%, rgba(15,26,21,0.5) 100%)"
          : "rgba(15,26,21,0.5)",
        border: hasSpoken ? `1px solid ${accent}44` : "1px solid rgba(200,169,110,0.08)",
        boxShadow: hasSpoken ? `0 6px 20px rgba(0,0,0,0.2), inset 0 1px 0 ${accent}20` : "none",
        opacity: hasSpoken ? 1 : 0.65,
        animationDelay: `${order * 80}ms`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <div
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
          style={{
            color: hasSpoken ? "#0f1a15" : accent,
            background: hasSpoken ? accent : "rgba(200,169,110,0.06)",
            border: hasSpoken ? "none" : `1px solid ${accent}25`,
          }}
        >
          {glyph}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[10.5px] leading-none" style={{ color: hasSpoken ? "#f5e8c8" : "rgba(245,232,200,0.5)", fontWeight: 500 }}>
            {name}
          </div>
          <div className="mt-0.5 truncate text-[8.5px]" style={{ color: "rgba(220,196,135,0.4)" }}>
            {oneLiner}
          </div>
        </div>
        {hasSpoken ? (
          <span className="rounded px-1 py-[1px] text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: sentimentColor, background: `${sentimentColor}18` }}>
            {sentiment}
          </span>
        ) : null}
      </div>

      <div
        className="min-h-[44px] px-0.5 text-[10.5px] italic leading-[1.45]"
        style={{ color: hasSpoken ? "#f5e8c8" : "rgba(245,232,200,0.2)", fontFamily: "var(--font-heading)" }}
      >
        {hasSpoken ? <span className="animate-fade-in block">{quote}</span> : <ThinkingDots />}
      </div>

      {hasSpoken && subScores ? (
        <div className="grid grid-cols-3 gap-1.5 pt-0.5" style={{ borderTop: "1px solid rgba(200,169,110,0.08)" }}>
          <MiniScore label="Clar" value={subScores.clarity} accent={accent} />
          <MiniScore label="Feel" value={subScores.resonance} accent={accent} />
          <MiniScore label="Intent" value={subScores.intent} accent={accent} />
        </div>
      ) : null}
    </button>
  );
}

function MiniScore({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="flex flex-col">
      <div className="mb-[2px] flex items-baseline justify-between">
        <span className="text-[7.5px] uppercase tracking-[0.2em]" style={{ color: "rgba(220,196,135,0.4)" }}>
          {label}
        </span>
        <span className="text-[8.5px] tabular-nums" style={{ color: accent }}>
          {value}
        </span>
      </div>
      <div className="h-[2px] overflow-hidden rounded-full" style={{ background: "rgba(200,169,110,0.08)" }}>
        <div className="h-full" style={{ width: `${value}%`, background: accent }} />
      </div>
    </div>
  );
}

function VerdictMeter({
  verdict,
  running,
}: {
  verdict: { average: number; verdict: string; risk: number; resonance: number };
  running: boolean;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-full px-5 py-2.5"
      style={{
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(200,169,110,0.22)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.2)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[8.5px] uppercase tracking-[0.2em]" style={{ color: "rgba(220,196,135,0.55)" }}>
          Verdict
        </span>
        <span className="text-[22px] leading-none tabular-nums" style={{ color: "#f5e8c8", fontFamily: "var(--font-heading)" }}>
          {Math.round(verdict.average)}
        </span>
        <span className="text-[10px]" style={{ color: "rgba(220,196,135,0.4)" }}>
          /100
        </span>
      </div>
      <div className="h-4 w-px" style={{ background: "rgba(200,169,110,0.18)" }} />
      <div className="text-[10px]" style={{ color: "rgba(220,196,135,0.6)" }}>
        Resonance <span style={{ color: "#dcc487", fontWeight: 600 }}>{verdict.resonance}</span> · Risk{" "}
        <span style={{ color: "#dcc487", fontWeight: 600 }}>{verdict.risk}</span>
      </div>
      {running ? (
        <div className="flex items-center gap-1">
          <span className="h-[4px] w-[4px] rounded-full animate-pulse-dot" style={{ background: "#4a9070" }} />
          <span className="text-[9px] uppercase tracking-[0.15em]" style={{ color: "#4a9070" }}>
            Forming
          </span>
        </div>
      ) : null}
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex h-full items-center gap-1 pt-2">
      {[0, 180, 360].map((delay) => (
        <span
          key={delay}
          className="h-[3px] w-[3px] rounded-full animate-pulse-dot"
          style={{ background: "rgba(220,196,135,0.35)", animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function resolveSentimentColor(sentiment: string) {
  if (sentiment === "love") return "#8fd3a8";
  if (sentiment === "warm") return "#dcc487";
  if (sentiment === "neutral") return "#b0a99e";
  if (sentiment === "cold") return "#b58a7a";
  return "#6b6560";
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-xl border px-4 py-6 text-center"
      style={{ borderColor: "rgba(200,169,110,0.22)", background: "rgba(15,26,21,0.75)" }}
    >
      <h3 className="text-[16px]" style={{ fontFamily: "var(--font-heading)", color: "#f5e8c8" }}>
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-[12px] leading-[1.6]" style={{ color: "rgba(240,232,216,0.72)" }}>
        {body}
      </p>
    </div>
  );
}
