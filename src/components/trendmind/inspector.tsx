"use client";

import React from "react";

import { AGENTS } from "@/lib/campaign-data";
import { useStore } from "@/lib/workspace-store";

export function Inspector() {
  const { campaign, closeInspector, inspector } = useStore();
  const open = inspector.kind !== null;

  return (
    <>
      <div
        onClick={closeInspector}
        className="absolute inset-0 z-[45] bg-black/8 transition-opacity duration-200"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      />
      <aside
        className="absolute right-0 top-0 z-[50] flex h-full flex-col transition-transform duration-300 ease-out"
        style={{
          width: "min(400px, 36vw)",
          transform: open ? "translateX(0)" : "translateX(105%)",
          background: "#fdfaf5",
          borderLeft: "1px solid #d8d0c4",
          boxShadow: open ? "-20px 0 50px rgba(0,0,0,0.1), -2px 0 8px rgba(0,0,0,0.05)" : "none",
        }}
      >
        <header className="flex h-[38px] flex-shrink-0 items-center justify-between px-4" style={{ borderBottom: "1px solid #e4ded4", background: "#f5f1ea" }}>
          <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.2em]" style={{ color: "#9b9590" }}>
            <span className="h-[4px] w-[4px] rounded-full" style={{ background: "#c8a96e" }} />
            Inspector
            {inspector.kind ? <span style={{ color: "#5a5550" }}>· {labelForKind(inspector.kind)}</span> : null}
          </div>
          <button
            aria-label="Close inspector"
            onClick={closeInspector}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors"
            style={{ color: "#9b9590" }}
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {open && campaign ? <InspectorBody /> : null}
        </div>
      </aside>
    </>
  );
}

function labelForKind(kind: string) {
  return {
    research: "Research",
    angle: "Angle",
    "draft-atom": "Draft",
    variant: "Variant",
    persona: "Persona",
    layer: "Layer",
  }[kind];
}

