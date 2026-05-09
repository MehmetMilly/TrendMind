"use client";

import { AGENTS } from "@/lib/campaign-data";
import { useStore } from "@/lib/workspace-store";

import { SectionShell } from "./section-shell";

export function StudioSection() {
  const { campaign, inspector, openInspector, rerunPhase, runPending } = useStore();
  const studio = campaign?.phases.studio.data;
  const draft = campaign?.phases.draft.data;
  const variant =
    draft?.variants.find((entry) => entry.id === studio?.selectedVariantId) ??
    draft?.variants.find((entry) => entry.id === campaign?.selectedVariantId) ??
    draft?.variants[0];
  const hook = draft?.atoms.find((atom) => atom.id === variant?.hookId)?.text ?? "";
  const cta = draft?.atoms.find((atom) => atom.id === variant?.ctaId)?.text ?? "";

  return (
    <SectionShell
      id="studio"
      rightSlot={
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.08em]" style={{ color: "#9b9590" }}>
            <span className="h-[3px] w-[3px] rounded-full" style={{ background: AGENTS.visual.accent }} />
            <span style={{ color: AGENTS.visual.accent }}>{AGENTS.visual.short}</span>
            <span>· composing</span>
          </span>
          <button
            onClick={() => void rerunPhase("studio")}
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
      {studio ? (
        <>
          <div className="grid grid-cols-[1.6fr_1fr] gap-3">
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: "linear-gradient(180deg, #1a1612 0%, #242019 100%)",
                border: "1px solid rgba(200,169,110,0.15)",
                boxShadow:
                  "0 16px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(200,169,110,0.08)",
                minHeight: "460px",
              }}
            >
              <AdCanvas hook={hook} cta={cta} palette={studio.palette} />
              <div className="absolute left-3 top-2.5 z-20 flex items-center gap-1.5" style={{ color: "rgba(245,232,200,0.7)" }}>
                <span className="h-[5px] w-[5px] rounded-full" style={{ background: "#c8a96e" }} />
                <span className="text-[9px] font-medium uppercase tracking-[0.2em]">Preview · 4:5</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
                <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
                  الاتجاه البصري
                </div>
                <p className="mt-1 text-[12px] leading-[1.6]" style={{ color: "#3a3631" }}>
                  {studio.summary}
                </p>
                <p className="mt-2 text-[11px] leading-[1.55]" style={{ color: "#5a5550" }}>
                  {studio.composition}
                </p>
              </div>

              <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
                <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "#ece5d8", background: "#f5f1ea" }}>
                  <span className="text-[8.5px] font-bold uppercase tracking-[0.2em]" style={{ color: "#a68b4b" }}>
                    الطبقات
                  </span>
                  <span className="text-[9px] tabular-nums" style={{ color: "#b0a99e" }}>
                    {studio.layers.length}
                  </span>
                </div>
                <div>
                  {[...studio.layers].reverse().map((layer) => {
                    const selected = inspector.kind === "layer" && inspector.id === layer.id;
                    return (
                      <button
                        key={layer.id}
                        onClick={() => openInspector("layer", layer.id)}
                        className="flex w-full items-center gap-2.5 border-b px-3 py-2 text-left transition-all"
                        style={{
                          borderColor: "#ece5d8",
                          background: selected ? "rgba(200,169,110,0.07)" : "transparent",
                          borderLeft: selected ? "2px solid #c8a96e" : "2px solid transparent",
                        }}
                      >
                        <div
                          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[9px] font-medium"
                          style={{ background: "rgba(200,169,110,0.08)", color: "#a68b4b" }}
                        >
                          {layer.kind[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11.5px] font-medium" style={{ color: "#1f1d1a" }}>
                            {layer.name}
                          </div>
                          <div className="truncate text-[10px]" style={{ color: "#9b9590" }}>
                            {layer.note}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
                <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
                  لوحة الألوان والموجه
                </div>
                <div className="mt-2 flex gap-2">
                  {studio.palette.map((color) => (
                    <div key={color} className="flex flex-col items-center gap-1">
                      <span
                        className="h-7 w-7 rounded-full border"
                        style={{ background: color, borderColor: "rgba(0,0,0,0.08)" }}
                      />
                      <span className="text-[9px]" style={{ color: "#9b9590" }}>
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10.5px] leading-[1.55]" style={{ color: "#5a5550" }}>
                  {studio.imagePrompt}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
              <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
                الأبعاد
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {studio.formats.map((format) => (
                  <div
                    key={format.id}
                    className="rounded-lg border px-3 py-2"
                    style={{ borderColor: "#ece5d8", background: "#faf7f2" }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span style={{ color: "#1f1d1a", fontWeight: 500 }}>{format.name}</span>
                      <span style={{ color: "#9b9590" }}>{format.size}</span>
                    </div>
                    <div className="mt-1 text-[10px]" style={{ color: "#5a5550" }}>
                      {format.layoutNote}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
              <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
                قائمة الأصول
              </div>
              <div className="mt-2 space-y-2">
                {studio.assetChecklist.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex gap-2 text-[11px]" style={{ color: "#5a5550" }}>
                    <span style={{ color: "#3d7a5f" }}>•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          title="No studio direction yet"
          body="Run Trial and Studio to turn the winning message into a visual system with prompt, palette, and format guidance."
        />
      )}
    </SectionShell>
  );
}

function AdCanvas({
  hook,
  cta,
  palette,
}: {
  hook: string;
  cta: string;
  palette: string[];
}) {
  const [light, gold, dark] = [palette[0] ?? "#F4EADB", palette[1] ?? "#C8A96E", palette[2] ?? "#18251F"];

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(520px 260px at 58% 28%, ${light}66, transparent 70%), radial-gradient(420px 240px at 28% 78%, ${gold}40, transparent 70%), linear-gradient(160deg, ${dark} 0%, #2a1f16 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(92deg, rgba(255,230,180,0.7) 0, rgba(255,230,180,0.7) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(2deg, rgba(255,230,180,0.7) 0, rgba(255,230,180,0.7) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-[155px] w-[180px]" style={{ filter: "drop-shadow(0 32px 32px rgba(0,0,0,0.4))" }}>
          <div
            className="absolute inset-x-6 top-6 rounded-[6px]"
            style={{
              bottom: 0,
              background: `linear-gradient(180deg, ${light} 0%, ${gold} 60%, #ab8d5a 100%)`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -4px 8px rgba(0,0,0,0.12)",
            }}
          />
          <div className="absolute bottom-0 left-1/2 top-0 w-[18px] -translate-x-1/2" style={{ background: "linear-gradient(90deg, #6d4f33 0%, #8c6a45 50%, #6d4f33 100%)" }} />
          <div className="absolute left-0 right-0 top-[48%] h-[14px] -translate-y-1/2" style={{ background: "linear-gradient(180deg, #6d4f33 0%, #8c6a45 50%, #6d4f33 100%)" }} />
          <div className="absolute left-1/2 top-[8px] h-[26px] w-[65px] -translate-x-1/2 rounded-full" style={{ background: "linear-gradient(180deg, #8c6a45 0%, #6d4f33 100%)" }} />
        </div>
      </div>
      <div className="absolute bottom-28 left-0 right-0 flex justify-center px-8">
        <p
          className="max-w-[440px] text-center text-[30px] italic leading-[1.15] tracking-[-0.015em]"
          style={{ fontFamily: "var(--font-heading)", color: "#f5e8c8", textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}
        >
          “{hook}”
        </p>
      </div>
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div
          className="rounded-full px-4 py-2 text-[11.5px] font-medium tracking-[0.06em]"
          style={{
            color: "#162b22",
            background: "linear-gradient(160deg, #dcc487, #a68b4b)",
            boxShadow: "0 6px 20px rgba(200,169,110,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          {cta}
        </div>
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
