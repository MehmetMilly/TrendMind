'use client';

import React from 'react';
import type { PhaseId } from '@/lib/campaign-context';
import { PHASES, useCampaign } from '@/lib/campaign-context';

const phaseDescriptions: Record<PhaseId, string> = {
  brief: '',
  research: 'The Trend Scout and Brand Strategist will surface cultural signals, competitive insights, and audience data to inform your campaign direction.',
  strategy: 'The Campaign Director will synthesize research into a cohesive creative strategy with clear pillars, messaging, and tactical recommendations.',
  drafting: 'Content Architects and Visual Director will produce campaign assets, copy drafts, and creative concepts aligned to the strategy.',
  results: 'Performance Critic will evaluate the campaign output, providing scoring, suggested improvements, and final recommendations.',
};

const phaseIcons: Record<PhaseId, React.ReactNode> = {
  brief: null,
  research: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M12 12L15.5 15.5" />
    </svg>
  ),
  strategy: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2L11.5 7L17 7.5L13 11.5L14 17L9 14.5L4 17L5 11.5L1 7.5L6.5 7L9 2Z" />
    </svg>
  ),
  drafting: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" />
    </svg>
  ),
  results: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 14L6 8L10 11L16 4" />
      <path d="M13 4H16V7" />
    </svg>
  ),
};

export function PlaceholderPhase({ phaseId }: { phaseId: PhaseId }) {
  const phase = PHASES.find((p) => p.id === phaseId);
  const { setActivePhase } = useCampaign();

  if (!phase) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-phase-enter">
      {/* Subtle radial underlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(200, 169, 110, 0.04) 0%, transparent 70%)',
        }}
      />

      <div className="text-center relative z-10">
        {/* Phase icon */}
        <div
          className="mx-auto mb-5 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(200, 169, 110, 0.06)',
            border: '1px solid rgba(200, 169, 110, 0.1)',
            color: '#a68b4b',
          }}
        >
          {phaseIcons[phaseId]}
        </div>

        <h3
          className="text-[20px] font-normal tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
        >
          {phase.label}
        </h3>

        <p
          className="text-[12.5px] mt-2.5 max-w-[380px] leading-relaxed mx-auto"
          style={{ color: '#9b9590' }}
        >
          {phaseDescriptions[phaseId]}
        </p>

        <p
          className="text-[11px] mt-4 font-medium"
          style={{ color: '#c0bbb4' }}
        >
          This phase will be available in a future update.
        </p>

        {/* Back to previous */}
        {phase.index > 0 && (
          <button
            onClick={() => setActivePhase(PHASES[phase.index - 1].id)}
            className="mt-5 px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-200"
            style={{
              color: '#7a756e',
              background: 'rgba(200, 169, 110, 0.06)',
              border: '1px solid rgba(200, 169, 110, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(200, 169, 110, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(200, 169, 110, 0.06)';
            }}
          >
            ← Back to {PHASES[phase.index - 1].label}
          </button>
        )}
      </div>
    </div>
  );
}
