'use client';

import React, { useCallback } from 'react';
import { useCampaign, PHASES } from '@/lib/campaign-context';

// ─── Icons ───────────────────────────────────────────────────────────

function CompassIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2L11.5 7L17 7.5L13 11.5L14 17L9 14.5L4 17L5 11.5L1 7.5L6.5 7L9 2Z" />
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

function QuoteGlyph() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor" aria-hidden="true">
      <path d="M0 18V11.5C0 7.5 1 4.5 3 2.5C5 0.7 7.3 0 10 0V3.5C7.7 3.8 6.2 4.6 5.4 5.7C4.7 6.8 4.4 8.1 4.4 9.6H10V18H0ZM12 18V11.5C12 7.5 13 4.5 15 2.5C17 0.7 19.3 0 22 0V3.5C19.7 3.8 18.2 4.6 17.4 5.7C16.7 6.8 16.4 8.1 16.4 9.6H22V18H12Z" />
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

function Chip({
  children,
  tone = 'gold',
}: {
  children: React.ReactNode;
  tone?: 'gold' | 'green' | 'plum' | 'rose' | 'sand';
}) {
  const toneMap = {
    gold:  { bg: 'rgba(200, 169, 110, 0.09)', border: 'rgba(200, 169, 110, 0.18)', text: '#8a7345', dot: 'linear-gradient(135deg,#d4ba84,#a68b4b)' },
    green: { bg: 'rgba(91, 138, 114, 0.08)',  border: 'rgba(91, 138, 114, 0.18)',  text: '#4a7a63', dot: 'linear-gradient(135deg,#6b9c83,#3d7a5f)' },
    plum:  { bg: 'rgba(122, 107, 138, 0.08)', border: 'rgba(122, 107, 138, 0.18)', text: '#6e5d80', dot: 'linear-gradient(135deg,#9684a8,#6e5d80)' },
    rose:  { bg: 'rgba(166, 110, 110, 0.07)', border: 'rgba(166, 110, 110, 0.16)', text: '#8a5a5a', dot: 'linear-gradient(135deg,#c89494,#a66e6e)' },
    sand:  { bg: 'rgba(155, 132, 102, 0.08)', border: 'rgba(155, 132, 102, 0.18)', text: '#7a634a', dot: 'linear-gradient(135deg,#b59878,#8b6f4e)' },
  } as const;
  const t = toneMap[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
      style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: t.dot }}
      />
      {children}
    </span>
  );
}

// ─── Campaign Summary ────────────────────────────────────────────────

interface SummaryRow {
  label: string;
  value: string;
}

const summaryRows: SummaryRow[] = [
  { label: 'Campaign',         value: 'Q4 Holiday Push' },
  { label: 'Thread',           value: 'Q4 Holiday Push — Strategy Thread' },
  { label: 'Brand / Project',  value: 'TrendMind Retail Collective' },
  { label: 'Platform',         value: 'X (Twitter)' },
  { label: 'Primary language', value: 'English' },
  { label: 'Tone of voice',    value: 'Warm, refined, editorial, intelligent, calm' },
];

const brandPillars = [
  'Premium quality',
  'Intentional gifting',
  'Sustainable elegance',
  'Modern cultural awareness',
];

const bannedPhrases = [
  'best deal ever',
  'hurry now',
  'cheap gifts',
  'viral hack',
];

function SummaryRowItem({ row, last }: { row: SummaryRow; last: boolean }) {
  return (
    <div
      className="grid grid-cols-[140px_1fr] gap-4 py-2.5"
      style={{
        borderBottom: last
          ? 'none'
          : '1px dashed rgba(200, 169, 110, 0.18)',
      }}
    >
      <span
        className="text-[10.5px] font-semibold uppercase tracking-[0.1em] pt-0.5"
        style={{ color: '#9b8a6a' }}
      >
        {row.label}
      </span>
      <span className="text-[12.5px] leading-relaxed" style={{ color: '#3d3835' }}>
        {row.value}
      </span>
    </div>
  );
}

