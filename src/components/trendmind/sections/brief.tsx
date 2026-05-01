'use client';

// Brief — the source of truth block.
// Compact, dense, inline-editable. No hero, no giant title, no wasted
// first screen. The whole point is to make the campaign essentials
// controllable and make downstream edits *meaningful*.

import React from 'react';
import { SectionShell, Attribution } from './section-shell';
import { AGENTS } from '@/lib/campaign-data';
import { useStore } from '@/lib/workspace-store';

export function BriefSection() {
  const { brief, updateBrief } = useStore();

  return (
    <SectionShell id="brief" tagline="Source of truth — everything downstream reads from here">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #faf7f2 0%, #f5f1ea 100%)',
          border: '1px solid #e4ded4',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        }}
      >
        {/* Top row — campaign + brand + platform */}
        <div
          className="grid grid-cols-[1.4fr_1fr_0.9fr] gap-0"
          style={{ borderBottom: '1px solid #eae3d6' }}
        >
          <Field
            label="Campaign"
            value={brief.campaign}
            onChange={(v) => updateBrief('campaign', v)}
            heading
          />
          <Field
            label="Brand"
            value={brief.brand}
            onChange={(v) => updateBrief('brand', v)}
            border
          />
          <Field
            label="Platform"
            value={brief.platform}
            onChange={(v) => updateBrief('platform', v)}
            border
          />
        </div>

        {/* Goal — the single most important editable line */}
        <BigField
          label="Goal"
          value={brief.goal}
          onChange={(v) => updateBrief('goal', v)}
        />

        {/* Audience */}
        <BigField
          label="Audience"
          value={brief.audience}
          onChange={(v) => updateBrief('audience', v)}
        />

        {/* Tone + Pillars + Avoid row */}
        <div
          className="grid grid-cols-[1fr_1.2fr_1fr]"
          style={{ borderTop: '1px solid #eae3d6' }}
        >
          <Field
            label="Tone"
            value={brief.tone}
            onChange={(v) => updateBrief('tone', v)}
          />
          <ChipField
            label="Pillars"
            values={brief.pillars}
            onChange={(vals) => updateBrief('pillars', vals)}
            accent="#3d7a5f"
            border
          />
          <ChipField
            label="Avoid"
            values={brief.avoid}
            onChange={(vals) => updateBrief('avoid', vals)}
            accent="#8a6a5a"
            border
          />
        </div>

        {/* Context — longform, editorial */}
        <BigField
          label="Context"
          value={brief.context}
          onChange={(v) => updateBrief('context', v)}
          soft
        />

        {/* Footer row — attribution + downstream note */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderTop: '1px solid #eae3d6', background: '#f0ebe1' }}
        >
          <Attribution agentShort={AGENTS.director.short} accent={AGENTS.director.accent} extra="orchestrating" />
          <div className="flex items-center gap-2 text-[11px]" style={{ color: '#6b6560' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4a9070' }} />
            Research, Strategy, Draft, Trial, Studio, Launch all read from this
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function Field({
  label,
  value,
  onChange,
  heading,
  border,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  heading?: boolean;
  border?: boolean;
}) {
  return (
    <label
      className="relative block px-4 py-3 group"
      style={border ? { borderLeft: '1px solid #eae3d6' } : undefined}
    >
      <span
        className="block text-[10px] tracking-[0.18em] uppercase font-semibold mb-1.5"
        style={{ color: '#9b9590' }}
      >
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent outline-none"
        style={{
          color: '#2c2c2c',
          fontSize: heading ? '16px' : '13.5px',
          fontFamily: heading ? 'var(--font-heading)' : undefined,
          letterSpacing: heading ? '-0.01em' : undefined,
        }}
      />
    </label>
  );
}

function BigField({
  label,
  value,
  onChange,
  soft,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  soft?: boolean;
}) {
  return (
    <label
      className="block px-4 py-3"
      style={{ borderTop: '1px solid #eae3d6' }}
    >
      <span
        className="block text-[10px] tracking-[0.18em] uppercase font-semibold mb-1.5"
        style={{ color: '#9b9590' }}
      >
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={soft ? 2 : 2}
        className="w-full bg-transparent outline-none resize-none leading-[1.5]"
        style={{
          color: soft ? '#4a4540' : '#2c2c2c',
          fontSize: '13.5px',
          fontStyle: soft ? 'italic' : 'normal',
          fontFamily: soft ? 'var(--font-heading)' : undefined,
        }}
      />
    </label>
  );
}

function ChipField({
  label,
  values,
  onChange,
  accent,
  border,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  accent: string;
  border?: boolean;
}) {
  const [draft, setDraft] = React.useState('');
  return (
    <div
      className="px-4 py-3"
      style={border ? { borderLeft: '1px solid #eae3d6' } : undefined}
    >
      <span
        className="block text-[10px] tracking-[0.18em] uppercase font-semibold mb-1.5"
        style={{ color: '#9b9590' }}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11.5px] font-medium tracking-[0.01em] group cursor-default"
            style={{
              color: accent,
              background: `${accent}12`,
              border: `1px solid ${accent}28`,
            }}
          >
            {v}
            <button
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="opacity-40 hover:opacity-100 transition-opacity"
              title="Remove"
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M2 2L7 7M7 2L2 7" />
              </svg>
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && draft.trim()) {
              onChange([...values, draft.trim()]);
              setDraft('');
            }
          }}
          placeholder="+ add"
          className="bg-transparent outline-none text-[11.5px] px-1 w-16"
          style={{ color: '#6b6560' }}
        />
      </div>
    </div>
  );
}
