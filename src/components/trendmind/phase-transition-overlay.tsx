"use client";

import React from "react";

import { PHASES } from "@/lib/campaign-data";
import { useStore } from "@/lib/workspace-store";

export function PhaseTransitionOverlay() {
  const { activePhase, acceptPhaseTransition, cancelPhaseTransition, phaseTransitionTarget } = useStore();
  const [remaining, setRemaining] = React.useState(3);

  React.useEffect(() => {
    if (!phaseTransitionTarget) return;
    const reset = window.setTimeout(() => setRemaining(3), 0);
    const tick = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    const done = window.setTimeout(acceptPhaseTransition, 3000);
    return () => {
      window.clearTimeout(reset);
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [acceptPhaseTransition, phaseTransitionTarget]);

  if (!phaseTransitionTarget) return null;

  const current = PHASES.find((phase) => phase.id === activePhase)?.label;
  const next = PHASES.find((phase) => phase.id === phaseTransitionTarget)?.label;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12100d]/70 p-6 backdrop-blur-xl">
      <div
        className="w-full max-w-[520px] rounded-2xl border p-8 text-center shadow-2xl animate-gallery-lights"
        style={{ background: "linear-gradient(180deg, #fff8eb, #f2eadb)", borderColor: "rgba(200,169,110,0.35)" }}
      >
        <p className="text-[13px] font-semibold" style={{ color: "#7c6a48" }}>اكتملت مرحلة {current}</p>
        <h2
          className="mt-3 text-[38px] leading-[1.15]"
          style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
        >
          الانتقال إلى {next}
        </h2>
        <div className="mx-auto mt-7 flex h-20 w-20 items-center justify-center rounded-full border" style={{ borderColor: "#d9bf82" }}>
          <span className="text-[28px] font-bold tabular-nums" style={{ color: "#a68b4b" }}>
            {remaining}
          </span>
        </div>
        <div className="mt-7 flex items-center justify-center gap-2">
          <button
            onClick={acceptPhaseTransition}
            className="rounded-lg px-4 py-2 text-[13px] font-bold"
            style={{ color: "#f8f1df", background: "#163326" }}
          >
            الانتقال الآن
          </button>
          <button
            onClick={cancelPhaseTransition}
            className="rounded-lg border px-4 py-2 text-[13px] font-bold"
            style={{ color: "#5a4d39", borderColor: "#d9caa8", background: "rgba(255,255,255,0.45)" }}
          >
            البقاء هنا
          </button>
        </div>
      </div>
    </div>
  );
}
