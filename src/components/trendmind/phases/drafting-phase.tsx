'use client';

import React, { useCallback } from 'react';
import { useCampaign, PHASES } from '@/lib/campaign-context';

// ─── Icons ───────────────────────────────────────────────────────────

function PenIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 2.5L15.5 5.5L6 15H3V12L12.5 2.5Z" />
      <path d="M11 4L14 7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7H11M8 4L11 7L8 10" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 7H3M6 4L3 7L6 10" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8V2M2.5 4.5L5 2L7.5 4.5" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 1.5V4M6 8V10.5M1.5 6H4M8 6H10.5M3 3L4.5 4.5M7.5 7.5L9 9M9 3L7.5 4.5M4.5 7.5L3 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5L4.2 7.2L8.5 2.8" />
    </svg>
  );
}

function QuoteGlyph() {
  return (
    <svg width="14" height="12" viewBox="0 0 22 18" fill="currentColor" aria-hidden="true">
      <path d="M0 18V11.5C0 7.5 1 4.5 3 2.5C5 0.7 7.3 0 10 0V3.5C7.7 3.8 6.2 4.6 5.4 5.7C4.7 6.8 4.4 8.1 4.4 9.6H10V18H0ZM12 18V11.5C12 7.5 13 4.5 15 2.5C17 0.7 19.3 0 22 0V3.5C19.7 3.8 18.2 4.6 17.4 5.7C16.7 6.8 16.4 8.1 16.4 9.6H22V18H12Z" />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M4 1.5L3 10.5M9 1.5L8 10.5M1.5 4H10.5M1.5 8H10.5" />
    </svg>
  );
}

// ─── Section primitives ──────────────────────────────────────────────

function SectionLabel({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: '#a68b4b' }}
      >
        {children}
      </span>
      {kicker && (
        <span
          className="flex-1 text-[11px] leading-relaxed"
          style={{ color: '#9b9590' }}
        >
          {kicker}
        </span>
      )}
    </div>
  );
}

function MicroLabel({ children, accent = '#a68b4b' }: { children: React.ReactNode; accent?: string }) {
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-[0.12em]"
      style={{ color: accent }}
    >
      {children}
    </span>
  );
}

// ─── Variant accent palette ──────────────────────────────────────────

interface VariantAccent {
  name: string;
  primary: string;     // text & dot
  primarySoft: string; // tinted backgrounds
  primaryEdge: string; // borders
  primaryGrad: [string, string];
  ribbon: string;      // header gradient pair top
  ribbonTo: string;
}

const ACCENTS: Record<'A' | 'B' | 'C', VariantAccent> = {
  A: {
    name: 'Gold',
    primary: '#a68b4b',
    primarySoft: 'rgba(200, 169, 110, 0.09)',
    primaryEdge: 'rgba(200, 169, 110, 0.22)',
    primaryGrad: ['#d4ba84', '#a68b4b'],
    ribbon: 'rgba(243, 234, 216, 0.7)',
    ribbonTo: 'rgba(255, 255, 255, 0)',
  },
  B: {
    name: 'Sage',
    primary: '#3d7a5f',
    primarySoft: 'rgba(91, 138, 114, 0.08)',
    primaryEdge: 'rgba(91, 138, 114, 0.22)',
    primaryGrad: ['#6b9c83', '#3d7a5f'],
    ribbon: 'rgba(216, 232, 222, 0.7)',
    ribbonTo: 'rgba(255, 255, 255, 0)',
  },
  C: {
    name: 'Plum',
    primary: '#7d6c92',
    primarySoft: 'rgba(122, 107, 138, 0.08)',
    primaryEdge: 'rgba(122, 107, 138, 0.22)',
    primaryGrad: ['#9684a8', '#6e5d80'],
    ribbon: 'rgba(225, 219, 232, 0.7)',
    ribbonTo: 'rgba(255, 255, 255, 0)',
  },
};

// ─── Variant data ────────────────────────────────────────────────────

interface SubScore {
  label: string;
  initial: number;
  refined: number;
}

interface Iteration {
  label: string;          // e.g. "v1 · Initial pass"
  timestamp: string;
  body: string;
  score: number;
  critique: string;
  state: 'past' | 'current';
}

