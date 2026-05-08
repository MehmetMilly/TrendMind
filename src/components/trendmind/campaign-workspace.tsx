"use client";

import {
  ArrowUpLeft,
  BadgeCheck,
  Eye,
  Filter,
  FileText,
  Layers3,
  Link2,
  MessageSquare,
  Orbit,
  Pencil,
  Play,
  Radar,
  RefreshCw,
  Sparkles,
  Settings,
  ShieldCheck,
  Target,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";
import React from "react";

import { AgentPeek } from "@/components/trendmind/agent-peek";
import { PhaseBackdrop } from "@/components/trendmind/phase-backdrop";
import { AGENTS, PHASES, RESEARCH_KIND_META } from "@/lib/campaign-data";
import type { PhaseId, ResearchItem, ResearchKind, StrategyAngle } from "@/lib/types";
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
    research: <ResearchPageRevamp />,
    strategy: <StrategyPageRevamp />,
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


function ResearchPageRevamp() {
  const { campaign, openInspector } = useStore();
  const data = campaign?.phases.research.data;
  const [showAll, setShowAll] = React.useState(false);
  const [filter, setFilter] = React.useState<ResearchKind | "all">("all");
  const items = React.useMemo(
    () => [...(data?.items ?? [])].sort((a, b) => b.confidence - a.confidence),
    [data?.items],
  );
  const filteredItems = React.useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.kind === filter)),
    [filter, items],
  );
  const visible = showAll ? filteredItems : filteredItems.slice(0, 6);
  const lead = filteredItems[0] ?? items[0] ?? null;
  const averageConfidence = items.length
    ? Math.round(items.reduce((sum, item) => sum + item.confidence, 0) / items.length)
    : 0;
  const sourceCount = new Set(items.map((item) => item.source)).size;

  return (
    <PageShell phase="research" line={data?.overview || "نلتقط الإشارات التي يمكن أن تتحول إلى زاوية حملة حقيقية، ثم نوضح لماذا تستحق الثقة."}>
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div className="space-y-5">
          <section
            className="overflow-hidden rounded-[32px] border"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,250,242,0.96) 0%, rgba(248,241,225,0.98) 55%, rgba(241,230,202,0.98) 100%)",
              borderColor: "#d8bd7c",
              boxShadow: "0 20px 58px rgba(91,68,34,0.1)",
            }}
          >
            <div className="grid gap-0 lg:grid-cols-[1.18fr_0.82fr]">
              <div className="relative p-6 lg:p-7">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.2]"
                  style={{
                    background:
                      "radial-gradient(circle at 12% 18%, rgba(61,122,95,0.16), transparent 24%), radial-gradient(circle at 88% 22%, rgba(200,169,110,0.18), transparent 28%)",
                  }}
                />
                <div className="relative">
                  <div
                    className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold"
                    style={{
                      borderColor: "rgba(22,51,38,0.1)",
                      background: "rgba(255,255,255,0.46)",
                      color: "#1e3a2f",
                    }}
                  >
                    <Radar size={13} />
                    غرفة الإشارات
                  </div>
                  <h2
                    className="max-w-[820px] text-[34px] leading-[1.16]"
                    style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
                  >
                    {data.recommendedFocus}
                  </h2>
                  <p className="mt-3 max-w-[760px] text-[14px] leading-[1.9]" style={{ color: "#5b544a" }}>
                    {data.overview}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <DecisionMetric
                      label="الإشارات"
                      value={String(items.length)}
                      detail="نقاط بحث قابلة للتحويل إلى قرارات."
                      icon={<Layers3 size={15} />}
                    />
                    <DecisionMetric
                      label="الثقة المتوسطة"
                      value={`${averageConfidence}%`}
                      detail="مستوى صلابة القراءة عبر كامل المرحلة."
                      icon={<BadgeCheck size={15} />}
                    />
                    <DecisionMetric
                      label="المصادر"
                      value={String(sourceCount)}
                      detail="مراجع أو قواعد قراءة تدعم الاستنتاجات."
                      icon={<Orbit size={15} />}
                    />
                  </div>
                </div>
              </div>

              <div
                className="border-t p-6 lg:border-r lg:border-t-0 lg:p-7"
                style={{
                  borderColor: "rgba(216,189,124,0.36)",
                  background: "rgba(255,252,247,0.54)",
                }}
              >
                <div
                  className="rounded-[28px] border p-5"
                  style={{ borderColor: "#eadcc0", background: "rgba(255,255,255,0.64)" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-bold" style={{ color: "#a68b4b" }}>
                        البوصلة الحالية
                      </div>
                      <h3
                        className="mt-1 text-[24px] leading-[1.2]"
                        style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
                      >
                        {lead?.title ?? "لا توجد إشارة بارزة"}
                      </h3>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-bold tabular-nums"
                      style={{ background: "rgba(61,122,95,0.1)", color: "#163326" }}
                    >
                      {lead?.confidence ?? 0}%
                    </span>
                  </div>

                  {lead ? (
                    <>
                      <p className="mt-3 text-[13px] leading-[1.8]" style={{ color: "#5a5550" }}>
                        {buildResearchWhyRevamp(lead)}
                      </p>
                      <div
                        className="mt-4 rounded-2xl border p-3"
                        style={{ borderColor: "#ece5d8", background: "#faf7f0" }}
                      >
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold" style={{ color: "#6f5a34" }}>
                          <Sparkles size={13} />
                          ما الذي يفعله TrendMind بهذه الإشارة؟
                        </div>
                        <p className="text-[12px] leading-[1.75]" style={{ color: "#61594e" }}>
                          {buildResearchNextStepRevamp(lead)}
                        </p>
                      </div>
                    </>
                  ) : null}

                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-bold" style={{ color: "#a68b4b" }}>
                      <FileText size={13} />
                      مصادر داعمة
                    </div>
                    <div className="space-y-2">
                      {data.sourceSummary.slice(0, 3).map((source, index) => (
                        <div
                          key={`${source}-${index}`}
                          className="rounded-2xl border px-3 py-2 text-[12px] leading-[1.65]"
                          style={{ borderColor: "#ece5d8", background: "rgba(255,255,255,0.58)", color: "#5f574e" }}
                        >
                          {source}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="flex flex-col gap-3 rounded-[28px] border px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
            style={{ background: "rgba(255,250,242,0.84)", borderColor: "#e4ded4" }}
          >
            <div className="flex items-center gap-2 text-[12px]" style={{ color: "#6b6258" }}>
              <Filter size={14} color="#a68b4b" />
              اختر نوع الإشارات أو افتح أي بطاقة لمعرفة كيف وصل النظام لهذا الاستنتاج.
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "trend", "audience", "competitive", "fact", "risk"] as const).map((entry) => {
                const active = filter === entry;
                const count = entry === "all" ? items.length : items.filter((item) => item.kind === entry).length;
                const meta = entry === "all" ? null : RESEARCH_KIND_META[entry];

                return (
                  <button
                    key={entry}
                    onClick={() => setFilter(entry)}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold transition-all"
                    style={{
                      borderColor: active ? meta?.accent ?? "#c8a96e" : "#e4ded4",
                      background: active ? meta?.background ?? "rgba(200,169,110,0.14)" : "#fffaf2",
                      color: active ? meta?.accent ?? "#6f5a34" : "#6b6258",
                      boxShadow: active ? "0 10px 24px rgba(200,169,110,0.12)" : "none",
                    }}
                  >
                    {entry === "all" ? "الكل" : meta?.label}
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] tabular-nums"
                      style={{ background: active ? "rgba(255,255,255,0.7)" : "rgba(200,169,110,0.12)", color: "inherit" }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((item, index) => {
              const meta = RESEARCH_KIND_META[item.kind];
              const agent = AGENTS[item.by];
              return (
                <AgentPeek key={item.id} agent={item.by} reasoning={`Selected because it scores ${item.confidence}% confidence and strengthens the ${meta.label} path.`}>
                  <article
                    className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[28px] border p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "linear-gradient(180deg, #fffdf8 0%, #fff8ee 100%)",
                      borderColor: `${meta.accent}33`,
                      boxShadow: "0 14px 36px rgba(31,29,26,0.06)",
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${meta.accent}, transparent 82%)` }} />
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ color: meta.accent, background: meta.background }}>
                          {meta.label}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ color: agent.accent, background: `${agent.accent}12` }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: agent.accent }} />
                          {agent.short}
                        </span>
                      </div>
                      <div className="text-start">
                        <div className="text-[10px] font-bold" style={{ color: "#a68b4b" }}>
                          الثقة
                        </div>
                        <div className="text-[18px] font-bold tabular-nums" style={{ color: "#1f1d1a" }}>
                          {item.confidence}%
                        </div>
                      </div>
                    </div>

                    <h3
                      className="mt-4 line-clamp-3 text-[22px] leading-[1.28]"
                      style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
                    >
                      {item.title || `إشارة ${index + 1}`}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-[13px] leading-[1.8]" style={{ color: "#625b52" }}>
                      {item.summary}
                    </p>

                    <div className="mt-4 rounded-2xl border p-3" style={{ borderColor: "#ece5d8", background: "rgba(255,255,255,0.56)" }}>
                      <div className="mb-1 text-[10px] font-bold" style={{ color: "#a68b4b" }}>
                        لماذا تهم؟
                      </div>
                      <p className="text-[12px] leading-[1.7]" style={{ color: "#584f45" }}>
                        {buildResearchWhyRevamp(item)}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full px-2 py-1 text-[10px] font-semibold" style={{ background: "rgba(200,169,110,0.12)", color: "#6f5a34" }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="mb-3 rounded-2xl border px-3 py-2.5" style={{ borderColor: "#ece5d8", background: "#faf7f0" }}>
                        <div className="mb-1 text-[10px] font-bold" style={{ color: "#a68b4b" }}>
                          الدليل أو المصدر
                        </div>
                        <div className="truncate text-[11px]" style={{ color: "#7a7063" }}>
                          {item.source}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openInspector("research", item.id)}
                          className="flex-1 rounded-xl px-3 py-2.5 text-[12px] font-bold transition-all"
                          style={{ background: "#163326", color: "#f7ead0" }}
                        >
                          شرح الإشارة
                        </button>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-xl border px-3 py-2.5 text-[12px] font-bold"
                            style={{ borderColor: "#d8c79a", color: "#6f5a34", background: "#fffaf2" }}
                          >
                            المصدر
                            <ArrowUpLeft size={13} />
                          </a>
                        ) : (
                          <button
                            onClick={() => openInspector("research", item.id)}
                            className="inline-flex items-center gap-1 rounded-xl border px-3 py-2.5 text-[12px] font-bold"
                            style={{ borderColor: "#d8c79a", color: "#6f5a34", background: "#fffaf2" }}
                          >
                            مزيد
                            <Target size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                </AgentPeek>
              );
            })}
          </div>

          {filteredItems.length > 6 ? (
            <button
              onClick={() => setShowAll((value) => !value)}
              className="mx-auto rounded-full px-4 py-2 text-[12px] font-bold"
              style={{ background: "#efe5d2", color: "#6f5a34" }}
            >
              {showAll ? "عرض أقل" : "عرض بقية الإشارات"}
            </button>
          ) : null}
        </div>
      ) : null}
    </PageShell>
  );
}

function StrategyPageRevamp() {
  const { campaign, openInspector, setSelectedAngleId } = useStore();
  const data = campaign?.phases.strategy.data;
  const selectedAngleId = campaign?.selectedAngleId ?? data?.recommendedAngleId ?? null;
  const recommended = data?.angles.find((angle) => angle.id === data.recommendedAngleId) ?? null;
  const selectedAngle = data?.angles.find((angle) => angle.id === selectedAngleId) ?? recommended ?? null;
  const heroAngle = selectedAngle ?? recommended;
  const heroAngleLabel =
    selectedAngle && recommended && selectedAngle.id !== recommended.id ? "الزاوية المعتمدة الآن" : "الزاوية المقترحة الآن";
  const averageScore = data?.angles.length
    ? Math.round(data.angles.reduce((sum, angle) => sum + angle.score, 0) / data.angles.length)
    : 0;

  return (
    <PageShell phase="strategy" line={data?.campaignThesis || "نحوّل البحث إلى غرفة قرار: لماذا هذه الزاوية، ماذا نختبر فيها، وكيف قد يراها الناس فعلًا."}>
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div className="space-y-4">
          <section
            className="overflow-hidden rounded-[32px] border"
            style={{
              background: "linear-gradient(135deg, #fffaf2 0%, #f5ebd8 58%, #efe2c0 100%)",
              borderColor: "#d8bd7c",
              boxShadow: "0 20px 58px rgba(91,68,34,0.1)",
            }}
          >
            <div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="p-6 lg:p-7">
                <div
                  className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold"
                  style={{ borderColor: "rgba(22,51,38,0.1)", background: "rgba(255,255,255,0.46)", color: "#1e3a2f" }}
                >
                  <Target size={13} />
                  غرفة القرار
                </div>
                <h2
                  className="max-w-[860px] text-[34px] leading-[1.16]"
                  style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
                >
                  {data.campaignThesis}
                </h2>
                <p className="mt-3 max-w-[780px] text-[14px] leading-[1.9]" style={{ color: "#5b544a" }}>
                  {data.decisionFrame}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <DecisionMetric
                    label="المسارات"
                    value={String(data.angles.length)}
                    detail="خيارات حقيقية قابلة للمقارنة لا مجرد أفكار معروضة."
                    icon={<Layers3 size={15} />}
                  />
                  <DecisionMetric
                    label="المتوسط"
                    value={`${averageScore}%`}
                    detail="جاهزية أولية قبل الدخول في الصياغة والاختبار."
                    icon={<BadgeCheck size={15} />}
                  />
                  <DecisionMetric
                    label="الموصى بها"
                    value={recommended?.letter ?? "-"}
                    detail="الخيار الأقرب للوضوح والجدوى الآن."
                    icon={<Sparkles size={15} />}
                  />
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  <DecisionFrameBlock title="اتجاه الرسالة" body={data.messageDirection} />
                  <DecisionFrameBlock title="منطق التمركز" body={data.positioningLogic} />
                  <DecisionFrameBlock title="نبرة القرار" body={data.toneDirection} />
                </div>
              </div>

              <div
                className="border-t p-6 lg:border-r lg:border-t-0 lg:p-7"
                style={{ borderColor: "rgba(216,189,124,0.36)", background: "rgba(18,31,24,0.96)", color: "#f7ead0" }}
              >
                <div
                  className="rounded-[28px] border p-5"
                  style={{
                    borderColor: "rgba(217,191,130,0.24)",
                    background: "linear-gradient(180deg, rgba(30,49,38,0.95), rgba(18,31,24,0.98))",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-bold" style={{ color: "#d9bf82" }}>
                        {heroAngleLabel}
                      </div>
                      <h3 className="mt-2 text-[28px] leading-[1.14]" style={{ fontFamily: "var(--font-heading)" }}>
                        {heroAngle?.title}
                      </h3>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-bold tabular-nums"
                      style={{ background: "rgba(217,191,130,0.14)", color: "#f7ead0" }}
                    >
                      {heroAngle?.score ?? 0}%
                    </span>
                  </div>

                  <p className="mt-4 text-[30px] leading-[1.22]" style={{ fontFamily: "var(--font-heading)", color: "#f7ead0" }}>
                    {heroAngle?.hook}
                  </p>
                  <p className="mt-4 text-[13px] leading-[1.85]" style={{ color: "rgba(247,234,208,0.76)" }}>
                    {heroAngle?.fit}
                  </p>

                  <div className="mt-5 grid gap-3">
                    <DarkDecisionCard title="لماذا اقترحناها؟" body={heroAngle ? buildAngleWhyRevamp(heroAngle) : ""} icon={<Sparkles size={14} />} />
                    <DarkDecisionCard title="رد الفعل المتوقع" body={heroAngle ? buildAngleAudienceReadRevamp(heroAngle) : ""} icon={<Users size={14} />} />
                    <DarkDecisionCard title="الخطر الذي نراقبه" body={heroAngle?.risks[0] ?? "لا يوجد خطر ظاهر بعد."} icon={<TriangleAlert size={14} />} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-3 lg:grid-cols-3">
            {data.angles.map((angle) => (
              <div
                key={`summary-${angle.id}`}
                className="rounded-[26px] border p-4"
                style={{ background: "#fffaf2", borderColor: angle.id === data.recommendedAngleId ? "#d8bd7c" : "#e4ded4" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-2xl text-[18px] font-bold"
                      style={{ background: "rgba(200,169,110,0.12)", color: "#a68b4b", fontFamily: "var(--font-heading)" }}
                    >
                      {angle.letter}
                    </span>
                    <div>
                      <div className="text-[10px] font-bold" style={{ color: "#a68b4b" }}>
                        مسار {angle.lane}
                      </div>
                      <div className="text-[18px] leading-[1.15]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
                        {angle.title}
                      </div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: "#163326" }}>
                    {angle.score}%
                  </span>
                </div>
                <p className="mt-3 text-[12px] leading-[1.7]" style={{ color: "#5f574e" }}>
                  {buildAngleQuickFrameRevamp(angle)}
                </p>
              </div>
            ))}
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            {data.angles.map((angle) => {
              const selected = selectedAngleId === angle.id;
              const recommendedAngle = angle.id === data.recommendedAngleId;

              return (
                <article
                  key={angle.id}
                  className="flex min-h-[520px] flex-col rounded-[30px] border p-5 transition-all duration-300"
                  style={{
                    background: selected ? "linear-gradient(180deg, #fffaf2, #f1e5c9)" : "linear-gradient(180deg, #fffdf8, #fff8ee)",
                    borderColor: selected ? "#c8a96e" : recommendedAngle ? "#d8bd7c" : "#e4ded4",
                    boxShadow: selected ? "0 20px 46px rgba(166,139,75,0.18)" : "0 12px 34px rgba(31,29,26,0.05)",
                    transform: selected ? "translateY(-4px)" : "translateY(0)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-[44px] leading-none" style={{ fontFamily: "var(--font-heading)", color: "#d1b675" }}>
                        {angle.letter}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ color: "#6f5a34", background: "rgba(200,169,110,0.12)" }}>
                            {angle.lane}
                          </span>
                          {recommendedAngle ? (
                            <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ color: "#163326", background: "rgba(61,122,95,0.12)" }}>
                              موصى بها
                            </span>
                          ) : null}
                          {selected ? (
                            <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ color: "#163326", background: "rgba(61,122,95,0.12)" }}>
                              محددة الآن
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-3 text-[26px] leading-[1.18]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
                          {angle.title}
                        </h3>
                      </div>
                    </div>
                    <button onClick={() => openInspector("angle", angle.id)} className="rounded-2xl p-2.5" style={{ background: "#f1e7d5", color: "#745f39" }} title="استعراض">
                      <Eye size={15} />
                    </button>
                  </div>

                  <p className="mt-4 text-[22px] leading-[1.3]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
                    {angle.hook}
                  </p>

                  <p className="mt-3 text-[13px] leading-[1.85]" style={{ color: "#5f574e" }}>
                    {angle.thesis}
                  </p>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-bold">
                      <span style={{ color: "#6f5a34" }}>جاهزية الاتجاه</span>
                      <span className="tabular-nums" style={{ color: "#163326" }}>{angle.score}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full" style={{ background: "rgba(200,169,110,0.14)" }}>
                      <div className="h-full rounded-full" style={{ width: `${angle.score}%`, background: "linear-gradient(90deg, #3d7a5f, #c8a96e)" }} />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <AngleInsightCard title="لماذا هذا الخيار؟" body={buildAngleWhyRevamp(angle)} icon={<Sparkles size={13} />} />
                    <AngleInsightCard title="كيف سيتلقاه الجمهور؟" body={buildAngleAudienceReadRevamp(angle)} icon={<Users size={13} />} />
                    <AngleInsightCard title="ماذا نثبت عند الاختبار؟" body={buildAngleTestingReadRevamp(angle)} icon={<Target size={13} />} />
                    <AngleInsightCard title="الخطر الرئيسي" body={angle.risks[0] ?? "الخطر منخفض حاليًا."} icon={<TriangleAlert size={13} />} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Chip text={`الوعد: ${angle.promise}`} />
                    <Chip text={`النبرة: ${angle.tone}`} />
                    <Chip text={`الموقف: ${angle.stance}`} />
                  </div>

                  <div className="mt-auto pt-5">
                    <button onClick={() => void setSelectedAngleId(angle.id)} className="w-full rounded-xl px-3 py-2.5 text-[12px] font-bold" style={{ color: selected ? "#f8f1df" : "#163326", background: selected ? "#163326" : "#efe5d2" }}>
                      {selected ? "هذه هي الزاوية المعتمدة الآن" : "اعتماد هذه الزاوية"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

function buildResearchWhyRevamp(item: ResearchItem) {
  switch (item.kind) {
    case "trend":
      return "هذه الإشارة مهمة لأنها تلتقط نمطًا قابلًا للتكرار، ويمكن تحويله إلى زاوية يشعر الناس أنها من السوق الحقيقي لا من داخل غرفة كتابة.";
    case "audience":
      return "هذه الإشارة تقرّبنا من اللغة التي يفهمها الجمهور فعلًا، وتقلل خطر بناء رسالة جميلة لكنها بعيدة عن دوافع القرار.";
    case "competitive":
      return "هذه القراءة مهمة لأنها تمنعنا من تقليد المنافسين بشكل أعمى، وتوضح أين يمكن لـ TrendMind أن يظهر بوضوح مختلف.";
    case "fact":
      return "هذه الإشارة ترفع مصداقية الرسالة لأنها تربط الوعد بعنصر يمكن الدفاع عنه بدل الاكتفاء بانطباع عام.";
    case "risk":
      return "هذه الإشارة تحمينا من زاوية قد تبدو جذابة بصريًا أو لغويًا، لكنها تضعف الثقة أو تفتح باب اعتراض مبكر.";
    default:
      return "هذه الإشارة تعطي قراءة عملية تساعدنا على اتخاذ قرار أفضل في المرحلة التالية.";
  }
}

function buildResearchNextStepRevamp(item: ResearchItem) {
  switch (item.kind) {
    case "trend":
      return "سنحوّل هذا النمط إلى زاوية قابلة للاختبار: كيف نستفيد من الاتجاه بدون أن يبدو المحتوى نسخة مكررة؟";
    case "audience":
      return "سنستخدم هذه القراءة لصياغة الزاوية والنبرة والمحفز الأقرب لفهم الجمهور، ثم نختبر وضوحها في التخطيط.";
    case "competitive":
      return "سنقارن هذه الإشارة بمسارات التخطيط لنقرر: هل ننافس على الوضوح، أم على التميز، أم على سرعة الالتقاط؟";
    case "fact":
      return "سنضع هذه الحقيقة داخل الرسالة الأساسية أو المساندة حتى تبقى النسخة مقنعة ويمكن الدفاع عنها بسهولة.";
    case "risk":
      return "سنأخذ هذا التحذير كقيد استراتيجي يمنع تضخم الوعود أو تشوش الرسالة في المرحلة التالية.";
    default:
      return "سيتم دفع هذه القراءة للأمام كجزء من منطق الاختيار في التخطيط.";
  }
}

function buildAngleWhyRevamp(angle: StrategyAngle) {
  return angle.rationale[0] ?? `اقتُرح هذا المسار لأنه يبني على ${angle.promise} بطريقة تجعل الرسالة أوضح وأسهل في الاختبار.`;
}

function buildAngleAudienceReadRevamp(angle: StrategyAngle) {
  if (angle.lane === "safe") {
    return "الجمهور سيفهم الفائدة بسرعة ويشعر أن القرار أسهل، لكن الانطباع قد يكون أقل إثارة إذا لم ندعم النسخة بخطاف قوي.";
  }

  if (angle.lane === "sharp") {
    return "هذا المسار يمنح الجمهور لحظة توقف ذكية؛ يشعر بالتميز والوضوح معًا، وهو غالبًا الأنسب عندما نريد توازنًا بين الجمال والإقناع.";
  }

  return "الجمهور قد يلتقط الرسالة بسرعة إذا كان التنفيذ مضبوطًا، لكن هذا المسار يحتاج مراقبة حتى لا يتحول الاهتمام إلى تشويش أو مبالغة.";
}

function buildAngleTestingReadRevamp(angle: StrategyAngle) {
  if (angle.lane === "safe") {
    return "نختبر هنا: هل الوضوح وحده يكفي لرفع القبول والتحويل، أم أن المسار يحتاج عنصرًا أكثر تميزًا حتى يُتذكر؟";
  }

  if (angle.lane === "sharp") {
    return "نختبر هنا: هل هذا التوازن بين الجاذبية والوضوح يعطي أفضل استجابة، وهل يشعر الجمهور أن الرسالة ذكية لا متصنعة؟";
  }

  return "نختبر هنا: هل الجرأة ترفع الانتباه فعليًا أم أنها تسرق التركيز من الفائدة الأساسية التي نريد تثبيتها؟";
}

function buildAngleQuickFrameRevamp(angle: StrategyAngle) {
  return `اقتُرح هذا المسار لأن ${angle.rationale[0] ?? angle.promise}. النبرة الحالية: ${angle.tone}.`;
}

function DecisionMetric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border px-4 py-4" style={{ borderColor: "#eadcc0", background: "rgba(255,255,255,0.56)" }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] font-bold" style={{ color: "#a68b4b" }}>{label}</div>
        <div style={{ color: "#3d7a5f" }}>{icon}</div>
      </div>
      <div className="mt-2 text-[24px] font-bold leading-none" style={{ color: "#1f1d1a", fontFamily: "var(--font-heading)" }}>{value}</div>
      <div className="mt-2 text-[11px] leading-[1.65]" style={{ color: "#6d6559" }}>{detail}</div>
    </div>
  );
}

function DecisionFrameBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border p-4" style={{ borderColor: "#e4ded4", background: "rgba(255,255,255,0.48)" }}>
      <div className="mb-2 text-[10px] font-bold" style={{ color: "#a68b4b" }}>{title}</div>
      <p className="text-[12px] leading-[1.75]" style={{ color: "#5b544a" }}>{body}</p>
    </div>
  );
}

function DarkDecisionCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border p-3" style={{ borderColor: "rgba(217,191,130,0.18)", background: "rgba(217,191,130,0.08)" }}>
      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold" style={{ color: "#d9bf82" }}>
        {icon}
        {title}
      </div>
      <p className="text-[12px] leading-[1.75]" style={{ color: "rgba(247,234,208,0.76)" }}>{body}</p>
    </div>
  );
}

function AngleInsightCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border p-3" style={{ borderColor: "#ece5d8", background: "rgba(255,255,255,0.54)" }}>
      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold" style={{ color: "#a68b4b" }}>
        {icon}
        {title}
      </div>
      <p className="text-[12px] leading-[1.7]" style={{ color: "#584f45" }}>{body}</p>
    </div>
  );
}

function DraftPage() {
  const { campaign, openInspector } = useStore();
  const data = campaign?.phases.draft.data;
  const strategy = campaign?.phases.strategy.data;
  const [manualDrafts, setManualDrafts] = React.useState<Record<string, { hookId: string; bodyId: string; ctaId: string }>>({});

  return (
    <PageShell phase="draft" line={data?.summary || "نجهّز لكل مسار أكثر من صياغة، ثم نعتمد إعلاناً مركباً من العنوان والجسم والدعوة قبل الاختبار."}>
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
            const manualDraft = manualDrafts[angle.id] ?? {
              hookId: variant.hookId,
              bodyId: variant.bodyId,
              ctaId: variant.ctaId,
            };
            const selectedHook = laneHooks.find((item) => item.id === manualDraft.hookId) ?? laneHooks[0];
            const selectedBody = laneBodies.find((item) => item.id === manualDraft.bodyId) ?? laneBodies[0];
            const selectedCta = laneCtas.find((item) => item.id === manualDraft.ctaId) ?? laneCtas[0];
            const assembledText = [selectedHook?.text, selectedBody?.text, selectedCta?.text].filter(Boolean).join("\n\n");
            const updateManualDraft = (patch: Partial<{ hookId: string; bodyId: string; ctaId: string }>) => {
              setManualDrafts((current) => ({
                ...current,
                [angle.id]: {
                  hookId: manualDraft.hookId,
                  bodyId: manualDraft.bodyId,
                  ctaId: manualDraft.ctaId,
                  ...patch,
                },
              }));
            };
            return (
              <article key={angle.id} className="rounded-3xl border p-4" style={{ background: "#fffaf2", borderColor: "#c8a96e", boxShadow: "0 16px 42px rgba(166,139,75,0.12)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold" style={{ color: "#a68b4b" }}>زاوية صياغة</div>
                    <h3 className="mt-1 text-[22px] leading-[1.15]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>مسار {angle.letter}</h3>
                  </div>
                </div>
                <DraftList title="العناوين" items={laneHooks} selectedId={manualDraft.hookId} onSelect={(id) => updateManualDraft({ hookId: id })} onOpen={openInspector} />
                <DraftList title="الأجسام" items={laneBodies} selectedId={manualDraft.bodyId} onSelect={(id) => updateManualDraft({ bodyId: id })} onOpen={openInspector} />
                <DraftList title="الدعوات" items={laneCtas} selectedId={manualDraft.ctaId} onSelect={(id) => updateManualDraft({ ctaId: id })} onOpen={openInspector} />
                {variant ? (
                  <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "#c8a96e", background: "linear-gradient(180deg, #f6ecd2, #fffaf2)" }}>
                    <div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-bold" style={{ color: "#a68b4b" }}>التركيبة المعتمدة لهذا المسار</span><button onClick={() => openInspector("variant", variant.id)} className="text-[11px] font-bold" style={{ color: "#6f5a34" }}>تفاصيل</button></div>
                    <p className="whitespace-pre-line text-[13px] leading-[1.75]" style={{ color: "#514a42" }}>{assembledText}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">{variant.critique.slice(0, 2).map((note, index) => <Chip key={index} text={note.note} />)}</div>
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


function DraftList({
  title,
  items,
  selectedId,
  onSelect,
  onOpen,
}: {
  title: string;
  items: Array<{ id: string; text: string; note?: string }>;
  selectedId?: string;
  onSelect?: (id: string) => void;
  onOpen: (kind: "draft-atom", id: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold" style={{ color: "#a68b4b" }}>
        <span>{title}</span>
        <span className="tabular-nums" style={{ color: "#b0a99e" }}>{items.length}</span>
      </div>
      <div className="space-y-1.5">
        {items.slice(0, 5).map((item) => {
          const selected = item.id === selectedId;
          return (
          <button key={item.id} onClick={() => onSelect ? onSelect(item.id) : onOpen("draft-atom", item.id)} onDoubleClick={() => onOpen("draft-atom", item.id)} className="w-full rounded-xl border px-3 py-2 text-start text-[12px] leading-[1.55] transition-all" style={{ background: selected ? "rgba(61,122,95,0.09)" : "#fdf8ee", borderColor: selected ? "#3d7a5f" : "#e7decc", color: "#3f3932" }}>
            <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold" style={{ background: selected ? "#163326" : "#efe5d2", color: selected ? "#f8f1df" : "#9b875e" }}>{selected ? "✓" : ""}</span>
            {item.text}
          </button>
          );
        })}
      </div>
    </div>
  );
}

function TrialPage() {
  const { campaign, resetTrialReplay } = useStore();
  const data = campaign?.phases.trial.data;
  const draft = campaign?.phases.draft.data;
  const strategy = campaign?.phases.strategy.data;
  const testedVariants = (data?.angleWinners ?? [])
    .map((winner) => draft?.variants.find((variant) => variant.id === winner.variantId))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <PageShell
      phase="trial"
      line={data?.summary || "اختبار يقارن الإعلانات الثلاثة المعتمدة ويعرض تفاعل الجمهور مع كل صيغة قبل الإطلاق."}
      action={
        data ? (
          <button onClick={resetTrialReplay} className="rounded-lg px-3 py-2 text-[12px] font-bold" style={{ background: "#163326", color: "#f8f1df" }}>
            إعادة العرض
          </button>
        ) : null
      }
    >
      {!data ? <EmptyPhase /> : null}
      {data ? (
        <div className="overflow-hidden rounded-3xl border p-5 animate-curtain-rise" style={{ background: "linear-gradient(135deg, #fffaf2 0%, #f2eadb 56%, #e9f0e6 100%)", borderColor: "rgba(61,122,95,0.24)", boxShadow: "0 24px 70px rgba(31,29,26,.08)" }}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[24px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>الإعلانات الثلاثة تحت الاختبار</h3>
              <p className="mt-1 text-[12px] leading-[1.7]" style={{ color: "#6b6258" }}>كل إعلان يمثل مساراً مختلفاً، والتفاعل يظهر كإحساس عام داخل بطاقة الإعلان نفسها.</p>
            </div>
            <span title="نموذج شخصيات اصطناعي، وليس مستخدمين حقيقيين" className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "rgba(61,122,95,0.12)", color: "#163326" }}>i</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {testedVariants.map((variant) => {
              if (!variant) return null;
              const angle = strategy?.angles.find((entry) => entry.id === variant.angleId);
              const score = data.scoreboard.find((entry) => entry.variantId === variant.id);
              return (
                <AgentPeek key={variant.id} agent="simulator" reasoning={score?.verdict ?? "تم اختبار الإعلان على مجموعة شخصيات مركبة."}>
                  <article className="relative min-h-[460px] overflow-hidden rounded-[28px] border p-5" style={{ background: "linear-gradient(180deg, #fffdf8, #f7f0e1)", borderColor: score?.variantId === data.winningVariantId ? "#3d7a5f" : "#e0d5c1", boxShadow: score?.variantId === data.winningVariantId ? "0 20px 54px rgba(61,122,95,.18)" : "0 14px 38px rgba(31,29,26,.07)" }}>
                    <div className="text-[12px] font-black" style={{ color: "#3d7a5f" }}>مسار {angle?.letter}</div>
                    <div className="mt-4 h-1 w-14 rounded-full" style={{ background: "linear-gradient(90deg, #163326, #c8a96e)" }} />
                    <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.85]" style={{ color: "#332d27" }}>{variant.fullText}</p>
                    <div className="absolute bottom-5 left-5 right-5 rounded-2xl border px-4 py-3 text-[12px] font-bold" style={{ background: "rgba(61,122,95,0.10)", borderColor: "rgba(61,122,95,0.22)", color: "#163326" }}>
                      تفاعل الجمهور يظهر في المقارنة النهائية بدون تفاصيل مشتتة داخل البطاقة.
                    </div>
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
          <div className="col-span-2">
            <PackagingAgentPanel />
          </div>
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


function PackagingAgentPanel() {
  const { campaign } = useStore();
  const brief = campaign?.brief;
  const direction = buildPackagingDirection(
    [
      brief?.productName,
      brief?.brandName,
      brief?.audience,
      brief?.tone,
      brief?.valueProposition,
      brief?.context,
    ]
      .filter(Boolean)
      .join(" "),
    brief?.brandName || "TrendMind",
    brief?.productName || "المنتج",
  );

  return (
    <AgentPeek agent="packaging" reasoning="Packaging Agent builds a market-ready packaging direction from the product, audience, positioning, materials, shelf appeal, and mockup requirements.">
      <section className="rounded-3xl border p-5" style={{ background: "#fffaf2", borderColor: "#d8bd7c", boxShadow: "0 18px 52px rgba(91,68,34,0.09)" }}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold" style={{ color: "#a68b4b" }}>Packaging Agent</div>
            <h2 className="mt-1 text-[30px] leading-[1.15]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>اتجاه تغليف جاهز للموك أب</h2>
            <p className="mt-2 max-w-[780px] text-[13px] leading-[1.8]" style={{ color: "#5f574e" }}>
              {direction.description}
            </p>
          </div>
          <div className="rounded-2xl border px-4 py-3 text-start" style={{ borderColor: "#e4ded4", background: "#f8f0df" }}>
            <div className="text-[10px] font-bold" style={{ color: "#a68b4b" }}>Brand Mood</div>
            <div className="mt-1 text-[15px] font-bold" style={{ color: "#163326" }}>{direction.mood}</div>
            <div className="mt-1 text-[11px]" style={{ color: "#7a6e60" }}>{direction.positioning}</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "#d8bd7c", background: "linear-gradient(160deg, #18251f 0%, #312719 100%)", boxShadow: "0 24px 72px rgba(31,29,26,0.22)" }}>
            <div className="relative min-h-[360px] p-6" style={{ background: `radial-gradient(circle at 18% 20%, ${direction.colors[1]}55, transparent 28%), linear-gradient(145deg, ${direction.colors[0]}, #101712 72%)` }}>
              <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.32) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="relative flex h-full items-center justify-center">
                <div className="relative h-[270px] w-[210px] rounded-[28px]" style={{ background: "linear-gradient(180deg, #fdf8ee, #efe4cf)", boxShadow: "0 34px 60px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.42)" }}>
                  <div className="absolute left-1/2 top-8 h-[120px] w-[120px] -translate-x-1/2 rounded-[28px]" style={{ background: `linear-gradient(180deg, ${direction.colors[3]}, ${direction.colors[1]})`, boxShadow: "0 18px 30px rgba(0,0,0,.16)" }} />
                  <div className="absolute bottom-7 left-6 right-6">
                    <div className="text-[10px] font-bold tracking-[0.18em]" style={{ color: direction.colors[0] }}>RETAIL PACKAGING</div>
                    <h3 className="mt-2 text-[22px] leading-[1.12]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{brief?.brandName || "TrendMind"}</h3>
                    <p className="mt-1 text-[12px] leading-[1.5]" style={{ color: "#5f574e" }}>{brief?.productName || "منتج جديد"}</p>
                    <div className="mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: "#163326", color: "#f7ead0" }}>{direction.slogan}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Panel title="Brand Analysis">
              {direction.brandAnalysis.map((item) => (
                <p key={item} className="rounded-xl border px-3 py-2 text-[12px] leading-[1.65]" style={{ borderColor: "#e4ded4", background: "rgba(250,247,240,0.64)", color: "#514a42" }}>
                  {item}
                </p>
              ))}
            </Panel>
            <Panel title="Packaging Concept">
              {direction.concept.map((item) => (
                <p key={item} className="rounded-xl border px-3 py-2 text-[12px] leading-[1.65]" style={{ borderColor: "#e4ded4", background: "rgba(250,247,240,0.64)", color: "#514a42" }}>
                  {item}
                </p>
              ))}
            </Panel>
            <Panel title="Visual Identity">
              <div className="flex flex-wrap gap-2">
                {direction.colors.map((color) => <span key={color} className="h-9 w-9 rounded-full border" style={{ background: color, borderColor: "rgba(0,0,0,.12)" }} title={color} />)}
              </div>
              <div className="rounded-xl border px-3 py-2 text-[12px] leading-[1.65]" style={{ borderColor: "#e4ded4", background: "rgba(250,247,240,0.64)", color: "#514a42" }}>
                {direction.identity[0]}
              </div>
            </Panel>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <Panel title="Materials & Printing">
            {direction.materials.map((item) => (
              <p key={item} className="rounded-xl border px-3 py-2 text-[12px] leading-[1.65]" style={{ borderColor: "#e4ded4", background: "rgba(250,247,240,0.64)", color: "#514a42" }}>
                {item}
              </p>
            ))}
          </Panel>
          <Panel title="Shelf Appeal & CX">
            {direction.shelfAppeal.map((item) => (
              <p key={item} className="rounded-xl border px-3 py-2 text-[12px] leading-[1.65]" style={{ borderColor: "#e4ded4", background: "rgba(250,247,240,0.64)", color: "#514a42" }}>
                {item}
              </p>
            ))}
          </Panel>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {direction.costs.map((cost) => (
            <div key={cost.label} className="rounded-2xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdf8ee" }}>
              <div className="text-[10px] font-bold" style={{ color: "#a68b4b" }}>{cost.label}</div>
              <div className="mt-1 text-[14px] font-bold tabular-nums" style={{ color: "#163326" }}>{cost.value}</div>
              <div className="mt-1 text-[10px] leading-[1.5]" style={{ color: "#766d62" }}>{cost.note}</div>
            </div>
          ))}
        </div>

        <section className="mt-4 rounded-2xl border p-4" style={{ background: "#163326", borderColor: "#d8bd7c", color: "#f7ead0" }}>
          <h3 className="mb-3 text-[18px]" style={{ fontFamily: "var(--font-heading)" }}>AI Mockup Prompt</h3>
          <p dir="ltr" className="rounded-xl border p-3 text-[11px] leading-[1.7]" style={{ background: "rgba(217,191,130,0.12)", borderColor: "rgba(217,191,130,0.24)", color: "rgba(247,234,208,0.82)" }}>
            {direction.mockupPrompt}
          </p>
        </section>
      </section>
    </AgentPeek>
  );
}

function buildPackagingDirection(text: string, brandName: string, productName: string) {
  const normalized = text.toLowerCase();
  const isBeauty = /(beauty|makeup|skin|perfume|cosmetic|serum|skincare|عطر|تجميل|بشرة)/.test(normalized);
  const isFood = /(coffee|matcha|food|restaurant|dessert|chocolate|snack|قهوة|مطعم|حلوى|شوكولاتة)/.test(normalized);
  const isFitness = /(protein|fitness|gym|wellness|health|bar|بروتين|رياضة|صحة)/.test(normalized);

  if (isBeauty) {
    return {
      mood: "Minimal, soft luxury",
      positioning: "Premium self-care product with quiet confidence.",
      colors: ["#f4eee8", "#d8b7a6", "#1f1d1a", "#c8a96e"],
      brandAnalysis: ["الجمهور: نساء يهتممن بالعناية والنتائج الموثوقة.", "الشخصية: هادئة، راقية، دقيقة، وغير صاخبة.", "الإحساس: نظافة، نعومة، ثقة، وفخامة يومية."],
      concept: ["علبة خارجية عمودية بسيطة بسطح مطفي ونافذة نصية صغيرة.", "تجربة فتح بطبقات قليلة وورقة تعليمات قصيرة.", "تفاصيل ذهبية محدودة حول الشعار فقط."],
      identity: ["ألوان أساسية هادئة مع لمسة ذهبية محدودة.", "خط Sans واضح للعناوين وخط Serif لطيف للشعار."],
      slogan: "Care, refined.",
      description: `${productName} من ${brandName}: تجربة عناية نظيفة وراقية تبدو جميلة وتُفهم بسرعة.`,
      materials: ["Rigid paperboard أو SBS حسب الميزانية.", "Soft-touch matte lamination مع spot UV خفيف.", "CMYK + foil ذهبي أو rose-gold للشعار."],
      shelfAppeal: ["أظهر اسم المنتج كبيرًا وواضحًا في أول ثلث من الواجهة.", "استخدم مساحة بيضاء واسعة لرفع الإحساس الطبي الفاخر.", "أضف سطر طمأنة قصير داخل الغطاء لرفع الثقة."],
      mockupPrompt: `realistic premium skincare packaging mockup for ${brandName}, product ${productName}, soft beige rigid box and bottle, matte soft-touch finish, subtle rose gold foil logo, minimal typography, clean studio lighting, luxury cosmetic shelf appeal, front and angled view, high-end branding agency style`,
      costs: defaultCosts("$0.45-$0.90", "$1.10-$2.40", "$3.20-$6.50"),
    };
  }

  if (isFood) {
    return {
      mood: "Warm premium craft",
      positioning: "Giftable product with rich sensory value.",
      colors: ["#2b1d14", "#c8a96e", "#f5efe4", "#7a3f2a"],
      brandAnalysis: ["الجمهور: مشترو هدايا وتجارب طعم قابلة للتصوير.", "الشخصية: دافئة، أصيلة، شهية، ومصقولة.", "الإحساس: رائحة، ضيافة، جودة، وإهداء."],
      concept: ["Sleeve box أو tin box حسب طبيعة المنتج.", "فتحة جانبية تكشف المنتج كهدية صغيرة.", "ختم دائري يرفع الإحساس الحرفي.", "بطاقة داخلية قصيرة تحكي قصة المنتج."],
      identity: ["بني عميق مع ذهب دافئ وكريمي.", "خط عربي/لاتيني أنيق بوزن واضح.", "مزج قريب من الرف الفاخر والمناسبات."],
      slogan: "Crafted to be remembered.",
      description: `${productName} بتغليف دافئ ومميز يحول الشراء إلى تجربة إهداء جاهزة.`,
      materials: ["كرتون غذائي مطلي أو علبة معدنية للنسخة الممتازة.", "Matte varnish مع emboss لختم الشعار.", "Spot colors لثبات الألوان العميقة."],
      shelfAppeal: ["أظهر النكهة أو النوع في شريط واضح.", "استخدم contrast قوي بين الخلفية والختم.", "أضف بطاقة صغيرة داخلية لقصة المنتج أو طريقة التقديم."],
      mockupPrompt: `realistic premium food packaging mockup for ${brandName}, product ${productName}, warm dark brown and gold sleeve box, tactile paper texture, embossed seal, elegant Arabic-inspired typography, gift-ready presentation, luxury retail shelf, soft warm studio lighting`,
      costs: defaultCosts("$0.35-$0.75", "$0.90-$2.10", "$2.80-$5.80"),
    };
  }

  if (isFitness) {
    return {
      mood: "Modern performance",
      positioning: "High-trust active lifestyle product.",
      colors: ["#101c16", "#3d7a5f", "#f7ead0", "#d9bf82"],
      brandAnalysis: ["الجمهور: رياضيون ومهتمون بالصحة يريدون وضوحًا سريعًا.", "الشخصية: قوية، نظيفة، عملية، ومباشرة.", "الإحساس: طاقة منظمة بدون مبالغة."],
      concept: ["عبوة أو wrapper بخطوط حادة ومساحات معلومات منظمة.", "فتحة سريعة ونظيفة مع معلومات غذائية سهلة القراءة.", "Badge واضح للبروتين أو الفائدة الأساسية.", "لمسات معدنية محدودة لتجنب الشكل الرخيص."],
      identity: ["أخضر داكن مع ذهبي باهت وكريمي.", "Sans condensed للعناوين والأرقام.", "مزج عملي premium مناسب للمتجر والإعلانات."],
      slogan: "Built for better days.",
      description: `${productName} بتغليف واضح وسريع الفهم، مصمم ليبدو موثوقًا من أول نظرة.`,
      materials: ["Film wrapper أو carton multipack بحسب المنتج.", "Matte finish مع spot gloss على أرقام الفائدة.", "طباعة flexo أو digital للدُفعات الصغيرة."],
      shelfAppeal: ["اجعل رقم الفائدة أو البروتين هو البطل البصري.", "ضع النكهة بلون ثانوي ثابت.", "أضف QR لتجربة أو وصفة أو شرح استخدام."],
      mockupPrompt: `realistic modern protein product packaging mockup for ${brandName}, product ${productName}, dark green matte wrapper and carton, premium performance branding, bold nutrition badge, clean typography, gym lifestyle retail shelf, dramatic studio lighting`,
      costs: defaultCosts("$0.18-$0.40", "$0.55-$1.20", "$1.60-$3.80"),
    };
  }

  return {
    mood: "Modern minimal tech",
    positioning: "Smart product with premium utility and strong shelf clarity.",
    colors: ["#162b22", "#c8a96e", "#f5f1ea", "#4f6e87"],
    brandAnalysis: ["الجمهور: مستخدمون يريدون منتجًا عمليًا يبدو موثوقًا وحديثًا.", "الشخصية: ذكية، منظمة، دقيقة، وهادئة.", "الإحساس: كفاءة، حماية، وقيمة واضحة."],
    concept: ["علبة rigid أو drawer box بواجهة نظيفة ومواصفات مختصرة.", "طبقة داخلية مع المنتج مثبتة بشكل مرتب.", "شعار مطبوع بتفاصيل spot UV أو foil خفيف.", "نظام أيقونات صغير للفوائد الأساسية."],
    identity: ["أخضر داكن مع ذهبي محايد وأزرق مطفأ.", "Sans هندسي واضح للأرقام والعناوين.", "مزج تقني فخم مناسب للرف والإعلانات."],
    slogan: "Power, made simple.",
    description: `${productName} بتغليف واضح ومطمئن يشرح القيمة بسرعة ويعطي إحساسًا تقنيًا راقيًا من أول لمسة.`,
    materials: ["Rigid paperboard أو folding carton حسب الميزانية.", "Matte lamination مع spot UV على الأيقونات.", "CMYK مع لون spot للأخضر الداكن لضبط الفخامة."],
    shelfAppeal: ["اعرض الفائدة الرئيسية في أول 30% من الواجهة.", "استخدم نوافذ مواصفات مختصرة لا تتجاوز 3 نقاط.", "أضف insert داخلي يشرح الاستخدام في جملة واحدة."],
    mockupPrompt: `realistic premium tech product packaging mockup for ${brandName}, product ${productName}, dark forest green rigid drawer box, warm gold foil logo, minimal geometric typography, molded inner tray, smart icons, luxury modern retail shelf, front and 3/4 angle view, clean studio lighting`,
    costs: defaultCosts("$0.50-$1.10", "$1.40-$3.20", "$4.00-$8.50"),
  };
}

function defaultCosts(low: string, medium: string, premium: string) {
  return [
    { label: "Low", value: low, note: "كميات أكبر وخامات اقتصادية." },
    { label: "Medium", value: medium, note: "أفضل توازن بين الشكل والتكلفة." },
    { label: "Premium", value: premium, note: "تفاصيل فاخرة وتجربة فتح أقوى." },
  ];
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
          <LaunchInfluencerSuggestions />
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


function LaunchInfluencerSuggestions() {
  const { campaign } = useStore();
  const briefText = [
    campaign?.brief.productName,
    campaign?.brief.audience,
    campaign?.brief.valueProposition,
    campaign?.brief.context,
  ]
    .filter(Boolean)
    .join(" ");
  const profile = detectInfluencerProfile(briefText);
  const suggestions = INFLUENCER_CANDIDATES.map((candidate) => ({
    ...candidate,
    matchScore: calculateInfluencerMatch(candidate, profile.keywords),
  }))
    .sort((a, b) => b.matchScore - a.matchScore || b.engagementRate - a.engagementRate)
    .slice(0, 3);

  return (
    <section className="rounded-3xl border p-5" style={{ background: "#fffaf2", borderColor: "#d8bd7c", boxShadow: "0 18px 52px rgba(91,68,34,0.09)" }}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold" style={{ color: "#a68b4b" }}>Influencer Agent</div>
          <h2 className="mt-1 text-[26px] leading-[1.15]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>اقتراحات المؤثرين للإطلاق</h2>
          <p className="mt-2 max-w-[720px] text-[13px] leading-[1.8]" style={{ color: "#5f574e" }}>
            أفضل 3 مؤثرين لهذه الحملة، مرتبين حسب توافق الجمهور والتفاعل وجودة المحتوى واحتمالية تحقيق نتائج.
          </p>
        </div>
        <span className="rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: "rgba(61,122,95,0.1)", color: "#163326" }}>
          3 suggestions
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {suggestions.map((influencer) => (
          <AgentPeek key={`launch-${influencer.platform}-${influencer.username}`} agent="influencer" reasoning={`Launch suggestion selected with ${influencer.matchScore}% match score.`}>
            <article className="rounded-2xl border p-4" style={{ background: "#fdf8ee", borderColor: "#e4ded4", boxShadow: "0 10px 34px rgba(31,29,26,0.04)" }}>
              <div className="flex items-center gap-3">
                <div aria-label={`${influencer.name} profile`} role="img" className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${influencer.profileImage})`, border: "2px solid #efe4cf" }} />
                <div className="min-w-0">
                  <h3 className="truncate text-[17px] leading-[1.2]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>{influencer.name}</h3>
                  <div dir="ltr" className="truncate text-[11px] font-bold" style={{ color: "#8f877b" }}>{influencer.username}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ background: "rgba(61,122,95,0.1)", color: "#1e3a2f" }}>{influencer.platform}</span>
                <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ background: "rgba(200,169,110,0.13)", color: "#6f5a34" }}>{influencer.country}</span>
                <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ background: "rgba(79,110,135,0.1)", color: "#4f6e87" }}>{influencer.category}</span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-start">
                <InfluencerStat label="المتابعون" value={influencer.followers} />
                <InfluencerStat label="التفاعل" value={`${influencer.engagementRate}%`} />
                <InfluencerStat label="المشاهدات" value={influencer.averageViews} />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-[12px] font-bold">
                  <span style={{ color: "#6f5a34" }}>Match Score</span>
                  <span className="tabular-nums" style={{ color: "#163326" }}>{influencer.matchScore}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: "#eadfcb" }}>
                  <div className="h-full rounded-full" style={{ width: `${influencer.matchScore}%`, background: "linear-gradient(90deg, #3d7a5f, #c8a96e)" }} />
                </div>
              </div>
            </article>
          </AgentPeek>
        ))}
      </div>
    </section>
  );
}

const INFLUENCER_CANDIDATES = [
  {
    name: "Ahmed Tech",
    username: "@ahmedgadgets",
    platform: "TikTok",
    followers: "1.2M",
    engagementRate: 8.7,
    averageViews: "430K",
    contentType: "مراجعات قصيرة، تجارب أجهزة، تجهيزات سفر تقنية",
    category: "Technology",
    country: "Saudi Arabia",
    audienceInterests: ["tech", "gadgets", "mobile", "travel", "reviews"],
    contentQuality: 94,
    audienceQuality: 92,
    conversionPotential: 95,
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80",
    url: "https://www.tiktok.com/@ahmedgadgets",
  },
  {
    name: "Lina Gear",
    username: "@linagear",
    platform: "Instagram",
    followers: "780K",
    engagementRate: 7.9,
    averageViews: "210K",
    contentType: "ريلز، مقارنات منتجات، تصوير لايف ستايل",
    category: "Consumer Electronics",
    country: "UAE",
    audienceInterests: ["tech", "electronics", "shopping", "mobile", "lifestyle"],
    contentQuality: 91,
    audienceQuality: 90,
    conversionPotential: 89,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80",
    url: "https://www.instagram.com/linagear",
  },
  {
    name: "Faisal Travel Tech",
    username: "@faisaltravels",
    platform: "Snapchat",
    followers: "520K",
    engagementRate: 9.1,
    averageViews: "180K",
    contentType: "قصص سفر يومية، أساسيات المطارة، إكسسوارات الجوال",
    category: "Travel Technology",
    country: "Saudi Arabia",
    audienceInterests: ["travel", "tech", "mobile", "gadgets", "airports"],
    contentQuality: 88,
    audienceQuality: 91,
    conversionPotential: 92,
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=180&q=80",
    url: "https://www.snapchat.com/add/faisaltravels",
  },
  {
    name: "Maya Unbox",
    username: "@mayaunbox",
    platform: "TikTok",
    followers: "2.4M",
    engagementRate: 5.8,
    averageViews: "620K",
    contentType: "فتح صناديق، اختبار منتجات، مميزات وعيوب سريعة",
    category: "Gadgets",
    country: "Kuwait",
    audienceInterests: ["gadgets", "shopping", "tech", "deals", "reviews"],
    contentQuality: 86,
    audienceQuality: 82,
    conversionPotential: 84,
    profileImage: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=180&q=80",
    url: "https://www.tiktok.com/@mayaunbox",
  },
  {
    name: "Omar Mobile Lab",
    username: "@omarmobilelab",
    platform: "Instagram",
    followers: "410K",
    engagementRate: 10.4,
    averageViews: "135K",
    contentType: "إكسسوارات الجوال، اختبارات أداء، أدلة شراء",
    category: "Mobile Accessories",
    country: "Egypt",
    audienceInterests: ["mobile", "tech", "electronics", "reviews", "accessories"],
    contentQuality: 90,
    audienceQuality: 89,
    conversionPotential: 87,
    profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=180&q=80",
    url: "https://www.instagram.com/omarmobilelab",
  },
  {
    name: "Noura Trips",
    username: "@nouratrips",
    platform: "Snapchat",
    followers: "950K",
    engagementRate: 6.9,
    averageViews: "310K",
    contentType: "تجارب فنادق، تجهيز شنط، أساسيات سفر عائلية",
    category: "Travel",
    country: "Saudi Arabia",
    audienceInterests: ["travel", "family", "shopping", "lifestyle", "mobile"],
    contentQuality: 84,
    audienceQuality: 86,
    conversionPotential: 83,
    profileImage: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=180&q=80",
    url: "https://www.snapchat.com/add/nouratrips",
  },
];

function InfluencerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border px-3 py-2" style={{ borderColor: "#e4ded4", background: "rgba(255,255,255,0.42)" }}>
      <div className="text-[9px] font-bold" style={{ color: "#a68b4b" }}>{label}</div>
      <div className="mt-1 text-[13px] font-bold tabular-nums" style={{ color: "#1f1d1a" }}>{value}</div>
    </div>
  );
}

function detectInfluencerProfile(text: string) {
  const normalized = text.toLowerCase();

  if (/(beauty|makeup|skin|perfume|cosmetic|serum|skincare|عطر|تجميل|بشرة)/.test(normalized)) {
    return {
      domain: "Beauty & Personal Care",
      creatorTypes: "Beauty reviewers, skincare educators, lifestyle creators",
      keywords: ["beauty", "skincare", "makeup", "lifestyle", "shopping"],
    };
  }

  if (/(food|restaurant|coffee|meal|snack|delivery|مطعم|قهوة|وجبة)/.test(normalized)) {
    return {
      domain: "Food & Beverage",
      creatorTypes: "Food reviewers, recipe creators, local city guides",
      keywords: ["food", "restaurants", "cooking", "family", "lifestyle"],
    };
  }

  if (/(fitness|gym|protein|sport|wellness|health|نادي|رياضة|صحة)/.test(normalized)) {
    return {
      domain: "Fitness & Wellness",
      creatorTypes: "Fitness coaches, wellness creators, sports reviewers",
      keywords: ["fitness", "sports", "wellness", "health", "lifestyle"],
    };
  }

  return {
    domain: "Technology Accessories",
    creatorTypes: "Tech reviewers, travel tech, electronics creators",
    keywords: ["tech", "electronics", "travel", "gadgets", "mobile", "reviews", "accessories"],
  };
}

function calculateInfluencerMatch(
  influencer: (typeof INFLUENCER_CANDIDATES)[number],
  keywords: string[],
) {
  const overlap = influencer.audienceInterests.filter((item) => keywords.includes(item)).length;
  const audienceFit = Math.min(100, 58 + overlap * 8);
  const engagementStrength = Math.min(100, influencer.engagementRate * 8.5);

  return Math.round(
    audienceFit * 0.36 +
      engagementStrength * 0.22 +
      influencer.contentQuality * 0.18 +
      influencer.audienceQuality * 0.14 +
      influencer.conversionPotential * 0.1,
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
