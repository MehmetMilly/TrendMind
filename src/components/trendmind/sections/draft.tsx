"use client";

import { AGENTS } from "@/lib/campaign-data";
import type { DraftAtom, DraftVariant } from "@/lib/types";
import { useStore } from "@/lib/workspace-store";

import { SectionShell } from "./section-shell";

export function DraftSection() {
  const {
    campaign,
    openInspector,
    rerunPhase,
    runPending,
    setSelectedVariantId,
  } = useStore();
  const draft = campaign?.phases.draft.data;
  const selectedVariantId = campaign?.selectedVariantId ?? draft?.recommendedVariantId ?? null;

  const hooks = draft?.atoms.filter((atom) => atom.kind === "hook") ?? [];
  const bodies = draft?.atoms.filter((atom) => atom.kind === "body") ?? [];
  const ctas = draft?.atoms.filter((atom) => atom.kind === "cta") ?? [];

  return (
    <SectionShell
      id="draft"
      rightSlot={
        <div className="flex items-center gap-2">
          <AgentTag label={AGENTS.architect.short} accent={AGENTS.architect.accent} extra="building variants" />
          <AgentTag label={AGENTS.critic.short} accent={AGENTS.critic.accent} extra="scoring" />
          <button
            onClick={() => void rerunPhase("draft")}
            disabled={runPending}
            className="rounded-md px-2 py-[4px] text-[10px] font-medium"
            style={{
              color: "#1e3a2f",
              border: "1px solid rgba(30,58,47,0.18)",
              opacity: runPending ? 0.6 : 1,
            }}
          >
            Re-run
          </button>
        </div>
      }
    >
      {draft ? (
        <>
          <div
            className="mb-4 overflow-hidden rounded-lg border"
            style={{ background: "#fdfaf5", borderColor: "#e4ded4" }}
          >
            <div className="grid grid-cols-[1fr_1.6fr_1fr] gap-0">
              <AtomColumn title="Hooks" atoms={hooks} onSelect={openInspector} />
              <AtomColumn title="Bodies" atoms={bodies} onSelect={openInspector} border />
              <AtomColumn title="CTAs" atoms={ctas} onSelect={openInspector} border />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {draft.variants.map((variant) => (
              <VariantCard
                key={variant.id}
                atoms={draft.atoms}
                variant={variant}
                selected={selectedVariantId === variant.id}
                onInspect={() => openInspector("variant", variant.id)}
                onSelect={() => void setSelectedVariantId(variant.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No drafts yet"
          body="Run Strategy and Draft to generate structured hooks, bodies, CTAs, and launch-ready variants."
        />
      )}
    </SectionShell>
  );
}

function AgentTag({
  label,
  accent,
  extra,
}: {
  label: string;
  accent: string;
  extra: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.06em]" style={{ color: "#9b9590" }}>
      <span className="h-[3px] w-[3px] rounded-full" style={{ background: accent }} />
      <span style={{ color: accent }}>{label}</span>
      <span>· {extra}</span>
    </span>
  );
}

function AtomColumn({
  title,
  atoms,
  onSelect,
  border,
}: {
  title: string;
  atoms: DraftAtom[];
  onSelect: (kind: "draft-atom", id: string) => void;
  border?: boolean;
}) {
  return (
    <div className="flex flex-col" style={border ? { borderLeft: "1px solid #ece5d8" } : undefined}>
      <div className="flex items-center justify-between border-b px-3 py-1.5" style={{ borderColor: "#ece5d8", background: "#f5f1ea" }}>
        <span className="text-[8.5px] font-bold uppercase tracking-[0.2em]" style={{ color: "#a68b4b" }}>
          {title}
        </span>
        <span className="text-[9px] tabular-nums" style={{ color: "#b0a99e" }}>
          {atoms.length}
        </span>
      </div>
      <div className="space-y-1 p-1.5">
        {atoms.map((atom) => (
          <button
            key={atom.id}
            onClick={() => onSelect("draft-atom", atom.id)}
            className="relative w-full rounded-md border px-2 py-1.5 text-left text-[11.5px] leading-[1.4]"
            style={{ color: "#1f1d1a", background: "#fdfaf5", borderColor: "#ece5d8" }}
          >
            {atom.text}
            {atom.note ? (
              <span
                className="absolute right-1 top-1 h-[4px] w-[4px] rounded-full"
                style={{ background: "#b7863f" }}
                title={atom.note}
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function VariantCard({
  atoms,
  variant,
  selected,
  onInspect,
  onSelect,
}: {
  atoms: DraftAtom[];
  variant: DraftVariant;
  selected: boolean;
  onInspect: () => void;
  onSelect: () => void;
}) {
  const hook = atoms.find((atom) => atom.id === variant.hookId)?.text ?? "";
  const body = atoms.find((atom) => atom.id === variant.bodyId)?.text ?? "";
  const cta = atoms.find((atom) => atom.id === variant.ctaId)?.text ?? "";
  const scoreAccent = variant.score >= 90 ? "#3d7a5f" : variant.score >= 82 ? "#a68b4b" : "#8a6a5a";

  return (
    <div
      onClick={onSelect}
      className="flex cursor-pointer flex-col overflow-hidden rounded-xl transition-all duration-300"
      style={{
        background: "#fdfaf5",
        border: selected ? "1.5px solid #3d7a5f" : "1px solid #e4ded4",
        boxShadow: selected ? "0 6px 20px rgba(61,122,95,0.12)" : "0 1px 3px rgba(0,0,0,0.02)",
        transform: selected ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "#ece5d8", background: "#f5f1ea" }}>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "#a68b4b" }}>
            {variant.name}
          </span>
          <span className="text-[9px]" style={{ color: "#b0a99e" }}>
            · {variant.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="rounded px-1.5 py-[1px] text-[10px] font-bold tabular-nums"
            style={{
              color: scoreAccent,
              background: `${scoreAccent}10`,
              border: `1px solid ${scoreAccent}25`,
            }}
          >
            {variant.score}
          </span>
          {selected ? <span className="h-[5px] w-[5px] rounded-full" style={{ background: "#3d7a5f" }} /> : null}
        </div>
      </div>

      <div className="flex-1 space-y-2 p-3">
        <p className="text-[13px] italic leading-[1.3]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
          “{hook}”
        </p>
        <p className="text-[11.5px] leading-[1.5]" style={{ color: "#3a3631" }}>
          {body}
        </p>
        <p className="text-[11px] font-medium" style={{ color: "#a68b4b" }}>
          {cta}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-t px-3 py-2" style={{ borderColor: "#ece5d8", background: "rgba(200,169,110,0.03)" }}>
        {variant.critique.map((critique, index) => {
          const agent = AGENTS[critique.agent];
          return (
            <span
              key={`${variant.id}-${index}`}
              className="inline-flex items-center gap-1 rounded px-1.5 py-[2px] text-[9.5px]"
              style={{ color: "#5a5550", background: "rgba(200,169,110,0.06)" }}
            >
              <span className="h-[3px] w-[3px] rounded-full" style={{ background: agent.accent }} />
              {critique.note}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t px-3 py-1.5" style={{ borderColor: "#ece5d8" }}>
        <button onClick={(event) => { event.stopPropagation(); onInspect(); }} className="text-[9.5px] font-medium" style={{ color: "#9b9590" }}>
          Inspect →
        </button>
        <span className="text-[9px] uppercase tracking-[0.12em]" style={{ color: selected ? "#3d7a5f" : "#b0a99e" }}>
          {selected ? "Elevated" : "Elevate"}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-xl border px-4 py-6 text-center"
      style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}
    >
      <h3 className="text-[16px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-[12px] leading-[1.6]" style={{ color: "#5a5550" }}>
        {body}
      </p>
    </div>
  );
}
