"use client";

import {
  ChevronDown,
  Eye,
  Layers,
  MessageSquare,
  Play,
  Radar,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import React from "react";

import { AgentPeek } from "@/components/trendmind/agent-peek";
import { PhaseBackdrop } from "@/components/trendmind/phase-backdrop";
import { PHASES, RESEARCH_KIND_META } from "@/lib/campaign-data";
import type { PhaseId } from "@/lib/types";
import { useStore } from "@/lib/workspace-store";

export function CampaignWorkspace() {
  const { activePhase, campaign, error, loading } = useStore();

  return (
    <main id="tm-phase-page" className="relative min-h-0 flex-1 overflow-hidden">
      <PhaseBackdrop phase={activePhase} />
      {loading ? <WorkspacePlaceholder label="جاري تحميل مساحة العمل..." /> : null}
      {!loading && !campaign ? <WorkspacePlaceholder label={error ?? "لا توجد حملة بعد."} /> : null}
      {campaign ? <PhaseRouter key={activePhase} phase={activePhase} /> : null}
    </main>
  );
}

function PhaseRouter({ phase }: { phase: PhaseId }) {
  const page = {
    brief: <BriefPage />,
    research: <ResearchPage />,
    strategy: <StrategyPage />,
    draft: <DraftPage />,
    trial: <TrialPage />,
    studio: <StudioPage />,
    launch: <LaunchPage />,
  }[phase];

  return (
    <div className="relative h-full overflow-y-auto px-6 py-5">
      <div className="mx-auto max-w-[1240px]">{page}</div>
    </div>
  );
}

function PageShell({
  phase,
  line,
  children,
  dark,
  action,
}: {
  phase: PhaseId;
  line: string;
  children: React.ReactNode;
  dark?: boolean;
  action?: React.ReactNode;
}) {
  const { phaseStatus, rerunPhase, visitedPhases } = useStore();
  const meta = PHASES.find((entry) => entry.id === phase)!;
  const firstVisit = !visitedPhases.has(phase);

  return (
    <section className={`${firstVisit ? animationFor(phase) : "animate-fade-in"} pb-8`}>
      <header className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tabular-nums" style={{ color: dark ? "#d9bf82" : "#a68b4b" }}>
              {String(meta.index + 1).padStart(2, "0")}
            </span>
            <h1
              className="text-[30px] leading-none"
              style={{ fontFamily: "var(--font-heading)", color: dark ? "#f7ead0" : "#1f1d1a" }}
            >
              {meta.label}
            </h1>
            <StatusDot status={phaseStatus[phase]} />
          </div>
          <p className="mt-2 max-w-[720px] text-[13px] leading-[1.7]" style={{ color: dark ? "rgba(247,234,208,0.68)" : "#6b6258" }}>
            {line}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {action}
          {phase !== "brief" ? (
            <button
              onClick={() => void rerunPhase(phase)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold"
              style={{ color: dark ? "#101c16" : "#f8f1df", background: dark ? "#d9bf82" : "#163326" }}
            >
              <RefreshCw size={14} />
              إعادة البدء
            </button>
          ) : null}
        </div>
      </header>
      {children}
    </section>
  );
}

function BriefPage() {
  const { brief, savingBrief, startFullRun, updateBrief } = useStore();
  if (!brief) return null;

  return (
    <PageShell
      phase="brief"
      line="ابدأ بإيجاز واضح. كل المراحل اللاحقة ستقرأ من هذه الصفحة فقط."
      action={
        <button
          onClick={() => void startFullRun()}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold"
          style={{ color: "#f8f1df", background: "#163326" }}
        >
          <Play size={14} />
          بدء الحملة
        </button>
      }
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-[1.2fr_1fr_0.45fr] gap-3">
          <Field label="الحملة" value={brief.campaignName} onChange={(value) => updateBrief("campaignName", value)} placeholder="حملة جديدة" strong />
          <Field label="العلامة" value={brief.brandName} onChange={(value) => updateBrief("brandName", value)} placeholder="اسم العلامة" />
          <Field label="المنصة" value={brief.platform} onChange={(value) => updateBrief("platform", value)} placeholder="X" />
        </div>
        <div className="grid grid-cols-[1fr_0.9fr] gap-4">
          <Panel title="الصوت والهدف">
            <TextArea label="الهدف" value={brief.goal} onChange={(value) => updateBrief("goal", value)} placeholder="ما النتيجة التي تريد الوصول إليها؟" />
            <TextArea label="الجمهور" value={brief.audience} onChange={(value) => updateBrief("audience", value)} placeholder="من الذي نحاول تحريكه؟" />
            <TextArea label="النبرة" value={brief.tone} onChange={(value) => updateBrief("tone", value)} placeholder="مثلا: ذكية، حادة، دافئة، موثوقة" />
          </Panel>
          <Panel title="القيود">
            <Field label="المنتج" value={brief.productName} onChange={(value) => updateBrief("productName", value)} placeholder="اسم المنتج أو العرض" />
            <TextArea label="القيمة المقترحة" value={brief.valueProposition} onChange={(value) => updateBrief("valueProposition", value)} placeholder="لماذا يهتم الجمهور؟" />
            <ChipEditor label="الركائز" values={brief.pillars} onChange={(values) => updateBrief("pillars", values)} />
            <Details title="تجنب وحواجز">
              <ChipEditor label="تجنب" values={brief.avoid} onChange={(values) => updateBrief("avoid", values)} />
              <ChipEditor label="حواجز" values={brief.guardrails} onChange={(values) => updateBrief("guardrails", values)} />
            </Details>
          </Panel>
        </div>
        <div className="flex items-center justify-between rounded-xl border px-4 py-3 text-[12px]" style={{ background: "#fffaf2", borderColor: "#e4ded4", color: "#867a6b" }}>
          <span>{savingBrief ? "جاري الحفظ..." : "الحفظ تلقائي"}</span>
          <span dir="ltr">TrendMind</span>
        </div>
      </div>
    </PageShell>
  );
}

function ResearchPage() {
  const { campaign, openInspector } = useStore();
  const data = campaign?.phases.research.data;
  const [showAll, setShowAll] = React.useState(false);
  const items = [...(data?.items ?? [])].sort((a, b) => b.confidence - a.confidence);
  const visible = showAll ? items : items.slice(0, 6);

  return (
    <PageShell phase="research" line={data?.overview || "سنلتقط الإشارات التي يمكن أن تصنع زاوية حملة حقيقية."}>
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <>
          <div className="mb-4 flex items-center gap-2">
            {Object.values(RESEARCH_KIND_META).map((kind) => (
              <span key={kind.label} className="flex h-8 w-8 items-center justify-center rounded-lg border" style={{ borderColor: `${kind.accent}33`, color: kind.accent, background: kind.background }} title={kind.label}>
                <Radar size={14} />
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {visible.map((item, index) => {
              const meta = RESEARCH_KIND_META[item.kind];
              return (
                <AgentPeek key={item.id} agent={item.by} reasoning={`اختيرت هذه الإشارة لأن ثقتها ${item.confidence}% وتدعم مسار ${meta.label}.`}>
                  <button
                    onClick={() => openInspector("research", item.id)}
                    className="min-h-[170px] w-full rounded-xl border p-4 text-start transition-all hover:-translate-y-0.5"
                    style={{ background: "#fffaf2", borderColor: "#e4ded4", boxShadow: "0 8px 24px rgba(31,29,26,0.04)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ color: meta.accent, background: meta.background }}>
                        {meta.label}
                      </span>
                      <span className="text-[11px] tabular-nums" style={{ color: "#a68b4b" }}>{item.confidence}%</span>
                    </div>
                    <h3 className="mt-4 line-clamp-2 text-[17px] leading-[1.35]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
                      {item.title || `إشارة ${index + 1}`}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-[1.7]" style={{ color: "#665f56" }}>{item.summary}</p>
                    <p className="mt-4 truncate text-[10px]" style={{ color: "#a29a90" }}>المصدر: {item.source}</p>
                  </button>
                </AgentPeek>
              );
            })}
          </div>
          {items.length > 6 ? (
            <button onClick={() => setShowAll((value) => !value)} className="mt-4 rounded-lg px-3 py-2 text-[12px] font-bold" style={{ background: "#efe5d2", color: "#6f5a34" }}>
              {showAll ? "عرض أقل" : "عرض الكل"}
            </button>
          ) : null}
        </>
      ) : null}
    </PageShell>
  );
}

function StrategyPage() {
  const { campaign, openInspector, setSelectedAngleId } = useStore();
  const data = campaign?.phases.strategy.data;
  return (
    <PageShell phase="strategy" line={data?.campaignThesis || "حوّل البحث إلى ثلاث زوايا واضحة: آمنة، حادة، وقابلة للانتشار."}>
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div className="grid grid-cols-3 gap-4">
          {data.angles.map((angle, index) => (
            <AgentPeek key={angle.id} agent="strategist" reasoning={`يفضل المخطط هذه الزاوية لأنها تجمع وعد ${angle.promise || "واضح"} مع ملاءمة ${angle.fit || "قابلة للاختبار"}.`}>
              <article className="min-h-[440px] rounded-2xl border p-5" style={{ background: "#fffaf2", borderColor: campaign?.selectedAngleId === angle.id ? "#c8a96e" : "#e4ded4" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[42px]" style={{ fontFamily: "var(--font-heading)", color: "#d1b675" }}>{angle.letter}</span>
                  <button onClick={() => openInspector("angle", angle.id)} className="rounded-lg p-2" style={{ background: "#f1e7d5", color: "#745f39" }} title="استعراض">
                    <Eye size={15} />
                  </button>
                </div>
                <h3 className="mt-3 text-[25px] leading-[1.2]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{angle.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.8]" style={{ color: "#5f574e" }}>{angle.thesis}</p>
                <div className="mt-5 space-y-2 text-[12px]">
                  <Chip text={`الوعد: ${angle.promise}`} />
                  <Chip text={`النبرة: ${angle.tone}`} />
                  {angle.risks[0] ? <Chip text={`المخاطر: ${angle.risks[0]}`} /> : null}
                </div>
                <button onClick={() => void setSelectedAngleId(angle.id)} className="mt-6 w-full rounded-lg px-3 py-2 text-[12px] font-bold" style={{ color: "#f8f1df", background: index === 1 ? "#163326" : "#6f5a34" }}>
                  اعتماد
                </button>
              </article>
            </AgentPeek>
          ))}
        </div>
      ) : null}
    </PageShell>
  );
}

function DraftPage() {
  const { campaign, openInspector, setSelectedVariantId } = useStore();
  const data = campaign?.phases.draft.data;
  const [tab, setTab] = React.useState<"hook" | "body" | "cta">("hook");
  const labels = { hook: "الخطافات", body: "المحتوى", cta: "الدعوات" };

  return (
    <PageShell phase="draft" line={data?.summary || "صياغة متعددة المسارات: خطافات، محتوى، ودعوات تتحول إلى نسخ قابلة للاختبار."}>
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-4">
          <Panel title="عدة الصياغة">
            <div className="mb-3 flex gap-2">
              {(["hook", "body", "cta"] as const).map((kind) => (
                <button key={kind} onClick={() => setTab(kind)} className="rounded-lg px-3 py-2 text-[12px] font-bold" style={{ background: tab === kind ? "#163326" : "#efe5d2", color: tab === kind ? "#f8f1df" : "#6f5a34" }}>
                  {labels[kind]}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {data.atoms.filter((atom) => atom.kind === tab).map((atom) => (
                <AgentPeek key={atom.id} agent="architect" reasoning="اختاره مهندس المحتوى لأنه يخدم زاوية الحملة دون إغراق النسخة بالتفاصيل.">
                  <button onClick={() => openInspector("draft-atom", atom.id)} className="w-full rounded-xl border p-3 text-start text-[13px] leading-[1.7]" style={{ background: "#fffaf2", borderColor: "#e4ded4", color: "#38332e" }}>
                    {atom.text}
                  </button>
                </AgentPeek>
              ))}
            </div>
          </Panel>
          <div className="grid gap-3">
            {data.variants.map((variant) => (
              <AgentPeek key={variant.id} agent="critic" reasoning={`منحها الناقد ${variant.score}% لأنها توازن بين الوضوح والشد العاطفي.`}>
                <article className="rounded-2xl border p-5" style={{ background: "#fffaf2", borderColor: campaign?.selectedVariantId === variant.id ? "#c8a96e" : "#e4ded4" }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[22px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{variant.name}</h3>
                    <span className="text-[13px] font-bold tabular-nums" style={{ color: "#a68b4b" }}>{variant.score}%</span>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-[13px] leading-[1.8]" style={{ color: "#514a42" }}>{variant.fullText}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {variant.critique.slice(0, 2).map((note, index) => <Chip key={index} text={note.note} />)}
                    {variant.critique.length > 2 ? <Chip text={`+${variant.critique.length - 2}`} /> : null}
                  </div>
                  <button onClick={() => void setSelectedVariantId(variant.id)} className="mt-4 rounded-lg px-3 py-2 text-[12px] font-bold" style={{ color: "#f8f1df", background: "#163326" }}>
                    اعتماد النسخة
                  </button>
                </article>
              </AgentPeek>
            ))}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

function TrialPage() {
  const { campaign, resetTrialReplay, startTrialReplay, trialPlaybackState, trialPlaybackTick } = useStore();
  const data = campaign?.phases.trial.data;
  const selected = campaign?.selectedVariantId ?? data?.winningVariantId;
  const reactions = data?.reactions.filter((reaction) => reaction.variantId === selected) ?? [];
  const visible = trialPlaybackState === "running" ? reactions.slice(0, Math.max(1, trialPlaybackTick)) : reactions;

  return (
    <PageShell
      phase="trial"
      dark
      line={data?.summary || "مسرح اختبار داكن يعرض ردود فعل جمهور اصطناعي قبل الإطلاق."}
      action={
        data ? (
          <>
            <button onClick={startTrialReplay} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold" style={{ background: "#d9bf82", color: "#101c16" }}>
              <Play size={14} /> تشغيل الاختبار
            </button>
            <button onClick={resetTrialReplay} className="rounded-lg px-3 py-2 text-[12px] font-bold" style={{ background: "rgba(217,191,130,0.12)", color: "#f7ead0" }}>
              إعادة الاختبار
            </button>
          </>
        ) : null
      }
    >
      {!data ? <EmptyPhase dark /> : null}
      {data ? (
        <div className="rounded-3xl border p-6 animate-curtain-rise" style={{ background: "rgba(9,17,12,0.82)", borderColor: "rgba(217,191,130,0.22)" }}>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[24px]" style={{ fontFamily: "var(--font-heading)", color: "#f7ead0" }}>الحكم النهائي</h3>
            <span title="نموذج شخصيات اصطناعي، وليس مستخدمين حقيقيين" className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "rgba(217,191,130,0.13)", color: "#d9bf82" }}>i</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {visible.map((reaction) => {
              const persona = data.personas.find((item) => item.id === reaction.personaId);
              return (
                <AgentPeek key={reaction.id} agent="simulator" reasoning={reaction.why}>
                  <article className="rounded-2xl border p-4" style={{ background: "rgba(255,248,235,0.06)", borderColor: "rgba(217,191,130,0.18)" }}>
                    <div className="text-[28px]">{persona?.glyph}</div>
                    <h4 className="mt-2 text-[16px] font-bold" style={{ color: "#f7ead0" }}>{persona?.name}</h4>
                    <p className="mt-3 text-[13px] leading-[1.8]" style={{ color: "rgba(247,234,208,0.75)" }}>“{reaction.quote}”</p>
                  </article>
                </AgentPeek>
              );
            })}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

function StudioPage() {
  const { campaign, openInspector } = useStore();
  const data = campaign?.phases.studio.data;
  const [layersOpen, setLayersOpen] = React.useState(false);
  return (
    <PageShell phase="studio" line={data?.summary || "حوّل النسخة المختارة إلى لوحة تنفيذية واضحة للأصول البصرية."}>
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="rounded-3xl border p-5 animate-artboard-draw" style={{ background: "#fffaf2", borderColor: "#e4ded4" }}>
            <div className="aspect-[16/9] rounded-2xl border p-8" style={{ background: "linear-gradient(135deg, #efe5d2, #f9f5ec)", borderColor: "#dccaa7" }}>
              <div className="h-full rounded-xl border border-dashed p-6" style={{ borderColor: "#c8a96e66" }}>
                <h3 className="max-w-xl text-[38px] leading-[1.18]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{data.composition}</h3>
                <p className="mt-5 max-w-2xl text-[14px] leading-[1.8]" style={{ color: "#5b534a" }}>{data.imagePrompt}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.assetChecklist.map((item) => <Chip key={item} text={item} />)}
              {data.palette.map((color) => <span key={color} className="h-7 w-7 rounded-full border" style={{ background: color, borderColor: "#d8d0c4" }} title={color} />)}
            </div>
          </div>
          <button onClick={() => setLayersOpen((value) => !value)} className="h-fit rounded-xl px-3 py-3" style={{ background: "#163326", color: "#f8f1df" }}>
            <Layers size={18} />
          </button>
          {layersOpen ? (
            <aside className="absolute left-6 top-24 z-20 w-[320px] rounded-2xl border p-4 shadow-2xl" style={{ background: "#fffaf2", borderColor: "#e4ded4" }}>
              <h3 className="mb-3 text-[18px]" style={{ fontFamily: "var(--font-heading)" }}>الطبقات</h3>
              <div className="space-y-2">
                {data.layers.map((layer) => (
                  <button key={layer.id} onClick={() => openInspector("layer", layer.id)} className="w-full rounded-xl border p-3 text-start" style={{ borderColor: "#e4ded4" }}>
                    <div className="text-[13px] font-bold">{layer.name}</div>
                    <div className="text-[11px]" style={{ color: "#8f877b" }}>{layer.note}</div>
                  </button>
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      ) : null}
    </PageShell>
  );
}

function LaunchPage() {
  const { campaign } = useStore();
  const data = campaign?.phases.launch.data;
  const [open, setOpen] = React.useState(false);
  const [replayKey, setReplayKey] = React.useState(0);
  const pack = data?.packages[0];

  return (
    <PageShell
      phase="launch"
      line={data?.summary || "النتيجة النهائية: نسخة رابحة، حزمة إطلاق، وخطة ردود جاهزة."}
      action={data ? <button onClick={() => setReplayKey((value) => value + 1)} className="rounded-lg px-3 py-2 text-[12px] font-bold" style={{ background: "#efe5d2", color: "#6f5a34" }}>إعادة العرض</button> : null}
    >
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div key={replayKey} className="relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} className="absolute h-1 w-1 rounded-full animate-ember-drift" style={{ right: `${8 + index * 7}%`, bottom: `${8 + (index % 4) * 5}%`, background: "#c8a96e", animationDelay: `${index * 0.12}s` }} />
            ))}
          </div>
          <article className="mx-auto max-w-[760px] rounded-3xl border p-7 text-center animate-gallery-lights" style={{ background: "#fffaf2", borderColor: "#d8bd7c", boxShadow: "0 24px 70px rgba(91,68,34,0.18)" }}>
            <Sparkles className="mx-auto" color="#c8a96e" />
            <h2 className="mt-4 text-[40px] leading-[1.14]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{pack?.headline || "الحزمة الفائزة"}</h2>
            <p className="mx-auto mt-4 max-w-[620px] whitespace-pre-line text-[15px] leading-[1.9]" style={{ color: "#514a42" }}>{data.finalCaption}</p>
            <button className="mt-6 rounded-lg px-5 py-2.5 text-[13px] font-bold" style={{ color: "#f8f1df", background: "#163326" }}>{pack?.cta || "إطلاق"}</button>
          </article>
          <button onClick={() => setOpen((value) => !value)} className="mx-auto mt-5 flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold" style={{ background: "#efe5d2", color: "#6f5a34" }}>
            بدائل ومخاطر <ChevronDown size={14} />
          </button>
          {open ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Panel title="بدائل">{data.alternates.map((item) => <p key={item} className="mb-2 text-[12px] leading-[1.7]">{item}</p>)}</Panel>
              <Panel title="خطة الرد">{data.responsePlan.map((item) => <Details key={item.scenario} title={item.scenario}><p className="text-[12px] leading-[1.7]">{item.response}</p></Details>)}</Panel>
              <Panel title="المخاطر">{data.riskNotes.map((item) => <Chip key={item} text={item} />)}</Panel>
            </div>
          ) : null}
        </div>
      ) : null}
    </PageShell>
  );
}

function Field({ label, value, onChange, placeholder, strong }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; strong?: boolean }) {
  return (
    <label className="block rounded-xl border px-4 py-3" style={{ background: "#fffaf2", borderColor: "#e4ded4" }}>
      <span className="mb-1 block text-[10px] font-bold" style={{ color: "#a68b4b" }}>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full bg-transparent outline-none" style={{ color: "#1f1d1a", fontFamily: strong ? "var(--font-heading)" : undefined, fontSize: strong ? 20 : 14 }} />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold" style={{ color: "#a68b4b" }}>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} className="w-full resize-none rounded-xl border bg-transparent px-3 py-2 text-[13px] leading-[1.7] outline-none" style={{ borderColor: "#e4ded4", color: "#1f1d1a" }} />
    </label>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border p-4" style={{ background: "rgba(255,250,242,0.88)", borderColor: "#e4ded4", boxShadow: "0 10px 34px rgba(31,29,26,0.04)" }}>
      <h2 className="mb-3 text-[20px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Details({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rounded-xl border px-3 py-2" style={{ borderColor: "#e4ded4", background: "rgba(255,255,255,0.38)" }}>
      <summary className="cursor-pointer text-[12px] font-bold" style={{ color: "#6f5a34" }}>{title}</summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function ChipEditor({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  const [draft, setDraft] = React.useState("");
  return (
    <div>
      <div className="mb-1 text-[10px] font-bold" style={{ color: "#a68b4b" }}>{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value, index) => <Chip key={`${value}-${index}`} text={value} onRemove={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} />)}
        <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && draft.trim()) { event.preventDefault(); onChange([...values, draft.trim()]); setDraft(""); } }} placeholder="+" className="w-12 bg-transparent text-[12px] outline-none" />
      </div>
    </div>
  );
}

function Chip({ text, onRemove }: { text: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold" style={{ background: "rgba(200,169,110,0.13)", color: "#6f5a34" }}>
      <span className="truncate">{text}</span>
      {onRemove ? <button onClick={onRemove}>×</button> : null}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === "ready" ? "#3d7a5f" : status === "running" || status === "pending" ? "#c8a96e" : status === "stale" ? "#b7863f" : status === "error" ? "#b25b50" : "#cfc7ba";
  return <span className="h-2 w-2 rounded-full" style={{ background: color }} />;
}

function EmptyPhase({ dark }: { dark?: boolean }) {
  const { activePhase, rerunPhase } = useStore();
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="rounded-2xl border px-8 py-7 text-center" style={{ background: dark ? "rgba(255,248,235,0.06)" : "#fffaf2", borderColor: dark ? "rgba(217,191,130,0.18)" : "#e4ded4" }}>
        <MessageSquare className="mx-auto" color={dark ? "#d9bf82" : "#a68b4b"} />
        <h2 className="mt-3 text-[24px]" style={{ fontFamily: "var(--font-heading)", color: dark ? "#f7ead0" : "#1f1d1a" }}>لا توجد مخرجات بعد</h2>
        <p className="mt-2 text-[13px]" style={{ color: dark ? "rgba(247,234,208,0.65)" : "#6b6258" }}>ابدأ المرحلة لتظهر النتائج هنا بشكل واضح ومختصر.</p>
        <button onClick={() => void rerunPhase(activePhase)} className="mt-5 rounded-lg px-4 py-2 text-[12px] font-bold" style={{ color: dark ? "#101c16" : "#f8f1df", background: dark ? "#d9bf82" : "#163326" }}>بدء المرحلة</button>
      </div>
    </div>
  );
}

function WorkspacePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative flex h-full min-h-[420px] items-center justify-center px-6">
      <div className="max-w-md rounded-2xl border px-6 py-8 text-center" style={{ borderColor: "#e4ded4", background: "rgba(253,250,245,0.9)", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
        <div dir="ltr" className="text-[20px]" style={{ fontFamily: "var(--font-wordmark)", color: "#1f1d1a" }}>TrendMind</div>
        <h2 className="mt-2 text-[24px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>مساحة العمل</h2>
        <p className="mt-2 text-[12px] leading-[1.6]" style={{ color: "#5a5550" }}>{label}</p>
      </div>
    </div>
  );
}

function animationFor(phase: PhaseId) {
  return {
    brief: "animate-rise-in",
    research: "animate-phase-slide-rtl",
    strategy: "animate-phase-slide-rtl",
    draft: "animate-card-in",
    trial: "animate-curtain-rise",
    studio: "animate-artboard-draw",
    launch: "animate-gallery-lights",
  }[phase];
}
