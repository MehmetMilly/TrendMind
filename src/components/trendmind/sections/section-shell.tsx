'use client';

// A shared, intentionally compact section wrapper for the living campaign
// artifact. Every phase gets the same spine (index, label, role, ambient
// state) so the workspace feels coherent, but the *body* of each phase is
// free to be its own purpose-built surface.

import React from 'react';
import { PhaseId, PHASES } from '@/lib/campaign-data';
import { useStore } from '@/lib/workspace-store';

export function SectionShell({
  id,
  children,
  accent = '#c8a96e',
  tagline,
  rightSlot,
  dramatic = false,
}: {
  id: PhaseId;
  children: React.ReactNode;
  accent?: string;
  tagline?: string;
  rightSlot?: React.ReactNode;
  dramatic?: boolean;
}) {
  const { registerSectionRef, briefDirtyFor } = useStore();
  const phase = PHASES.find((p) => p.id === id)!;
  const isStale = briefDirtyFor.includes(id) && id !== 'brief';

  return (
    <section
      ref={(node) => registerSectionRef(id, node)}
      data-phase={id}
      className={`relative scroll-mt-4 ${dramatic ? 'py-10' : 'py-6'}`}
      style={
        dramatic
          ? {
              background: 'linear-gradient(180deg, #f5f1ea 0%, #efe8dc 40%, #f5f1ea 100%)',
            }
          : undefined
      }
    >
      {/* Section header — thin, tight, restrained */}
      <header className="flex items-end justify-between gap-4 mb-4 px-8 max-w-[1180px] mx-auto">
        <div className="flex items-baseline gap-3 min-w-0">
          <span
            className="text-[10px] tabular-nums font-semibold tracking-[0.14em]"
            style={{ color: accent }}
          >
            {String(phase.index + 1).padStart(2, '0')}
          </span>
          <h2
            className="text-[22px] leading-none tracking-[-0.01em]"
            style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
          >
            {phase.label}
          </h2>
          <span className="text-[11.5px] tracking-[0.02em]" style={{ color: '#9b9590' }}>
            — {tagline ?? phase.role}
          </span>
          {isStale && (
            <span
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase px-1.5 py-0.5 rounded-full ml-2"
              style={{ color: '#8a6a5a', background: 'rgba(138,106,90,0.1)', border: '1px solid rgba(138,106,90,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#b7863f' }} />
              Drifted from brief
            </span>
          )}
        </div>
        {rightSlot}
      </header>
      <div className="px-8 max-w-[1180px] mx-auto">
        {/* Hairline under header */}
        <div
          className="h-px mb-5"
          style={{
            background:
              'linear-gradient(90deg, transparent, #d8d0c4 12%, #d8d0c4 88%, transparent)',
          }}
        />
        {children}
      </div>
    </section>
  );
}

// Small inline attribution chip used across sections for agent credit.
export function Attribution({
  agentShort,
  accent,
  extra,
}: {
  agentShort: string;
  accent: string;
  extra?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.06em] uppercase font-medium"
      style={{ color: '#9b9590' }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: accent }}
      />
      <span style={{ color: accent }}>{agentShort}</span>
      {extra && <span>· {extra}</span>}
    </span>
  );
}