function CampaignSummarySection() {
  return (
    <section
      className="rounded-2xl overflow-hidden animate-rise-in"
      style={{
        background:
          'linear-gradient(180deg, #ffffff 0%, #faf6ee 100%)',
        border: '1px solid #e4ded4',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.02), 0 12px 32px -22px rgba(120, 96, 50, 0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
        animationDelay: '40ms',
      }}
    >
      {/* Header */}
      <div
        className="relative px-6 pt-6 pb-5 overflow-hidden"
        style={{
          borderBottom: '1px solid rgba(228, 222, 212, 0.7)',
          background:
            'linear-gradient(160deg, rgba(255,255,255,0) 0%, rgba(243,234,216,0.5) 100%)',
        }}
      >
        <div
          className="absolute -top-12 -right-10 w-44 h-44 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(200,169,110,0.18) 0%, rgba(200,169,110,0) 70%)',
            filter: 'blur(2px)',
          }}
        />
        <div className="relative flex items-start justify-between gap-5">
          <div className="min-w-0">
            <MicroLabel>Campaign Summary</MicroLabel>
            <h3
              className="mt-2 text-[20px] leading-snug tracking-[-0.015em]"
              style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
            >
              The strategic foundation
            </h3>
            <p
              className="mt-1.5 text-[12.5px] leading-relaxed max-w-[480px]"
              style={{ color: '#6b6560' }}
            >
              A distilled view of who, where, and how — the agreed parameters
              guiding every decision in this campaign.
            </p>
          </div>

          <span
            className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-md flex-shrink-0 mt-1"
            style={{
              background: 'rgba(91, 138, 114, 0.08)',
              color: '#3d7a5f',
              border: '1px solid rgba(91, 138, 114, 0.18)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#3d7a5f' }}
            />
            Confirmed
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-x-8 gap-y-6">
        {/* Left: identity rows */}
        <div>
          {summaryRows.map((r, i) => (
            <SummaryRowItem
              key={r.label}
              row={r}
              last={i === summaryRows.length - 1}
            />
          ))}
        </div>

        {/* Right: goal + focus */}
        <div className="flex flex-col gap-5">
          <div>
            <MicroLabel accent="#3d7a5f">Primary goal</MicroLabel>
            <p
              className="mt-2 text-[13px] leading-relaxed"
              style={{ color: '#2c2c2c', fontFamily: 'var(--font-heading)' }}
            >
              Create a holiday campaign direction that feels{' '}
              <span style={{ color: '#a68b4b' }}>premium</span>,{' '}
              <span style={{ color: '#a68b4b' }}>culturally relevant</span>,
              and conversion-oriented — without losing warmth.
            </p>
          </div>

          <div>
            <MicroLabel accent="#7d6c92">Campaign focus</MicroLabel>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Chip tone="gold">Holiday gifting</Chip>
              <Chip tone="plum">Cultural relevance</Chip>
              <Chip tone="sand">Elevated lifestyle storytelling</Chip>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars + banned strip */}
      <div
        className="px-6 py-5 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6"
        style={{
          borderTop: '1px solid rgba(228, 222, 212, 0.7)',
          background: 'rgba(245, 241, 234, 0.45)',
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <MicroLabel>Brand Pillars</MicroLabel>
            <span className="text-[10.5px]" style={{ color: '#b5b0a8' }}>
              Foundational
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {brandPillars.map((p) => (
              <div
                key={p}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  background: '#faf7f2',
                  border: '1px solid #ece6da',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #c8a96e, #a68b4b)',
                    boxShadow: '0 0 0 3px rgba(200, 169, 110, 0.1)',
                  }}
                />
                <span
                  className="text-[12.5px] font-medium"
                  style={{ color: '#2c2c2c' }}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <MicroLabel accent="#a66e6e">Banned phrases</MicroLabel>
            <span className="text-[10.5px]" style={{ color: '#b5b0a8' }}>
              Avoid in copy
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {bannedPhrases.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
                style={{
                  background: 'rgba(166, 110, 110, 0.06)',
                  border: '1px dashed rgba(166, 110, 110, 0.32)',
                  color: '#8a5a5a',
                  textDecoration: 'line-through',
                  textDecorationColor: 'rgba(166, 110, 110, 0.4)',
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Brand Strategy ──────────────────────────────────────────────────

const messagingDirection = [
  'Give better, not louder.',
  'Make gifting feel intentional, warm, and elevated.',
  'Lead with atmosphere, care, and presentation rather than urgency.',
  'Show taste and meaning, not just product.',
];

const emotionalTerritory = [
  'Calm generosity',
  'Considered taste',
  'Warm sophistication',
  'Seasonal intimacy',
];

const guardrails = [
  { type: 'avoid', text: 'Aggressive sales tone' },
  { type: 'avoid', text: 'Discount-first framing' },
  { type: 'avoid', text: 'Cliché holiday hype language' },
  { type: 'do',    text: 'Prioritize visual and tonal elegance' },
  { type: 'do',    text: 'Keep the campaign emotionally warm but controlled' },
];

const contentPrinciples = [
  { title: 'Atmosphere first',  body: 'Lead with mood, light, and texture before product callouts.' },
  { title: 'Editorial cadence', body: 'Pace posts like a thoughtful magazine column, not a sales feed.' },
  { title: 'Quiet confidence',  body: 'Let craft and presentation do the persuading.' },
];

function PositioningCard() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6"
      style={{
        background:
          'linear-gradient(155deg, #2d4a3d 0%, #1e3a2f 60%, #162e24 100%)',
        boxShadow:
          '0 18px 40px -22px rgba(30, 58, 47, 0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* decorative orbs */}
      <div
        className="absolute -top-16 -left-12 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(200,169,110,0.22) 0%, rgba(200,169,110,0) 70%)',
        }}
      />
      <div
        className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,186,132,0.12) 0%, rgba(212,186,132,0) 70%)',
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-1 rounded-md"
            style={{
              background: 'rgba(212, 186, 132, 0.14)',
              color: '#e8d9bd',
              border: '1px solid rgba(212, 186, 132, 0.22)',
            }}
          >
            Positioning Statement
          </span>
          <span
            className="text-[10.5px] font-medium"
            style={{ color: 'rgba(232, 217, 189, 0.55)' }}
          >
            Authored by Brand Strategist
          </span>
        </div>

        <div className="flex gap-4">
          <div
            className="flex-shrink-0 mt-1"
            style={{ color: 'rgba(212, 186, 132, 0.35)' }}
          >
            <QuoteGlyph />
          </div>
          <p
            className="text-[18px] leading-[1.55] tracking-[-0.01em]"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#f3ead8',
              fontStyle: 'italic',
            }}
          >
            TrendMind Retail Collective should present holiday gifting as an
            intentional act of taste, care, and cultural awareness — offering
            premium, sustainable choices that feel emotionally resonant rather
            than loudly promotional.
          </p>
        </div>

        <div
          className="mt-5 pt-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(212, 186, 132, 0.15)' }}
        >
          <span
            className="text-[10.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: 'rgba(232, 217, 189, 0.5)' }}
          >
            Strategic North Star
          </span>
          <span
            className="text-[11px]"
            style={{ color: 'rgba(232, 217, 189, 0.65)' }}
          >
            Locked & guiding all downstream decisions
          </span>
        </div>
      </div>
    </div>
  );
}

