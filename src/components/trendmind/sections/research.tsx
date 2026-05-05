"use client";

import React, { useMemo, useState } from "react";

import { AGENTS, RESEARCH_KIND_META } from "@/lib/campaign-data";
import type { ResearchKind } from "@/lib/types";
import { useStore } from "@/lib/workspace-store";

import { SectionShell } from "./section-shell";

const FILTERS: Array<ResearchKind | "all"> = [
  "all",
  "trend",
  "audience",
  "competitive",
  "risk",
  "fact",
];

export function ResearchSection() {
  const { campaign, inspector, openInspector, rerunPhase, runPending } = useStore();
  const [filter, setFilter] = useState<ResearchKind | "all">("all");
  const research = campaign?.phases.research.data;

  const items = useMemo(() => {
    const allItems = research?.items ?? [];
    if (filter === "all") return allItems;
    return allItems.filter((item) => item.kind === filter);
  }, [filter, research?.items]);

  const right = (
    <div className="flex items-center gap-1">
      {FILTERS.map((entry) => {
        const active = filter === entry;
        return (
          <button
            key={entry}
            onClick={() => setFilter(entry)}
            className="rounded-md px-1.5 py-[3px] text-[9.5px] font-medium uppercase tracking-[0.1em] transition-all"
            style={{
              color: active ? "#1f1d1a" : "#b0a99e",
              background: active ? "rgba(200,169,110,0.15)" : "transparent",
            }}
          >
            {entry}
          </button>
        );
      })}
      <button
        onClick={() => void rerunPhase("research")}
        disabled={runPending}
        className="ml-2 rounded-md px-2 py-[4px] text-[10px] font-medium"
        style={{
          color: "#1e3a2f",
          border: "1px solid rgba(30,58,47,0.18)",
          opacity: runPending ? 0.6 : 1,
        }}
      >
        Re-run
      </button>
    </div>
  );

  return (
    <SectionShell id="research" rightSlot={right}>
      {research ? (
        <>
          <div
            className="mb-3 rounded-xl border px-4 py-3"
            style={{ borderColor: "#e4ded4", background: "#faf7f2" }}
          >
            <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
              Research readout
            </div>
            <p className="mt-1 text-[13px] leading-[1.6]" style={{ color: "#3a3631" }}>
              {research.overview}
            </p>
            <div className="mt-2 text-[11px]" style={{ color: "#5a5550" }}>
              Focus: {research.recommendedFocus}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2.5">
            {items.map((item, index) => {
              const meta = RESEARCH_KIND_META[item.kind];
              const agent = AGENTS[item.by];
              const selected = inspector.kind === "research" && inspector.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => openInspector("research", item.id)}
                  className="group flex flex-col gap-1.5 rounded-lg p-3 text-left transition-all duration-200"
                  style={{
                    gridColumn: `span ${cardSpan(index)}`,
                    background: selected ? "#faf7f2" : "#fdfaf5",
                    border: selected ? "1px solid #c8a96e" : "1px solid #e8e2d8",
                    boxShadow: selected
                      ? "0 4px 16px rgba(200,169,110,0.15)"
                      : "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1 rounded px-1 py-[1px] text-[8.5px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: meta.accent, background: meta.background }}
                    >
                      <span className="h-[3px] w-[3px] rounded-full" style={{ background: meta.accent }} />
                      {meta.label}
                    </span>
                    <Confidence value={item.confidence} accent={meta.accent} />
                  </div>

                  <h3 className="text-[12.5px] font-medium leading-[1.3]" style={{ color: "#1f1d1a" }}>
                    {item.title}
                  </h3>
                  <p className="line-clamp-3 text-[11px] leading-[1.45]" style={{ color: "#6b6560" }}>
                    {item.summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[8.5px] uppercase tracking-[0.06em]" style={{ color: "#9b9590" }}>
                      <span className="h-[3px] w-[3px] rounded-full" style={{ background: agent.accent }} />
                      <span style={{ color: agent.accent }}>{agent.short}</span>
                    </span>
                    <span className="max-w-[55%] truncate text-[9px]" style={{ color: "#b0a99e" }} title={item.source}>
                      {item.source}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <EmptyPhase
          title="No research yet"
          body="Run the campaign from Research to fill this board with audience signals, risks, and source-backed context."
        />
      )}
    </SectionShell>
  );
}

function cardSpan(index: number) {
  const pattern = [5, 4, 3, 6, 3, 3];
  return pattern[index % pattern.length] ?? 4;
}

function Confidence({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[9px] tabular-nums" style={{ color: "#b0a99e" }}>
        {value}%
      </span>
      <div className="h-[2px] w-10 overflow-hidden rounded-full" style={{ background: "rgba(200,169,110,0.12)" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: accent }} />
      </div>
    </div>
  );
}

function EmptyPhase({ title, body }: { title: string; body: string }) {
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
