"use client";

import { useStore } from "@/lib/workspace-store";

import { SectionShell } from "./section-shell";

export function LaunchSection() {
  const { campaign, exportCampaign, rerunPhase, runPending } = useStore();
  const draft = campaign?.phases.draft.data;
  const launch = campaign?.phases.launch.data;
  const strategy = campaign?.phases.strategy.data;

  const winner =
    draft?.variants.find((entry) => entry.id === launch?.winningVariantId) ?? draft?.variants[0];
  const hook = draft?.atoms.find((atom) => atom.id === winner?.hookId)?.text ?? "";
  const cta = draft?.atoms.find((atom) => atom.id === winner?.ctaId)?.text ?? "";
  const winningAngle =
    strategy?.angles.find((entry) => entry.id === launch?.winningAngleId) ?? strategy?.angles[0];

  return (
    <SectionShell
      id="launch"
      rightSlot={
        <div className="flex items-center gap-2">
          <button
            onClick={() => void rerunPhase("launch")}
            disabled={runPending}
            className="rounded-md px-3 py-[5px] text-[10.5px] font-medium tracking-[0.04em]"
            style={{
              color: "#1e3a2f",
              border: "1px solid rgba(30,58,47,0.18)",
              opacity: runPending ? 0.6 : 1,
            }}
          >
            Re-run
          </button>
          <button
            onClick={exportCampaign}
            className="rounded-md px-3 py-[5px] text-[10.5px] font-medium tracking-[0.04em]"
            style={{
              color: "#f0e8d8",
              background: "linear-gradient(160deg, #3d7a5f, #1e3a2f)",
              boxShadow: "0 4px 14px rgba(30,58,47,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            Export package
          </button>
        </div>
      }
    >
      {launch && winner ? (
        <>
          <div
            className="grid overflow-hidden rounded-2xl"
            style={{
              gridTemplateColumns: "1.3fr 1fr",
              background: "linear-gradient(180deg, #fdfaf5 0%, #f0e8d3 100%)",
              border: "1px solid #d8c79a",
              boxShadow: "0 8px 28px rgba(200,169,110,0.15), 0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <span className="rounded px-1.5 py-[2px] text-[8.5px] font-bold uppercase tracking-[0.2em]" style={{ color: "#162b22", background: "rgba(61,122,95,0.1)" }}>
                  Winner
                </span>
                <span className="text-[9.5px]" style={{ color: "#9b9590" }}>
                  · {winningAngle?.title}
                </span>
              </div>

              <p className="text-[24px] italic leading-[1.15] tracking-[-0.015em]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
                “{hook}”
              </p>
              <pre
                className="whitespace-pre-wrap text-[13px] leading-[1.6]"
                style={{ color: "#3a3631", fontFamily: "var(--font-body)" }}
              >
                {launch.finalCaption}
              </pre>

              <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: "#ece5d8" }}>
                <span className="text-[12px] font-medium" style={{ color: "#a68b4b" }}>
                  {cta}
                </span>
                <span className="rounded px-1.5 py-[2px] text-[9.5px]" style={{ background: "rgba(200,169,110,0.1)", color: "#a68b4b" }}>
                  Ready for launch
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #1a1612, #2a1f16)", borderLeft: "1px solid #d8c79a" }}>
              <MiniAd hook={hook} cta={cta} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {launch.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-lg border p-2.5"
                style={{ background: "#fdfaf5", borderColor: "#e4ded4" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-medium" style={{ color: "#1f1d1a" }}>
                    {pkg.name}
                  </span>
                  <span className="text-[9px] tabular-nums" style={{ color: "#b0a99e" }}>
                    {pkg.ratio}
                  </span>
                </div>
                <div className="mt-2 rounded-md border p-2" style={{ borderColor: "#ece5d8", background: "#faf7f2" }}>
                  <div className="text-[11px]" style={{ color: "#1f1d1a", fontWeight: 500 }}>
                    {pkg.headline}
                  </div>
                  <div className="mt-1 text-[10px] leading-[1.5]" style={{ color: "#5a5550" }}>
                    {pkg.caption}
                  </div>
                  <div className="mt-2 text-[9px]" style={{ color: "#a68b4b" }}>
                    {pkg.cta}
                  </div>
                </div>
                <div className="mt-2 text-[10px]" style={{ color: "#5a5550" }}>
                  {pkg.visualCue}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Panel title="Response plan">
              {launch.responsePlan.map((entry, index) => (
                <div key={`${entry.scenario}-${index}`} className="mb-2 last:mb-0">
                  <div className="text-[10px] font-medium" style={{ color: "#1f1d1a" }}>
                    {entry.scenario}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-[1.5]" style={{ color: "#5a5550" }}>
                    {entry.response}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.14em]" style={{ color: "#a68b4b" }}>
                    {entry.tone}
                  </div>
                </div>
              ))}
            </Panel>

            <Panel title="Risks and next steps">
              {launch.riskNotes.map((note, index) => (
                <Row key={`risk-${index}`} label="Risk" text={note} accent="#8a6a5a" />
              ))}
              {launch.nextSteps.map((step, index) => (
                <Row key={`step-${index}`} label="Next" text={step} accent="#3d7a5f" />
              ))}
            </Panel>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Panel title="Launch checklist">
              {launch.launchChecklist.map((item, index) => (
                <Row key={`check-${index}`} label="Do" text={item} accent="#a68b4b" />
              ))}
            </Panel>
            <Panel title="Alternates">
              {launch.alternates.map((item, index) => (
                <div
                  key={`alt-${index}`}
                  className="mb-2 rounded-md border px-3 py-2 text-[11px] leading-[1.5] last:mb-0"
                  style={{ borderColor: "#ece5d8", background: "#faf7f2", color: "#5a5550" }}
                >
                  {item}
                </div>
              ))}
            </Panel>
          </div>
        </>
      ) : (
        <EmptyState
          title="No launch package yet"
          body="Run Studio and Launch to turn the winning direction into a presentable delivery set with alternates, responses, and rollout guidance."
        />
      )}
    </SectionShell>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-3" style={{ background: "#fdfaf5", borderColor: "#e4ded4" }}>
      <div className="mb-2 text-[8.5px] font-bold uppercase tracking-[0.2em]" style={{ color: "#a68b4b" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent: string;
}) {
  return (
    <div className="mb-2 flex items-start gap-1.5 last:mb-0">
      <span
        className="mt-[2px] rounded px-1 py-[1px] text-[8px] font-bold uppercase tracking-[0.2em]"
        style={{ color: accent, background: `${accent}12` }}
      >
        {label}
      </span>
      <span className="text-[11px] leading-[1.45]" style={{ color: "#5a5550" }}>
        {text}
      </span>
    </div>
  );
}

function MiniAd({ hook, cta }: { hook: string; cta: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(300px 170px at 58% 28%, rgba(236,214,164,0.4), transparent 70%), linear-gradient(160deg, #403226 0%, #2a1f16 100%)",
      }}
    >
      <div className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-[90px] w-[100px]" style={{ filter: "drop-shadow(0 16px 18px rgba(0,0,0,0.35))" }}>
          <div className="absolute inset-x-4 top-4 rounded-[4px]" style={{ bottom: 0, background: "linear-gradient(180deg, #e8d4a8 0%, #ab8d5a 100%)" }} />
          <div className="absolute bottom-0 left-1/2 top-0 w-[10px] -translate-x-1/2" style={{ background: "linear-gradient(90deg, #6d4f33, #8c6a45, #6d4f33)" }} />
          <div className="absolute left-0 right-0 top-[48%] h-[8px] -translate-y-1/2" style={{ background: "linear-gradient(180deg, #6d4f33, #8c6a45, #6d4f33)" }} />
        </div>
      </div>
      <div className="absolute bottom-14 left-0 right-0 flex justify-center px-5">
        <p className="max-w-[220px] text-center text-[13px] italic leading-[1.2]" style={{ fontFamily: "var(--font-heading)", color: "#f5e8c8" }}>
          “{hook}”
        </p>
      </div>
      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        <div className="rounded-full px-2 py-1 text-[9px] font-medium tracking-[0.05em]" style={{ color: "#162b22", background: "linear-gradient(160deg, #dcc487, #a68b4b)" }}>
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
