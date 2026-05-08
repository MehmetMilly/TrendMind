"use client";

import type { PhaseId } from "@/lib/types";

const BACKDROPS: Record<PhaseId, string> = {
  brief:
    "radial-gradient(720px 360px at 82% 2%, rgba(200,169,110,0.2), transparent 58%), linear-gradient(180deg, #fbf6ec, #f2ece1)",
  research:
    "radial-gradient(circle at 18% 18%, rgba(61,122,95,0.12), transparent 28%), repeating-linear-gradient(180deg, rgba(61,122,95,0.05) 0 1px, transparent 1px 26px), #f5f1ea",
  strategy:
    "linear-gradient(90deg, rgba(61,122,95,0.08), transparent 30%, rgba(200,169,110,0.08) 54%, transparent 78%, rgba(138,106,90,0.08)), #f5f1ea",
  draft:
    "linear-gradient(rgba(31,29,26,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(31,29,26,0.025) 1px, transparent 1px), #f7f1e7",
  trial:
    "radial-gradient(720px 380px at 84% 4%, rgba(61,122,95,0.13), transparent 60%), radial-gradient(620px 360px at 18% 18%, rgba(200,169,110,0.16), transparent 64%), linear-gradient(rgba(31,29,26,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(31,29,26,0.022) 1px, transparent 1px), #f7f1e7",
  studio:
    "linear-gradient(rgba(61,122,95,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(61,122,95,0.06) 1px, transparent 1px), radial-gradient(760px 460px at 50% 18%, rgba(255,255,255,0.8), transparent 62%), #efe9df",
  launch:
    "radial-gradient(720px 360px at 82% 6%, rgba(200,169,110,0.18), transparent 58%), linear-gradient(rgba(31,29,26,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(31,29,26,0.022) 1px, transparent 1px), #f7f1e7",
};

export function PhaseBackdrop({ phase }: { phase: PhaseId }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        key={phase}
        className="absolute inset-0 animate-backdrop-float"
        style={{
          background: BACKDROPS[phase],
          backgroundSize: phase === "studio" || phase === "draft" || phase === "trial" ? "auto, auto, 36px 36px, 36px 36px, auto" : undefined,
          opacity: 0.92,
        }}
      />
    </div>
  );
}