interface Variant {
  id: 'A' | 'B' | 'C';
  title: string;
  angle: string;            // short framing line under the title
  architectLabel: string;   // "Architect 01"
  architectInitials: string;
  architectGrad: [string, string];
  passLabel: string;        // "Pass 2 of 2"
  passComplete: number;     // out of 3
  passTotal: number;
  status: { label: string; tone: 'progressed' | 'revising' | 'strengthened'; live: boolean };
  initialScore: number;
  refinedScore: number;
  subScores: SubScore[];
  iterations: Iteration[];
  cta: string;
  hashtags: string[];
  criticHeadline: string;   // brief headline above critique pull-quote
  criticPullQuote: string;
}

const VARIANTS: Variant[] = [
  {
    id: 'A',
    title: 'Variant A',
    angle: 'Warm editorial — intentional gifting',
    architectLabel: 'Architect 01',
    architectInitials: 'A1',
    architectGrad: ['#c8a96e', '#a68b4b'],
    passLabel: 'Pass 2 of 2',
    passComplete: 2,
    passTotal: 2,
    status: { label: 'Polished', tone: 'progressed', live: false },
    initialScore: 78,
    refinedScore: 91,
    subScores: [
      { label: 'Hook',       initial: 76, refined: 90 },
      { label: 'Clarity',    initial: 82, refined: 92 },
      { label: 'Emotional',  initial: 80, refined: 93 },
      { label: 'Brand',      initial: 84, refined: 94 },
      { label: 'Trend',      initial: 70, refined: 86 },
      { label: 'CTA',        initial: 74, refined: 89 },
    ],
    iterations: [
      {
        label: 'v1 · Initial pass',
        timestamp: '7 min ago',
        score: 78,
        body:
          'Holiday gifting should feel intentional, not loud. Choose pieces that carry warmth, care, and lasting taste.',
        critique:
          'Strong tone — sharpen the opening line and lean further into the emotional payoff.',
        state: 'past',
      },
      {
        label: 'v2 · Refined draft',
        timestamp: 'Just now',
        score: 91,
        body:
          'Give better, not louder. Holiday gifting can feel warm, intentional, and beautifully considered. Choose pieces that leave a lasting impression.',
        critique:
          'Opening is now decisive and the emotional through-line lands cleanly.',
        state: 'current',
      },
    ],
    cta: 'Discover gifts that feel as thoughtful as they look.',
    hashtags: ['#IntentionalGifting', '#HolidayStyle', '#ThoughtfulGifts', '#SeasonalEditorial'],
    criticHeadline: 'Critique summary',
    criticPullQuote:
      'Tone, cadence, and brand alignment are excellent. Ready to compete in final ranking.',
  },
  {
    id: 'B',
    title: 'Variant B',
    angle: 'Emotional invitation — meaningful gifting',
    architectLabel: 'Architect 02',
    architectInitials: 'A2',
    architectGrad: ['#5b8a72', '#3d7a5f'],
    passLabel: 'Pass 2 of 2',
    passComplete: 2,
    passTotal: 2,
    status: { label: 'Revising', tone: 'revising', live: true },
    initialScore: 69,
    refinedScore: 86,
    subScores: [
      { label: 'Hook',       initial: 70, refined: 84 },
      { label: 'Clarity',    initial: 76, refined: 88 },
      { label: 'Emotional',  initial: 64, refined: 90 },
      { label: 'Brand',      initial: 72, refined: 87 },
      { label: 'Trend',      initial: 66, refined: 82 },
      { label: 'CTA',        initial: 58, refined: 85 },
    ],
    iterations: [
      {
        label: 'v1 · Initial pass',
        timestamp: '6 min ago',
        score: 69,
        body:
          'Find premium gifts for the season. Thoughtful products for people who care.',
        critique:
          'CTA feels too passive — invite reflection or an emotional response from the reader.',
        state: 'past',
      },
      {
        label: 'v2 · Refined draft',
        timestamp: '30s ago',
        score: 86,
        body:
          'Choose gifts that feel personal, elevated, and quietly unforgettable. This season, let intention lead the gesture.',
        critique:
          'CTA now invites reflection — emotional resonance noticeably stronger.',
        state: 'current',
      },
    ],
    cta: 'Which kind of gift feels most meaningful to you?',
    hashtags: ['#HolidayGifting', '#MeaningfulGiving', '#PremiumLifestyle', '#SeasonalMood'],
    criticHeadline: 'Critique summary',
    criticPullQuote:
      'Major lift on emotional and CTA scoring. Hook could still gain another point of warmth.',
  },
  {
    id: 'C',
    title: 'Variant C',
    angle: 'Curated taste — quiet luxury cadence',
    architectLabel: 'Architect 03',
    architectInitials: 'A3',
    architectGrad: ['#9684a8', '#6e5d80'],
    passLabel: 'Pass 2 of 2',
    passComplete: 2,
    passTotal: 2,
    status: { label: 'Strengthened', tone: 'strengthened', live: false },
    initialScore: 58,
    refinedScore: 82,
    subScores: [
      { label: 'Hook',       initial: 60, refined: 80 },
      { label: 'Clarity',    initial: 68, refined: 84 },
      { label: 'Emotional',  initial: 54, refined: 80 },
      { label: 'Brand',      initial: 52, refined: 86 },
      { label: 'Trend',      initial: 60, refined: 80 },
      { label: 'CTA',        initial: 56, refined: 82 },
    ],
    iterations: [
      {
        label: 'v1 · Initial pass',
        timestamp: '6 min ago',
        score: 58,
        body:
          'The holidays are here. Shop smarter with better gift ideas for everyone.',
        critique:
          'Language is too generic — anchor it in premium seasonal taste and brand cadence.',
        state: 'past',
      },
      {
        label: 'v2 · Refined draft',
        timestamp: '1 min ago',
        score: 82,
        body:
          'Skip the noise. Give with taste, warmth, and intention this holiday season. A better gift begins with better curation.',
        critique:
          'Better alignment with the campaign\'s warm editorial tone — brand pillars now visible.',
        state: 'current',
      },
    ],
    cta: 'What makes a gift feel truly memorable to you?',
    hashtags: ['#CuratedGifting', '#ModernHoliday', '#GiftWithTaste', '#QuietLuxury'],
    criticHeadline: 'Critique summary',
    criticPullQuote:
      'Largest uplift across all variants. Brand alignment moved from weak to strong in one pass.',
  },
];

