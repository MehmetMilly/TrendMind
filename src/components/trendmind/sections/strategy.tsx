'use client';

// Strategy — the decision surface.
// Three angle bets shown side by side, equal weight, clearly contrasted.
// The user picks one to commit to for Draft / Studio / Launch. The
// unselected angles stay visible as alternates the system can revisit.

import React from 'react';
import { SectionShell, Attribution } from './section-shell';
import { AGENTS, ANGLES, RESEARCH, StrategyAngle } from '@/lib/campaign-data';
import { useStore } from '@/lib/workspace-store';

export function StrategySection() {
  const { selectedAngleId, setSelectedAngleId, openInspector } = useStore();

  return (
    <SectionShell
      id="strategy"
      tagline="Three parallel angle bets — pick one to commit, keep the others as alternates"
      rightSlot={
        <div className="flex items-center gap-2 text-[10.5px] tracking-[0.14em] uppercase" style={{ color: '#9b9590' }}>
          <Attribution agentShort={AGENTS.strategist.short} accent={AGENTS.strategist.accent} extra="shaping" />
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        {ANGLES.map((a) => (
          <AngleCard
            key={a.id}
            angle={a}
            selected={selectedAngleId === a.id}
            onSelect={() => setSelectedAngleId(a.id)}
            onOpen={() => openInspector('angle', a.id)}
          />
        ))}
      </div>

      {/* Decision line */}
      <div
        className="mt-4 flex items-center justify-between px-4 py-2.5 rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #faf7f2, #f2ecdf)',
          border: '1px solid #e4ded4',
        }}
      >
        <div className="flex items-center gap-3 text-[12px]" style={{ color: '#3a3631' }}>
          <span className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: '#a68b4b' }}>
            Committed
          </span>
          <span className="font-medium">
            {ANGLES.find((a) => a.id === selectedAngleId)?.name}
          </span>
          <span style={{ color: '#9b9590' }}>
            — Draft, Trial, Studio, Launch will be built from this angle.
          </span>
        </div>
        <button
          className="text-[11.5px] font-medium tracking-[0.04em] px-2 py-1 rounded-md transition-colors"
          style={{ color: '#3d7a5f', background: 'rgba(61,122,95,0.08)', border: '1px solid rgba(61,122,95,0.2)' }}
        >
          Keep alternates warm →
        </button>
      </div>
    </SectionShell>
  );
}

function AngleCard({
  angle,
  selected,
  onSelect,
  onOpen,
}: {
  angle: StrategyAngle;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const leadSignal = RESEARCH.find((r) => r.id === angle.leadSignal);

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 animate-rise-in"
      style={{
        background: selected
          ? 'linear-gradient(180deg, #faf7f2 0%, #f0e8d3 100%)'
          : '#fbf8f2',
        border: selected ? '1px solid #c8a96e' : '1px solid #e4ded4',
        boxShadow: selected
          ? '0 10px 30px rgba(200,169,110,0.18), 0 1px 2px rgba(0,0,0,0.03)'
          : '0 1px 2px rgba(0,0,0,0.02)',
        transform: selected ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Top ribbon — letter + name */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3"
        style={{ borderBottom: '1px solid #eae3d6' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[12px] font-bold"
            style={{
              color: selected ? '#1e3a2f' : '#a68b4b',
              background: selected ? 'linear-gradient(160deg, #dcc487, #c8a96e)' : 'rgba(200,169,110,0.1)',
              boxShadow: selected ? 'inset 0 1px 0 rgba(255,255,255,0.3)' : undefined,
            }}
          >
            {angle.letter}
          </div>
          <div>
            <div className="text-[9.5px] tracking-[0.18em] uppercase" style={{ color: '#9b9590' }}>
              Angle {angle.letter}
            </div>
            <div
              className="text-[14.5px] leading-none tracking-[-0.005em] mt-1 font-medium"
              style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
            >
              {angle.name}
            </div>
          </div>
        </div>
        {selected && (
          <span
            className="text-[9.5px] tracking-[0.18em] uppercase font-semibold px-1.5 py-0.5 rounded"
            style={{ color: '#1e3a2f', background: 'rgba(61,122,95,0.15)' }}
          >
            Committed
          </span>
        )}
      </div>

      {/* Hook — big editorial line */}
      <div className="px-4 py-4">
        <p
          className="text-[16px] leading-[1.35] tracking-[-0.01em] italic"
          style={{ fontFamily: 'var(--font-heading)', color: '#1f1d1a' }}
        >
          “{angle.hook}”
        </p>
      </div>

      {/* Stance + promise */}
      <div className="px-4 pb-3 space-y-2.5 text-[12px] leading-[1.55]">
        <div>
          <div className="text-[9.5px] tracking-[0.18em] uppercase mb-1" style={{ color: '#b0a99e' }}>
            Stance
          </div>
          <p style={{ color: '#3a3631' }}>{angle.stance}</p>
        </div>
        <div>
          <div className="text-[9.5px] tracking-[0.18em] uppercase mb-1" style={{ color: '#b0a99e' }}>
            Promise
          </div>
          <p style={{ color: '#3a3631' }}>{angle.promise}</p>
        </div>
      </div>

      {/* Supports */}
      <div className="px-4 pb-3">
        <div className="text-[9.5px] tracking-[0.18em] uppercase mb-1.5" style={{ color: '#b0a99e' }}>
          Supports
        </div>
        <ul className="space-y-1 text-[11.5px] leading-[1.45]" style={{ color: '#4a4540' }}>
          {angle.support.map((s, i) => (
            <li key={i} className="flex gap-1.5">
              <span style={{ color: '#c8a96e' }}>—</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk strip */}
      <div
        className="px-4 py-2 flex items-start gap-2 text-[11px]"
        style={{ background: 'rgba(138,106,90,0.06)', borderTop: '1px solid #eae3d6' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-[2px] flex-shrink-0">
          <path d="M6 1.5L11 10.5H1L6 1.5Z" stroke="#8a6a5a" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M6 5V7.5M6 9V9.2" stroke="#8a6a5a" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span style={{ color: '#6b5a4d' }}>{angle.risk}</span>
      </div>

      {/* Footer actions */}
      <div
        className="px-4 py-2.5 flex items-center justify-between gap-2"
        style={{ borderTop: '1px solid #eae3d6', background: selected ? 'rgba(200,169,110,0.07)' : '#f0ebe1' }}
      >
        <button
          onClick={onOpen}
          className="text-[11px] font-medium tracking-[0.04em] transition-colors"
          style={{ color: '#6b6560' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1e3a2f')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b6560')}
        >
          Inspect {leadSignal ? `· signal ${leadSignal.id.toUpperCase()}` : ''} →
        </button>
        <button
          onClick={onSelect}
          disabled={selected}
          className="px-2.5 py-1 rounded-md text-[11px] font-medium tracking-[0.02em] transition-all"
          style={
            selected
              ? {
                  color: '#f0e8d8',
                  background: 'linear-gradient(160deg, #3d7a5f, #1e3a2f)',
                  cursor: 'default',
                }
              : {
                  color: '#1e3a2f',
                  background: 'transparent',
                  border: '1px solid rgba(30,58,47,0.25)',
                }
          }
        >
          {selected ? 'Committed' : 'Commit'}
        </button>
      </div>
    </div>
  );
}
