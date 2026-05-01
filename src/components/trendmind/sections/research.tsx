'use client';

// Research — an embedded evidence board.
// Dense grid of typed research cards (trend / competitive / audience /
// risk / fact). Each card is attributable and inspectable. Clicking one
// opens the Inspector with deeper context.

import React, { useMemo, useState } from 'react';
import { SectionShell, Attribution } from './section-shell';
import { AGENTS, RESEARCH, ResearchKind } from '@/lib/campaign-data';
import { useStore } from '@/lib/workspace-store';

const KIND_META: Record<ResearchKind, { label: string; accent: string; bg: string }> = {
  trend:       { label: 'Trend',       accent: '#a68b4b', bg: 'rgba(200,169,110,0.08)' },
  competitive: { label: 'Competitive', accent: '#4f6e87', bg: 'rgba(79,110,135,0.08)'  },
  audience:    { label: 'Audience',    accent: '#3d7a5f', bg: 'rgba(61,122,95,0.08)'   },
  risk:        { label: 'Risk',        accent: '#8a6a5a', bg: 'rgba(138,106,90,0.08)'  },
  fact:        { label: 'Fact',        accent: '#6b6560', bg: 'rgba(107,101,96,0.08)'  },
};

const FILTERS: (ResearchKind | 'all')[] = ['all', 'trend', 'audience', 'competitive', 'risk', 'fact'];

export function ResearchSection() {
  const { openInspector, inspector } = useStore();
  const [filter, setFilter] = useState<ResearchKind | 'all'>('all');

  const items = useMemo(
    () => (filter === 'all' ? RESEARCH : RESEARCH.filter((r) => r.kind === filter)),
    [filter],
  );

  const right = (
    <div className="flex items-center gap-1">
      {FILTERS.map((f) => {
        const isActive = filter === f;
        return (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-2 py-1 rounded-md text-[10.5px] tracking-[0.08em] uppercase font-medium transition-all"
            style={{
              color: isActive ? '#1e3a2f' : '#9b9590',
              background: isActive ? 'rgba(200,169,110,0.18)' : 'transparent',
              border: isActive ? '1px solid rgba(200,169,110,0.35)' : '1px solid transparent',
            }}
          >
            {f}
          </button>
        );
      })}
    </div>
  );

  return (
    <SectionShell
      id="research"
      tagline="Trend signals, audience patterns, competitive scan, risks — attributable, inspectable"
      rightSlot={right}
    >
      <div className="grid grid-cols-12 gap-3">
        {items.map((item, i) => {
          const meta = KIND_META[item.kind];
          const agent = AGENTS[item.by];
          const span = cardSpan(i, items.length);
          const selected = inspector.kind === 'research' && inspector.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => openInspector('research', item.id)}
              className={`group text-left rounded-xl p-3.5 transition-all duration-200 flex flex-col gap-2 animate-rise-in`}
              style={{
                gridColumn: `span ${span}`,
                background: selected ? '#faf7f2' : '#fbf8f2',
                border: selected ? '1px solid #c8a96e' : '1px solid #e4ded4',
                boxShadow: selected
                  ? '0 6px 18px rgba(200,169,110,0.18), 0 1px 2px rgba(0,0,0,0.03)'
                  : '0 1px 2px rgba(0,0,0,0.02)',
                animationDelay: `${i * 40}ms`,
              }}
              onMouseEnter={(e) => {
                if (!selected) e.currentTarget.style.background = '#faf7f2';
              }}
              onMouseLeave={(e) => {
                if (!selected) e.currentTarget.style.background = '#fbf8f2';
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1.5 text-[9.5px] tracking-[0.18em] uppercase font-semibold px-1.5 py-0.5 rounded"
                  style={{ color: meta.accent, background: meta.bg }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: meta.accent }} />
                  {meta.label}
                </span>
                <ConfidenceBar value={item.confidence} accent={meta.accent} />
              </div>
              <h3
                className="text-[13.5px] leading-[1.35] tracking-[-0.005em] font-medium"
                style={{ color: '#2c2c2c' }}
              >
                {item.title}
              </h3>
              <p className="text-[12px] leading-[1.55] line-clamp-3" style={{ color: '#6b6560' }}>
                {item.summary}
              </p>
              <div className="flex items-center justify-between mt-auto pt-1">
                <Attribution agentShort={agent.short} accent={agent.accent} />
                <span className="text-[10px] truncate max-w-[60%]" style={{ color: '#a59f97' }} title={item.source}>
                  {item.source}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer summary */}
      <div
        className="mt-4 flex items-center justify-between px-3 py-2 rounded-lg"
        style={{ background: 'rgba(200,169,110,0.06)', border: '1px dashed rgba(200,169,110,0.25)' }}
      >
        <div className="flex items-center gap-2 text-[11px]" style={{ color: '#6b6560' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#3d7a5f' }} />
          Scout and Strategist continue to refresh signals in the background.
        </div>
        <button
          className="text-[11px] font-medium tracking-[0.04em]"
          style={{ color: '#3d7a5f' }}
        >
          Pull fresh batch →
        </button>
      </div>
    </SectionShell>
  );
}

function cardSpan(i: number, total: number) {
  // A subtle editorial rhythm: vary column spans to avoid a boring grid.
  const pattern = [5, 4, 3, 6, 3, 3]; // sums of 12 per row cycle
  return pattern[i % pattern.length] ?? 4;
}

function ConfidenceBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9.5px] tabular-nums tracking-[0.06em]" style={{ color: '#9b9590' }}>
        {value}%
      </span>
      <div
        className="w-12 h-[3px] rounded-full overflow-hidden"
        style={{ background: 'rgba(200,169,110,0.15)' }}
      >
        <div
          className="h-full rounded-full animate-score-fill"
          style={{
            width: `${value}%`,
            background: accent,
          }}
        />
      </div>
    </div>
  );
}