function InspectorBody() {
  const {
    campaign,
    directorDraft,
    inspector,
    openDirector,
    rerunPhase,
    setDirectorDraft,
    setSelectedAngleId,
    setSelectedVariantId,
  } = useStore();

  if (!campaign || !inspector.kind || !inspector.id) return null;

  if (inspector.kind === "research") {
    const item = campaign.phases.research.data?.items.find((entry) => entry.id === inspector.id);
    if (!item) return null;
    const agent = AGENTS[item.by];
    return (
      <Frame>
        <KindHeader title={item.title} sub={item.kind} />
        <p className="text-[12px] leading-[1.6]" style={{ color: "#3a3631" }}>
          {item.summary}
        </p>
        <Divider />
        <MetaRow label="Source" value={item.source} />
        <MetaRow label="Confidence" value={`${item.confidence}%`} />
        <MetaRow label="By" value={agent.name} accent={agent.accent} />
        <MetaRow label="Tags" value={item.tags.join(", ")} />
        <ActionRow>
          <ButtonPrimary
            onClick={() => {
              setDirectorDraft({
                ...directorDraft,
                phase: "strategy",
                note: `Lean harder on this signal: ${item.title}`,
              });
              openDirector("strategy");
            }}
          >
            Send to Strategy
          </ButtonPrimary>
          <ButtonGhost onClick={() => void rerunPhase("research")}>Refresh</ButtonGhost>
        </ActionRow>
      </Frame>
    );
  }

  if (inspector.kind === "angle") {
    const angle = campaign.phases.strategy.data?.angles.find((entry) => entry.id === inspector.id);
    if (!angle) return null;
    return (
      <Frame>
        <KindHeader title={angle.title} sub={`Angle ${angle.letter} · ${angle.lane}`} />
        <p className="text-[13px] italic leading-[1.5]" style={{ color: "#1f1d1a", fontFamily: "var(--font-heading)" }}>
          “{angle.hook}”
        </p>
        <Divider />
        <Section title="Thesis">{angle.thesis}</Section>
        <Section title="Promise">{angle.promise}</Section>
        <Section title="Rationale">
          {angle.rationale.map((entry, index) => (
            <Bullet key={`${entry}-${index}`}>{entry}</Bullet>
          ))}
        </Section>
        <Section title="Risk">
          {angle.risks.map((entry, index) => (
            <Bullet key={`${entry}-${index}`}>{entry}</Bullet>
          ))}
        </Section>
        <ActionRow>
          <ButtonPrimary onClick={() => void setSelectedAngleId(angle.id)}>Commit</ButtonPrimary>
          <ButtonGhost onClick={() => void rerunPhase("strategy")}>Re-run</ButtonGhost>
        </ActionRow>
      </Frame>
    );
  }

  if (inspector.kind === "draft-atom") {
    const atom = campaign.phases.draft.data?.atoms.find((entry) => entry.id === inspector.id);
    if (!atom) return null;
    return (
      <Frame>
        <KindHeader title={atom.kind.toUpperCase()} sub="Draft piece" />
        <div className="rounded-lg px-3 py-2.5 text-[12.5px] leading-[1.55]" style={{ background: "#f0ebe1", color: "#1f1d1a", border: "1px solid #e4ded4" }}>
          {atom.text}
        </div>
        {atom.note ? <Section title="Note">{atom.note}</Section> : null}
        <ActionRow>
          <ButtonPrimary
            onClick={() => {
              setDirectorDraft({
                ...directorDraft,
                phase: "draft",
                note: `Keep this ${atom.kind} energy, but generate stronger alternates around: ${atom.text}`,
              });
              openDirector("draft");
            }}
          >
            Ask for alternates
          </ButtonPrimary>
          <ButtonGhost onClick={() => void rerunPhase("draft")}>Re-run Draft</ButtonGhost>
        </ActionRow>
      </Frame>
    );
  }

  if (inspector.kind === "variant") {
    const draft = campaign.phases.draft.data;
    const variant = draft?.variants.find((entry) => entry.id === inspector.id);
    if (!draft || !variant) return null;
    const hook = draft.atoms.find((atom) => atom.id === variant.hookId)?.text ?? "";
    const body = draft.atoms.find((atom) => atom.id === variant.bodyId)?.text ?? "";
    const cta = draft.atoms.find((atom) => atom.id === variant.ctaId)?.text ?? "";

    return (
      <Frame>
        <KindHeader title={variant.name} sub={`${variant.id} · ${variant.score}/100`} />
        <Section title="Composition">
          <StackLine label="Hook" text={hook} />
          <StackLine label="Body" text={body} />
          <StackLine label="CTA" text={cta} />
        </Section>
        <Section title="Critique">
          {variant.critique.map((entry, index) => {
            const agent = AGENTS[entry.agent];
            return (
              <div key={`${entry.note}-${index}`} className="mb-1.5 flex items-start gap-1.5 last:mb-0">
                <span
                  className="mt-[1px] rounded px-1 py-[1px] text-[9px] font-bold tracking-[0.04em]"
                  style={{ color: agent.accent, background: `${agent.accent}12` }}
                >
                  {agent.short}
                </span>
                <p className="text-[11.5px] leading-[1.5]" style={{ color: "#3a3631" }}>
                  {entry.note}
                </p>
              </div>
            );
          })}
        </Section>
        <ActionRow>
          <ButtonPrimary onClick={() => void setSelectedVariantId(variant.id)}>Elevate</ButtonPrimary>
          <ButtonGhost onClick={() => void rerunPhase("trial")}>Send to Trial</ButtonGhost>
        </ActionRow>
      </Frame>
    );
  }

  if (inspector.kind === "persona") {
    const trial = campaign.phases.trial.data;
    const persona = trial?.personas.find((entry) => entry.id === inspector.id);
    if (!trial || !persona) return null;
    const reactions = trial.reactions.filter((entry) => entry.personaId === persona.id);
    return (
      <Frame>
        <KindHeader title={persona.name} sub={persona.archetype} />
        <p className="text-[12px]" style={{ color: "#3a3631" }}>
          {persona.oneLiner}
        </p>
        <Divider />
        <Section title="Reaction feed">
          {reactions.map((reaction) => (
            <div key={reaction.id} className="mb-2 rounded-md border px-2.5 py-2 last:mb-0" style={{ background: "#f0ebe1", borderColor: "#e4ded4" }}>
              <div className="mb-0.5 flex items-center justify-between text-[9.5px] uppercase" style={{ color: "#9b9590" }}>
                <span>{reaction.variantId}</span>
                <span style={{ color: resolveSentimentColor(reaction.sentiment) }}>{reaction.sentiment}</span>
              </div>
              <p className="text-[11.5px] italic leading-[1.5]" style={{ color: "#3a3631", fontFamily: "var(--font-heading)" }}>
                {reaction.quote}
              </p>
              <p className="mt-1 text-[10px] leading-[1.45]" style={{ color: "#5a5550" }}>
                {reaction.why}
              </p>
            </div>
          ))}
        </Section>
      </Frame>
    );
  }

  if (inspector.kind === "layer") {
    const layer = campaign.phases.studio.data?.layers.find((entry) => entry.id === inspector.id);
    if (!layer) return null;
    return (
      <Frame>
        <KindHeader title={layer.name} sub={`Studio · ${layer.kind}`} />
        <p className="text-[12px]" style={{ color: "#3a3631" }}>
          {layer.note}
        </p>
        <Divider />
        <ActionRow>
          <ButtonPrimary onClick={() => void rerunPhase("studio")}>Regenerate studio</ButtonPrimary>
          <ButtonGhost
            onClick={() => {
              setDirectorDraft({
                ...directorDraft,
                phase: "studio",
                note: `Refine the ${layer.name.toLowerCase()} layer: ${layer.note}`,
              });
              openDirector("studio");
            }}
          >
            Direct refinement
          </ButtonGhost>
        </ActionRow>
      </Frame>
    );
  }

  return null;
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3 p-4 animate-fade-in">{children}</div>;
}

function KindHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <div className="mb-0.5 text-[9px] uppercase tracking-[0.2em]" style={{ color: "#9b9590" }}>
        {sub}
      </div>
      <h2 className="text-[16px] leading-[1.2] tracking-[-0.01em]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
        {title}
      </h2>
    </div>
  );
}

function Divider() {
  return <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #e4ded4 25%, #e4ded4 75%, transparent)" }} />;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em]" style={{ color: "#9b9590" }}>
        {title}
      </div>
      <div className="text-[12px] leading-[1.6]" style={{ color: "#5a5550" }}>
        {children}
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 flex gap-1.5 last:mb-0">
      <span style={{ color: "#c8a96e" }}>•</span>
      <span>{children}</span>
    </div>
  );
}

function MetaRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-[11.5px]">
      <span style={{ color: "#9b9590" }}>{label}</span>
      <span style={{ color: accent ?? "#1f1d1a", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function StackLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="mb-1.5 last:mb-0">
      <div className="mb-0.5 text-[8.5px] uppercase tracking-[0.2em]" style={{ color: "#b0a99e" }}>
        {label}
      </div>
      <div className="rounded-md px-2.5 py-1.5 text-[11.5px] leading-[1.5]" style={{ background: "#f0ebe1", color: "#1f1d1a", border: "1px solid #e4ded4" }}>
        {text}
      </div>
    </div>
  );
}

function ActionRow({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 pt-1">{children}</div>;
}

function ButtonPrimary({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all"
      style={{
        color: "#f0e8d8",
        background: "linear-gradient(160deg, #2d5a47, #1e3a2f)",
        boxShadow: "0 2px 8px rgba(30,58,47,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </button>
  );
}

function ButtonGhost({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all"
      style={{ color: "#5a5550", border: "1px solid #d8d0c4" }}
    >
      {children}
    </button>
  );
}

function resolveSentimentColor(sentiment: string) {
  if (sentiment === "love") return "#3d7a5f";
  if (sentiment === "warm") return "#a68b4b";
  if (sentiment === "neutral") return "#6b6560";
  return "#8a6a5a";
}
