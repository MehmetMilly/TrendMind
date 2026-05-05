"use client";

import { Play, Save, Sparkles } from "lucide-react";

import { PHASES } from "@/lib/campaign-data";
import { useStore } from "@/lib/workspace-store";

export function DirectorDrawer() {
  const {
    applyDirectorRun,
    closeDirector,
    directorDraft,
    directorOpen,
    runPending,
    setDirectorDraft,
    storeDirectorNote,
  } = useStore();

  return (
    <aside
      className="absolute right-0 top-0 z-[60] flex h-full flex-col border-l transition-transform duration-300"
      style={{
        width: "min(360px, 100vw)",
        transform: directorOpen ? "translateX(0)" : "translateX(104%)",
        background: "#fdfaf5",
        borderColor: "#e4ded4",
        boxShadow: directorOpen ? "-20px 0 50px rgba(0,0,0,0.12)" : "none",
      }}
    >
      <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "#e4ded4", background: "#f5f1ea" }}>
        <div>
          <div className="text-[8.5px] uppercase tracking-[0.22em]" style={{ color: "#3d7a5f" }}>
            Director
          </div>
          <h2
            className="mt-0.5 text-[15px] tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
          >
            Change the direction
          </h2>
        </div>
        <button
          onClick={closeDirector}
          className="rounded-md px-2 py-1 text-[10px] font-medium"
          style={{ color: "#6b6560", background: "rgba(200,169,110,0.08)" }}
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#f8f4ed" }}>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={14} color="#3d7a5f" />
            <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#9b9590" }}>
              Apply from phase
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PHASES.filter((phase) => phase.id !== "brief").map((phase) => {
              const active = directorDraft.phase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setDirectorDraft({ ...directorDraft, phase: phase.id })}
                  className="rounded-lg border px-2 py-2 text-left text-[11px] transition-all"
                  style={{
                    borderColor: active ? "#3d7a5f" : "#e4ded4",
                    background: active ? "rgba(61,122,95,0.08)" : "#fdfaf5",
                    color: active ? "#1e3a2f" : "#5a5550",
                  }}
                >
                  {phase.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#9b9590" }}>
            Direction note
          </div>
          <textarea
            aria-label="Direction note"
            value={directorDraft.note}
            onChange={(event) =>
              setDirectorDraft({ ...directorDraft, note: event.target.value })
            }
            rows={9}
            placeholder="Example: keep the emotional warmth, but make the hook less poetic and more product-specific."
            className="w-full rounded-xl border bg-transparent px-3 py-3 text-[12px] leading-[1.55] resize-none"
            style={{ borderColor: "#e4ded4", color: "#1f1d1a" }}
          />
          <div className="mt-2 text-[10px]" style={{ color: "#9b9590" }}>
            This gets saved to the campaign history and can be applied as a targeted rerun from the phase you selected.
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-3" style={{ borderColor: "#e4ded4", background: "#f5f1ea" }}>
        <div className="flex gap-2">
          <button
            onClick={() => void storeDirectorNote()}
            disabled={!directorDraft.note.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium"
            style={{
              color: "#5a5550",
              border: "1px solid #d8d0c4",
              opacity: directorDraft.note.trim() ? 1 : 0.6,
            }}
          >
            <Save size={14} />
            Store note
          </button>
          <button
            onClick={() => void applyDirectorRun()}
            disabled={!directorDraft.note.trim() || runPending}
            className="flex flex-[1.2] items-center justify-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium"
            style={{
              color: "#f0e8d8",
              background: "linear-gradient(160deg, #3d7a5f, #1e3a2f)",
              opacity: !directorDraft.note.trim() || runPending ? 0.65 : 1,
            }}
          >
            <Play size={14} />
            Apply and rerun
          </button>
        </div>
      </div>
    </aside>
  );
}
