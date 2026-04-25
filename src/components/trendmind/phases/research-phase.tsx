'use client';

import React, { useCallback } from 'react';
import { useCampaign, PHASES } from '@/lib/campaign-context';

// ─── Icons ───────────────────────────────────────────────────────────

function CompassIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6.5" />
      <path d="M11.5 6.5L10 10L6.5 11.5L8 8L11.5 6.5Z" />
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

function SparkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 1.5V4M6 8V10.5M1.5 6H4M8 6H10.5M3 3L4.5 4.5M7.5 7.5L9 9M9 3L7.5 4.5M4.5 7.5L3 9" />
    </svg>
  );
}

function SourceDotIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="5" cy="5" r="3.5" />
      <circle cx="5" cy="5" r="1" fill="currentColor" stroke="none" />
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

// ─── Mock data ───────────────────────────────────────────────────────

const demographicClusters = [
  { label: 'Ages 25–40', meta: 'Core' },
  { label: 'Urban professionals', meta: 'Geo' },
  { label: 'Premium lifestyle buyers', meta: 'Segment' },
  { label: 'Sustainability-aware shoppers', meta: 'Values' },
];

const motivations = [
  'Give gifts that feel meaningful',
  'Balance taste with responsibility',
  'Discover elevated but practical products',
  'Express care through presentation and quality',
];

const behaviors = [
  'Save gift ideas early',
  'Respond to seasonal visual storytelling',
  'Engage with polished, editorial-style content',
  'Prefer calm premium messaging over aggressive promotion',
];

const contentPreferences = [
  'Lifestyle-led imagery',
  'Curated holiday moodboards',
  'Tasteful product storytelling',
  'Modern cultural relevance',
  'Minimal but warm tone',
];

interface TrendRef {
  id: string;
  title: string;
  source: string;
  summary: string;
  signal: 'High' | 'Medium-High' | 'Medium';
  // 0..1 visualization for the signal bar
  signalLevel: number;
  // gradient pair used for the editorial thumbnail
  thumb: { from: string; via: string; to: string; accent: string };
  tags: string[];
}

const trends: TrendRef[] = [
  {
    id: 't1',
    title: 'Elevated Gifting Rituals',
    source: 'Trend Hunter',
    summary:
      'Consumers are increasingly drawn to gifting content that emphasizes ritual, curation, and emotional presentation over raw discount language.',
    signal: 'High',
    signalLevel: 0.92,
    thumb: { from: '#e8d9bd', via: '#d4ba84', to: '#a68b4b', accent: '#7a5e2e' },
    tags: ['Ritual', 'Curation', 'Emotional'],
  },
  {
    id: 't2',
    title: 'Soft Luxury Holiday Visuals',
    source: 'Pinterest Trends',
    summary:
      'Warm, minimal, premium holiday imagery with tactile materials and muted palettes is performing strongly.',
    signal: 'Medium-High',
    signalLevel: 0.74,
    thumb: { from: '#efe6d8', via: '#d8c4a8', to: '#9b8466', accent: '#6b563a' },
    tags: ['Soft luxury', 'Tactile', 'Muted palette'],
  },
  {
    id: 't3',
    title: 'Intentional Shopping Culture',
    source: 'TikTok / Editorial trend synthesis',
    summary:
      'Audiences are reacting positively to messaging around buying fewer, better, more meaningful items.',
    signal: 'High',
    signalLevel: 0.88,
    thumb: { from: '#dfe5dc', via: '#a8bca5', to: '#5b8a72', accent: '#3d7a5f' },
    tags: ['Slow consumption', 'Values-led', 'Editorial'],
  },
  {
    id: 't4',
    title: 'Modern Seasonal Warmth',
    source: 'Instagram visual scan',
    summary:
      'Editorial-feeling holiday content with calm lighting, paper textures, and crafted arrangements is resonating more than loud festive visuals.',
    signal: 'Medium',
    signalLevel: 0.6,
    thumb: { from: '#ece1d3', via: '#c8a96e', to: '#8b6f4e', accent: '#5b4528' },
    tags: ['Editorial', 'Paper textures', 'Crafted'],
  },
];

// ─── Audience: hero card ─────────────────────────────────────────────

