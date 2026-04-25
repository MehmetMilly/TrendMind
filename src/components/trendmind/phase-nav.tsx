'use client';

import React from 'react';
import { PHASES, useCampaign } from '@/lib/campaign-context';
import type { PhaseId } from '@/lib/campaign-context';

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 5.5L4.2 7.2L7.5 3.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5.5" width="7" height="5" rx="1" />
      <path d="M4 5.5V3.5C4 2.1 4.9 1 6 1C7.1 1 8 2.1 8 3.5V5.5" />
    </svg>
  );
}

function PhaseStep({
  phase,
  index,
  isActive,
  isComplete,
  isUnlocked,
  isLast,
  onClick,
}: {
  phase: { id: PhaseId; label: string };
  index: number;
  isActive: boolean;
  isComplete: boolean;
  isUnlocked: boolean;
  isLast: boolean;
  onClick: () => void;
}) {
  const canClick = isUnlocked;

  return (
    <div className="flex items-center">
      <button
        onClick={canClick ? onClick : undefined}
        disabled={!canClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-250 relative group"
        style={{
          cursor: canClick ? 'pointer' : 'default',
          background: isActive
            ? 'rgba(200, 169, 110, 0.12)'
            : 'transparent',
          border: isActive
            ? '1px solid rgba(200, 169, 110, 0.2)'
            : '1px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (canClick && !isActive) {
            e.currentTarget.style.background = 'rgba(200, 169, 110, 0.06)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        {/* Step number / status indicator */}
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 flex-shrink-0"
          style={{
            background: isActive
              ? 'linear-gradient(135deg, #c8a96e, #a68b4b)'
              : isComplete
                ? 'linear-gradient(135deg, #4a9070, #3d7a5f)'
                : 'rgba(200, 169, 110, 0.08)',
            color: isActive || isComplete
              ? '#fff'
              : !isUnlocked
                ? '#c8c2ba'
                : '#9b9590',
            boxShadow: isActive
              ? '0 1px 4px rgba(166, 139, 75, 0.3)'
              : isComplete
                ? '0 1px 4px rgba(61, 122, 95, 0.2)'
                : 'none',
          }}
        >
          {isComplete ? <CheckIcon /> : !isUnlocked ? <LockIcon /> : index + 1}
        </div>

        {/* Label */}
        <span
          className="text-[11.5px] font-medium transition-colors duration-200 whitespace-nowrap"
          style={{
            color: isActive
              ? '#2c2c2c'
              : isComplete
                ? '#4a9070'
                : isUnlocked
                  ? '#7a756e'
                  : '#c0bbb4',
            fontFamily: 'var(--font-body)',
          }}
        >
          {phase.label}
        </span>
      </button>

      {/* Connector line */}
      {!isLast && (
        <div
          className="w-6 h-px mx-0.5 flex-shrink-0"
          style={{
            background: isComplete
              ? 'linear-gradient(90deg, rgba(74, 144, 112, 0.3), rgba(74, 144, 112, 0.15))'
              : 'linear-gradient(90deg, rgba(228, 222, 212, 0.7), rgba(228, 222, 212, 0.4))',
            transition: 'background 0.3s ease',
          }}
        />
      )}
    </div>
  );
}

export function PhaseNav() {
  const { activePhase, setActivePhase, canNavigateTo, isPhaseComplete } = useCampaign();

  return (
    <div
      className="flex items-center px-5 h-[38px] flex-shrink-0"
      style={{
        borderBottom: '1px solid rgba(228, 222, 212, 0.7)',
        background: 'rgba(250, 247, 242, 0.4)',
      }}
    >
      <div className="flex items-center">
        {PHASES.map((phase, i) => (
          <PhaseStep
            key={phase.id}
            phase={phase}
            index={i}
            isActive={activePhase === phase.id}
            isComplete={isPhaseComplete(phase.id)}
            isUnlocked={canNavigateTo(phase.id)}
            isLast={i === PHASES.length - 1}
            onClick={() => setActivePhase(phase.id)}
          />
        ))}
      </div>
    </div>
  );
}