// ─── Status pill ─────────────────────────────────────────────────────

function StatusPill({ status }: { status: Variant['status'] }) {
  const map = {
    progressed: {
      bg: 'rgba(91, 138, 114, 0.1)',
      border: 'rgba(91, 138, 114, 0.22)',
      color: '#3d7a5f',
      dot: '#3d7a5f',
    },
    revising: {
      bg: 'rgba(200, 169, 110, 0.12)',
      border: 'rgba(200, 169, 110, 0.28)',
      color: '#a68b4b',
      dot: '#c8a96e',
    },
    strengthened: {
      bg: 'rgba(122, 107, 138, 0.1)',
      border: 'rgba(122, 107, 138, 0.22)',
      color: '#7d6c92',
      dot: '#7d6c92',
    },
  } as const;
  const t = map[status.tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.1em]"
      style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status.live ? 'animate-signal-pulse' : ''}`}
        style={{ background: t.dot }}
      />
      {status.label}
    </span>
  );
}

// ─── Pass dots ───────────────────────────────────────────────────────

function PassDots({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="w-[6px] h-[6px] rounded-full"
          style={{
            background:
              i < done
                ? 'linear-gradient(135deg, #d4ba84, #a68b4b)'
                : 'rgba(200, 169, 110, 0.18)',
            boxShadow:
              i < done
                ? '0 0 0 2px rgba(200, 169, 110, 0.1)'
                : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ─── Score plate ─────────────────────────────────────────────────────

function ScorePlate({ variant, accent }: { variant: Variant; accent: VariantAccent }) {
  const delta = variant.refinedScore - variant.initialScore;
  return (
    <div
      className="rounded-xl p-3.5 flex items-center gap-3"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #faf6ee 100%)',
        border: '1px solid #ece6da',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      }}
    >
      {/* Big score */}
      <div className="flex flex-col items-start min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: accent.primary }}
          >
            Critic Score
          </span>
          <span
            className="text-[10px] font-medium"
            style={{ color: '#b5b0a8' }}
          >
            · live
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1 animate-score-tick">
          <span
            className="text-[34px] leading-none tracking-[-0.02em]"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#2c2c2c',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {variant.refinedScore}
          </span>
          <span className="text-[12px] font-medium" style={{ color: '#b5b0a8' }}>
            / 100
          </span>
        </div>
        {/* Evolution */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className="text-[10.5px] font-medium tabular-nums"
            style={{ color: '#9b9590' }}
          >
            {variant.initialScore}
          </span>
          <span className="text-[10px]" style={{ color: '#c0bbb4' }}>
            →
          </span>
          <span
            className="text-[10.5px] font-semibold tabular-nums"
            style={{ color: accent.primary }}
          >
            {variant.refinedScore}
          </span>
        </div>
      </div>

      {/* Delta chip */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold tabular-nums"
          style={{
            background: 'rgba(91, 138, 114, 0.1)',
            color: '#3d7a5f',
            border: '1px solid rgba(91, 138, 114, 0.2)',
          }}
        >
          <ArrowUpIcon />
          +{delta}
        </span>
        <span
          className="text-[9.5px] font-medium uppercase tracking-[0.12em]"
          style={{ color: '#b5b0a8' }}
        >
          score uplift
        </span>
      </div>
    </div>
  );
}

// ─── Sub-score bars ──────────────────────────────────────────────────

function SubScoreBars({ variant, accent }: { variant: Variant; accent: VariantAccent }) {
  return (
    <div className="space-y-2">
      {variant.subScores.map((s, i) => {
        const delta = s.refined - s.initial;
        const pct = Math.max(0, Math.min(100, s.refined));
        return (
          <div key={s.label} className="flex items-center gap-2.5">
            <span
              className="text-[10.5px] font-medium uppercase tracking-[0.06em] flex-shrink-0"
              style={{ color: '#7a756e', width: 64 }}
            >
              {s.label}
            </span>
            <div
              className="relative flex-1 h-[6px] rounded-full overflow-hidden"
              style={{
                background: 'rgba(200, 169, 110, 0.08)',
                border: '1px solid rgba(228, 222, 212, 0.6)',
              }}
            >
              {/* Initial ghost mark */}
              <div
                className="absolute top-0 bottom-0"
                style={{
                  left: `${s.initial}%`,
                  width: 1.5,
                  background: 'rgba(155, 132, 102, 0.45)',
                }}
              />
              {/* Refined fill */}
              <div
                className="absolute top-0 left-0 bottom-0 animate-score-fill rounded-full"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${accent.primaryGrad[0]}, ${accent.primaryGrad[1]})`,
                  animationDelay: `${120 + i * 50}ms`,
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.4) inset',
                }}
              />
            </div>
            <span
              className="text-[10.5px] font-semibold tabular-nums flex-shrink-0"
              style={{ color: '#3d3835', width: 22, textAlign: 'right' }}
            >
              {s.refined}
            </span>
            <span
              className="text-[9.5px] font-semibold tabular-nums flex-shrink-0 text-right"
              style={{ color: '#3d7a5f', width: 26 }}
            >
              +{delta}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Iteration timeline ──────────────────────────────────────────────

