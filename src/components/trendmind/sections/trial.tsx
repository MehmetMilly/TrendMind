'use client';

// Trial — the emotional centerpiece.
// This section is where TrendMind shows that it is not just "write an ad."
// It is a small audience-simulation theatre: the selected variant goes on
// a lit stage, synthetic personas react one by one, verdicts form, and
// the user sees the campaign meet its audience before it meets the world.
//
// Theatrical, not chaotic. Still inside the scrolling artifact, but with
// a darker, more immersive surface.

import React, { useMemo } from 'react';
import { SectionShell, Attribution } from './section-shell';
import {
  AGENTS,
  DRAFT_ATOMS,
  DRAFT_VARIANTS,
  PERSONAS,
  TRIAL_REACTIONS,
} from '@/lib/campaign-data';
import { useStore } from '@/lib/workspace-store';

export function TrialSection() {
  const {
    selectedVariantId,
    trialPhase,
    trialTick,
    startTrial,
    resetTrial,
    openInspector,
  } = useStore();

  const variant = DRAFT_VARIANTS.find((v) => v.id === selectedVariantId) ?? DRAFT_VARIANTS[0];
  const hook = DRAFT_ATOMS.find((a) => a.id === variant.hookId);
  const body = DRAFT_ATOMS.find((a) => a.id === variant.bodyId);
  const cta = DRAFT_ATOMS.find((a) => a.id === variant.ctaId);

  const reactions = useMemo(
    () => TRIAL_REACTIONS.filter((r) => r.variantId === variant.id),
    [variant.id],
  );

  const revealed = trialPhase === 'complete' ? reactions.length : Math.min(trialTick, reactions.length);

  // Verdict — soft aggregation
  const verdict = useMemo(() => {
    const shown = reactions.slice(0, revealed);
    if (shown.length === 0) return null;
    const avg =
      shown.reduce((acc, r) => acc + (r.subScores.clarity + r.subScores.feel + r.subScores.intent) / 3, 0) /
      shown.length;
    const loves = shown.filter((r) => r.sentiment === 'love').length;
    return { avg, loves, total: shown.length };
  }, [reactions, revealed]);

  const right = (
    <div className="flex items-center gap-2">
      <Attribution agentShort={AGENTS.critic.short} accent={AGENTS.critic.accent} extra="judging" />
      <div className="flex items-center gap-1">
        {trialPhase === 'idle' && (
          <button
            onClick={startTrial}
            className="px-3 py-1 rounded-md text-[11px] font-medium tracking-[0.04em] transition-all"
            style={{
              color: '#f0e8d8',
              background: 'linear-gradient(160deg, #c8a96e, #a68b4b)',
              boxShadow: '0 2px 8px rgba(200,169,110,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            ▸ Run trial
          </button>
        )}
        {trialPhase === 'running' && (
          <button
            onClick={resetTrial}
            className="px-3 py-1 rounded-md text-[11px] font-medium tracking-[0.04em]"
            style={{
              color: '#dcc487',
              background: 'rgba(200,169,110,0.1)',
              border: '1px solid rgba(200,169,110,0.3)',
            }}
          >
            Pause
          </button>
        )}
        {trialPhase === 'complete' && (
          <button
            onClick={resetTrial}
            className="px-3 py-1 rounded-md text-[11px] font-medium tracking-[0.04em]"
            style={{
              color: '#dcc487',
              background: 'rgba(200,169,110,0.1)',
              border: '1px solid rgba(200,169,110,0.3)',
            }}
          >
            Re-run
          </button>
        )}
      </div>
    </div>
  );

  return (
    <SectionShell
      id="trial"
      tagline="Synthetic audience simulation — the campaign meets its audience before the world does"
      rightSlot={right}
      dramatic
    >
      {/* The theatre — a darker, lit stage */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            'radial-gradient(800px 400px at 50% 10%, rgba(200,169,110,0.18), transparent 60%), ' +
            'linear-gradient(180deg, #1a2f26 0%, #14241d 100%)',
          border: '1px solid rgba(200,169,110,0.22)',
          boxShadow: '0 20px 50px rgba(20,36,29,0.3), inset 0 1px 0 rgba(200,169,110,0.15)',
        }}
      >
        {/* Stage lights / ambient glow */}
        <StageLights active={trialPhase !== 'idle'} />

        {/* Center stage — the variant on trial */}
        <div className="relative px-6 pt-7 pb-5">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase" style={{ color: '#dcc487' }}>
              <span className="w-1 h-1 rounded-full animate-pulse-dot" style={{ background: '#dcc487' }} />
              On stage
              <span style={{ color: 'rgba(220,196,135,0.5)' }}>·</span>
              <span>Variant {variant.id.replace('v', '')}</span>
            </div>
          </div>

          <div className="max-w-[680px] mx-auto text-center space-y-3">
            <p
              className="text-[24px] leading-[1.25] tracking-[-0.01em] italic"
              style={{ fontFamily: 'var(--font-heading)', color: '#f5e8c8' }}
            >
              “{hook?.text}”
            </p>
            <p className="text-[13.5px] leading-[1.65]" style={{ color: 'rgba(240,232,216,0.78)' }}>
              {body?.text}
            </p>
            <p
              className="text-[12px] tracking-[0.04em] font-medium pt-1"
              style={{ color: '#c8a96e' }}
            >
              {cta?.text}
            </p>
          </div>

          {/* Verdict meter */}
          {verdict && (
            <div className="mt-5 flex items-center justify-center">
              <VerdictMeter verdict={verdict} running={trialPhase === 'running'} />
            </div>
          )}
        </div>

        {/* Audience grid */}
        <div
          className="relative px-5 pt-4 pb-5"
          style={{
            borderTop: '1px solid rgba(200,169,110,0.15)',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 100%)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-[0.22em] uppercase font-medium" style={{ color: 'rgba(220,196,135,0.7)' }}>
              Audience · {PERSONAS.length} synthetic personas
            </span>
            <span className="text-[10px] tabular-nums" style={{ color: 'rgba(220,196,135,0.55)' }}>
              {revealed}/{reactions.length} reactions in
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {PERSONAS.map((p, i) => {
              const reaction = reactions.find((r) => r.personaId === p.id);
              const reactionIndex = reactions.findIndex((r) => r.personaId === p.id);
              const hasSpoken = reactionIndex > -1 && reactionIndex < revealed;
              return (
                <PersonaStall
                  key={p.id}
                  name={p.name}
                  oneLiner={p.oneLiner}
                  glyph={p.glyph}
                  accent={p.accent}
                  hasSpoken={hasSpoken}
                  sentiment={hasSpoken ? reaction!.sentiment : 'idle'}
                  quote={hasSpoken ? reaction!.quote : undefined}
                  subScores={hasSpoken ? reaction!.subScores : undefined}
                  onOpen={() => openInspector('persona', p.id)}
                  order={i}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom control strip */}
        <div
          className="px-5 py-2.5 flex items-center justify-between"
          style={{
            borderTop: '1px solid rgba(200,169,110,0.15)',
            background: 'rgba(0,0,0,0.15)',
          }}
        >
          <div className="flex items-center gap-4 text-[10.5px] tracking-[0.14em] uppercase" style={{ color: 'rgba(220,196,135,0.6)' }}>
            <StatusChip
              label={trialPhase === 'idle' ? 'Waiting' : trialPhase === 'running' ? 'Running' : 'Complete'}
              active={trialPhase !== 'idle'}
            />
            <span>{reactions.length} reactions modeled</span>
            <span>variants compared: 3</span>
          </div>
          <div className="flex items-center gap-3 text-[10.5px]" style={{ color: 'rgba(220,196,135,0.55)' }}>
            <span>Reactions based on persona model · not real users</span>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

// ── Persona card ─────────────────────────────────────────────────────

function PersonaStall({
  name,
  oneLiner,
  glyph,
  accent,
  hasSpoken,
  sentiment,
  quote,
  subScores,
  onOpen,
  order,
}: {
  name: string;
  oneLiner: string;
  glyph: string;
  accent: string;
  hasSpoken: boolean;
  sentiment: 'love' | 'warm' | 'neutral' | 'cold' | 'idle';
  quote?: string;
  subScores?: { clarity: number; feel: number; intent: number };
  onOpen: () => void;
  order: number;
}) {
  const sColor = sentimentColor(sentiment);
  return (
    <button
      onClick={onOpen}
      className="group text-left rounded-xl p-3 flex flex-col gap-2 transition-all duration-300"
      style={{
        background: hasSpoken
          ? 'linear-gradient(180deg, rgba(200,169,110,0.1) 0%, rgba(30,58,47,0.35) 100%)'
          : 'rgba(30,58,47,0.4)',
        border: hasSpoken ? `1px solid ${accent}55` : '1px solid rgba(200,169,110,0.12)',
        boxShadow: hasSpoken ? `0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 ${accent}30` : 'none',
        transform: hasSpoken ? 'translateY(0)' : 'translateY(2px)',
        opacity: hasSpoken ? 1 : 0.72,
        animationDelay: `${order * 80}ms`,
      }}
    >
      {/* Head */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{
            color: hasSpoken ? '#1e3a2f' : accent,
            background: hasSpoken ? accent : 'rgba(200,169,110,0.08)',
            border: hasSpoken ? `1px solid ${accent}` : `1px solid ${accent}30`,
          }}
        >
          {glyph}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11.5px] leading-none truncate" style={{ color: hasSpoken ? '#f5e8c8' : 'rgba(245,232,200,0.6)', fontWeight: 500 }}>
            {name}
          </div>
          <div className="text-[9.5px] mt-1 truncate" style={{ color: 'rgba(220,196,135,0.5)' }}>
            {oneLiner}
          </div>
        </div>
        {hasSpoken && (
          <span
            className="text-[9px] tracking-[0.18em] uppercase font-semibold px-1 py-0.5 rounded"
            style={{ color: sColor, background: `${sColor}22` }}
          >
            {sentiment}
          </span>
        )}
      </div>

      {/* Quote */}
      <div
        className="relative min-h-[54px] text-[11.5px] leading-[1.5] italic px-1 pt-1"
        style={{
          color: hasSpoken ? '#f5e8c8' : 'rgba(245,232,200,0.25)',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {hasSpoken ? (
          <span className="animate-fade-in block">{quote}</span>
        ) : (
          <ThinkingDots />
        )}
      </div>

      {/* Sub scores */}
      {hasSpoken && subScores && (
        <div className="grid grid-cols-3 gap-2 pt-1" style={{ borderTop: '1px solid rgba(200,169,110,0.1)' }}>
          <SubScore label="Clar" value={subScores.clarity} accent={accent} />
          <SubScore label="Feel" value={subScores.feel} accent={accent} />
          <SubScore label="Intent" value={subScores.intent} accent={accent} />
        </div>
      )}
    </button>
  );
}

function SubScore({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between mb-0.5">
        <span className="text-[8.5px] tracking-[0.18em] uppercase" style={{ color: 'rgba(220,196,135,0.5)' }}>
          {label}
        </span>
        <span className="text-[9.5px] tabular-nums" style={{ color: accent }}>
          {value}
        </span>
      </div>
      <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(200,169,110,0.1)' }}>
        <div
          className="h-full animate-score-fill"
          style={{ width: `${value}%`, background: accent }}
        />
      </div>
    </div>
  );
}

// ── Verdict meter ────────────────────────────────────────────────────

function VerdictMeter({
  verdict,
  running,
}: {
  verdict: { avg: number; loves: number; total: number };
  running: boolean;
}) {
  return (
    <div
      className="flex items-center gap-5 px-5 py-2.5 rounded-full"
      style={{
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(200,169,110,0.28)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[9.5px] tracking-[0.18em] uppercase" style={{ color: 'rgba(220,196,135,0.65)' }}>
          Verdict
        </span>
        <span
          className="text-[20px] tabular-nums leading-none animate-score-tick"
          key={Math.round(verdict.avg)}
          style={{ color: '#f5e8c8', fontFamily: 'var(--font-heading)' }}
        >
          {Math.round(verdict.avg)}
        </span>
        <span className="text-[10.5px]" style={{ color: 'rgba(220,196,135,0.55)' }}>
          / 100
        </span>
      </div>
      <div className="w-px h-5" style={{ background: 'rgba(200,169,110,0.22)' }} />
      <div className="text-[10.5px] tracking-[0.08em]" style={{ color: 'rgba(220,196,135,0.7)' }}>
        <span style={{ color: '#dcc487', fontWeight: 600 }}>{verdict.loves}</span> loved ·{' '}
        <span style={{ color: '#dcc487', fontWeight: 600 }}>{verdict.total}</span> heard
      </div>
      {running && (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#4a9070' }} />
          <span className="text-[10px] tracking-[0.14em] uppercase" style={{ color: '#4a9070' }}>
            Forming
          </span>
        </div>
      )}
    </div>
  );
}

// ── Stage lights ─────────────────────────────────────────────────────

function StageLights({ active }: { active: boolean }) {
  return (
    <>
      <div
        className="pointer-events-none absolute top-0 left-1/4 w-[320px] h-[180px]"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(220,196,135,0.22), transparent 70%)',
          opacity: active ? 1 : 0.6,
          transition: 'opacity 0.4s ease-out',
        }}
      />
      <div
        className="pointer-events-none absolute top-0 right-1/4 w-[320px] h-[180px]"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(61,122,95,0.14), transparent 70%)',
          opacity: active ? 1 : 0.6,
          transition: 'opacity 0.4s ease-out',
        }}
      />
    </>
  );
}

// ── Tiny pieces ──────────────────────────────────────────────────────

function StatusChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? 'animate-pulse-dot' : ''}`}
        style={{ background: active ? '#4a9070' : 'rgba(220,196,135,0.4)' }}
      />
      <span style={{ color: active ? '#dcc487' : 'rgba(220,196,135,0.6)' }}>{label}</span>
    </span>
  );
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 h-full pt-2">
      <Dot delay={0} />
      <Dot delay={180} />
      <Dot delay={360} />
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="w-1 h-1 rounded-full animate-pulse-dot"
      style={{ background: 'rgba(220,196,135,0.45)', animationDelay: `${delay}ms` }}
    />
  );
}

function sentimentColor(s: string) {
  if (s === 'love')    return '#8fd3a8';
  if (s === 'warm')    return '#dcc487';
  if (s === 'neutral') return '#b0a99e';
  if (s === 'cold')    return '#b58a7a';
  return '#6b6560';
}
