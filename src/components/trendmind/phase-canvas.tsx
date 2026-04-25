'use client';

import React from 'react';
import { useCampaign, PHASES } from '@/lib/campaign-context';
import { BriefPhase } from './phases/brief-phase';
import { ResearchPhase } from './phases/research-phase';
import { PlaceholderPhase } from './phases/placeholder-phase';

export function PhaseCanvas() {
  const { activePhase } = useCampaign();
  const currentPhase = PHASES.find((p) => p.id === activePhase);
  const phaseNumber = currentPhase ? currentPhase.index + 1 : 1;

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Canvas container */}
      <div
        className="flex-1 rounded-xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #faf7f2 0%, #f8f4ed 100%)',
          border: '1px solid #e4ded4',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03), 0 0 0 1px rgba(255,255,255,0.5) inset',
        }}
      >
        {/* Canvas header — refined */}
        <div
          className="flex items-center justify-between px-5 h-[40px] flex-shrink-0"
          style={{
            borderBottom: '1px solid rgba(228, 222, 212, 0.7)',
            background: 'rgba(245, 241, 234, 0.6)',
          }}
        >
          <div className="flex items-center gap-2">
            {/* Small phase indicator dot */}
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, #c8a96e, #a68b4b)' }}
            />
            <span className="text-[11.5px] font-medium tracking-wide uppercase" style={{ color: '#9b9590', letterSpacing: '0.08em' }}>
              {currentPhase?.label ?? 'Phase'} Canvas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10.5px] font-semibold px-2.5 py-1 rounded-md"
              style={{
                background: 'rgba(200, 169, 110, 0.1)',
                color: '#a68b4b',
                border: '1px solid rgba(200, 169, 110, 0.15)',
              }}
            >
              Phase {phaseNumber} of {PHASES.length}
            </span>
          </div>
        </div>

        {/* Phase body — rendered by active phase */}
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {activePhase === 'brief' && <BriefPhase />}
          {activePhase === 'research' && <ResearchPhase />}
          {activePhase !== 'brief' && activePhase !== 'research' && (
            <PlaceholderPhase phaseId={activePhase} />
          )}
        </div>
      </div>
    </div>
  );
}
