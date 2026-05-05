"use client";

import React from "react";

import { AGENTS } from "@/lib/campaign-data";
import type { AgentId } from "@/lib/types";

export function AgentPeek({
  agent = "director",
  reasoning,
  children,
}: {
  agent?: AgentId;
  reasoning: string;
  children: React.ReactNode;
}) {
  const meta = AGENTS[agent];

  return (
    <span className="group/peek relative inline-block focus-within:z-20">
      {children}
      <span
        className="pointer-events-none absolute right-0 top-[calc(100%+8px)] z-30 hidden w-[260px] rounded-xl border px-3 py-2 text-start shadow-xl group-hover/peek:block group-focus-within/peek:block"
        style={{ background: "#fffaf2", borderColor: "rgba(200,169,110,0.28)", color: "#4b443c" }}
      >
        <span className="mb-1 flex items-center gap-2 text-[11px] font-bold" style={{ color: meta.accent }}>
          <span className="h-2 w-2 rounded-full" style={{ background: meta.accent }} />
          {meta.name}
        </span>
        <span className="block text-[11px] leading-[1.7]">{reasoning}</span>
      </span>
    </span>
  );
}
