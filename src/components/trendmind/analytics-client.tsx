"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Printer,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

import { useStore } from "@/lib/workspace-store";

import type {
  AnalyticsCriticReport,
  AnalyticsData,
  AngleStats,
  RiskDetectorReport,
} from "@/lib/analytics-engine";

const LANE_COLOR: Record<string, string> = {
  safe: "#3d7a5f",
  sharp: "#c8a96e",
  viral: "#7a5f9e",
};

const SENTIMENT_COLOR = {
  love: "#3d7a5f",
  warm: "#8aab6a",
  neutral: "#9b9590",
  cold: "#c0604e",
};

const REC_BG = { go: "#3d7a5f", "no-go": "#c0604e", "conditional-go": "#c8a96e" };
const REC_TEXT = { go: "#f0faf5", "no-go": "#fff5f5", "conditional-go": "#1f1d1a" };
const REC_ICON = { go: CheckCircle2, "no-go": XCircle, "conditional-go": AlertTriangle };

const SENTIMENT_LABELS: Record<string, string> = {
  love: "إعجاب",
  warm: "دافئ",
  neutral: "محايد",
  cold: "بارد",
};

const REC_LABELS: Record<string, string> = {
  go: "بدء (Go)",
  "no-go": "توقف (No-Go)",
  "conditional-go": "بدء مشروط",
};

const RISK_LABELS: Record<string, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع",
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}

