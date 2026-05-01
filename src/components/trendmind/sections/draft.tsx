'use client';

// Draft — construction, not paragraphs.
// Top: a compact kit of hooks / bodies / CTAs the system has produced.
// Bottom: three composed variants where the user can see construction,
// compare scores, and read inline critic notes attached to the piece
// that earned them.

import React from 'react';
import { SectionShell, Attribution } from './section-shell';
import {
  AGENTS,
  DRAFT_ATOMS,
  DRAFT_VARIANTS,
  DraftAtom,
  DraftVariant,
  ANGLES,
} from '@/lib/campaign-data';
import { useStore } from '@/lib/workspace-store';

export function DraftSection() {
  const { selectedVariantId, setSelectedVariantId, openInspector } = useStore();

  const hooks = DRAFT_ATOMS.filter((a) => a.kind === 'hook');
  const bodies = DRAFT_ATOMS.filter((a) => a.kind === 'body');
  const ctas = DRAFT_ATOMS.filter((a) => a.kind === 'cta');

  const right = (
    <div className="flex items-center gap-2">
      <Attribution agentShort={AGENTS.architects.short} accent={AGENTS.architects.accent} extra="writing" />
      <span className="text-[11px]" style={{ color: '#9b9590' }}>·</span>
      <Attribution agentShort={AGENTS.critic.short} accent={AGENTS.critic.accent} extra="scoring" />
    </div>
  );

  return (
    <SectionShell
      id="draft"
      tagline="A kit of pieces and three composed variants — hover to see construction"
      rightSlot={right}
    >
      {/* Construction kit */}
      <div
        className="grid grid-cols-[1fr_1.6fr_1fr] gap-0 rounded-xl overflow-hidden mb-5"
        style={{
          background: '#fbf8f2',
          border: '1px solid #e4ded4',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        }}
      >
        <AtomColumn title="Hooks"  atoms={hooks}  onSelect={(id) => openInspector('draft-atom', id)} />
        <AtomColumn title="Bodies" atoms={bodies} onSelect={(id) => openInspector('draft-atom', id)} border />
        <AtomColumn title="CTAs"   atoms={ctas}   onSelect={(id) => openInspector('draft-atom', id)} border />
      </div>

      {/* Variants — composed */}
      <div className="grid grid-cols-3 gap-3">
        {DRAFT_VARIANTS.map((v) => (
          <VariantCard
            key={v.id}
            variant={v}
            selected={selectedVariantId === v.id}
            onSelect={() => setSelectedVariantId(v.id)}
            onOpen={() => openInspector('variant', v.id)}
          />
        ))}
      </div>
    </SectionShell>
  );
}

