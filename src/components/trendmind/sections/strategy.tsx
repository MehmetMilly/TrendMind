"use client";

import { AGENTS } from "@/lib/campaign-data";
import { useStore } from "@/lib/workspace-store";

import { SectionShell } from "./section-shell";

export function StrategySection() {
  const { campaign, openInspector, rerunPhase, runPending, setSelectedAngleId } = useStore();
  const strategy = campaign?.phases.strategy.data;
  const selectedAngleId = campaign?.selectedAngleId ?? strategy?.recommendedAngleId ?? null;

  return (
    <SectionShell
      id="strategy"
      rightSlot={
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.08em]" style={{ color: "#9b9590" }}>
            <span className="h-[3px] w-[3px] rounded-full" style={{ background: AGENTS.strategist.accent }} />
            <span style={{ color: AGENTS.strategist.accent }}>{AGENTS.strategist.short}</span>
            <span>· framing lanes</span>
          </span>
          <button
            onClick={() => void rerunPhase("strategy")}
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
      {strategy ? (
        <>
          <div
            className="mb-3 rounded-xl border px-4 py-3"
            style={{ borderColor: "#e4ded4", background: "#faf7f2" }}
          >
            <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
              Campaign thesis
            </div>
            <p className="mt-1 text-[13px] leading-[1.6]" style={{ color: "#3a3631" }}>
              {strategy.campaignThesis}
            </p>
            <p className="mt-2 text-[11px] leading-[1.5]" style={{ color: "#5a5550" }}>
              {strategy.decisionFrame}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {strategy.angles.map((angle) => (
              <div
                key={angle.id}
                className="flex flex-col rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background:
                    selectedAngleId === angle.id
                      ? "linear-gradient(180deg, #fdfaf5 0%, #f2ebd6 100%)"
                      : "#fdfaf5",
                  border:
                    selectedAngleId === angle.id
                      ? "1.5px solid #c8a96e"
                      : "1px solid #e4ded4",
                  boxShadow:
                    selectedAngleId === angle.id
                      ? "0 8px 24px rgba(200,169,110,0.18), 0 1px 3px rgba(0,0,0,0.04)"
                      : "0 1px 3px rgba(0,0,0,0.03)",
                  transform: selectedAngleId === angle.id ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                <div className="flex items-center gap-2.5 px-3.5 pb-2 pt-3.5">
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[12px] font-bold"
                    style={{
                      color: selectedAngleId === angle.id ? "#162b22" : "#a68b4b",
                      background:
                        selectedAngleId === angle.id
                          ? "linear-gradient(160deg, #dcc487, #c8a96e)"
                          : "rgba(200,169,110,0.1)",
                    }}
                  >
                    {angle.letter}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[8.5px] uppercase tracking-[0.2em]" style={{ color: "#b0a99e" }}>
                      {angle.lane}
                    </div>
                    <div
                      className="mt-0.5 truncate text-[14px] font-medium leading-none"
                      style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
                    >
                      {angle.title}
                    </div>
                  </div>
                </div>

                <div className="px-3.5 py-3">
                  <p
                    className="text-[15px] italic leading-[1.3]"
                    style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
                  >
                    “{angle.hook}”
                  </p>
                  <p className="mt-2 text-[11.5px] leading-[1.55]" style={{ color: "#3a3631" }}>
                    {angle.thesis}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 px-3.5 pb-2.5">
                  {angle.rationale.map((item, index) => (
                    <span
                      key={`${angle.id}-${index}`}
                      className="rounded px-1.5 py-[2px] text-[10px] leading-[1.35]"
                      style={{ color: "#5a5550", background: "rgba(200,169,110,0.08)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div
                  className="mt-auto flex items-center gap-1.5 px-3.5 py-2 text-[10px]"
                  style={{ background: "rgba(138,106,90,0.05)", borderTop: "1px solid #ece5d8" }}
                >
                  <span style={{ color: "#8a6a5a" }}>Risk</span>
                  <span style={{ color: "#6b5a4d" }}>{angle.risks[0]}</span>
                </div>

                <div className="flex items-center justify-between border-t px-3.5 py-2" style={{ borderColor: "#ece5d8" }}>
                  <button
                    onClick={() => openInspector("angle", angle.id)}
                    className="text-[10px] font-medium"
                    style={{ color: "#9b9590" }}
                  >
                    Inspect →
                  </button>
                  <button
                    onClick={() => void setSelectedAngleId(angle.id)}
                    className="rounded-md px-2 py-[4px] text-[10px] font-medium"
                    style={
                      selectedAngleId === angle.id
                        ? {
                            color: "#f0e8d8",
                            background: "linear-gradient(160deg, #3d7a5f, #1e3a2f)",
                          }
                        : { color: "#1e3a2f", border: "1px solid rgba(30,58,47,0.2)" }
                    }
                  >
                    {selectedAngleId === angle.id ? "Committed" : "Commit"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No strategy lanes yet"
          body="Run Research and Strategy to compare safe, sharp, and viral directions before drafting."
        />
      )}
    </SectionShell>
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