function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border ${className}`}
      style={{
        background: "#ffffff",
        borderColor: "#e4ded4",
        boxShadow: "0 1px 4px rgba(31,29,26,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({
  icon: Icon,
  title,
  subtitle,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid #f0ece5" }}>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: accent ? `${accent}18` : "#f5f1ea" }}>
        <Icon size={15} style={{ color: accent ?? "#5a5550" }} />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold" style={{ color: "#1f1d1a" }}>
          {title}
        </p>
        {subtitle ? (
          <p className="text-[11px]" style={{ color: "#9b9590" }}>
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ScoreBar({ value, max = 10, accent = "#c8a96e" }: { value: number; max?: number; accent?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "#f0ece5" }} dir="ltr">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: accent }} />
      </div>
      <span className="w-7 text-right text-[11px] font-medium tabular-nums" style={{ color: "#5a5550" }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

function SentimentBar({ sentiment }: { sentiment: AngleStats["sentiment"] }) {
  const total = sentiment.total || 1;
  const segments: (keyof typeof SENTIMENT_COLOR)[] = ["love", "warm", "neutral", "cold"];

  return (
    <div className="space-y-1.5">
      <div className="flex h-2 w-full overflow-hidden rounded-full" style={{ background: "#f0ece5" }} dir="ltr">
        {segments.map((key) => {
          const width = (sentiment[key] / total) * 100;
          return width > 0 ? (
            <div key={key} style={{ width: `${width}%`, background: SENTIMENT_COLOR[key] }} className="transition-all duration-700" />
          ) : null;
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {segments.map((key) => (
          <div key={key} className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: SENTIMENT_COLOR[key] }} />
            <span className="text-[10px]" style={{ color: "#9b9590" }}>
              {SENTIMENT_LABELS[key]} {sentiment[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimulationSuccessCard({ data }: { data: AnalyticsData }) {
  if (!data.hasTrialData || data.angles.length === 0) {
    return (
      <Card>
        <CardHeader icon={Users} title="نجاح المحاكاة" accent="#c8a96e" />
        <div className="flex items-center justify-center p-8 text-center">
          <div>
            <Users size={28} style={{ color: "#d8d0c4", margin: "0 auto 8px" }} />
            <p className="text-[12px]" style={{ color: "#9b9590" }}>
              قم بتشغيل مرحلة التجربة لمعرفة معدلات النجاح.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader icon={Users} title="نجاح المحاكاة" subtitle={`${data.totalPersonas} شخصية · ${data.totalReactions} تفاعل`} accent="#c8a96e" />
      <div className="divide-y" style={{ borderColor: "#f5f1ea" }}>
        {data.angles.map((angle) => (
          <div key={angle.angleId} className="space-y-2 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: `${LANE_COLOR[angle.lane]}20`, color: LANE_COLOR[angle.lane] }}>
                  {angle.letter}
                </span>
                <span className="text-[12px] font-medium" style={{ color: "#1f1d1a" }}>
                  {angle.title}
                </span>
              </div>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: angle.successRate >= 0.6 ? "#3d7a5f" : angle.successRate >= 0.4 ? "#c8a96e" : "#c0604e" }}>
                {pct(angle.successRate)}
              </span>
            </div>
            <SentimentBar sentiment={angle.sentiment} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function WinningAngleCard({ data }: { data: AnalyticsData }) {
  const winner = data.angles.find((angle) => angle.angleId === data.winningAngleId);

  return (
    <Card>
      <CardHeader icon={TrendingUp} title="الزاوية الفائزة" accent="#3d7a5f" />
      {winner ? (
        <div className="space-y-4 p-5">
          <div className="rounded-xl p-4 text-center" style={{ background: `${LANE_COLOR[winner.lane]}10`, border: `1px solid ${LANE_COLOR[winner.lane]}25` }}>
            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{ background: LANE_COLOR[winner.lane], color: "#fff" }}>
              {winner.letter} · {winner.lane}
            </span>
            <p className="mt-2 text-[15px] font-bold" style={{ color: "#1f1d1a" }}>
              {winner.title}
            </p>
            <p className="mt-1 text-[28px] font-bold tabular-nums" style={{ color: LANE_COLOR[winner.lane] }}>
              {pct(winner.successRate)}
            </p>
          </div>
          <div className="space-y-2">
            {[
              { label: "درجة الاستراتيجية", value: winner.strategyScore },
              { label: "الوضوح", value: winner.avgClarity },
              { label: "الرنين", value: winner.avgResonance },
              { label: "النية", value: winner.avgIntent },
              { label: "احتمالية التحويل", value: winner.conversionPotential },
            ].map((metric) => (
              <div key={metric.label}>
                <p className="mb-0.5 text-[11px]" style={{ color: "#5a5550" }}>
                  {metric.label}
                </p>
                <ScoreBar value={metric.value} accent={LANE_COLOR[winner.lane]} />
              </div>
            ))}
          </div>
          {data.trialSummary ? (
            <p className="text-[11.5px] leading-relaxed" style={{ color: "#5a5550" }}>
              {data.trialSummary}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center justify-center p-8 text-center">
          <p className="text-[12px]" style={{ color: "#9b9590" }}>
            لا يوجد فائز بعد.
          </p>
        </div>
      )}
    </Card>
  );
}

function ResourceUsageCard({ data }: { data: AnalyticsData }) {
  const completedPhases = data.phaseTimings.filter((phase) => phase.durationMs !== null);
  const totalMs = completedPhases.reduce((sum, phase) => sum + (phase.durationMs ?? 0), 0);
  const maxMs = Math.max(...completedPhases.map((phase) => phase.durationMs ?? 0), 1);

  return (
    <Card>
      <CardHeader
        icon={Clock}
        title="استخدام الموارد"
        subtitle={completedPhases.length > 0 ? `المدة الإجمالية ${formatDuration(totalMs)}` : "لم تكتمل أي مراحل بعد"}
        accent="#7a5f9e"
      />
      <div className="space-y-3 p-5">
        {data.phaseTimings.map((phase) => (
          <div key={phase.phase} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium" style={{ color: "#1f1d1a" }}>
                {phase.label}
              </span>
              <span className="text-[11px] font-medium tabular-nums" style={{ color: "#5a5550" }}>
                {phase.durationMs !== null ? formatDuration(phase.durationMs) : "—"}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "#f0ece5" }} dir="ltr">
              {phase.durationMs !== null ? (
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(phase.durationMs / maxMs) * 100}%`, background: "linear-gradient(90deg, #7a5f9e, #c8a96e)" }} />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AngleMatrixCard({ data }: { data: AnalyticsData }) {
  return (
    <Card>
      <CardHeader icon={BarChart3} title="مصفوفة الزوايا" subtitle="قارن الدرجات عبر الاتجاهات الناتجة" accent="#c8a96e" />
      <div className="overflow-x-auto" dir="ltr">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ background: "#faf7f2", borderBottom: "1px solid #f0ece5" }}>
              <th className="px-5 py-3 text-start font-semibold" style={{ color: "#5a5550" }}>
                الزاوية
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: "#5a5550" }}>
                المسار
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: "#5a5550" }}>
                النجاح
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: "#5a5550" }}>
                الاستراتيجية
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: "#5a5550" }}>
                الوضوح
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: "#5a5550" }}>
                الرنين
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: "#5a5550" }}>
                النية
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: "#5a5550" }}>
                التحويل
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: "#5a5550" }}>
                المخاطر
              </th>
            </tr>
          </thead>
          <tbody>
            {data.angles.map((angle, index) => {
              const isWinner = angle.angleId === data.winningAngleId;
              return (
                <tr key={angle.angleId} style={{ background: isWinner ? `${LANE_COLOR[angle.lane]}08` : index % 2 === 0 ? "#fff" : "#faf7f2", borderBottom: "1px solid #f5f1ea" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: `${LANE_COLOR[angle.lane]}20`, color: LANE_COLOR[angle.lane] }}>
                        {angle.letter}
                      </span>
                      <span className="font-medium" style={{ color: "#1f1d1a" }}>
                        {angle.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${LANE_COLOR[angle.lane]}15`, color: LANE_COLOR[angle.lane] }}>
                      {angle.lane}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold tabular-nums" style={{ color: angle.successRate >= 0.6 ? "#3d7a5f" : angle.successRate >= 0.4 ? "#c8a96e" : "#c0604e" }}>
                      {pct(angle.successRate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBar value={angle.strategyScore} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBar value={angle.avgClarity} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBar value={angle.avgResonance} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBar value={angle.avgIntent} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBar value={angle.conversionPotential} accent="#3d7a5f" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBar value={angle.riskScore} accent="#c0604e" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function AudienceInsightsCard({ data }: { data: AnalyticsData }) {
  if (!data.hasTrialData) return null;
  if (data.audienceSummary.length === 0 && data.responseRisks.length === 0) return null;

  return (
    <Card>
      <CardHeader icon={Zap} title="رؤى الجمهور" subtitle="التفاعلات الرئيسية المستخرجة من مرحلة التجربة" accent="#c8a96e" />
      <div className="grid grid-cols-2 gap-px" style={{ background: "#f0ece5" }}>
        {data.audienceSummary.length > 0 ? (
          <div className="space-y-2 p-5" style={{ background: "#fff" }}>
            <p className="text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: "#3d7a5f" }}>
              ما الذي نجح
            </p>
            {data.audienceSummary.map((note, index) => (
              <div key={`${note}-${index}`} className="flex gap-2">
                <ChevronRight size={12} className="mt-0.5 flex-shrink-0" style={{ color: "#3d7a5f" }} />
                <p className="text-[12px] leading-snug" style={{ color: "#5a5550" }}>
                  {note}
                </p>
              </div>
            ))}
          </div>
        ) : null}
        {data.responseRisks.length > 0 ? (
          <div className="space-y-2 p-5" style={{ background: "#fff" }}>
            <p className="text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: "#c0604e" }}>
              ما يجب مراقبته
            </p>
            {data.responseRisks.map((risk, index) => (
              <div key={`${risk}-${index}`} className="flex gap-2">
                <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" style={{ color: "#c0604e" }} />
                <p className="text-[12px] leading-snug" style={{ color: "#5a5550" }}>
                  {risk}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function CriticReportCard({ report }: { report: AnalyticsCriticReport }) {
  return (
    <Card style={{ border: "1px solid rgba(200,169,110,0.35)" }}>
      <div className="flex items-center gap-3 px-5 py-4" style={{ background: "linear-gradient(135deg, #0f1f18, #162b22)", borderBottom: "1px solid rgba(200,169,110,0.2)" }}>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(200,169,110,0.15)" }}>
          <Sparkles size={14} style={{ color: "#c8a96e" }} />
        </div>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: "#f0e8d8" }}>
            تقرير ناقد الذكاء الاصطناعي
          </p>
          <p className="text-[11px]" style={{ color: "rgba(240,232,216,0.55)" }}>
            الملخص التنفيذي والمنطق الاستراتيجي
          </p>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <div>
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: "#9b9590" }}>
            الملخص
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: "#1f1d1a" }}>
            {report.executiveSummary}
          </p>
        </div>
        {report.winnerRationale ? (
          <div className="rounded-xl p-4" style={{ background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.2)" }}>
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: "#a68b4b" }}>
              منطق الفائز
            </p>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "#1f1d1a" }}>
              {report.winnerRationale}
            </p>
          </div>
        ) : null}
        {report.demographicInsights.length > 0 || report.resistanceGroups.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {report.demographicInsights.length > 0 ? (
              <InsightList title="رؤى ديموغرافية" items={report.demographicInsights} color="#3d7a5f" />
            ) : null}
            {report.resistanceGroups.length > 0 ? (
              <InsightList title="مجموعات المقاومة" items={report.resistanceGroups} color="#c0604e" />
            ) : null}
          </div>
        ) : null}
        {report.strategicConclusion ? (
          <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, #0f1f18, #162b22)", border: "1px solid rgba(200,169,110,0.2)" }}>
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: "#c8a96e" }}>
              الخلاصة الاستراتيجية
            </p>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "#f0e8d8" }}>
              {report.strategicConclusion}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function RiskDetectorCard({ report }: { report: RiskDetectorReport }) {
  const RecIcon = REC_ICON[report.recommendation];
  const bg = REC_BG[report.recommendation];
  const text = REC_TEXT[report.recommendation];

  return (
    <Card>
      <CardHeader icon={ShieldCheck} title="كاشف المخاطر" subtitle="توصية البدء / عدم البدء" accent="#c0604e" />
      <div className="space-y-5 p-5">
        <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: bg, boxShadow: `0 2px 12px ${bg}40` }}>
          <RecIcon size={28} style={{ color: text, flexShrink: 0 }} />
          <div>
            <p className="text-[18px] font-black tracking-wide" style={{ color: text }}>
              {REC_LABELS[report.recommendation]}
            </p>
            <p className="mt-0.5 text-[11px] font-medium" style={{ color: text, opacity: 0.8 }}>
              مستوى المخاطر: <span className="font-bold uppercase">{RISK_LABELS[report.overallRiskLevel]}</span>
            </p>
          </div>
        </div>

        {report.rationale ? (
          <p className="text-[12.5px] leading-relaxed" style={{ color: "#5a5550" }}>
            {report.rationale}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          {report.prRisks.length > 0 ? <RiskList title="مخاطر العلاقات العامة" items={report.prRisks} color="#c0604e" /> : null}
          {report.culturalSensitivities.length > 0 ? <RiskList title="الحساسيات الثقافية" items={report.culturalSensitivities} color="#c8a96e" /> : null}
          {report.negativeTrends.length > 0 ? <RiskList title="الاتجاهات السلبية" items={report.negativeTrends} color="#9b9590" /> : null}
          {report.conditions.length > 0 ? <RiskList title="الشروط" items={report.conditions} color="#3d7a5f" /> : null}
        </div>
      </div>
    </Card>
  );
}

function InsightList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-widest" style={{ color }}>
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2">
            <ChevronRight size={12} className="mt-0.5 flex-shrink-0" style={{ color }} />
            <span className="text-[11.5px] leading-snug" style={{ color: "#5a5550" }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskList({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-widest" style={{ color }}>
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2">
            <div className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full" style={{ background: color }} />
            <span className="text-[11.5px] leading-snug" style={{ color: "#5a5550" }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ConsultResult {
  critic: AnalyticsCriticReport | null;
  risk: RiskDetectorReport | null;
}

export function AnalyticsClient({
  initialData,
  campaignId,
}: {
  initialData: AnalyticsData;
  campaignId: string;
}) {
  const { setActivePhase, activePhase } = useStore();
  const [consulting, setConsulting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<ConsultResult>({ critic: null, risk: null });

  async function consult() {
    setConsulting(true);
    setError(null);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/analytics/consult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "both" }),
      });
      const payload = (await response.json().catch(() => ({}))) as
        | { critic: AnalyticsCriticReport; risk: RiskDetectorReport }
        | { error?: string };

      if (!response.ok) {
        const errorMessage = "error" in payload ? payload.error : undefined;
        throw new Error(errorMessage ?? "فشلت استشارة التحليلات.");
      }

      setResult({
        critic: "critic" in payload ? payload.critic : null,
        risk: "risk" in payload ? payload.risk : null,
      });
    } catch (consultError) {
      setError(consultError instanceof Error ? consultError.message : "خطأ غير متوقع");
    } finally {
      setConsulting(false);
    }
  }

  return (
    <div className="min-h-full pb-20" style={{ background: "#f9f7f2" }}>
      <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b px-6 py-3" style={{ background: "rgba(249,247,242,0.92)", backdropFilter: "blur(12px)", borderColor: "#e4ded4" }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePhase(activePhase)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-[#f0ece5]"
            style={{ color: "#5a5550" }}
          >
            <ArrowRight size={13} />
            العودة
          </button>
          <div className="h-4 w-px" style={{ background: "#e4ded4" }} />
          <div className="flex items-center gap-2">
            <BarChart3 size={14} style={{ color: "#c8a96e" }} />
            <span className="text-[13px] font-semibold" style={{ color: "#1f1d1a" }}>
              {initialData.campaignName}
            </span>
            <span className="text-[12px]" style={{ color: "#9b9590" }}>
              التحليلات
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {error ? <span className="text-[11px]" style={{ color: "#c0604e" }}>{error}</span> : null}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all"
            style={{ color: "#5a5550", background: "#fff", borderColor: "#e4ded4" }}
          >
            <Printer size={13} />
            طباعة
          </button>
          <button
            onClick={() => void consult()}
            disabled={consulting || !initialData.hasTrialData}
            className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[12px] font-semibold transition-all"
            style={{
              background: consulting || !initialData.hasTrialData ? "#e4ded4" : "linear-gradient(135deg, #dcc487, #a68b4b)",
              color: consulting || !initialData.hasTrialData ? "#9b9590" : "#0f1f18",
              cursor: consulting || !initialData.hasTrialData ? "not-allowed" : "pointer",
            }}
          >
            <Sparkles size={13} />
            {consulting ? "جاري الاستشارة..." : "استشارة الذكاء الاصطناعي"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] space-y-6 px-6 py-8">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9b9590" }}>
            {initialData.brandName}
          </p>
          <h1 className="text-[22px] font-bold" style={{ color: "#1f1d1a" }}>
            {initialData.campaignName} - التحليلات
          </h1>
          {!initialData.hasTrialData ? (
            <p className="mt-2 text-[12px]" style={{ color: "#c8a96e" }}>
              قم بتشغيل مرحلة التجربة لفتح تحليلات أعمق.
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-5">
          <SimulationSuccessCard data={initialData} />
          <WinningAngleCard data={initialData} />
          <ResourceUsageCard data={initialData} />
        </div>

        <AngleMatrixCard data={initialData} />
        <AudienceInsightsCard data={initialData} />

        {consulting ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border py-10" style={{ background: "#fff", borderColor: "#e4ded4" }}>
            <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "#e4ded4", borderTopColor: "#c8a96e" }} />
            <span className="text-[13px]" style={{ color: "#5a5550" }}>
              جاري استشارة الوكلاء...
            </span>
          </div>
        ) : null}

        {result.critic ? <CriticReportCard report={result.critic} /> : null}
        {result.risk ? <RiskDetectorCard report={result.risk} /> : null}

        <div className="hidden print:block pt-8" style={{ borderTop: "1px solid #e4ded4", color: "#9b9590", fontSize: "10px" }}>
          تقرير تحليلات TrendMind · {initialData.campaignName}
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}
