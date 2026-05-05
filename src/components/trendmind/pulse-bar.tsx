"use client";

import React, { useEffect, useMemo, useState } from "react";

import { AGENTS } from "@/lib/campaign-data";
import { formatClockLabel } from "@/lib/time-format";
import { useStore } from "@/lib/workspace-store";

export function PulseBar() {
  const { campaign } = useStore();
  const activities = useMemo(
    () => (campaign?.activities ?? []).slice().reverse(),
    [campaign?.activities],
  );
  const [index, setIndex] = useState(0);
  const safeIndex = activities.length === 0 ? 0 : index % activities.length;

  useEffect(() => {
    if (activities.length <= 1) return;

    const handle = window.setInterval(() => {
      setIndex((current) => (current + 1) % activities.length);
    }, 3600);

    return () => window.clearInterval(handle);
  }, [activities.length]);

  const current = activities[safeIndex];
  const agent = current ? AGENTS[current.actor] : null;

  return (
    <div
      className="relative flex h-[26px] flex-shrink-0 items-center gap-2.5 overflow-hidden px-3"
      style={{
        background: "linear-gradient(180deg, #f0ebe1 0%, #e8e3d9 100%)",
        borderTop: "1px solid #e4ded4",
      }}
    >
      {current && agent ? (
        <>
          <div className="relative h-[6px] w-[6px]">
            <span className="absolute inset-0 rounded-full" style={{ background: agent.accent }} />
            <span
              className="absolute -inset-0.5 rounded-full animate-signal-pulse"
              style={{ background: agent.accent, opacity: 0.2 }}
            />
          </div>

          <div key={current.id} className="flex min-w-0 flex-1 items-center gap-1.5 animate-fade-in">
            <span
              className="text-[10px] font-semibold tracking-[0.04em]"
              style={{ color: agent.accent }}
            >
              {agent.short}
            </span>
            <span className="truncate text-[10.5px]" style={{ color: "#5a5550" }}>
              {current.message}
            </span>
          </div>

          <span className="text-[9px] tabular-nums" style={{ color: "#9b9590" }}>
            {formatClockLabel(current.createdAt)}
          </span>
        </>
      ) : (
        <span className="text-[10.5px]" style={{ color: "#9b9590" }}>
          ستظهر الإشارات هنا عندما تبدأ الحملة بالحركة.
        </span>
      )}

      <div
        className="absolute bottom-0 right-0 h-[1px] w-16 animate-ambient-drift"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(200,169,110,0.45), transparent)",
        }}
      />
    </div>
  );
}