function IterationStep({
  step,
  accent,
  isLast,
}: {
  step: Iteration;
  accent: VariantAccent;
  isLast: boolean;
}) {
  const isCurrent = step.state === 'current';
  return (
    <li className="relative pl-7">
      {/* Rail */}
      {!isLast && (
        <span
          className="absolute left-[10px] top-4 bottom-[-12px] w-px"
          style={{
            background:
              'linear-gradient(180deg, rgba(228, 222, 212, 0.9) 0%, rgba(228, 222, 212, 0.3) 100%)',
          }}
        />
      )}
      {/* Marker */}
      <span
        className="absolute left-0 top-1.5 w-[20px] h-[20px] rounded-full flex items-center justify-center"
        style={{
          background: isCurrent
            ? `linear-gradient(135deg, ${accent.primaryGrad[0]}, ${accent.primaryGrad[1]})`
            : 'rgba(245, 241, 234, 1)',
          border: isCurrent
            ? `1px solid ${accent.primaryEdge}`
            : '1px solid rgba(228, 222, 212, 0.9)',
          color: isCurrent ? '#fff' : '#b5b0a8',
          boxShadow: isCurrent
            ? '0 1px 4px rgba(0,0,0,0.1), 0 0 0 3px rgba(200, 169, 110, 0.06)'
            : 'none',
        }}
      >
        {isCurrent ? <CheckIcon /> : (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#c0bbb4' }}
          />
        )}
      </span>

      {/* Body */}
      <div
        className="rounded-xl p-3"
        style={{
          background: isCurrent ? '#ffffff' : 'rgba(250, 247, 242, 0.6)',
          border: isCurrent
            ? `1px solid ${accent.primaryEdge}`
            : '1px solid rgba(228, 222, 212, 0.7)',
          boxShadow: isCurrent
            ? '0 1px 2px rgba(0,0,0,0.02), 0 8px 22px -16px rgba(120, 96, 50, 0.16)'
            : 'none',
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-[10.5px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: isCurrent ? accent.primary : '#9b9590' }}
            >
              {step.label}
            </span>
            {isCurrent && (
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-[0.1em]"
                style={{
                  background: accent.primarySoft,
                  color: accent.primary,
                  border: `1px solid ${accent.primaryEdge}`,
                }}
              >
                Current
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-[10.5px] font-semibold tabular-nums"
              style={{ color: isCurrent ? '#3d3835' : '#b5b0a8' }}
            >
              {step.score}
            </span>
            <span className="text-[9.5px]" style={{ color: '#c0bbb4' }}>
              {step.timestamp}
            </span>
          </div>
        </div>
        <p
          className={`text-[12px] leading-relaxed ${isCurrent ? '' : 'italic'}`}
          style={{
            color: isCurrent ? '#2c2c2c' : '#7a756e',
            fontFamily: isCurrent ? 'var(--font-heading)' : 'var(--font-body)',
            letterSpacing: isCurrent ? '-0.005em' : '0',
            textDecoration: isCurrent ? 'none' : 'none',
            opacity: isCurrent ? 1 : 0.85,
          }}
        >
          {step.body}
        </p>
        <div
          className="mt-2 pt-2 flex items-start gap-1.5"
          style={{ borderTop: '1px dashed rgba(228, 222, 212, 0.85)' }}
        >
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.1em] mt-[2px] flex-shrink-0"
            style={{ color: '#a68b4b' }}
          >
            Critic
          </span>
          <span
            className="text-[11px] leading-relaxed"
            style={{ color: '#6b6560' }}
          >
            {step.critique}
          </span>
        </div>
      </div>
    </li>
  );
}

// ─── Variant card ────────────────────────────────────────────────────

function VariantCard({ variant, index }: { variant: Variant; index: number }) {
  const accent = ACCENTS[variant.id];

  return (
    <article
      className="flex flex-col rounded-2xl overflow-hidden animate-rise-in"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #fcf9f3 100%)',
        border: '1px solid #e4ded4',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.02), 0 14px 36px -24px rgba(120, 96, 50, 0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
        animationDelay: `${160 + index * 90}ms`,
      }}
    >
      {/* Ribbon header */}
      <div
        className="relative px-4 pt-4 pb-3.5 overflow-hidden"
        style={{
          borderBottom: '1px solid rgba(228, 222, 212, 0.7)',
          background: `linear-gradient(160deg, ${accent.ribbon} 0%, ${accent.ribbonTo} 100%)`,
        }}
      >
        {/* decorative orb */}
        <div
          className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${accent.primarySoft} 0%, rgba(255,255,255,0) 70%)`,
            filter: 'blur(2px)',
          }}
        />

        <div className="relative flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center px-2 py-1 rounded-md text-[10.5px] font-semibold uppercase tracking-[0.14em]"
              style={{
                background: '#ffffff',
                color: accent.primary,
                border: `1px solid ${accent.primaryEdge}`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              Variant {variant.id}
            </span>
            <PassDots done={variant.passComplete} total={variant.passTotal} />
          </div>
          <StatusPill status={variant.status} />
        </div>

        <h3
          className="text-[18px] leading-snug tracking-[-0.015em]"
          style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
        >
          {variant.angle}
        </h3>

        <div
          className="mt-2.5 pt-2.5 flex items-center justify-between gap-2"
          style={{ borderTop: '1px dashed rgba(200, 169, 110, 0.22)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[8.5px] font-bold flex-shrink-0"
              style={{
                background: `linear-gradient(145deg, ${variant.architectGrad[0]}, ${variant.architectGrad[1]})`,
                color: '#fff',
                boxShadow:
                  '0 1px 3px rgba(0,0,0,0.1), 0 0 0 1.5px rgba(255,255,255,0.12) inset',
                letterSpacing: '0.04em',
              }}
            >
              {variant.architectInitials}
            </span>
            <div className="flex flex-col min-w-0">
              <span
                className="text-[10.5px] font-semibold leading-tight"
                style={{ color: '#3d3835' }}
              >
                {variant.architectLabel}
              </span>
              <span
                className="text-[9.5px] font-medium"
                style={{ color: '#9b9590' }}
              >
                Content Architect
              </span>
            </div>
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: '#9b8a6a' }}
          >
            {variant.passLabel}
          </span>
        </div>
      </div>

      {/* Score plate + sub-scores */}
      <div className="px-4 pt-4 pb-3 space-y-3">
        <ScorePlate variant={variant} accent={accent} />

        <div>
          <div className="flex items-center justify-between mb-2">
            <MicroLabel accent={accent.primary}>Critic Sub-scores</MicroLabel>
            <span
              className="text-[9.5px] font-medium"
              style={{ color: '#b5b0a8' }}
            >
              ghost line = initial
            </span>
          </div>
          <SubScoreBars variant={variant} accent={accent} />
        </div>
      </div>

      {/* Iteration history */}
      <div
        className="px-4 pt-3.5 pb-4 space-y-3"
        style={{
          borderTop: '1px solid rgba(228, 222, 212, 0.7)',
          background: 'rgba(250, 247, 242, 0.5)',
        }}
      >
        <div className="flex items-center justify-between">
          <MicroLabel accent={accent.primary}>Iteration History</MicroLabel>
          <span
            className="text-[9.5px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: '#b5b0a8' }}
          >
            {variant.iterations.length} versions
          </span>
        </div>
        <ol className="relative space-y-3">
          {variant.iterations.map((step, i) => (
            <IterationStep
              key={step.label}
              step={step}
              accent={accent}
              isLast={i === variant.iterations.length - 1}
            />
          ))}
        </ol>
      </div>

      {/* CTA + hashtags */}
      <div
        className="px-4 py-4 space-y-3"
        style={{ borderTop: '1px solid rgba(228, 222, 212, 0.7)' }}
      >
        <div
          className="rounded-xl px-3.5 py-3 flex items-start gap-2.5"
          style={{
            background: '#ffffff',
            border: `1px solid ${accent.primaryEdge}`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <span
            className="mt-[2px] flex-shrink-0"
            style={{ color: accent.primary }}
          >
            <SparkIcon />
          </span>
          <div className="min-w-0">
            <span
              className="text-[9.5px] font-semibold uppercase tracking-[0.12em] block"
              style={{ color: accent.primary }}
            >
              Call to action
            </span>
            <p
              className="text-[12.5px] leading-relaxed mt-0.5"
              style={{
                color: '#2c2c2c',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.005em',
                fontStyle: 'italic',
              }}
            >
              {variant.cta}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span style={{ color: '#a68b4b' }}>
              <HashIcon />
            </span>
            <MicroLabel>Hashtags</MicroLabel>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {variant.hashtags.map((h) => (
              <span
                key={h}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
                style={{
                  background: '#faf7f2',
                  border: '1px solid #ece6da',
                  color: '#7a634a',
                }}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Critic pull-quote footer */}
      <div
        className="px-4 py-3.5 flex items-start gap-2.5"
        style={{
          borderTop: '1px solid rgba(228, 222, 212, 0.7)',
          background:
            'linear-gradient(180deg, rgba(245, 241, 234, 0.55) 0%, rgba(245, 241, 234, 0.85) 100%)',
        }}
      >
        <span
          className="flex-shrink-0 mt-[3px]"
          style={{ color: 'rgba(166, 139, 75, 0.55)' }}
        >
          <QuoteGlyph />
        </span>
        <div className="min-w-0">
          <span
            className="text-[9.5px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: '#a68b4b' }}
          >
            Performance Critic · {variant.criticHeadline}
          </span>
          <p
            className="text-[11.5px] leading-relaxed mt-0.5"
            style={{ color: '#4a4540' }}
          >
            {variant.criticPullQuote}
          </p>
        </div>
      </div>
    </article>
  );
}

// ─── Drafting status strip ───────────────────────────────────────────

function DraftingStatusStrip() {
  const avgUplift = Math.round(
    VARIANTS.reduce((sum, v) => sum + (v.refinedScore - v.initialScore), 0) / VARIANTS.length,
  );
  const passLabel = `${Math.max(...VARIANTS.map((v) => v.passComplete))} of ${Math.max(
    ...VARIANTS.map((v) => v.passTotal),
  )}`;

  return (
    <section
      className="relative rounded-2xl overflow-hidden animate-rise-in"
      style={{
        background:
          'linear-gradient(155deg, #2d4a3d 0%, #1e3a2f 60%, #162e24 100%)',
        boxShadow:
          '0 18px 40px -22px rgba(30, 58, 47, 0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
        animationDelay: '60ms',
      }}
    >
      {/* decorative orbs */}
      <div
        className="absolute -top-12 -left-10 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(200,169,110,0.22) 0%, rgba(200,169,110,0) 70%)',
        }}
      />
      <div
        className="absolute -bottom-16 right-10 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,186,132,0.1) 0%, rgba(212,186,132,0) 70%)',
        }}
      />

      <div className="relative px-6 py-5 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 items-center">
        {/* Left: orchestration narrative */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-1 rounded-md"
              style={{
                background: 'rgba(212, 186, 132, 0.14)',
                color: '#e8d9bd',
                border: '1px solid rgba(212, 186, 132, 0.22)',
              }}
            >
              Drafting Workspace
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-md"
              style={{
                background: 'rgba(91, 138, 114, 0.18)',
                color: '#cfe6d8',
                border: '1px solid rgba(91, 138, 114, 0.28)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-signal-pulse"
                style={{ background: '#9bd1b3' }}
              />
              Critic Active
            </span>
          </div>
          <h3
            className="text-[19px] leading-snug tracking-[-0.015em]"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#f3ead8',
              fontStyle: 'italic',
            }}
          >
            Three Content Architects are writing in parallel — one Performance Critic
            scores, refines, and re-scores until the drafts feel ready.
          </h3>
          <p
            className="text-[11.5px] leading-relaxed mt-2"
            style={{ color: 'rgba(232, 217, 189, 0.75)' }}
          >
            Each variant is iterated until its hook, clarity, emotional resonance,
            brand alignment, trend relevance, and CTA all meet the campaign bar.
          </p>
        </div>

        {/* Right: stat blocks */}
        <div className="grid grid-cols-3 gap-2.5 min-w-0">
          <StatTile
            label="Variants in flight"
            value="3"
            sub="A · B · C"
          />
          <StatTile
            label="Refinement passes"
            value={passLabel}
            sub="orchestrated"
          />
          <StatTile
            label="Avg score uplift"
            value={`+${avgUplift}`}
            sub="across variants"
            emphasis
          />
        </div>
      </div>

      {/* Critic now-reviewing thin row */}
      <div
        className="relative px-6 py-2.5 flex items-center justify-between gap-3"
        style={{
          borderTop: '1px solid rgba(212, 186, 132, 0.14)',
          background: 'rgba(0,0,0,0.12)',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background:
                'linear-gradient(145deg, #8a7a6b, #6a5a4d)',
              color: '#fff',
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            PC
          </span>
          <span
            className="text-[11px] leading-snug truncate"
            style={{ color: 'rgba(232, 217, 189, 0.85)' }}
          >
            <span className="font-semibold" style={{ color: '#f3ead8' }}>
              Performance Critic
            </span>{' '}
            re-scored revised drafts —{' '}
            <span style={{ color: '#e8d9bd' }}>
              A 91 · B 86 · C 82
            </span>{' '}
            · refining for final ranking.
          </span>
        </div>
        <span
          className="text-[9.5px] font-semibold uppercase tracking-[0.14em] flex-shrink-0"
          style={{ color: 'rgba(232, 217, 189, 0.5)' }}
        >
          Live
        </span>
      </div>
    </section>
  );
}

function StatTile({
  label,
  value,
  sub,
  emphasis = false,
}: {
  label: string;
  value: string;
  sub: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className="rounded-xl px-3 py-3"
      style={{
        background: emphasis
          ? 'linear-gradient(160deg, rgba(212, 186, 132, 0.18) 0%, rgba(212, 186, 132, 0.06) 100%)'
          : 'rgba(255, 255, 255, 0.04)',
        border: emphasis
          ? '1px solid rgba(212, 186, 132, 0.32)'
          : '1px solid rgba(212, 186, 132, 0.12)',
      }}
    >
      <span
        className="text-[9.5px] font-semibold uppercase tracking-[0.12em] block"
        style={{ color: 'rgba(232, 217, 189, 0.55)' }}
      >
        {label}
      </span>
      <span
        className="text-[20px] leading-tight tracking-[-0.01em] block mt-1 tabular-nums"
        style={{
          fontFamily: 'var(--font-heading)',
          color: emphasis ? '#f3ead8' : '#e8d9bd',
        }}
      >
        {value}
      </span>
      <span
        className="text-[10px] font-medium block mt-0.5"
        style={{ color: 'rgba(232, 217, 189, 0.6)' }}
      >
        {sub}
      </span>
    </div>
  );
}

// ─── Drafting Phase ──────────────────────────────────────────────────

export function DraftingPhase() {
  const { goToNextPhase, setActivePhase } = useCampaign();

  const handleBack = useCallback(() => {
    setActivePhase('strategy');
  }, [setActivePhase]);

  const handleContinue = useCallback(() => {
    goToNextPhase();
  }, [goToNextPhase]);

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-phase-enter overflow-hidden">
      {/* Phase header */}
      <div className="px-8 pt-7 pb-5 flex-shrink-0">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background:
                  'linear-gradient(135deg, rgba(200, 169, 110, 0.14), rgba(200, 169, 110, 0.05))',
                border: '1px solid rgba(200, 169, 110, 0.18)',
                color: '#a68b4b',
              }}
            >
              <PenIcon />
            </div>
            <div>
              <h2
                className="text-[22px] font-normal tracking-[-0.02em] leading-tight"
                style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
              >
                Drafting & Refinement
              </h2>
              <p
                className="text-[12.5px] mt-1.5 leading-relaxed max-w-[620px]"
                style={{ color: '#9b9590' }}
              >
                Three variants are being written in parallel, critiqued, and
                improved together — until each one is strong enough for final
                ranking.
              </p>
            </div>
          </div>

          {/* live status pill */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg flex-shrink-0 mt-1"
            style={{
              background: 'rgba(200, 169, 110, 0.08)',
              border: '1px solid rgba(200, 169, 110, 0.22)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-signal-pulse"
              style={{ background: '#a68b4b' }}
            />
            <span
              className="text-[10.5px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: '#a68b4b' }}
            >
              Performance Critic · Scoring
            </span>
          </div>
        </div>
      </div>

      <div
        className="mx-8 h-px"
        style={{
          background:
            'linear-gradient(90deg, rgba(228, 222, 212, 0.8), rgba(228, 222, 212, 0.3))',
        }}
      />

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 pt-6 pb-8">
        <div className="max-w-[1240px] mx-auto">
          <SectionLabel kicker="The orchestration of three parallel campaign drafts under live critique.">
            Drafting Status
          </SectionLabel>

          <DraftingStatusStrip />

          {/* Section divider */}
          <div className="my-9 flex items-center gap-4" aria-hidden="true">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  'linear-gradient(90deg, rgba(228,222,212,0), rgba(228,222,212,0.9), rgba(228,222,212,0))',
              }}
            />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: '#c0b59a' }}
            >
              ✦
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  'linear-gradient(90deg, rgba(228,222,212,0), rgba(228,222,212,0.9), rgba(228,222,212,0))',
              }}
            />
          </div>

          <SectionLabel kicker="Three lanes · iteration history · live critic scoring.">
            Variant Lanes
          </SectionLabel>

          {/* Three variant lanes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {VARIANTS.map((v, i) => (
              <VariantCard key={v.id} variant={v} index={i} />
            ))}
          </div>

          {/* Footer actions */}
          <div
            className="mt-9 pt-5 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(228, 222, 212, 0.7)' }}
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12.5px] font-medium transition-all duration-200"
              style={{
                color: '#7a756e',
                background: 'rgba(200, 169, 110, 0.06)',
                border: '1px solid rgba(200, 169, 110, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(200, 169, 110, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(200, 169, 110, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.15)';
              }}
            >
              <ArrowLeftIcon />
              Back to Strategy
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[10.5px]" style={{ color: '#b5b0a8' }}>
                Drafts auto-saved · ready for ranking
              </span>
              <button
                onClick={handleContinue}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[12.5px] font-semibold transition-all duration-250"
                style={{
                  background: 'linear-gradient(135deg, #c8a96e, #a68b4b)',
                  color: '#fff',
                  boxShadow:
                    '0 2px 8px rgba(166, 139, 75, 0.3), 0 1px 2px rgba(0,0,0,0.06)',
                  border: 'none',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 4px 14px rgba(166, 139, 75, 0.4), 0 1px 2px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-0.5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(166, 139, 75, 0.3), 0 1px 2px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Continue to {PHASES[4].label}
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
