'use client';

// Selection-aware Inspector. Hidden by default. When the user selects a
// research item, angle, draft atom, variant, persona, or studio layer,
// this panel slides in with the right depth for that exact thing.

import React from 'react';
import { useStore } from '@/lib/workspace-store';
import {
  AGENTS,
  ANGLES,
  DRAFT_ATOMS,
  DRAFT_VARIANTS,
  PERSONAS,
  RESEARCH,
  STUDIO_LAYERS,
  TRIAL_REACTIONS,
} from '@/lib/campaign-data';

export function Inspector() {
  const { inspector, closeInspector } = useStore();
  const open = inspector.kind !== null;

  return (
    <>
      {/* Soft dim backdrop — sits inside the rounded shell */}
      <div
        onClick={closeInspector}
        className="absolute inset-0 bg-black/10 transition-opacity duration-200 z-[45]"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />
      <aside
        className="absolute top-0 right-0 h-full z-[50] flex flex-col transition-transform duration-300 ease-out"
        style={{
          width: 'min(420px, 38vw)',
          transform: open ? 'translateX(0)' : 'translateX(105%)',
          background: '#faf7f2',
          borderLeft: '1px solid #d8d0c4',
          boxShadow: open ? '-24px 0 60px rgba(0,0,0,0.12), -2px 0 10px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* Header */}
        <header
          className="flex items-center justify-between px-5 h-[44px] flex-shrink-0"
          style={{ borderBottom: '1px solid #e4ded4', background: '#f5f1ea' }}
        >
          <div className="flex items-center gap-2 text-[10.5px] tracking-[0.18em] uppercase font-medium" style={{ color: '#9b9590' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c8a96e' }} />
            Inspector
            {inspector.kind && (
              <span style={{ color: '#6b6560' }}>· {kindLabel(inspector.kind)}</span>
            )}
          </div>
          <button
            onClick={closeInspector}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
            style={{ color: '#6b6560' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,169,110,0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            title="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3L11 11M11 3L3 11" />
            </svg>
          </button>
        </header>

        {/* Body — per-kind content */}
        <div className="flex-1 overflow-y-auto">
          {open && <InspectorBody kind={inspector.kind} id={inspector.id} />}
        </div>
      </aside>
    </>
  );
}

function kindLabel(k: string) {
  switch (k) {
    case 'research':   return 'Research';
    case 'angle':      return 'Angle';
    case 'draft-atom': return 'Draft piece';
    case 'variant':    return 'Variant';
    case 'persona':    return 'Persona';
    case 'layer':      return 'Layer';
    default:           return '';
  }
}

function InspectorBody({
  kind,
  id,
}: {
  kind: ReturnType<typeof useStore>['inspector']['kind'];
  id: string | null;
}) {
  if (!kind || !id) return null;

  if (kind === 'research') {
    const item = RESEARCH.find((r) => r.id === id);
    if (!item) return null;
    const agent = AGENTS[item.by];
    return (
      <Frame>
        <KindHeader title={item.title} sub={`${kindDotColor(item.kind)} ${item.kind}`} />
        <p className="text-[13px] leading-[1.65]" style={{ color: '#3a3631' }}>
          {item.summary}
        </p>
        <Divider />
        <MetaRow label="Source" value={item.source} />
        <MetaRow label="Confidence" value={`${item.confidence}%`} />
        <MetaRow label="Attribution" value={`${agent.name}`} accent={agent.accent} />
        <Divider />
        <Section title="Why this matters">
          <p className="text-[12.5px] leading-[1.6]" style={{ color: '#6b6560' }}>
            This signal is feeding the{' '}
            <em style={{ color: '#2c2c2c', fontStyle: 'normal', fontWeight: 500 }}>
              {item.kind === 'trend' ? 'Strategy angle selection' : 'campaign framing'}
            </em>{' '}
            and has been promoted into the Strategy section.
          </p>
        </Section>
        <ActionRow>
          <BtnPrimary>Use in Strategy</BtnPrimary>
          <BtnGhost>Dismiss signal</BtnGhost>
        </ActionRow>
      </Frame>
    );
  }

  if (kind === 'angle') {
    const a = ANGLES.find((x) => x.id === id);
    if (!a) return null;
    return (
      <Frame>
        <KindHeader title={a.name} sub={`Angle ${a.letter}`} />
        <p className="text-[13px] italic leading-[1.6]" style={{ color: '#3a3631', fontFamily: 'var(--font-heading)' }}>
          “{a.hook}”
        </p>
        <Divider />
        <Section title="Stance">
          <p className="text-[12.5px] leading-[1.6]" style={{ color: '#6b6560' }}>{a.stance}</p>
        </Section>
        <Section title="Promise">
          <p className="text-[12.5px] leading-[1.6]" style={{ color: '#6b6560' }}>{a.promise}</p>
        </Section>
        <Section title="Supports">
          <ul className="text-[12.5px] leading-[1.6] space-y-1.5" style={{ color: '#3a3631' }}>
            {a.support.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: '#c8a96e' }}>—</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Risk">
          <p className="text-[12.5px] leading-[1.6]" style={{ color: '#8a6a5a' }}>{a.risk}</p>
        </Section>
        <Divider />
        <MetaRow label="Lead signal" value={`Research · ${a.leadSignal.toUpperCase()}`} />
      </Frame>
    );
  }

  if (kind === 'draft-atom') {
    const atom = DRAFT_ATOMS.find((x) => x.id === id);
    if (!atom) return null;
    return (
      <Frame>
        <KindHeader title={atom.kind.toUpperCase()} sub="Draft piece" />
        <div
          className="px-4 py-3 rounded-lg text-[13.5px] leading-[1.6]"
          style={{ background: '#f0ebe1', color: '#2c2c2c', border: '1px solid #e4ded4' }}
        >
          {atom.text}
        </div>
        {atom.note && (
          <Section title="Critic note">
            <p className="text-[12.5px] leading-[1.6]" style={{ color: '#8a6a5a' }}>
              {atom.note}
            </p>
          </Section>
        )}
        <ActionRow>
          <BtnPrimary>Use in variant</BtnPrimary>
          <BtnGhost>Ask for alternates</BtnGhost>
        </ActionRow>
      </Frame>
    );
  }

  if (kind === 'variant') {
    const v = DRAFT_VARIANTS.find((x) => x.id === id);
    if (!v) return null;
    const hook = DRAFT_ATOMS.find((a) => a.id === v.hookId);
    const body = DRAFT_ATOMS.find((a) => a.id === v.bodyId);
    const cta = DRAFT_ATOMS.find((a) => a.id === v.ctaId);
    return (
      <Frame>
        <KindHeader title={`Variant ${v.id.toUpperCase()}`} sub={`Angle ${v.angleId.toUpperCase()} · ${v.score}/100`} />
        <Section title="Composition">
          <StackLine label="Hook" text={hook?.text} />
          <StackLine label="Body" text={body?.text} />
          <StackLine label="CTA"  text={cta?.text} />
        </Section>
        <Section title="Critiques">
          <div className="space-y-2">
            {v.critiques.map((c, i) => {
              const agent = AGENTS[c.agent];
              return (
                <div key={i} className="flex gap-2 items-start">
                  <span
                    className="text-[10px] font-semibold tracking-[0.04em] rounded px-1.5 py-0.5 mt-0.5"
                    style={{ color: agent.accent, background: `${agent.accent}14` }}
                  >
                    {agent.short}
                  </span>
                  <p className="text-[12.5px] leading-[1.55]" style={{ color: '#3a3631' }}>
                    {c.note}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>
      </Frame>
    );
  }

  if (kind === 'persona') {
    const p = PERSONAS.find((x) => x.id === id);
    if (!p) return null;
    const reactions = TRIAL_REACTIONS.filter((r) => r.personaId === p.id);
    return (
      <Frame>
        <KindHeader title={p.name} sub="Synthetic persona" />
        <p className="text-[13px] leading-[1.6]" style={{ color: '#3a3631' }}>
          {p.oneLiner}
        </p>
        <Divider />
        <Section title="Reactions across variants">
          <div className="space-y-2">
            {reactions.map((r) => (
              <div
                key={r.variantId}
                className="px-3 py-2 rounded-md"
                style={{ background: '#f0ebe1', border: '1px solid #e4ded4' }}
              >
                <div className="flex items-center justify-between mb-1 text-[10.5px] tracking-[0.06em] uppercase" style={{ color: '#9b9590' }}>
                  <span>Variant {r.variantId.replace('v', '')}</span>
                  <span style={{ color: sentimentColor(r.sentiment) }}>{r.sentiment}</span>
                </div>
                <p className="text-[12.5px] italic leading-[1.55]" style={{ color: '#3a3631', fontFamily: 'var(--font-heading)' }}>
                  {r.quote}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </Frame>
    );
  }

  if (kind === 'layer') {
    const l = STUDIO_LAYERS.find((x) => x.id === id);
    if (!l) return null;
    return (
      <Frame>
        <KindHeader title={l.name} sub={`Studio · ${l.kind}`} />
        <p className="text-[13px] leading-[1.6]" style={{ color: '#3a3631' }}>
          {l.note}
        </p>
        <Divider />
        <ActionRow>
          <BtnPrimary>Open in focus</BtnPrimary>
          <BtnGhost>Swap layer</BtnGhost>
        </ActionRow>
      </Frame>
    );
  }

  return null;
}

// ── Pieces ──────────────────────────────────────────────────────────

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="p-5 flex flex-col gap-4 animate-fade-in">{children}</div>;
}

function KindHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <div className="text-[10.5px] tracking-[0.18em] uppercase mb-1" style={{ color: '#9b9590' }}>{sub}</div>
      <h2
        className="text-[18px] leading-[1.25] tracking-[-0.01em]"
        style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
      >
        {title}
      </h2>
    </div>
  );
}

function Divider() {
  return <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #e4ded4 30%, #e4ded4 70%, transparent)' }} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] tracking-[0.18em] uppercase mb-2 font-medium" style={{ color: '#9b9590' }}>{title}</div>
      {children}
    </div>
  );
}

function MetaRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[12.5px]">
      <span style={{ color: '#9b9590' }}>{label}</span>
      <span style={{ color: accent ?? '#2c2c2c', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function StackLine({ label, text }: { label: string; text?: string }) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="text-[9.5px] tracking-[0.18em] uppercase mb-1" style={{ color: '#b0a99e' }}>
        {label}
      </div>
      <div
        className="px-3 py-2 rounded-md text-[12.5px] leading-[1.55]"
        style={{ background: '#f0ebe1', color: '#2c2c2c', border: '1px solid #e4ded4' }}
      >
        {text}
      </div>
    </div>
  );
}

function ActionRow({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 pt-2">{children}</div>;
}

function BtnPrimary({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="flex-1 px-3 py-2 rounded-md text-[12px] font-medium tracking-[0.02em] transition-all"
      style={{
        color: '#f0e8d8',
        background: 'linear-gradient(160deg, #2d5a47, #1e3a2f)',
        boxShadow: '0 2px 8px rgba(30,58,47,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {children}
    </button>
  );
}
function BtnGhost({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="flex-1 px-3 py-2 rounded-md text-[12px] font-medium tracking-[0.02em] transition-all"
      style={{
        color: '#6b6560',
        background: 'transparent',
        border: '1px solid #d8d0c4',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,169,110,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </button>
  );
}

function kindDotColor(kind: string) {
  return '·';
}

function sentimentColor(s: string) {
  if (s === 'love') return '#3d7a5f';
  if (s === 'warm') return '#a68b4b';
  if (s === 'neutral') return '#6b6560';
  return '#8a6a5a';
}