function AtomColumn({
  title,
  atoms,
  onSelect,
  border,
}: {
  title: string;
  atoms: DraftAtom[];
  onSelect: (id: string) => void;
  border?: boolean;
}) {
  return (
    <div
      className="flex flex-col"
      style={border ? { borderLeft: '1px solid #eae3d6' } : undefined}
    >
      <div
        className="px-3.5 py-2 flex items-center justify-between"
        style={{ borderBottom: '1px solid #eae3d6', background: '#f5f1ea' }}
      >
        <span
          className="text-[10px] tracking-[0.18em] uppercase font-semibold"
          style={{ color: '#a68b4b' }}
        >
          {title}
        </span>
        <span className="text-[10px] tabular-nums" style={{ color: '#9b9590' }}>
          {atoms.length}
        </span>
      </div>
      <div className="p-2 space-y-1.5">
        {atoms.map((a) => (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className="w-full text-left px-2.5 py-2 rounded-md transition-all text-[12.5px] leading-[1.45] relative group"
            style={{
              color: '#2c2c2c',
              background: '#fbf8f2',
              border: '1px solid #eae3d6',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#faf3e3';
              e.currentTarget.style.borderColor = '#d8c79a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fbf8f2';
              e.currentTarget.style.borderColor = '#eae3d6';
            }}
          >
            {a.text}
            {a.note && (
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: '#b7863f' }}
                title={a.note}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function VariantCard({
  variant,
  selected,
  onSelect,
  onOpen,
}: {
  variant: DraftVariant;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const hook = DRAFT_ATOMS.find((a) => a.id === variant.hookId);
  const body = DRAFT_ATOMS.find((a) => a.id === variant.bodyId);
  const cta = DRAFT_ATOMS.find((a) => a.id === variant.ctaId);
  const angle = ANGLES.find((a) => a.id === variant.angleId);

  const scoreAccent =
    variant.score >= 90 ? '#3d7a5f' : variant.score >= 80 ? '#a68b4b' : '#8a6a5a';

  return (
    <div
      onClick={onSelect}
      className="relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer animate-rise-in"
      style={{
        background: '#fbf8f2',
        border: selected ? '1px solid #3d7a5f' : '1px solid #e4ded4',
        boxShadow: selected
          ? '0 8px 24px rgba(61,122,95,0.15), 0 1px 2px rgba(0,0,0,0.03)'
          : '0 1px 2px rgba(0,0,0,0.02)',
        transform: selected ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5"
        style={{ borderBottom: '1px solid #eae3d6', background: '#f5f1ea' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] tracking-[0.18em] uppercase font-semibold"
            style={{ color: '#a68b4b' }}
          >
            Variant {variant.id.replace('v', '')}
          </span>
          <span className="text-[10.5px]" style={{ color: '#9b9590' }}>
            · Angle {variant.angleId.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="px-1.5 py-0.5 rounded-md text-[11px] font-semibold tabular-nums"
            style={{
              color: scoreAccent,
              background: `${scoreAccent}12`,
              border: `1px solid ${scoreAccent}30`,
            }}
          >
            {variant.score}
          </div>
          {selected && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{ background: '#3d7a5f' }}
              title="Elevated to Studio & Launch"
            />
          )}
        </div>
      </div>

      {/* Composition (stacked pieces with faint chips of origin) */}
      <div className="p-3.5 space-y-3">
        <Piece label="HOOK"  text={hook?.text}  />
        <Piece label="BODY"  text={body?.text}  note={body?.note} />
        <Piece label="CTA"   text={cta?.text}   small />
      </div>

      {/* Angle tag */}
      {angle && (
        <div className="px-3.5 pb-3">
          <span className="text-[10.5px]" style={{ color: '#9b9590' }}>
            Built from <span style={{ color: '#1e3a2f', fontWeight: 500 }}>{angle.name}</span>
          </span>
        </div>
      )}

      {/* Critiques inline */}
      <div
        className="px-3.5 py-2.5"
        style={{ background: 'rgba(200,169,110,0.05)', borderTop: '1px solid #eae3d6' }}
      >
        {variant.critiques.map((c, i) => {
          const agent = AGENTS[c.agent];
          return (
            <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
              <span
                className="text-[9.5px] font-semibold tracking-[0.05em] px-1 py-0.5 rounded mt-[1px]"
                style={{ color: agent.accent, background: `${agent.accent}14` }}
              >
                {agent.short}
              </span>
              <span className="text-[11.5px] leading-[1.45]" style={{ color: '#3a3631' }}>
                {c.note}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div
        className="px-3.5 py-2 flex items-center justify-between"
        style={{ borderTop: '1px solid #eae3d6' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="text-[11px] font-medium tracking-[0.04em] transition-colors"
          style={{ color: '#6b6560' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1e3a2f')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b6560')}
        >
          Inspect →
        </button>
        <span className="text-[10.5px] tracking-[0.1em] uppercase" style={{ color: selected ? '#3d7a5f' : '#b0a99e' }}>
          {selected ? 'Elevated' : 'Tap to elevate'}
        </span>
      </div>
    </div>
  );
}

function Piece({
  label,
  text,
  note,
  small,
}: {
  label: string;
  text?: string;
  note?: string;
  small?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-[9px] tracking-[0.2em] uppercase font-semibold"
          style={{ color: '#b0a99e' }}
        >
          {label}
        </span>
        {note && (
          <span
            className="text-[9.5px] italic"
            style={{ color: '#b7863f' }}
            title={note}
          >
            note
          </span>
        )}
      </div>
      <p
        className={`leading-[1.5] ${small ? 'text-[12px]' : 'text-[13px]'}`}
        style={{
          color: '#2c2c2c',
          fontFamily: label === 'HOOK' ? 'var(--font-heading)' : undefined,
          fontStyle: label === 'HOOK' ? 'italic' : undefined,
        }}
      >
        {text}
      </p>
    </div>
  );
}
