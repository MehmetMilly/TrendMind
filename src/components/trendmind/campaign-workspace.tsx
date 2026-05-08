"use client";

import {
  Eye,
  FileText,
  Link2,
  MessageSquare,
  Pencil,
  Play,
  Radar,
  RefreshCw,
  Settings,
  ShieldCheck,
  Users,
  Zap,
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
      {!loading && !campaign ? <LandingPage errorMessage={error} /> : null}
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
  const { brief, startFullRun, updateBrief } = useStore();
  if (!brief) return null;

  const mergedGuardrails = [...brief.avoid, ...(brief.guardrails ?? [])];

  return (
    <PageShell
      phase="brief"
      line="ابدأ بإيجاز واضح. كل المراحل التالية ستقرأ هذه المدخلات كمرجع للحملة."
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
      {/* ── Top row: campaign / brand / platform ── */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="الحملة" value={brief.campaignName} onChange={(v) => updateBrief("campaignName", v)} placeholder="حملة إطلاق أو موسم" strong />
        <div className="grid grid-cols-2 gap-3">
          <Field label="العلامة" value={brief.brandName} onChange={(v) => updateBrief("brandName", v)} placeholder="اسم البراند" />
          <Field label="المنصة" value={brief.platform} onChange={(v) => updateBrief("platform", v)} placeholder="X / تيك توك" />
        </div>
      </div>

      {/* ── 2×2 card grid ── */}
      <div className="mt-4 grid grid-cols-2 gap-4">

        {/* ── إطار الحملة ── */}
        <section className="overflow-hidden rounded-2xl border" style={{ background: "rgba(255,250,242,0.88)", borderColor: "#e4ded4", boxShadow: "0 10px 34px rgba(31,29,26,0.04)" }}>
          <div className="relative flex items-center border-b px-5 py-4" style={{ borderColor: "#ece5d8" }}>
            <Settings size={18} color="#c8a96e" className="absolute right-5 top-1/2 -translate-y-1/2" />
            <h2 className="w-full pr-8 text-right text-[20px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>إطار الحملة</h2>
          </div>
          <div className="space-y-0">
            {/* الجمهور المستهدف */}
            <div className="border-b px-5 py-4" style={{ borderColor: "#ece5d8" }}>
              <div className="mb-2 text-right text-[12px] font-semibold" style={{ color: "#a68b4b" }}>الجمهور المستهدف</div>
              <div className="rounded-xl border px-4 py-3" style={{ background: "#faf7f0", borderColor: "#ece5d8" }}>
                <div className="flex items-center gap-2.5">
                  <input
                    value={brief.audience}
                    onChange={(e) => updateBrief("audience", e.target.value)}
                    placeholder="حدد الجمهور المستهدف وخصائصه الأساسية..."
                    className="w-full bg-transparent text-[13px] leading-[1.55] outline-none"
                    style={{ color: "#1f1d1a" }}
                  />
                  <Users size={16} color="#c8a96e" className="shrink-0" />
                </div>
              </div>
            </div>
            {/* جوهر الرسالة */}
            <div className="px-5 py-4">
              <div className="mb-2 text-right text-[12px] font-semibold" style={{ color: "#a68b4b" }}>جوهر الرسالة (الفكرة)</div>
              <div className="rounded-xl border px-4 py-3" style={{ background: "#faf7f0", borderColor: "#ece5d8" }}>
                <div className="flex items-start gap-2.5">
                  <textarea
                    value={brief.valueProposition}
                    onChange={(e) => updateBrief("valueProposition", e.target.value)}
                    placeholder="ما الفكرة الأساسية التي تريد أن تصل إلى الجمهور؟"
                    rows={2}
                    maxLength={400}
                    className="w-full resize-none bg-transparent text-[13px] leading-[1.6] outline-none"
                    style={{ color: "#1f1d1a" }}
                  />
                  <Zap size={16} color="#c8a96e" className="mt-0.5 shrink-0" />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <Pencil size={11} color="#b0a99e" />
                  <span className="text-[10px] tabular-nums" style={{ color: "#b0a99e" }}>{brief.valueProposition.length}/400</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── روابط البراند ── */}
        <section className="overflow-hidden rounded-2xl border" style={{ background: "rgba(255,250,242,0.88)", borderColor: "#e4ded4", boxShadow: "0 10px 34px rgba(31,29,26,0.04)" }}>
          <div className="relative flex items-center border-b px-5 py-4" style={{ borderColor: "#ece5d8" }}>
            <Link2 size={18} color="#c8a96e" className="absolute right-5 top-1/2 -translate-y-1/2" />
            <h2 className="w-full pr-8 text-right text-[20px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>روابط البراند</h2>
          </div>
          <div className="space-y-0">
            <div className="border-b px-5 py-4" style={{ borderColor: "#ece5d8" }}>
              <div className="mb-2 text-right text-[12px] font-semibold" style={{ color: "#a68b4b" }}>حسابات التواصل الاجتماعي</div>
              <div className="rounded-xl border px-4 py-3" style={{ background: "#faf7f0", borderColor: "#ece5d8" }}>
                <ChipEditor label="" values={brief.socialAccounts ?? []} onChange={(values) => updateBrief("socialAccounts", values)} placeholder="أضف روابط حسابات التواصل الاجتماعي..." />
                <div className="mt-1"><Pencil size={11} color="#b0a99e" /></div>
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="mb-2 text-right text-[12px] font-semibold" style={{ color: "#a68b4b" }}>الموقع الرسمي</div>
              <div className="rounded-xl border px-4 py-3" style={{ background: "#faf7f0", borderColor: "#ece5d8" }}>
                <ChipEditor label="" values={brief.brandLinks} onChange={(values) => updateBrief("brandLinks", values)} placeholder="أضف رابط الموقع الرسمي للبراند..." />
                <div className="mt-1"><Pencil size={11} color="#b0a99e" /></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── سياق الحملة ── */}
        <section className="overflow-hidden rounded-2xl border" style={{ background: "rgba(255,250,242,0.88)", borderColor: "#e4ded4", boxShadow: "0 10px 34px rgba(31,29,26,0.04)" }}>
          <div className="relative flex items-center border-b px-5 py-4" style={{ borderColor: "#ece5d8" }}>
            <FileText size={18} color="#c8a96e" className="absolute right-5 top-1/2 -translate-y-1/2" />
            <h2 className="w-full pr-8 text-right text-[20px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>سياق الحملة</h2>
          </div>
          <div className="px-5 py-4">
            <div className="mb-2 text-right text-[12px] font-semibold" style={{ color: "#a68b4b" }}>وصف السياق</div>
            <div className="rounded-xl border px-4 py-3" style={{ background: "#faf7f0", borderColor: "#ece5d8" }}>
              <textarea
                value={brief.context}
                onChange={(e) => updateBrief("context", e.target.value)}
                placeholder="اكتب السياق العام للحملة والظروف المحيطة بها..."
                rows={4}
                maxLength={500}
                className="w-full resize-none bg-transparent text-[13px] leading-[1.6] outline-none"
                style={{ color: "#1f1d1a" }}
              />
              <div className="mt-1 flex items-center justify-between">
                <Pencil size={11} color="#b0a99e" />
                <span className="text-[10px] tabular-nums" style={{ color: "#b0a99e" }}>{brief.context.length}/500</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── المحظورات والقيود ── */}
        <section className="overflow-hidden rounded-2xl border" style={{ background: "rgba(255,250,242,0.88)", borderColor: "#e4ded4", boxShadow: "0 10px 34px rgba(31,29,26,0.04)" }}>
          <div className="relative flex items-center border-b px-5 py-4" style={{ borderColor: "#ece5d8" }}>
            <ShieldCheck size={18} color="#c8a96e" className="absolute right-5 top-1/2 -translate-y-1/2" />
            <h2 className="w-full pr-8 text-right text-[20px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>المحظورات والقيود</h2>
          </div>
          <div className="px-5 py-4">
            <p className="mb-3 text-right text-[12px] leading-[1.7]" style={{ color: "#6b6258" }}>ما يجب تجنبه وما هو متاح للاستخدام في الحملة</p>
            <div className="rounded-xl border px-4 py-3" style={{ background: "#faf7f0", borderColor: "#ece5d8" }}>
              <textarea
                value={mergedGuardrails.join("\n")}
                onChange={(e) => {
                  const values = e.target.value.split("\n").filter((s) => s.trim());
                  updateBrief("avoid", values);
                  updateBrief("guardrails", []);
                }}
                placeholder="اذكر المحظورات، المواد الحساسة، والقيود القانونية أو الشرعية..."
                rows={4}
                maxLength={400}
                className="w-full resize-none bg-transparent text-[13px] leading-[1.6] outline-none"
                style={{ color: "#1f1d1a" }}
              />
              <div className="mt-1 flex items-center justify-between">
                <Pencil size={11} color="#b0a99e" />
                <span className="text-[10px] tabular-nums" style={{ color: "#b0a99e" }}>{mergedGuardrails.join("\n").length}/400</span>
              </div>
            </div>
          </div>
        </section>
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
  const recommended = data?.angles.find((angle) => angle.id === data.recommendedAngleId);

  return (
    <PageShell phase="strategy" line={data?.campaignThesis || "تحويل البحث إلى خطة حملة بثلاث زوايا قابلة للمقارنة والاختبار."}>
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div className="space-y-4">
          <section className="grid grid-cols-[1.15fr_0.85fr] gap-4 rounded-3xl border p-5" style={{ background: "linear-gradient(180deg, #fffaf2, #f4ead8)", borderColor: "#d8bd7c", boxShadow: "0 18px 52px rgba(91,68,34,0.09)" }}>
            <div>
              <div className="mb-2 text-[11px] font-bold" style={{ color: "#a68b4b" }}>خطة الحملة</div>
              <h2 className="text-[30px] leading-[1.18]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{data.campaignThesis}</h2>
              <p className="mt-3 text-[13px] leading-[1.8]" style={{ color: "#5f574e" }}>{data.decisionFrame}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] leading-[1.6]">
                <div className="rounded-2xl border p-3" style={{ borderColor: "#e4ded4", background: "rgba(255,250,242,0.72)" }}>كل زاوية تبقى مسارًا نشطًا في الصياغة والاختبار.</div>
                <div className="rounded-2xl border p-3" style={{ borderColor: "#e4ded4", background: "rgba(255,250,242,0.72)" }}>TrendMind يقارن الوضوح، الرنين، المخاطر، وقابلية التحويل.</div>
                <div className="rounded-2xl border p-3" style={{ borderColor: "#e4ded4", background: "rgba(255,250,242,0.72)" }}>الترشيح الحالي يوجه الأولوية، ولا يلغي بقية المسارات.</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] leading-[1.7]">
                <div className="rounded-2xl border p-3" style={{ borderColor: "#e4ded4", background: "rgba(255,255,255,0.44)" }}>
                  <div className="mb-1 font-bold" style={{ color: "#a68b4b" }}>اتجاه الرسالة</div>
                  <div style={{ color: "#5f574e" }}>{data.messageDirection}</div>
                </div>
                <div className="rounded-2xl border p-3" style={{ borderColor: "#e4ded4", background: "rgba(255,255,255,0.44)" }}>
                  <div className="mb-1 font-bold" style={{ color: "#a68b4b" }}>منطق التمركز</div>
                  <div style={{ color: "#5f574e" }}>{data.positioningLogic}</div>
                </div>
                <div className="rounded-2xl border p-3" style={{ borderColor: "#e4ded4", background: "rgba(255,255,255,0.44)" }}>
                  <div className="mb-1 font-bold" style={{ color: "#a68b4b" }}>قيود الاستراتيجية</div>
                  <div className="space-y-1">
                    {data.strategicConstraints.slice(0, 3).map((item) => (
                      <div key={item} style={{ color: "#5f574e" }}>{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border p-4" style={{ borderColor: "#d8bd7c", background: "#163326", color: "#f7ead0" }}>
              <div className="text-[11px] font-bold" style={{ color: "#d9bf82" }}>الزاوية الموصى بها</div>
              <h3 className="mt-3 text-[28px] leading-[1.15]" style={{ fontFamily: "var(--font-heading)" }}>{recommended?.title}</h3>
              <p className="mt-3 text-[13px] leading-[1.8]" style={{ color: "rgba(247,234,208,0.78)" }}>{recommended?.fit}</p>
              <p className="mt-3 text-[12px] leading-[1.75]" style={{ color: "rgba(247,234,208,0.68)" }}>{data.toneDirection}</p>
              <div className="mt-4 inline-flex rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: "rgba(217,191,130,0.14)", color: "#d9bf82" }}>{recommended?.score}% جاهزية مبدئية</div>
            </div>
          </section>
          <div className="grid grid-cols-3 gap-4">
            {data.angles.map((angle) => {
              const selected = campaign?.selectedAngleId === angle.id;
              return (
                <article key={angle.id} className="min-h-[390px] rounded-3xl border p-5 transition-all" style={{ background: selected ? "linear-gradient(180deg, #fffaf2, #f1e5c9)" : "#fffaf2", borderColor: selected ? "#c8a96e" : "#e4ded4", boxShadow: selected ? "0 18px 42px rgba(166,139,75,0.16)" : "0 10px 34px rgba(31,29,26,0.04)" }}>
                  <div className="flex items-start justify-between"><div><span className="text-[38px]" style={{ fontFamily: "var(--font-heading)", color: "#d1b675" }}>{angle.letter}</span><span className="mr-2 rounded-full px-2 py-1 text-[10px] font-bold" style={{ color: selected ? "#163326" : "#7c6a48", background: selected ? "rgba(61,122,95,0.12)" : "rgba(200,169,110,0.13)" }}>{selected ? "مرشح" : "مسار نشط"}</span></div><button onClick={() => openInspector("angle", angle.id)} className="rounded-lg p-2" style={{ background: "#f1e7d5", color: "#745f39" }} title="استعراض"><Eye size={15} /></button></div>
                  <h3 className="mt-3 text-[25px] leading-[1.2]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{angle.title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.8]" style={{ color: "#5f574e" }}>{angle.thesis}</p>
                  <div className="mt-5 space-y-2 text-[12px]"><Chip text={"الوعد: " + angle.promise} /><Chip text={"النبرة: " + angle.tone} /><Chip text={"سبب الاختبار: " + angle.rationale[0]} />{angle.risks[0] ? <Chip text={"محاذير: " + angle.risks[0]} /> : null}</div>
                  <button onClick={() => void setSelectedAngleId(angle.id)} className="mt-6 w-full rounded-lg px-3 py-2 text-[12px] font-bold" style={{ color: selected ? "#f8f1df" : "#163326", background: selected ? "#163326" : "#efe5d2" }}>{selected ? "زاوية مرشحة" : "تعيين كمرشح"}</button>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}


function DraftPage() {
  const { campaign, openInspector, setSelectedVariantId } = useStore();
  const data = campaign?.phases.draft.data;
  const strategy = campaign?.phases.strategy.data;

  return (
    <PageShell phase="draft" line={data?.summary || "صياغة متعددة المسارات: لكل زاوية خطافات، أجسام، دعوات، ونسخة مركبة قابلة للاختبار."}>
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div className="grid grid-cols-3 gap-3">
          {(strategy?.angles ?? []).map((angle) => {
            const hooks = data.atoms.filter((atom) => atom.angleId === angle.id && atom.kind === "hook");
            const bodies = data.atoms.filter((atom) => atom.angleId === angle.id && atom.kind === "body");
            const ctas = data.atoms.filter((atom) => atom.angleId === angle.id && atom.kind === "cta");
            const laneHooks = hooks.length > 0 ? hooks : [
              { id: angle.id + "_hook_1", text: angle.hook },
              { id: angle.id + "_hook_2", text: angle.promise },
              { id: angle.id + "_hook_3", text: angle.title },
            ];
            const laneBodies = bodies.length > 0 ? bodies : [
              { id: angle.id + "_body_1", text: angle.thesis },
              { id: angle.id + "_body_2", text: angle.fit },
              { id: angle.id + "_body_3", text: angle.stance },
            ];
            const laneCtas = ctas.length > 0 ? ctas : [
              { id: angle.id + "_cta_1", text: "ابدأ الآن" },
              { id: angle.id + "_cta_2", text: "اكتشف التفاصيل" },
              { id: angle.id + "_cta_3", text: "انضم إلى قائمة الانتظار" },
            ];
            const variant = data.variants.filter((entry) => entry.angleId === angle.id).sort((left, right) => right.score - left.score)[0] ?? {
              id: angle.id + "_assembled",
              angleId: angle.id,
              name: angle.title,
              hookId: laneHooks[0].id,
              bodyId: laneBodies[0].id,
              ctaId: laneCtas[0].id,
              tone: angle.tone,
              length: "medium" as const,
              score: angle.score,
              critique: [{ agent: "critic" as const, note: "مسار جاهز للمقارنة في الاختبار." }],
              fullText: laneHooks[0].text + "\n\n" + laneBodies[0].text + "\n\n" + laneCtas[0].text,
            };
            const selected = campaign?.selectedVariantId === variant?.id;
            return (
              <article key={angle.id} className="rounded-3xl border p-4" style={{ background: "#fffaf2", borderColor: selected ? "#c8a96e" : "#e4ded4", boxShadow: selected ? "0 16px 42px rgba(166,139,75,0.16)" : "0 10px 34px rgba(31,29,26,0.04)" }}>
                <div className="flex items-start justify-between gap-3"><div><div className="text-[11px] font-bold" style={{ color: "#a68b4b" }}>مسار {angle.letter}</div><h3 className="mt-1 text-[22px] leading-[1.15]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{angle.title}</h3></div><span className="rounded-full px-2 py-1 text-[11px] font-bold tabular-nums" style={{ color: selected ? "#163326" : "#a68b4b", background: selected ? "rgba(61,122,95,0.12)" : "rgba(200,169,110,0.12)" }}>{variant?.score}%</span></div>
                <DraftList title="الخطافات" items={laneHooks} onOpen={openInspector} />
                <DraftList title="الأجسام" items={laneBodies} onOpen={openInspector} />
                <DraftList title="الدعوات" items={laneCtas} onOpen={openInspector} />
                {variant ? (
                  <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: selected ? "#c8a96e" : "#e4ded4", background: selected ? "linear-gradient(180deg, #f6ecd2, #fffaf2)" : "#faf7f0" }}>
                    <div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-bold" style={{ color: "#a68b4b" }}>النسخة المركبة الأقوى</span><button onClick={() => openInspector("variant", variant.id)} className="text-[11px] font-bold" style={{ color: "#6f5a34" }}>تفاصيل</button></div>
                    <p className="whitespace-pre-line text-[13px] leading-[1.75]" style={{ color: "#514a42" }}>{variant.fullText}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">{variant.critique.slice(0, 2).map((note, index) => <Chip key={index} text={note.note} />)}</div>
                    <button onClick={() => void setSelectedVariantId(variant.id)} className="mt-4 w-full rounded-lg px-3 py-2 text-[12px] font-bold" style={{ color: "#f8f1df", background: selected ? "#163326" : "#6f5a34" }}>{selected ? "مختارة للاختبار" : "اعتماد النسخة"}</button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </PageShell>
  );
}


function DraftList({ title, items, onOpen }: { title: string; items: Array<{ id: string; text: string; note?: string }>; onOpen: (kind: "draft-atom", id: string) => void }) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold" style={{ color: "#a68b4b" }}>
        <span>{title}</span>
        <span className="tabular-nums" style={{ color: "#b0a99e" }}>{items.length}</span>
      </div>
      <div className="space-y-1.5">
        {items.slice(0, 5).map((item) => (
          <button key={item.id} onClick={() => onOpen("draft-atom", item.id)} className="w-full rounded-xl border px-3 py-2 text-start text-[12px] leading-[1.55]" style={{ background: "#fdf8ee", borderColor: "#e7decc", color: "#3f3932" }}>
            {item.text}
          </button>
        ))}
      </div>
    </div>
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
  const draft = campaign?.phases.draft.data;
  const variant = draft?.variants.find((entry) => entry.id === data?.selectedVariantId) ?? draft?.variants.find((entry) => entry.id === campaign?.selectedVariantId) ?? draft?.variants[0];
  const hook = draft?.atoms.find((atom) => atom.id === variant?.hookId)?.text ?? "الفكرة تتحول إلى مشهد";
  const cta = draft?.atoms.find((atom) => atom.id === variant?.ctaId)?.text ?? campaign?.brief.callToAction ?? "اكتشف الآن";

  return (
    <PageShell phase="studio" line={data?.summary || "تحويل النسخة المختارة إلى لوحة اتجاه بصري قابلة للإنتاج."}>
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div className="grid grid-cols-[1.12fr_0.88fr] gap-4">
          <div className="relative min-h-[560px] overflow-hidden rounded-3xl border" style={{ background: "linear-gradient(160deg, #18251f 0%, #312719 100%)", borderColor: "rgba(200,169,110,0.28)", boxShadow: "0 24px 72px rgba(31,29,26,0.22)" }}>
            <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(244,234,219,.42) 0, rgba(244,234,219,.42) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(0deg, rgba(244,234,219,.24) 0, rgba(244,234,219,.24) 1px, transparent 1px, transparent 4px)" }} />
            <div className="absolute right-5 top-4 z-10 flex items-center gap-2 text-[11px] font-bold" style={{ color: "rgba(247,234,208,0.72)" }}><span className="h-2 w-2 rounded-full" style={{ background: "#c8a96e" }} /> معاينة 4:5</div>
            <div className="absolute left-1/2 top-[33%] h-[152px] w-[152px] -translate-x-1/2 -translate-y-1/2 rounded-[36px]" style={{ background: "linear-gradient(180deg, #f4eadb, #c8a96e)", boxShadow: "0 34px 60px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.38)" }} />
            <div className="absolute left-1/2 top-[33%] h-[192px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(90deg, #6d4f33, #9d7a4c, #6d4f33)" }} />
            <div className="absolute left-1/2 top-[33%] h-[18px] w-[245px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(180deg, #6d4f33, #9d7a4c, #6d4f33)" }} />
            <div className="absolute bottom-24 left-8 right-8 text-center">
              <h3 className="text-[36px] italic leading-[1.15]" style={{ fontFamily: "var(--font-heading)", color: "#f7ead0", textShadow: "0 8px 28px rgba(0,0,0,.38)" }}>?{hook}?</h3>
              <div className="mt-7 inline-flex rounded-full px-5 py-2 text-[13px] font-bold" style={{ background: "linear-gradient(160deg, #dcc487, #a68b4b)", color: "#162b22", boxShadow: "0 10px 28px rgba(200,169,110,.28)" }}>{cta}</div>
            </div>
          </div>

          <div className="space-y-4">
            <Panel title="الاتجاه البصري">
              <p className="text-[13px] leading-[1.8]" style={{ color: "#514a42" }}>{data.summary}</p>
              <p className="text-[12px] leading-[1.75]" style={{ color: "#6b6258" }}>{data.composition}</p>
            </Panel>
            <section className="overflow-hidden rounded-2xl border" style={{ background: "#fffaf2", borderColor: "#e4ded4" }}>
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "#ece5d8", background: "#f5efe4" }}><span className="text-[11px] font-bold" style={{ color: "#a68b4b" }}>الطبقات</span><span className="text-[11px] tabular-nums" style={{ color: "#b0a99e" }}>{data.layers.length}</span></div>
              {data.layers.map((layer) => (
                <button key={layer.id} onClick={() => openInspector("layer", layer.id)} className="flex w-full gap-3 border-b px-4 py-3 text-start last:border-b-0" style={{ borderColor: "#ece5d8" }}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold" style={{ background: "rgba(200,169,110,.12)", color: "#a68b4b" }}>{layer.kind.slice(0, 1)}</span>
                  <span><span className="block text-[13px] font-bold" style={{ color: "#1f1d1a" }}>{layer.name}</span><span className="mt-1 block text-[11px] leading-[1.55]" style={{ color: "#766d62" }}>{layer.note}</span></span>
                </button>
              ))}
            </section>
            <Panel title="لوحة الألوان والموجه">
              <div className="flex flex-wrap gap-2">{data.palette.map((color) => <span key={color} className="h-9 w-9 rounded-full border" style={{ background: color, borderColor: "rgba(0,0,0,.1)" }} title={color} />)}</div>
              <div className="rounded-2xl border p-3 text-[12px] leading-[1.8]" style={{ background: "#faf7f0", borderColor: "#e4ded4", color: "#514a42" }}>{data.imagePrompt}</div>
            </Panel>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}


function LaunchPage() {
  const { campaign } = useStore();
  const data = campaign?.phases.launch.data;
  const draft = campaign?.phases.draft.data;
  const strategy = campaign?.phases.strategy.data;
  const posts = (strategy?.angles ?? []).map((angle) => {
    const variant = draft?.variants.find((entry) => entry.angleId === angle.id) ?? {
      fullText: angle.hook + "\n\n" + angle.thesis + "\n\nابدأ الآن",
      score: angle.score,
    };
    const pkg = data?.packages.find((entry) => entry.id.includes(angle.id) || entry.headline === angle.hook);
    return { angle, variant, pkg, score: variant?.score ?? angle.score };
  }).sort((a, b) => {
    const winner = data?.winningAngleId;
    if (a.angle.id === winner) return -1;
    if (b.angle.id === winner) return 1;
    return b.score - a.score;
  });
  const ordered = posts.length === 3 ? [posts[1], posts[0], posts[2]].filter(Boolean) : posts;
  const defaultId = data?.winningAngleId ?? ordered[1]?.angle.id ?? ordered[0]?.angle.id;
  const [selectedId, setSelectedId] = React.useState(defaultId);
  const selected = ordered.find((post) => post.angle.id === selectedId) ?? ordered[1] ?? ordered[0];

  return (
    <PageShell phase="launch" line={data?.summary || "لوحة قرار نهائية: ثلاث منشورات جاهزة، فائز واضح، وخطة إطلاق وردود."}>
      {!data ? <EmptyPhase /> : null}
      {data && selected ? (
        <div className="space-y-5">
          <div className="grid grid-cols-3 items-center gap-4">
            {ordered.map((post, index) => {
              const isWinner = post.angle.id === data.winningAngleId;
              const isSelected = post.angle.id === selectedId;
              return <LaunchPost key={post.angle.id} post={post} centered={index === 1} winner={isWinner} selected={isSelected} onClick={() => setSelectedId(post.angle.id)} />;
            })}
          </div>
          <section className="grid grid-cols-[1fr_1fr] gap-4 rounded-3xl border p-5" style={{ background: "#fffaf2", borderColor: "#d8bd7c", boxShadow: "0 18px 52px rgba(91,68,34,0.09)" }}>
            <div>
              <div className="text-[11px] font-bold" style={{ color: "#a68b4b" }}>تفاصيل المنشور المختار</div>
              <h2 className="mt-2 text-[30px] leading-[1.15]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{selected.angle.title}</h2>
              <p className="mt-3 text-[13px] leading-[1.8]" style={{ color: "#514a42" }}>{selected.angle.fit}</p>
              <div className="mt-4 flex flex-wrap gap-2"><Chip text={"التقييم: " + selected.score + "%"} /><Chip text={"المخاطر: " + (selected.angle.risks[0] ?? "منخفضة")} /><Chip text={"النبرة: " + selected.angle.tone} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px] leading-[1.7]">
              <Panel title="خطة الرد">{data.responsePlan.slice(0, 2).map((item) => <Details key={item.scenario} title={item.scenario}><p>{item.response}</p></Details>)}</Panel>
              <Panel title="خطوات الإطلاق">{data.launchChecklist.slice(0, 4).map((item) => <Chip key={item} text={item} />)}</Panel>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <Panel title="بدائل سريعة">{data.alternates.slice(0, 2).map((item) => <p key={item} className="whitespace-pre-line text-[12px] leading-[1.7]" style={{ color: "#514a42" }}>{item}</p>)}</Panel>
              <Panel title="المخاطر التالية">{data.riskNotes.map((item) => <Chip key={item} text={item} />)}{data.nextSteps.slice(0, 2).map((item) => <Chip key={item} text={item} />)}</Panel>
            </div>
          </section>
        </div>
      ) : null}
    </PageShell>
  );
}


function LaunchPost({ post, centered, winner, selected, onClick }: { post: { angle: { id: string; title: string; hook: string; letter: string }; variant?: { fullText: string; score: number }; pkg?: { cta: string } }; centered: boolean; winner: boolean; selected: boolean; onClick: () => void }) {
  const caption = post.variant?.fullText ?? post.angle.hook;
  return (
    <button onClick={onClick} className="relative w-full rounded-3xl border p-4 text-start transition-all" style={{ background: "#fffaf2", borderColor: selected || winner ? "#c8a96e" : "#e4ded4", transform: centered ? "translateY(-14px)" : "translateY(0)", boxShadow: winner ? "0 24px 70px rgba(166,139,75,0.24), 0 0 0 6px rgba(200,169,110,0.08)" : selected ? "0 16px 42px rgba(91,68,34,0.14)" : "0 10px 34px rgba(31,29,26,0.04)" }}>
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ color: winner ? "#163326" : "#7c6a48", background: winner ? "rgba(61,122,95,0.12)" : "rgba(200,169,110,0.13)" }}>{winner ? "الأقوى" : "زاوية " + post.angle.letter}</span>
        <span dir="ltr" className="text-[11px] font-bold" style={{ color: "#a68b4b" }}>X post</span>
      </div>
      <div className="rounded-2xl border p-4" style={{ background: "linear-gradient(180deg, #fdf8ee, #f4ead8)", borderColor: "#e4ded4" }}>
        <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#163326", color: "#f8f1df" }}>T</div><div><div className="text-[13px] font-bold" style={{ color: "#1f1d1a" }}>TrendMind</div><div dir="ltr" className="text-[11px]" style={{ color: "#8f877b" }}>@campaign_lab</div></div></div>
        <h3 className="mt-4 text-[22px] leading-[1.18]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{post.angle.hook}</h3>
        <p className="mt-3 line-clamp-6 whitespace-pre-line text-[12px] leading-[1.7]" style={{ color: "#514a42" }}>{caption}</p>
        <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: "#e4ded4" }}><span className="text-[12px] font-bold" style={{ color: "#a68b4b" }}>{post.pkg?.cta ?? "ابدأ الآن"}</span><span className="tabular-nums text-[12px] font-bold" style={{ color: "#163326" }}>{post.variant?.score ?? 0}%</span></div>
      </div>
      <div className="mt-3 text-[12px] font-bold" style={{ color: selected ? "#163326" : "#8f7d59" }}>{post.angle.title}</div>
    </button>
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

function ChipEditor({ label, values, onChange, placeholder = "+" }: { label: string; values: string[]; onChange: (values: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = React.useState("");
  return (
    <div>
      <div className="mb-1 text-[10px] font-bold" style={{ color: "#a68b4b" }}>{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value, index) => <Chip key={`${value}-${index}`} text={value} onRemove={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} />)}
        <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && draft.trim()) { event.preventDefault(); onChange([...values, draft.trim()]); setDraft(""); } }} placeholder={placeholder} className="min-w-12 flex-1 bg-transparent text-[12px] outline-none" />
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

function LandingPage({ errorMessage }: { errorMessage: string | null }) {
  const [showPopup, setShowPopup] = React.useState(false);

  return (
    <div className="relative flex h-full items-center justify-center px-6">
      <div className="max-w-lg text-center animate-rise-in">
        <div dir="ltr" className="text-[36px] leading-none" style={{ fontFamily: "var(--font-wordmark)", color: "#1f1d1a" }}>
          TrendMind
        </div>
        <p className="mx-auto mt-4 max-w-[320px] text-[14px] leading-[1.7]" style={{ color: "#6b6258" }}>
          منصة ذكية لبناء حملات تسويقية متكاملة تبدأ من الإيجاز وتنتهي بالإطلاق.
        </p>
        {errorMessage ? (
          <p className="mt-3 text-[12px]" style={{ color: "#b25b50" }}>{errorMessage}</p>
        ) : null}
        <button
          onClick={() => setShowPopup(true)}
          className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[14px] font-bold transition-all hover:scale-[1.02]"
          style={{
            color: "#f0e8d8",
            background: "linear-gradient(160deg, #3d7a5f, #163326)",
            boxShadow: "0 8px 28px rgba(22,51,38,0.28), 0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <span className="text-[16px]">+</span>
          إنشاء حملة جديدة
        </button>
      </div>
      {showPopup ? <CreateCampaignPopup onClose={() => setShowPopup(false)} /> : null}
    </div>
  );
}

function CreateCampaignPopup({ onClose }: { onClose: () => void }) {
  const { createCampaign, runPending } = useStore();
  const [form, setForm] = React.useState({
    campaignName: "",
    brandName: "",
    productName: "",
    platform: "X",
  });
  const valid = form.campaignName.trim() && form.brandName.trim() && form.productName.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12100d]/60 p-6 backdrop-blur-md" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-2xl border p-6 shadow-2xl animate-gallery-lights"
        style={{ background: "linear-gradient(180deg, #fff8eb, #f2eadb)", borderColor: "rgba(200,169,110,0.35)" }}
      >
        <h2 className="text-center text-[24px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
          إنشاء حملة جديدة
        </h2>
        <p className="mt-2 text-center text-[13px]" style={{ color: "#6b6258" }}>
          أدخل التفاصيل الأساسية للحملة لبدء العمل
        </p>
        <div className="mt-6 space-y-3">
          <PopupField label="اسم الحملة" value={form.campaignName} onChange={(v) => setForm((f) => ({ ...f, campaignName: v }))} placeholder="مثال: إطلاق شاورما البولد" />
          <PopupField label="اسم العلامة التجارية" value={form.brandName} onChange={(v) => setForm((f) => ({ ...f, brandName: v }))} placeholder="مثال: شاورمر" />
          <PopupField label="اسم المنتج" value={form.productName} onChange={(v) => setForm((f) => ({ ...f, productName: v }))} placeholder="مثال: شاورما البولد الجديدة" />
          <PopupField label="المنصة" value={form.platform} onChange={(v) => setForm((f) => ({ ...f, platform: v }))} placeholder="X / تيك توك / انستقرام" />
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            disabled={!valid || runPending}
            onClick={async () => {
              await createCampaign(form);
              onClose();
            }}
            className="rounded-lg px-5 py-2.5 text-[13px] font-bold transition-all"
            style={{
              color: "#f0e8d8",
              background: "linear-gradient(160deg, #3d7a5f, #163326)",
              opacity: !valid || runPending ? 0.55 : 1,
            }}
          >
            {runPending ? "جاري الإنشاء..." : "إنشاء الحملة"}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2.5 text-[13px] font-bold"
            style={{ color: "#5a4d39", borderColor: "#d9caa8", background: "rgba(255,255,255,0.45)" }}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

function PopupField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold" style={{ color: "#a68b4b" }}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border bg-transparent px-4 py-2.5 text-[13px] outline-none transition-all focus:border-[#c8a96e]"
        style={{ borderColor: "#e4ded4", color: "#1f1d1a", background: "rgba(255,255,255,0.5)" }}
      />
    </label>
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
