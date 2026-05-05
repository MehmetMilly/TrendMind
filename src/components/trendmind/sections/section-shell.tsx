"use client";

import { PHASES } from "@/lib/campaign-data";
import type { PhaseId } from "@/lib/types";
import { useStore } from "@/lib/workspace-store";

export function SectionShell({
  id,
  children,
  accent = "#c8a96e",
  rightSlot,
  dramatic = false,
  dark = false,
}: {
  id: PhaseId;
  children: React.ReactNode;
  accent?: string;
  rightSlot?: React.ReactNode;
  dramatic?: boolean;
  dark?: boolean;
}) {
  const { phaseStatus, registerSectionRef } = useStore();
  const phase = PHASES.find((entry) => entry.id === id)!;
  const status = phaseStatus[id];

  return (
    <section
      ref={(node) => registerSectionRef(id, node)}
      data-phase={id}
      className={`relative scroll-mt-4 ${dramatic ? "py-6" : "py-4"}`}
      style={
        dark
          ? {
              background:
                "linear-gradient(180deg, #0c1610 0%, #0f1a15 20%, #0f1a15 80%, #0c1610 100%)",
              margin: "0 -0.5px",
            }
          : dramatic
            ? {
                background:
                  "linear-gradient(180deg, #f5f1ea 0%, #efe8dc 40%, #f5f1ea 100%)",
              }
            : undefined
      }
    >
      <header className="mx-auto mb-3 flex max-w-[1200px] items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="text-[9px] font-bold tabular-nums tracking-[0.16em]"
            style={{ color: dark ? "rgba(200,169,110,0.6)" : accent }}
          >
            {String(phase.index + 1).padStart(2, "0")}
          </span>
          <h2
            className="text-[18px] leading-none tracking-[-0.01em]"
            style={{
              fontFamily: "var(--font-heading)",
              color: dark ? "#f5e8c8" : "#1f1d1a",
            }}
          >
            {phase.label}
          </h2>
          {status === "stale" ? (
            <span
              className="ml-1 h-[5px] w-[5px] rounded-full"
              style={{ background: "#b7863f" }}
              title="Stale after upstream changes"
            />
          ) : null}
          {status === "running" || status === "pending" ? (
            <span
              className="ml-1 h-[5px] w-[5px] rounded-full animate-pulse-dot"
              style={{ background: "#4a9070" }}
              title="In progress"
            />
          ) : null}
          {status === "error" ? (
            <span
              className="ml-1 h-[5px] w-[5px] rounded-full"
              style={{ background: "#b25b50" }}
              title="Needs attention"
            />
          ) : null}
        </div>
        {rightSlot}
      </header>
      <div className="mx-auto max-w-[1200px] px-6">{children}</div>
    </section>
  );
}

export function Attribution({
  agentShort,
  accent,
  extra,
}: {
  agentShort: string;
  accent: string;
  extra?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.08em]"
      style={{ color: "#9b9590" }}
    >
      <span className="inline-block h-[4px] w-[4px] rounded-full" style={{ background: accent }} />
      <span style={{ color: accent }}>{agentShort}</span>
      {extra ? <span>· {extra}</span> : null}
    </span>
  );
}
