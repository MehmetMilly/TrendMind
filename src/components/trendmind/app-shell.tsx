'use client';

import React from 'react';
import { CampaignProvider } from '@/lib/campaign-context';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { PhaseNav } from './phase-nav';
import { PhaseCanvas } from './phase-canvas';
import { AgentRail } from './agent-rail';

export function AppShell() {
  return (
    <CampaignProvider>
      <div className="w-full h-screen flex items-start justify-center overflow-hidden"
        style={{ background: '#d2cdc4', padding: '6px 8px 8px 8px' }}>
        {/* Main shell frame */}
        <div className="w-full h-full rounded-2xl overflow-hidden flex"
          style={{
            background: '#f5f1ea',
            boxShadow: '0 10px 40px rgba(0,0,0,0.14), 0 2px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}>
          {/* Left sidebar */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: '#ebe6dd' }}>
            {/* Top bar */}
            <TopBar />

            {/* Phase navigation */}
            <PhaseNav />

            {/* Content body */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              {/* Phase canvas */}
              <PhaseCanvas />

              {/* Agent rail */}
              <AgentRail />
            </div>
          </div>
        </div>
      </div>
    </CampaignProvider>
  );
}
