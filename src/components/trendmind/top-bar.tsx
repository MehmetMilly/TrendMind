"use client";

import {
  Command,
  Download,
  HelpCircle,
  Play,
  Share2,
  Wand2,
} from "lucide-react";

import { PHASES } from "@/lib/campaign-data";
import type { CampaignStatus, PhaseStatus } from "@/lib/types";
import { useStore } from "@/lib/workspace-store";

const STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: "مسودة",
  running: "قيد التشغيل",
  ready: "جاهزة",
  attention: "تحتاج انتباه",
};

export function TopBar() {
  const {
    activePhase,
    campaign,
    exportCampaign,
    openCampaignDrawer,
    openCommandPalette,
    openDirector,
    openShortcutHelp,
    phaseStatus,
    runPending,
    setActivePhase,
    shareCampaign,
    startFullRun,
  } = useStore();

  return (
    <header
      className="relative z-20 flex h-12 shrink-0 items-center gap-3 border-b px-3"
      style={{
        background: "rgba(253,250,245,0.82)",
        borderColor: "#e4ded4",
        backdropFilter: "blur(18px)",
      }}
    >
      <button
        className="flex h-9 min-w-[116px] items-center justify-center rounded-lg border px-3"
        style={{ borderColor: "#e8dfcf", background: "#fffaf2" }}
        onClick={openCampaignDrawer}
        title="فتح الحملات"
      >
        <span
          dir="ltr"
          className="text-[20px] leading-none tracking-[-0.01em]"
          style={{ fontFamily: "var(--font-wordmark)", color: "#1f1d1a" }}
        >
          TrendMind
        </span>
      </button>

      <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {PHASES.map((phase) => (
          <PhaseTab
            key={phase.id}
            active={phase.id === activePhase}
            status={phaseStatus[phase.id]}
            label={phase.label}
            index={phase.index + 1}
            onClick={() => setActivePhase(phase.id)}
          />
        ))}
      </nav>

      <button
        onClick={openCampaignDrawer}
        className="hidden min-w-0 max-w-[190px] rounded-lg px-2.5 py-1.5 text-start text-[11px] font-semibold md:block"
        style={{ color: "#3a3631", background: "rgba(200,169,110,0.08)" }}
        title="فتح الحملات"
      >
        <span className="block truncate">{campaign?.name || "حملة جديدة"}</span>
      </button>

      <span
        className="hidden rounded-full px-2.5 py-1 text-[10px] font-semibold md:inline-flex"
        style={{
          color: campaign?.status === "running" ? "#1f5f49" : "#8a6a35",
          background: campaign?.status === "running" ? "rgba(61,122,95,0.12)" : "rgba(200,169,110,0.14)",
        }}
      >
        {STATUS_LABEL[campaign?.status ?? "draft"]}
      </span>

      <div className="flex items-center gap-1">
        <IconAction title="البدء" onClick={() => void startFullRun()} disabled={runPending}>
          <Play size={15} />
        </IconAction>
        <IconAction title="المخرج" onClick={() => openDirector(activePhase)}>
          <Wand2 size={15} />
        </IconAction>
        <IconAction title="مشاركة" onClick={() => void shareCampaign()}>
          <Share2 size={15} />
        </IconAction>
        <IconAction title="تصدير" onClick={exportCampaign}>
          <Download size={15} />
        </IconAction>
        <IconAction title="الأوامر" onClick={openCommandPalette}>
          <Command size={14} />
        </IconAction>
        <IconAction title="الاختصارات" onClick={openShortcutHelp}>
          <HelpCircle size={14} />
        </IconAction>
      </div>
    </header>
  );
}

function PhaseTab({
  active,
  status,
  label,
  index,
  onClick,
}: {
  active: boolean;
  status: PhaseStatus;
  label: string;
  index: number;
  onClick: () => void;
}) {
  const running = status === "running";
  const pending = status === "pending";
  const ready = status === "ready";
  const stale = status === "stale";

  return (
    <button
      onClick={onClick}
      className="relative flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[11px] transition-all"
      style={{
        color: active ? "#1f1d1a" : "#766f66",
        background: active ? "#fff8eb" : "transparent",
        boxShadow: active ? "inset 0 0 0 1px rgba(200,169,110,0.34), 0 4px 16px rgba(200,169,110,0.12)" : "none",
        fontFamily: active ? "var(--font-heading)" : undefined,
        fontWeight: active ? 700 : 600,
      }}
      title={label}
    >
      <span className="text-[9px] tabular-nums" style={{ color: "#a68b4b" }}>
        {index}
      </span>
      <span>{label}</span>
      {running ? (
        <svg className="absolute -inset-[1px]" viewBox="0 0 74 32" preserveAspectRatio="none" aria-hidden>
          <rect
            x="1"
            y="1"
            width="72"
            height="30"
            rx="8"
            fill="none"
            stroke="#c8a96e"
            strokeWidth="1.5"
            strokeDasharray="42"
            className="animate-arc-progress"
          />
        </svg>
      ) : null}
      {pending ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#c8a96e" }} /> : null}
      {ready ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#3d7a5f" }} /> : null}
      {stale ? <span className="h-1.5 w-1.5 rounded-full animate-pulse-dot" style={{ background: "#b7863f" }} /> : null}
    </button>
  );
}

function IconAction({
  children,
  title,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
      style={{
        color: "#625b52",
        background: "rgba(31,29,26,0.04)",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {children}
    </button>
  );
}