function MessagingDirectionCard() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #faf6ee 100%)',
        border: '1px solid #e4ded4',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.02), 0 8px 22px -16px rgba(120, 96, 50, 0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <MicroLabel>Messaging Direction</MicroLabel>
        <span className="text-[10.5px]" style={{ color: '#b5b0a8' }}>
          {messagingDirection.length} principles
        </span>
      </div>
      <ol className="space-y-3">
        {messagingDirection.map((m, i) => (
          <li key={m} className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10.5px] font-semibold mt-0.5"
              style={{
                background: 'rgba(200, 169, 110, 0.1)',
                color: '#a68b4b',
                border: '1px solid rgba(200, 169, 110, 0.2)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="text-[13px] leading-relaxed flex-1 pt-0.5"
              style={{ color: '#2c2c2c' }}
            >
              {m}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CampaignAngleCard() {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, #faf6ee 0%, #f3ead8 100%)',
        border: '1px solid rgba(200, 169, 110, 0.25)',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.02), 0 10px 26px -18px rgba(166, 139, 75, 0.25)',
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, rgba(200,169,110,0.18), transparent 70%)',
        }}
      />
      <div className="relative">
        <MicroLabel>Campaign Angle</MicroLabel>
        <h4
          className="mt-2 text-[17px] leading-snug tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
        >
          A refined holiday campaign that merges{' '}
          <span style={{ color: '#a68b4b' }}>soft luxury</span>,{' '}
          <span style={{ color: '#a68b4b' }}>intentional shopping</span>, and{' '}
          <span style={{ color: '#a68b4b' }}>modern cultural relevance</span>{' '}
          into a warm editorial storytelling style.
        </h4>
      </div>
    </div>
  );
}

