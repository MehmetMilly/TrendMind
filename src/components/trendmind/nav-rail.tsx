"use client";

import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  ImageUp,
  LayoutDashboard,
  Settings2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { useStore } from "@/lib/workspace-store";

const SIDEBAR_STORAGE_KEY = "trendmind.sidebarExpanded.v1";

const ITEMS = [
  { id: "workspace", label: "مساحة العمل", icon: LayoutDashboard },
  { id: "campaigns", label: "الحملات", icon: FolderKanban },
  { id: "analytics", label: "التحليلات", icon: BarChart3 },
  { id: "logo", label: "اللوقو", icon: ImageUp },
];

export function NavRail() {
  const {
    activePhase,
    activeCampaignId,
    campaign,
    campaigns,
    openCampaignDrawer,
    selectCampaign,
    setActivePhase,
    workspaceView,
    openAnalytics,
    openSettings,
    openLogoStudio,
  } = useStore();
  const router = useRouter();

  const [expanded, setExpanded] = React.useState(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  const [campaignPopoverOpen, setCampaignPopoverOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const persistExpanded = (next: boolean) => {
    setExpanded(next);
    try { window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next)); } catch { /* noop */ }
    if (!next) setCampaignPopoverOpen(false);
  };

  const toggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      try { window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next)); } catch { /* noop */ }
      if (!next) setCampaignPopoverOpen(false);
      return next;
    });
  };

  React.useEffect(() => {
    if (!campaignPopoverOpen) return;
    function onOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setCampaignPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [campaignPopoverOpen]);

  const handleItemClick = (id: string) => {
    if (id === "campaigns") {
      if (!expanded) {
        setCampaignPopoverOpen((v) => !v);
      } else {
        openCampaignDrawer();
      }
    } else if (id === "logo") {
      openLogoStudio();
    } else if (id === "analytics") {
      const campaignId = campaign?.id ?? activeCampaignId;
      if (campaignId) {
        openAnalytics();
      } else {
        openCampaignDrawer();
      }
    } else if (id === "workspace") {
      setActivePhase(activePhase);
    }
  };

  const isActive = (id: string) =>
    id === "logo"
      ? workspaceView === "logo"
      : id === "analytics"
      ? workspaceView === "analytics"
      : id === "workspace" && workspaceView === "phase";

  return (
    <aside
      className="relative flex h-full flex-shrink-0 flex-col overflow-visible transition-[width] duration-300"
      style={{
        width: expanded ? 220 : 52,
        background: "linear-gradient(180deg, #162b22 0%, #0f1f18 60%, #121f19 100%)",
        borderLeft: "1px solid rgba(200, 169, 110, 0.08)",
        zIndex: 20,
      }}
    >
      {/* ── Logo + toggle row ── */}
      <div className="flex items-center justify-between pb-2 pt-3" style={{ paddingInline: expanded ? "14px 10px" : "11px" }}>
        <button
          type="button"
          onClick={() => persistExpanded(true)}
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px]"
          style={{
            background: "linear-gradient(145deg, #dcc487, #a68b4b)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
          title="TrendMind"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 10.5L6 7.5L9 9.5L12.5 5" stroke="#162b22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.5 5L12.5 5L12.5 7" stroke="#162b22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {expanded && (
          <span
            className="truncate px-1 text-[11px] font-bold tracking-[0.06em]"
            style={{ color: "#dcc487", letterSpacing: "0.06em" }}
            dir="ltr"
          >
            TrendMind
          </span>
        )}

        <button
          onClick={toggle}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
          style={{ color: "#6b7a72", background: "rgba(200,169,110,0.06)" }}
          title={expanded ? "طي القائمة" : "توسيع القائمة"}
        >
          {expanded ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      <div
        className="mx-auto mb-1.5 h-px"
        style={{
          width: expanded ? "calc(100% - 20px)" : 24,
          background: "linear-gradient(90deg, transparent, rgba(200, 169, 110, 0.25), transparent)",
        }}
      />

      {/* ── Nav items ── */}
      <nav className="mt-0.5 flex flex-1 flex-col gap-1 px-1.5">
        {ITEMS.map((item) => {
          const active = isActive(item.id);
          const isCampaigns = item.id === "campaigns";
          return (
            <div key={item.id} className="relative">
              <SidebarButton
                label={item.label}
                active={active}
                expanded={expanded}
                onClick={() => handleItemClick(item.id)}
              >
                <item.icon size={15} />
              </SidebarButton>

              {/* Campaigns popover (collapsed mode only) */}
              {isCampaigns && !expanded && campaignPopoverOpen && (
                <div
                  ref={popoverRef}
                  className="absolute top-0 z-50 overflow-hidden rounded-2xl border shadow-2xl"
                  style={{
                    right: "calc(100% + 8px)",
                    minWidth: 260,
                    background: "linear-gradient(180deg, #f8f4ed 0%, #f2ece1 100%)",
                    borderColor: "#e4ded4",
                  }}
                >
                  <div className="border-b px-4 py-3" style={{ borderColor: "#e4ded4" }}>
                    <div className="text-[8.5px] uppercase tracking-[0.22em]" style={{ color: "#a68b4b" }}>الحملات</div>
                    <h3 className="mt-0.5 text-[15px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
                      اختر حملة
                    </h3>
                  </div>
                  <div className="max-h-[380px] overflow-y-auto py-2">
                    {campaigns.length === 0 ? (
                      <p className="px-4 py-3 text-[12px]" style={{ color: "#9b9590" }}>لا توجد حملات بعد.</p>
                    ) : (
                      campaigns.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => { void selectCampaign(c.id); setCampaignPopoverOpen(false); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors"
                          style={{
                            background: c.id === activeCampaignId ? "rgba(200,169,110,0.14)" : "transparent",
                          }}
                        >
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                            style={{ background: "rgba(200,169,110,0.18)", color: "#7a6235" }}
                          >
                            {(c.name || "C")[0].toUpperCase()}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13px] font-semibold" style={{ color: "#1f1d1a" }}>{c.name}</div>
                            <div className="truncate text-[11px]" style={{ color: "#9b9590" }}>{c.brandName}</div>
                          </div>
                          {c.id === activeCampaignId && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#3d7a5f" }} />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                  <div className="border-t px-4 py-2" style={{ borderColor: "#e4ded4" }}>
                    <button
                      onClick={() => { openCampaignDrawer(); setCampaignPopoverOpen(false); }}
                      className="w-full rounded-lg py-2 text-[12px] font-bold"
                      style={{ color: "#f8f1df", background: "#163326" }}
                    >
                      + حملة جديدة
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="flex flex-col gap-1.5 px-1.5 pb-2.5">
        <SidebarButton label="الإعدادات" active={workspaceView === "settings"} expanded={expanded} onClick={openSettings}>
          <Settings2 size={15} />
        </SidebarButton>
        <div
          className="flex items-center gap-2.5"
          style={{ paddingInline: expanded ? "4px" : "0px" }}
        >
          <div
            className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
            style={{
              background: "linear-gradient(145deg, #c8a96e, #a68b4b)",
              color: "#162b22",
              boxShadow: "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
              letterSpacing: "0.05em",
              marginInline: expanded ? "0" : "auto",
            }}
            title="Julien Davis"
          >
            JD
          </div>
          {expanded && (
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="truncate text-[12px] font-semibold" style={{ color: "#d9bf82" }}>Julien Davis</div>
              <div className="truncate text-[10px]" style={{ color: "#5a6b62" }}>مدير الحملات</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarButton({
  children,
  label,
  active,
  expanded,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  expanded: boolean;
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
        className="relative flex w-full items-center gap-2.5 rounded-[9px] px-2 py-2 transition-all duration-200"
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
            className="absolute -right-[6px] bottom-1 top-1 w-[2px] rounded-full"
            style={{ background: "#c8a96e" }}
          />
        ) : null}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">{children}</span>
        {expanded && (
          <span className="truncate text-[12px] font-semibold">{label}</span>
        )}
      </button>

      {/* Tooltip only in collapsed mode */}
      {!expanded && (
        <span
          className="pointer-events-none absolute right-[46px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[10px] tracking-[0.04em] transition-opacity duration-150"
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
      )}
    </div>
  );
}

