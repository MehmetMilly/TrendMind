"use client";

import {
  FolderOpen,
  Play,
  Share2,
  SlidersHorizontal,
  Download,
} from "lucide-react";

import { useStore } from "@/lib/workspace-store";

export function TopStrip() {
  const {
    campaign,
    openCampaignDrawer,
    openDirector,
    runPending,
    savingBrief,
    shareCampaign,
    startFullRun,
    exportCampaign,
  } = useStore();

  return (
    <header
      className="relative flex h-[40px] flex-shrink-0 items-center justify-between px-4"
      style={{
        background: "linear-gradient(180deg, #faf7f2 0%, #f3eee5 100%)",
        borderBottom: "1px solid #e4ded4",
      }}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="text-[10px] font-medium uppercase tracking-[0.14em]"
          style={{ color: "#9b9590" }}
        >
          {campaign?.brandName ?? "TrendMind"}
        </span>
        <span className="text-[10px]" style={{ color: "#c8a96e" }}>
          /
        </span>
        <h1
          className="truncate text-[14px] font-medium tracking-[-0.005em]"
          style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
        >
          {campaign?.name ?? "Loading workspace..."}
        </h1>
        <StatusPill
          status={campaign?.status ?? "draft"}
          savingBrief={savingBrief}
          runPending={runPending}
        />
      </div>

      <div className="flex items-center gap-0.5">
        <ActionButton label="Campaigns" icon={<FolderOpen size={13} />} onClick={openCampaignDrawer} />
        <ActionButton
          label={runPending ? "Running" : "Run"}
          icon={<Play size={13} />}
          accent
          onClick={() => void startFullRun()}
        />
        <ActionButton
          label="Director"
          icon={<SlidersHorizontal size={13} />}
          onClick={() => openDirector()}
        />
        <Divider />
        <ActionButton
          label="Share"
          icon={<Share2 size={13} />}
          onClick={() => void shareCampaign()}
        />
        <ActionButton
          label="Export"
          icon={<Download size={13} />}
          onClick={exportCampaign}
        />
      </div>
    </header>
  );
}

function StatusPill({
  status,
  savingBrief,
  runPending,
}: {
  status: string;
  savingBrief: boolean;
  runPending: boolean;
}) {
  const palette: Record<string, { color: string; background: string; dot: string }> = {
    draft: { color: "#8a6a5a", background: "rgba(138,106,90,0.08)", dot: "#b58a7a" },
    running: { color: "#3d7a5f", background: "rgba(61,122,95,0.08)", dot: "#4a9070" },
    ready: { color: "#3d7a5f", background: "rgba(61,122,95,0.07)", dot: "#4a9070" },
    attention: { color: "#b25b50", background: "rgba(178,91,80,0.08)", dot: "#b25b50" },
  };
  const style = palette[status] ?? palette.draft;

  return (
    <div
      className="flex items-center gap-1 rounded-full px-1.5 py-[2px] text-[9.5px] font-medium tracking-[0.06em]"
      style={{
        color: style.color,
        background: style.background,
        border: `1px solid ${style.color}20`,
      }}
    >
      <span
        className={`h-[5px] w-[5px] rounded-full ${runPending || savingBrief ? "animate-pulse-dot" : ""}`}
        style={{ background: style.dot }}
      />
      {savingBrief ? "Saving" : runPending ? "Queued" : status}
    </div>
  );
}

function ActionButton({
  label,
  icon,
  accent,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  accent?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-md px-2 py-[5px] text-[11px] font-medium transition-all duration-200"
      style={{
        color: accent ? "#f0e8d8" : "#6b6560",
        background: accent
          ? "linear-gradient(160deg, #3d7a5f, #1e3a2f)"
          : "transparent",
        border: accent ? "1px solid rgba(61,122,95,0.2)" : "1px solid transparent",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function Divider() {
  return <div className="mx-0.5 h-3.5 w-px" style={{ background: "#e4ded4" }} />;
}