function EmotionalTerritoryCard() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: '#ffffff',
        border: '1px solid #e4ded4',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.02), 0 8px 22px -16px rgba(120, 96, 50, 0.12)',
      }}
    >
      <div className="flex items-center justify-between mb-3.5">
        <MicroLabel accent="#7d6c92">Emotional Territory</MicroLabel>
        <span className="text-[10.5px]" style={{ color: '#b5b0a8' }}>
          What this campaign should feel like
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {emotionalTerritory.map((e, i) => {
          const dots = [
            'linear-gradient(135deg, #d4ba84, #a68b4b)',
            'linear-gradient(135deg, #6b9c83, #3d7a5f)',
            'linear-gradient(135deg, #9684a8, #6e5d80)',
            'linear-gradient(135deg, #b59878, #8b6f4e)',
          ];
          return (
            <div
              key={e}
              className="rounded-xl px-3.5 py-3 flex items-center gap-3"
              style={{
                background: '#faf7f2',
                border: '1px solid #ece6da',
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: dots[i % dots.length],
                  boxShadow: '0 0 0 3px rgba(200, 169, 110, 0.08)',
                }}
              />
              <span
                className="text-[13px] leading-snug"
                style={{
                  color: '#2c2c2c',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.005em',
                }}
              >
                {e}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuardrailsCard() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #faf6ee 100%)',
        border: '1px solid #e4ded4',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.02), 0 8px 22px -16px rgba(120, 96, 50, 0.15)',
      }}
    >
      <div className="flex items-center justify-between mb-3.5">
        <MicroLabel>Creative Guardrails</MicroLabel>
        <span className="text-[10.5px]" style={{ color: '#b5b0a8' }}>
          Non-negotiables
        </span>
      </div>
      <ul className="space-y-2">
        {guardrails.map((g) => {
          const isAvoid = g.type === 'avoid';
          const color = isAvoid ? '#a66e6e' : '#3d7a5f';
          const bg = isAvoid
            ? 'rgba(166, 110, 110, 0.06)'
            : 'rgba(91, 138, 114, 0.06)';
          const border = isAvoid
            ? 'rgba(166, 110, 110, 0.18)'
            : 'rgba(91, 138, 114, 0.18)';
          return (
            <li
              key={g.text}
              className="flex items-center gap-3 px-3 py-2 rounded-lg"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <span
                className="text-[9.5px] font-semibold uppercase tracking-[0.14em] px-1.5 py-0.5 rounded"
                style={{
                  color,
                  background: '#ffffff',
                  border: `1px solid ${border}`,
                  minWidth: 44,
                  textAlign: 'center',
                }}
              >
                {isAvoid ? 'Avoid' : 'Do'}
              </span>
              <span
                className="text-[12.5px] leading-relaxed"
                style={{ color: '#2c2c2c' }}
              >
                {g.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ContentPrinciplesCard() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: '#ffffff',
        border: '1px solid #e4ded4',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.02), 0 8px 22px -16px rgba(120, 96, 50, 0.12)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <MicroLabel>Content Principles</MicroLabel>
        <span className="text-[10.5px]" style={{ color: '#b5b0a8' }}>
          For Content Architects
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {contentPrinciples.map((p, i) => (
          <div
            key={p.title}
            className="rounded-xl p-3.5"
            style={{
              background: '#faf7f2',
              border: '1px solid #ece6da',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-semibold"
                style={{
                  color: '#a68b4b',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="text-[12.5px] font-semibold"
                style={{ color: '#2c2c2c' }}
              >
                {p.title}
              </span>
            </div>
            <p
              className="text-[11.5px] leading-relaxed"
              style={{ color: '#6b6560' }}
            >
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandStrategySection() {
  return (
    <section className="space-y-4">
      <SectionLabel kicker="The decisive direction translating research into a campaign.">
        Brand Strategy
      </SectionLabel>

      <div className="animate-rise-in" style={{ animationDelay: '120ms' }}>
        <PositioningCard />
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4 animate-rise-in"
        style={{ animationDelay: '200ms' }}
      >
        <MessagingDirectionCard />
        <div className="flex flex-col gap-4">
          <CampaignAngleCard />
          <EmotionalTerritoryCard />
        </div>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-4 animate-rise-in"
        style={{ animationDelay: '280ms' }}
      >
        <GuardrailsCard />
        <ContentPrinciplesCard />
      </div>
    </section>
  );
}

// ─── Strategy Phase ──────────────────────────────────────────────────

export function StrategyPhase() {
  const { goToNextPhase, setActivePhase } = useCampaign();

  const handleBack = useCallback(() => {
    setActivePhase('research');
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
              <CompassIcon />
            </div>
            <div>
              <h2
                className="text-[22px] font-normal tracking-[-0.02em] leading-tight"
                style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
              >
                Campaign Strategy
              </h2>
              <p
                className="text-[12.5px] mt-1.5 leading-relaxed max-w-[600px]"
                style={{ color: '#9b9590' }}
              >
                This phase defines the messaging direction, campaign angle, and
                strategic guardrails that will guide every draft to come.
              </p>
            </div>
          </div>

          {/* live status pill */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg flex-shrink-0 mt-1"
            style={{
              background: 'rgba(91, 138, 114, 0.06)',
              border: '1px solid rgba(91, 138, 114, 0.18)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-signal-pulse"
              style={{ background: '#3d7a5f' }}
            />
            <span
              className="text-[10.5px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: '#3d7a5f' }}
            >
              Brand Strategist · Shaping
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
        <div className="max-w-[920px] mx-auto">
          {/* ── CAMPAIGN SUMMARY ─────────────────────────── */}
          <SectionLabel kicker="The agreed parameters the strategy is built upon.">
            Campaign Summary
          </SectionLabel>

          <CampaignSummarySection />

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

          {/* ── BRAND STRATEGY ───────────────────────────── */}
          <BrandStrategySection />

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
              Back to Research
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[10.5px]" style={{ color: '#b5b0a8' }}>
                Strategy auto-saved
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
                Continue to {PHASES[3].label}
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
