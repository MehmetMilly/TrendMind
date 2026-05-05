"use client";

import { CampaignDrawer } from "@/components/trendmind/campaign-drawer";
import { CampaignWorkspace } from "@/components/trendmind/campaign-workspace";
import { CommandPalette } from "@/components/trendmind/command-palette";
import { DirectorDrawer } from "@/components/trendmind/director-drawer";
import { Inspector } from "@/components/trendmind/inspector";
import { KeyboardShortcuts } from "@/components/trendmind/keyboard-shortcuts";
import { NavRail } from "@/components/trendmind/nav-rail";
import { PhaseTransitionOverlay } from "@/components/trendmind/phase-transition-overlay";
import { PulseBar } from "@/components/trendmind/pulse-bar";
import { TopBar } from "@/components/trendmind/top-bar";
import { WorkspaceProvider } from "@/lib/workspace-store";
import type { CampaignBootstrap } from "@/lib/types";

export function AppShell({
  initialBootstrap,
}: {
  initialBootstrap: CampaignBootstrap;
}) {
  return (
    <WorkspaceProvider initialBootstrap={initialBootstrap}>
      <div
        className="flex h-screen w-full items-stretch overflow-hidden"
        style={{ background: "#cfc9bf", padding: "5px 6px 6px 6px" }}
      >
        <div
          className="relative flex h-full w-full overflow-hidden rounded-2xl"
          style={{
            background: "#f5f1ea",
            boxShadow:
              "0 12px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.55)",
          }}
        >
          <NavRail />
          <CampaignDrawer />

          <div
            className="flex min-w-0 flex-1 flex-col overflow-hidden"
            style={{ background: "#f5f1ea" }}
          >
            <TopBar />
            <CampaignWorkspace />
            <PulseBar />
          </div>

          <Inspector />
          <DirectorDrawer />
          <PhaseTransitionOverlay />
          <CommandPalette />
          <KeyboardShortcuts />
        </div>
      </div>
    </WorkspaceProvider>
  );
}
