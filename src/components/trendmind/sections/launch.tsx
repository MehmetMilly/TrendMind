'use client';

// Launch — the ending state.
// Read-first, presentation ready. Shows the elevated winner, alternates
// kept warm, platform adaptations, and risk/response notes carried
// forward from Trial. Natural bottom of the scrolling artifact.

import React from 'react';
import { SectionShell } from './section-shell';
import {
  ANGLES,
  DRAFT_ATOMS,
  DRAFT_VARIANTS,
  LAUNCH_FORMATS,
  TRIAL_REACTIONS,
} from '@/lib/campaign-data';
import { useStore } from '@/lib/workspace-store';

export function LaunchSection() {
  const { selectedVariantId } = useStore();
  const winner = DRAFT_VARIANTS.find((v) => v.id === selectedVariantId) ?? DRAFT_VARIANTS[0];
  const hook = DRAFT_ATOMS.find((a) => a.id === winner.hookId);
  const body = DRAFT_ATOMS.find((a) => a.id === winner.bodyId);
  const cta = DRAFT_ATOMS.find((a) => a.id === winner.ctaId);
  const winningAngle = ANGLES.find((a) => a.id === winner.angleId);

  const alternates = DRAFT_VARIANTS.filter((v) => v.id !== winner.id);
  const winnerReactions = TRIAL_REACTIONS.filter((r) => r.variantId === winner.id);

  const avg =
    winnerReactions.reduce((acc, r) => acc + (r.subScores.clarity + r.subScores.feel + r.subScores.intent) / 3, 0) /
    Math.max(1, winnerReactions.length);

  return (
    <SectionShell
      id="launch"
      tagline="Ready to ship — winner, alternates kept warm, platform adaptations, risks to watch"
      rightSlot={
        <button
          className="px-3 py-1.5 rounded-md text-[11.5px] font-medium tracking-[0.04em] transition-all"
          style={{
            color: '#f0e8d8',
            background: 'linear-gradient(160deg, #3d7a5f, #1e3a2f)',
            boxShadow: '0 4px 14px rgba(30,58,47,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          Ship this campaign
        </button>
      }
    >
      {/* Winner */}
      <div
        className="rounded-2xl overflow-hidden grid grid-cols-[1.2fr_1fr] gap-0"
        style={{
          background: 'linear-gradient(180deg, #faf7f2 0%, #f2ecdf 100%)',
          border: '1px solid #d8c79a',
          boxShadow: '0 8px 28px rgba(200,169,110,0.15), 0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        {/* Left — the copy */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] tracking-[0.22em] uppercase font-semibold px-1.5 py-0.5 rounded"
              style={{ color: '#1e3a2f', background: 'rgba(61,122,95,0.12)' }}
            >
              Selected winner
            </span>
            <span className="text-[10.5px]" style={{ color: '#9b9590' }}>
              · Angle {winner.angleId.toUpperCase()} · {winningAngle?.name}
            </span>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#b0a99e' }}>
              Hook
            </div>
            <p
              className="text-[26px] leading-[1.2] tracking-[-0.01em] italic"
              style={{ fontFamily: 'var(--font-heading)', color: '#1f1d1a' }}
            >
              “{hook?.text}”
            </p>
          </div>

          <div>
            <div className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: '#b0a99e' }}>
              Body
            </div>
            <p className="text-[14px] leading-[1.65]" style={{ color: '#3a3631' }}>
              {body?.text}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #eae3d6' }}>
            <span className="text-[12.5px] font-medium tracking-[0.04em]" style={{ color: '#a68b4b' }}>
              {cta?.text}
            </span>
            <div className="flex items-center gap-3 text-[10.5px] tabular-nums" style={{ color: '#6b6560' }}>
              <ScorePill label="Critic"   value={winner.score} />
              <ScorePill label="Audience" value={Math.round(avg)} />
            </div>
          </div>
        </div>

        {/* Right — the finished preview (miniature of Studio) */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #1a1612 0%, #2a1f16 100%)',
            borderLeft: '1px solid #d8c79a',
          }}
        >
          <MiniAd hook={hook?.text ?? ''} cta={cta?.text ?? ''} />
        </div>
      </div>

      {/* Platform adaptations */}
      <div className="mt-5">
        <SectionLabel>Platform adaptations</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {LAUNCH_FORMATS.map((f) => (
            <div
              key={f.id}
              className="rounded-xl p-3 flex flex-col gap-2"
              style={{
                background: '#fbf8f2',
                border: '1px solid #e4ded4',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-medium" style={{ color: '#2c2c2c' }}>
                  {f.name}
                </span>
                <span className="text-[10px] tabular-nums" style={{ color: '#9b9590' }}>
                  {f.sizeNote}
                </span>
              </div>
              <AdThumb ratio={f.ratio} hook={hook?.text ?? ''} />
            </div>
          ))}
        </div>
      </div>

      {/* Two columns: alternates + risks */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {/* Alternates kept warm */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#fbf8f2', border: '1px solid #e4ded4' }}
        >
          <SectionLabel>Alternates kept warm</SectionLabel>
          <ul className="space-y-2">
            {alternates.map((v) => {
              const h = DRAFT_ATOMS.find((a) => a.id === v.hookId);
              return (
                <li key={v.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10.5px] tracking-[0.14em] uppercase" style={{ color: '#9b9590' }}>
                      Variant {v.id.replace('v', '')} · Angle {v.angleId.toUpperCase()}
                    </div>
                    <p
                      className="text-[13px] leading-[1.45] italic truncate"
                      style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
                    >
                      “{h?.text}”
                    </p>
                  </div>
                  <span
                    className="text-[11px] tabular-nums font-semibold px-1.5 py-0.5 rounded"
                    style={{ color: '#a68b4b', background: 'rgba(200,169,110,0.1)' }}
                  >
                    {v.score}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Risks & responses */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#fbf8f2', border: '1px solid #e4ded4' }}
        >
          <SectionLabel>Risks to watch</SectionLabel>
          <ul className="space-y-2 text-[12.5px]" style={{ color: '#3a3631' }}>
            <RiskRow text={winningAngle?.risk ?? ''} tag="angle" />
            <RiskRow
              text="“Holiday” keyword over-saturates feeds after Nov 20. Schedule heaviest spend before then."
              tag="platform"
            />
            <RiskRow
              text="One persona (Skeptic) stayed cool. Prepare a quote-reply asset that addresses them directly."
              tag="audience"
            />
          </ul>
        </div>
      </div>

      {/* End stamp */}
      <div
        className="mt-6 flex items-center justify-center gap-3 text-[10.5px] tracking-[0.22em] uppercase"
        style={{ color: '#a68b4b' }}
      >
        <Line />
        <span>Campaign complete</span>
        <Line />
      </div>
    </SectionShell>
  );
}

// ── Pieces ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] tracking-[0.22em] uppercase font-semibold mb-2.5"
      style={{ color: '#a68b4b' }}
    >
      {children}
    </div>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <span
      className="px-1.5 py-0.5 rounded"
      style={{ background: 'rgba(200,169,110,0.12)', color: '#a68b4b' }}
    >
      {label} <span style={{ color: '#1e3a2f', fontWeight: 600 }}>{value}</span>
    </span>
  );
}

function RiskRow({ text, tag }: { text: string; tag: string }) {
  return (
    <li className="flex gap-2 items-start">
      <span
        className="mt-[3px] text-[9px] tracking-[0.18em] uppercase font-semibold px-1 py-0.5 rounded"
        style={{ color: '#8a6a5a', background: 'rgba(138,106,90,0.1)' }}
      >
        {tag}
      </span>
      <span className="leading-[1.55]">{text}</span>
    </li>
  );
}

function Line() {
  return <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, #c8a96e, transparent)' }} />;
}

// ── Mini ad (preview on right of winner card) ────────────────────────

function MiniAd({ hook, cta }: { hook: string; cta: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(320px 180px at 60% 30%, rgba(236,214,164,0.45), transparent 70%), ' +
          'linear-gradient(160deg, #403226 0%, #2a1f16 100%)',
      }}
    >
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-[100px] h-[90px]" style={{ filter: 'drop-shadow(0 18px 20px rgba(0,0,0,0.35))' }}>
          <div className="absolute inset-x-4 bottom-0 top-4 rounded-[4px]"
            style={{ background: 'linear-gradient(180deg, #e8d4a8 0%, #d4bb85 60%, #ab8d5a 100%)' }} />
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[10px]"
            style={{ background: 'linear-gradient(90deg, #6d4f33, #8c6a45, #6d4f33)' }} />
          <div className="absolute left-0 right-0 top-[48%] -translate-y-1/2 h-[8px]"
            style={{ background: 'linear-gradient(180deg, #6d4f33, #8c6a45, #6d4f33)' }} />
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-14 flex justify-center px-5">
        <p
          className="text-center text-[14px] leading-[1.25] italic max-w-[240px]"
          style={{ fontFamily: 'var(--font-heading)', color: '#f5e8c8' }}
        >
          “{hook}”
        </p>
      </div>
      <div className="absolute left-0 right-0 bottom-5 flex justify-center">
        <div
          className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-[0.06em]"
          style={{ color: '#1e3a2f', background: 'linear-gradient(160deg, #dcc487, #a68b4b)' }}
        >
          {cta}
        </div>
      </div>
    </div>
  );
}

function AdThumb({ ratio, hook }: { ratio: string; hook: string }) {
  // Map ratio string like "4/5" -> aspect-ratio style
  const [a, b] = ratio.split('/').map(Number);
  return (
    <div
      className="w-full rounded-lg overflow-hidden relative"
      style={{
        aspectRatio: `${a} / ${b}`,
        background:
          'radial-gradient(200px 120px at 55% 35%, rgba(236,214,164,0.45), transparent 70%), ' +
          'linear-gradient(160deg, #403226 0%, #2a1f16 100%)',
      }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-[56px] h-[50px] rounded-[3px]"
          style={{
            background: 'linear-gradient(180deg, #e8d4a8 0%, #ab8d5a 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        />
      </div>
      <div className="absolute left-0 right-0 bottom-2 flex justify-center px-3">
        <p
          className="text-center text-[10px] leading-[1.2] italic line-clamp-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'rgba(245,232,200,0.9)' }}
        >
          “{hook}”
        </p>
      </div>
    </div>
  );
}
