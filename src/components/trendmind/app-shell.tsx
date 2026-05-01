'use client';

// TrendMind workspace shell.
// Slim nav-rail · compact top strip · phase ribbon · one scrolling
// campaign artifact · ambient pulse bar · hidden-by-default Inspector.

import React from 'react';
import { WorkspaceProvider } from '@/lib/workspace-store';
import { NavRail } from './nav-rail';
import { TopStrip } from './top-strip';
import { PhaseRibbon } from './phase-ribbon';
import { CampaignWorkspace } from './campaign-workspace';
import { PulseBar } from './pulse-bar';
import { Inspector } from './inspector';

export function AppShell() {
  return (
    <WorkspaceProvider>
      <div
        className="w-full h-screen flex items-stretch overflow-hidden"
        style={{
          background: '#d2cdc4',
          padding: '6px 8px 8px 8px',
        }}
      >
        <div
          className="w-full h-full rounded-2xl overflow-hidden flex relative"
          style={{
            background: '#f5f1ea',
            boxShadow:
              '0 10px 40px rgba(0,0,0,0.14), 0 2px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}
        >
          <NavRail />

          <div
            className="flex-1 flex flex-col min-w-0 overflow-hidden"
            style={{ background: '#f5f1ea' }}
          >
            <TopStrip />
            <PhaseRibbon />
            <CampaignWorkspace />
            <PulseBar />
          </div>

          <Inspector />
        </div>
      </div>
    </WorkspaceProvider>
  );
}
