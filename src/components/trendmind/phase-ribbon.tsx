'use client';

// A slim phase ribbon that acts as a navigator over the single scrolling
// campaign artifact. Clicking a phase scrolls the workspace to it. The
// active phase is driven by what's currently in view.

import React from 'react';
import { PHASES, PhaseId } from '@/lib/campaign-data';
import { useStore } from '@/lib/workspace-store';

export function PhaseRibbon() {
  const { activePhase, scrollToPhase, phaseStatus, briefDirtyFor } = useStore();
  const activeIndex = PHASES.findIndex((p) => p.id === activePhase);

  return (
    <div
      className="relative flex items-stretch h-[38px] px-4 flex-shrink-0 gap-0.5"
      style={{
        background: '#f5f1ea',
        borderBottom: '1px solid #e4ded4',
      }}
    >
      {/* Progress strip — ambient indicator of where we are */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[2px] pointer-events-none"
        style={{ background: 'transparent' }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${((activeIndex + 1) / PHASES.length) * 100}%`,
            background: 'linear-gradient(90deg, transparent, #c8a96e 20%, #c8a96e 80%, transparent)',
            boxShadow: '0 0 10px rgba(200,169,110,0.4)',
          }}
        />
      </div>

      {PHASES.map((p, i) => {
        const isActive = p.id === activePhase;
        const isStale = briefDirtyFor.includes(p.id) && p.id !== 'brief';
        return (
          <PhaseChip
            key={p.id}
            id={p.id}
            index={i}
            label={p.label}
            role={p.role}
            isActive={isActive}
            isStale={isStale}
            isWriting={phaseStatus[p.id] === 'writing'}
            onClick={() => scrollToPhase(p.id)}
          />
        );
      })}

      {/* Ambient pulse icon on the right */}
      <div className="flex-1" />
      <LiveDot />
    </div>
  );
}

function PhaseChip({
  index,
  label,
  role,
  isActive,
  isStale,
  isWriting,
  onClick,
}: {
  id: PhaseId;
  index: number;
  label: string;
  role: string;
  isActive: boolean;
  isStale: boolean;
  isWriting: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex items-center gap-2 px-2.5 rounded-md transition-all duration-200"
      style={{
        color: isActive ? '#1e3a2f' : hover ? '#2c2c2c' : '#6b6560',
        background: isActive
          ? 'rgba(200, 169, 110, 0.14)'
          : hover
            ? 'rgba(200, 169, 110, 0.06)'
            : 'transparent',
      }}
    >
      <span
        className="text-[10px] tabular-nums font-semibold"
        style={{ color: isActive ? '#a68b4b' : '#b0a99e' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span
        className="text-[12.5px] font-medium tracking-[-0.005em]"
        style={{ fontFamily: isActive ? 'var(--font-heading)' : undefined }}
      >
        {label}
      </span>
      {isStale && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#b7863f' }}
          title="Stale — Brief was edited"
        />
      )}
      {isWriting && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
          style={{ background: '#4a9070' }}
          title="Writing"
        />
      )}
      {/* Hover role hint */}
      <span
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[38px] whitespace-nowrap px-2 py-1 text-[10.5px] tracking-[0.05em] rounded-md transition-opacity duration-150"
        style={{
          opacity: hover && !isActive ? 1 : 0,
          background: '#1e3a2f',
          color: '#dcc487',
          border: '1px solid rgba(200,169,110,0.25)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
          zIndex: 40,
        }}
      >
        {role}
      </span>
    </button>
  );
}

function LiveDot() {
  return (
    <div
      className="self-center flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] tracking-[0.12em] uppercase"
      style={{
        color: '#6b6560',
        background: 'rgba(200, 169, 110, 0.08)',
        border: '1px solid rgba(200, 169, 110, 0.15)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#c8a96e' }} />
      Writing forward
    </div>
  );
}
