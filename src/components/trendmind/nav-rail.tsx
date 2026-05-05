"use client";

import {
  BarChart3,
  FolderKanban,
  LayoutDashboard,
  Settings2,
} from "lucide-react";
import React from "react";

import { useStore } from "@/lib/workspace-store";

const ITEMS = [
  { id: "workspace", label: "مساحة العمل", icon: LayoutDashboard },
  { id: "campaigns", label: "الحملات", icon: FolderKanban },
  { id: "analytics", label: "التحليلات", icon: BarChart3 },
];

export function NavRail() {
  const { openCampaignDrawer } = useStore();

  return (
    <aside
      className="relative flex h-full w-[52px] flex-shrink-0 flex-col items-center"
      style={{
        background: "linear-gradient(180deg, #162b22 0%, #0f1f18 60%, #121f19 100%)",
        borderLeft: "1px solid rgba(200, 169, 110, 0.08)",
      }}
    >
      <div className="pb-2.5 pt-3.5">
        <div
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px]"
          style={{
            background: "linear-gradient(145deg, #dcc487, #a68b4b)",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
          title="TrendMind"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3.5 10.5L6 7.5L9 9.5L12.5 5"
              stroke="#162b22"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.5 5L12.5 5L12.5 7"
              stroke="#162b22"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div
        className="mb-1.5 h-px w-6"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(200, 169, 110, 0.25), transparent)",
        }}
      />

      <nav className="mt-0.5 flex flex-1 flex-col items-center gap-1">
        {ITEMS.map((item) => (
          <RailButton
            key={item.id}
            label={item.label}
            active={item.id === "workspace"}
            onClick={item.id === "campaigns" ? openCampaignDrawer : undefined}
          >
            <item.icon size={15} />
          </RailButton>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-1.5 pb-2.5">
        <RailButton label="الإعدادات">
          <Settings2 size={15} />
        </RailButton>
        <div
          className="mt-0.5 flex h-[28px] w-[28px] items-center justify-center rounded-full text-[9px] font-bold"
          style={{
            background: "linear-gradient(145deg, #c8a96e, #a68b4b)",
            color: "#162b22",
            boxShadow:
              "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
            letterSpacing: "0.05em",
          }}
          title="Julien Davis"
        >
          JD
        </div>
      </div>
    </aside>
  );
}

function RailButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = React.useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={onClick}
        className="relative flex h-8 w-8 items-center justify-center rounded-[9px] transition-all duration-200"
        style={{
          color: active ? "#f0e8d8" : hover ? "#dcc487" : "#6b7a72",
          background: active
            ? "linear-gradient(160deg, rgba(200,169,110,0.2), rgba(200,169,110,0.08))"
            : hover
              ? "rgba(200, 169, 110, 0.06)"
              : "transparent",
          boxShadow: active ? "inset 0 0 0 1px rgba(200,169,110,0.28)" : "none",
        }}
      >
        {active ? (
          <span
            className="absolute -right-[8px] bottom-1 top-1 w-[2px] rounded-full"
            style={{ background: "#c8a96e" }}
          />
        ) : null}
        {children}
      </button>
      <span
        className="pointer-events-none absolute right-[42px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[10px] tracking-[0.04em] transition-opacity duration-150"
        style={{
          opacity: hover ? 1 : 0,
          background: "#0f1f18",
          color: "#dcc487",
          border: "1px solid rgba(200,169,110,0.2)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          zIndex: 40,
        }}
      >
        {label}
      </span>
    </div>
  );
}