function PrimaryAudienceCard() {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, #ffffff 0%, #faf6ee 55%, #f3ead8 100%)',
        border: '1px solid #e4ded4',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.02), 0 12px 32px -18px rgba(120, 96, 50, 0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
    >
      {/* soft decorative orb */}
      <div
        className="absolute -top-16 -right-12 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(200,169,110,0.22) 0%, rgba(200,169,110,0) 70%)',
          filter: 'blur(2px)',
        }}
      />

      <div className="relative flex items-start justify-between gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-1 rounded-md"
              style={{
                background: 'rgba(200, 169, 110, 0.1)',
                color: '#a68b4b',
                border: '1px solid rgba(200, 169, 110, 0.18)',
              }}
            >
              <SparkIcon />
              Primary Audience
            </span>
            <span
              className="text-[10.5px] font-medium"
              style={{ color: '#b5b0a8' }}
            >
              Synthesized by Brand Strategist
            </span>
          </div>

          <h3
            className="text-[19px] leading-snug tracking-[-0.015em] mb-2"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#2c2c2c',
            }}
          >
            Style-conscious professionals & thoughtful holiday shoppers
          </h3>
          <p
            className="text-[12.5px] leading-relaxed max-w-[520px]"
            style={{ color: '#6b6560' }}
          >
            They value sustainability, presentation, and intentional gifting.
            They look for quiet quality over loud promotion, and respond to
            content that feels considered and well-composed.
          </p>
        </div>

        {/* abstract portrait composition */}
        <div className="hidden md:flex flex-shrink-0 items-end gap-1.5 pt-1">
          {[
            ['#d4ba84', '#a68b4b'],
            ['#5b8a72', '#3d7a5f'],
            ['#8b6f4e', '#6b5535'],
          ].map(([a, b], i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 28,
                height: 28 + i * 6,
                background: `linear-gradient(160deg, ${a}, ${b})`,
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1.5px solid rgba(255,255,255,0.7)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Audience: cluster pill ──────────────────────────────────────────

function ClusterPill({ label, meta }: { label: string; meta: string }) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group"
      style={{
        background: '#faf7f2',
        border: '1px solid #e9e3d8',
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #c8a96e, #a68b4b)',
            boxShadow: '0 0 0 3px rgba(200, 169, 110, 0.1)',
          }}
        />
        <span
          className="text-[12.5px] font-medium truncate"
          style={{ color: '#2c2c2c' }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-[10px] uppercase tracking-[0.1em] font-semibold flex-shrink-0"
        style={{ color: '#b5a988' }}
      >
        {meta}
      </span>
    </div>
  );
}

// ─── Audience: list column ───────────────────────────────────────────

function InsightColumn({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: 'gold' | 'green' | 'plum';
}) {
  const accentMap = {
    gold: { dot: 'linear-gradient(135deg, #c8a96e, #a68b4b)', text: '#a68b4b' },
    green: { dot: 'linear-gradient(135deg, #6b9c83, #3d7a5f)', text: '#4a7a63' },
    plum: { dot: 'linear-gradient(135deg, #9684a8, #6e5d80)', text: '#7d6c92' },
  } as const;
  const a = accentMap[accent];

  return (
    <div
      className="rounded-xl p-4 h-full flex flex-col"
      style={{
        background: '#faf7f2',
        border: '1px solid #ece6da',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: a.dot }}
        />
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: a.text }}
        >
          {title}
        </span>
      </div>
      <ul className="space-y-2 flex-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[12.5px] leading-relaxed"
            style={{ color: '#3d3835' }}
          >
            <span
              className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: '#c8b58a' }}
            />
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Trend reference card ────────────────────────────────────────────

