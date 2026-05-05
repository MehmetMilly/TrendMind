"use client";

import { PHASES } from "@/lib/campaign-data";
import { useStore } from "@/lib/workspace-store";

export function PhaseRibbon() {
  const { activePhase, campaign, phaseStatus, scrollToPhase } = useStore();
  const activeIndex = PHASES.findIndex((phase) => phase.id === activePhase);
  const readyCount = PHASES.filter((phase) => phaseStatus[phase.id] === "ready").length;

  return (
    <div
      className="relative flex h-[34px] flex-shrink-0 items-stretch gap-0 px-3"
      style={{ background: "#f3eee5", borderBottom: "1px solid #e4ded4" }}
    >
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px]">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${(readyCount / PHASES.length) * 100}%`,
            background:
              "linear-gradient(90deg, transparent, #c8a96e 15%, #c8a96e 85%, transparent)",
            boxShadow: "0 0 8px rgba(200,169,110,0.35)",
          }}
        />
      </div>

      {PHASES.map((phase, index) => {
        const isActive = phase.id === activePhase;
        const status = phaseStatus[phase.id];
        const isPast = index < activeIndex;

        return (
          <button
            key={phase.id}
            onClick={() => scrollToPhase(phase.id)}
            className="relative flex items-center gap-1.5 px-2.5 transition-all duration-200"
            style={{
              color: isActive ? "#1f1d1a" : isPast ? "#5a5550" : "#9b9590",
              background: isActive ? "rgba(200,169,110,0.12)" : "transparent",
              borderRadius: "6px",
            }}
          >
            <span
              className="text-[9px] font-bold tabular-nums"
              style={{
                color: isActive ? "#a68b4b" : isPast ? "#c8a96e" : "#bfb8ae",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className="text-[11.5px] font-medium tracking-[-0.005em]"
              style={{ fontFamily: isActive ? "var(--font-heading)" : undefined }}
            >
              {phase.label}
            </span>
            {status === "stale" ? (
              <span className="h-[5px] w-[5px] rounded-full" style={{ background: "#b7863f" }} />
            ) : null}
            {status === "running" || status === "pending" ? (
              <span
                className="h-[5px] w-[5px] rounded-full animate-pulse-dot"
                style={{ background: "#4a9070" }}
              />
            ) : null}
            {status === "error" ? (
              <span className="h-[5px] w-[5px] rounded-full" style={{ background: "#b25b50" }} />
            ) : null}
          </button>
        );
      })}

      <div className="flex-1" />
      <div
        className="self-center rounded-full px-1.5 py-[3px] text-[9px] uppercase tracking-[0.12em]"
        style={{
          color: "#9b9590",
          background: "rgba(200,169,110,0.06)",
          border: "1px solid rgba(200,169,110,0.12)",
        }}
      >
        {campaign?.status ?? "draft"}
      </div>
    </div>
  );
}