function TrendCard({ trend, index }: { trend: TrendRef; index: number }) {
  const signalColor =
    trend.signal === 'High'
      ? '#3d7a5f'
      : trend.signal === 'Medium-High'
      ? '#a68b4b'
      : '#9b8466';

  return (
    <div
      className="group rounded-2xl overflow-hidden flex flex-col animate-rise-in transition-all duration-300"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #faf6ee 100%)',
        border: '1px solid #e4ded4',
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -16px rgba(120, 96, 50, 0.15)',
        animationDelay: `${index * 80}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          '0 1px 2px rgba(0,0,0,0.03), 0 16px 36px -18px rgba(120, 96, 50, 0.28)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          '0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -16px rgba(120, 96, 50, 0.15)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* editorial thumbnail */}
      <div
        className="relative h-[88px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${trend.thumb.from} 0%, ${trend.thumb.via} 55%, ${trend.thumb.to} 100%)`,
        }}
      >
        {/* layered shapes */}
        <div
          className="absolute -right-6 -top-6 w-24 h-24 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />
        <div
          className="absolute left-4 bottom-3 w-10 h-10 rounded-xl"
          style={{
            background: `linear-gradient(140deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05))`,
            border: '1px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(2px)',
          }}
        />
        <div
          className="absolute right-4 bottom-4 w-12 h-6 rounded-md"
          style={{
            background: `linear-gradient(90deg, ${trend.thumb.accent}, ${trend.thumb.to})`,
            opacity: 0.55,
          }}
        />
        {/* signal pill */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold"
          style={{
            background: 'rgba(255,255,255,0.78)',
            color: signalColor,
            border: '1px solid rgba(255,255,255,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-signal-pulse"
            style={{ background: signalColor }}
          />
          {trend.signal} signal
        </div>
      </div>

      {/* body */}
      <div className="px-4 pt-3.5 pb-4 flex-1 flex flex-col">
        <div
          className="flex items-center gap-1.5 text-[10.5px] font-medium mb-1.5"
          style={{ color: '#9b8466' }}
        >
          <SourceDotIcon />
          <span className="uppercase tracking-[0.08em]">{trend.source}</span>
        </div>

        <h4
          className="text-[14.5px] leading-snug tracking-[-0.01em] mb-1.5"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#2c2c2c',
          }}
        >
          {trend.title}
        </h4>

        <p
          className="text-[12px] leading-relaxed mb-3"
          style={{ color: '#6b6560' }}
        >
          {trend.summary}
        </p>

        {/* signal bar */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-[9.5px] uppercase tracking-[0.12em] font-semibold mb-1.5"
            style={{ color: '#b5a988' }}
          >
            <span>Signal strength</span>
            <span style={{ color: signalColor }}>
              {Math.round(trend.signalLevel * 100)}
            </span>
          </div>
          <div
            className="relative h-[3px] rounded-full overflow-hidden"
            style={{ background: 'rgba(200, 169, 110, 0.12)' }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${trend.signalLevel * 100}%`,
                background: `linear-gradient(90deg, #c8a96e, ${signalColor})`,
              }}
            />
          </div>

          {/* tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {trend.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                style={{
                  background: 'rgba(200, 169, 110, 0.07)',
                  color: '#8a7a6b',
                  border: '1px solid rgba(200, 169, 110, 0.13)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Research Phase ──────────────────────────────────────────────────

export function ResearchPhase() {
  const { goToNextPhase, setActivePhase } = useCampaign();

  const handleBack = useCallback(() => {
    setActivePhase('brief');
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
                Audience &amp; Trend Research
              </h2>
              <p
                className="text-[12.5px] mt-1.5 leading-relaxed max-w-[560px]"
                style={{ color: '#9b9590' }}
              >
                The agents are identifying who this campaign is truly for, and
                surfacing the cultural signals shaping how it should land right
                now.
              </p>
            </div>
          </div>

          {/* live status pill */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg flex-shrink-0 mt-1"
            style={{
              background: 'rgba(200, 169, 110, 0.06)',
              border: '1px solid rgba(200, 169, 110, 0.15)',
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
              Trend Scout · Processing
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
        <div className="max-w-[880px] mx-auto">
          {/* ── AUDIENCE INSIGHTS ─────────────────────────── */}
          <SectionLabel kicker="What we know about who this is for.">
            Audience Insights
          </SectionLabel>

          <div className="animate-rise-in" style={{ animationDelay: '40ms' }}>
            <PrimaryAudienceCard />
          </div>

          {/* Demographic clusters */}
          <div
            className="mt-5 animate-rise-in"
            style={{ animationDelay: '120ms' }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: '#8a7a6b' }}
              >
                Demographic Clusters
              </span>
              <span className="text-[10.5px]" style={{ color: '#b5b0a8' }}>
                4 segments identified
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {demographicClusters.map((c) => (
                <ClusterPill key={c.label} label={c.label} meta={c.meta} />
              ))}
            </div>
          </div>

          {/* Three-column qualitative grid */}
          <div
            className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 animate-rise-in"
            style={{ animationDelay: '200ms' }}
          >
            <InsightColumn
              title="Motivations"
              items={motivations}
              accent="gold"
            />
            <InsightColumn
              title="Behavior Patterns"
              items={behaviors}
              accent="green"
            />
            <InsightColumn
              title="Content Preferences"
              items={contentPreferences}
              accent="plum"
            />
          </div>

          {/* Section divider */}
          <div
            className="my-9 flex items-center gap-4"
            aria-hidden="true"
          >
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

          {/* ── TREND REFERENCES ─────────────────────────── */}
          <SectionLabel kicker="Cultural and visual signals shaping the moment.">
            Trend References
          </SectionLabel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trends.map((t, i) => (
              <TrendCard key={t.id} trend={t} index={i} />
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
                e.currentTarget.style.background =
                  'rgba(200, 169, 110, 0.12)';
                e.currentTarget.style.borderColor =
                  'rgba(200, 169, 110, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'rgba(200, 169, 110, 0.06)';
                e.currentTarget.style.borderColor =
                  'rgba(200, 169, 110, 0.15)';
              }}
            >
              <ArrowLeftIcon />
              Back to Brief
            </button>

            <div className="flex items-center gap-3">
              <span
                className="text-[10.5px]"
                style={{ color: '#b5b0a8' }}
              >
                Research auto-saved
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
                Continue to {PHASES[2].label}
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
