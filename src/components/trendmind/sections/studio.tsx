'use client';

// Studio — the visual production stage.
// Shows the composed ad preview (canvas left) and its layer stack
// (right). Clicking a layer opens it in the Inspector.

import React from 'react';
import { SectionShell, Attribution } from './section-shell';
import {
  AGENTS,
  DRAFT_ATOMS,
  DRAFT_VARIANTS,
  STUDIO_LAYERS,
} from '@/lib/campaign-data';
import { useStore } from '@/lib/workspace-store';

export function StudioSection() {
  const { selectedVariantId, openInspector, inspector } = useStore();
  const variant = DRAFT_VARIANTS.find((v) => v.id === selectedVariantId) ?? DRAFT_VARIANTS[0];
  const hook = DRAFT_ATOMS.find((a) => a.id === variant.hookId);
  const cta = DRAFT_ATOMS.find((a) => a.id === variant.ctaId);

  return (
    <SectionShell
      id="studio"
      tagline="Visual production — composed from the elevated variant, layer by layer"
      rightSlot={<Attribution agentShort={AGENTS.visual.short} accent={AGENTS.visual.accent} extra="composing" />}
    >
      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        {/* Left: the preview canvas */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, #1a1612 0%, #242019 100%)',
            border: '1px solid #e4ded4',
            boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
            minHeight: '420px',
          }}
        >
          {/* The composed "ad" */}
          <AdCanvas hook={hook?.text ?? ''} cta={cta?.text ?? ''} />
          {/* Canvas chrome */}
          <div
            className="absolute top-2.5 left-3 flex items-center gap-1.5 z-20"
            style={{ color: 'rgba(245,232,200,0.8)' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: '#c8a96e' }} />
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium">Preview · 4:5</span>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 z-20">
            <CanvasBtn>Refresh</CanvasBtn>
            <CanvasBtn>Focus mode</CanvasBtn>
          </div>
        </div>

        {/* Right: the layer stack */}
        <div
          className="rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: '#fbf8f2',
            border: '1px solid #e4ded4',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <div
            className="px-4 py-2.5 flex items-center justify-between"
            style={{ borderBottom: '1px solid #eae3d6', background: '#f5f1ea' }}
          >
            <span
              className="text-[10px] tracking-[0.18em] uppercase font-semibold"
              style={{ color: '#a68b4b' }}
            >
              Layers
            </span>
            <span className="text-[10px]" style={{ color: '#9b9590' }}>
              {STUDIO_LAYERS.length} · top to bottom
            </span>
          </div>
          <div className="flex-1 divide-y" style={{ borderColor: '#eae3d6' }}>
            {[...STUDIO_LAYERS].reverse().map((l) => {
              const selected = inspector.kind === 'layer' && inspector.id === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => openInspector('layer', l.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all"
                  style={{
                    background: selected ? 'rgba(200,169,110,0.08)' : 'transparent',
                    borderLeft: selected ? '2px solid #c8a96e' : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) e.currentTarget.style.background = 'rgba(200,169,110,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <LayerIcon kind={l.kind} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium" style={{ color: '#2c2c2c' }}>
                      {l.name}
                    </div>
                    <div className="text-[11px] leading-[1.4] truncate" style={{ color: '#6b6560' }}>
                      {l.note}
                    </div>
                  </div>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#b0a99e" strokeWidth="1.3" strokeLinecap="round">
                    <path d="M3.5 2L6.5 5L3.5 8" />
                  </svg>
                </button>
              );
            })}
          </div>
          <div
            className="px-4 py-2.5 flex items-center justify-between"
            style={{ borderTop: '1px solid #eae3d6', background: '#f0ebe1' }}
          >
            <span className="text-[11px]" style={{ color: '#6b6560' }}>
              Built from <span style={{ color: '#1e3a2f', fontWeight: 500 }}>Variant {variant.id.replace('v', '')}</span>
            </span>
            <button
              className="text-[11px] font-medium tracking-[0.04em]"
              style={{ color: '#3d7a5f' }}
            >
              Generate alt →
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

// ── The ad canvas (CSS-composed preview) ─────────────────────────────

function AdCanvas({ hook, cta }: { hook: string; cta: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        // Warm linen background — layered gradients to avoid needing image assets
        background:
          'radial-gradient(520px 260px at 60% 30%, rgba(236,214,164,0.45), transparent 70%), ' +
          'radial-gradient(420px 240px at 30% 80%, rgba(107,86,53,0.35), transparent 70%), ' +
          'linear-gradient(160deg, #403226 0%, #2a1f16 100%)',
      }}
    >
      {/* Linen texture — cross-hatched repeating gradient */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(92deg, rgba(255,230,180,0.8) 0, rgba(255,230,180,0.8) 1px, transparent 1px, transparent 3px), ' +
            'repeating-linear-gradient(2deg, rgba(255,230,180,0.8) 0, rgba(255,230,180,0.8) 1px, transparent 1px, transparent 3px)',
        }}
      />
      {/* Subject — a stylized wrapped object (pure CSS shape) */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative w-[160px] h-[140px]"
          style={{ filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.35))' }}
        >
          {/* Box body */}
          <div
            className="absolute inset-x-6 bottom-0 top-6 rounded-[6px]"
            style={{
              background:
                'linear-gradient(180deg, #e8d4a8 0%, #d4bb85 60%, #ab8d5a 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -4px 8px rgba(0,0,0,0.12)',
            }}
          />
          {/* Ribbon vertical */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[18px]"
            style={{
              background:
                'linear-gradient(90deg, #6d4f33 0%, #8c6a45 50%, #6d4f33 100%)',
              boxShadow: '0 0 12px rgba(0,0,0,0.25)',
            }}
          />
          {/* Ribbon horizontal */}
          <div
            className="absolute left-0 right-0 top-[48%] -translate-y-1/2 h-[14px]"
            style={{
              background:
                'linear-gradient(180deg, #6d4f33 0%, #8c6a45 50%, #6d4f33 100%)',
              boxShadow: '0 0 12px rgba(0,0,0,0.25)',
            }}
          />
          {/* Bow loops */}
          <div
            className="absolute left-1/2 top-[10px] -translate-x-1/2 w-[60px] h-[24px] rounded-full"
            style={{
              background:
                'linear-gradient(180deg, #8c6a45 0%, #6d4f33 100%)',
              clipPath: 'ellipse(50% 50% at 25% 50%) , ellipse(50% 50% at 75% 50%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
            }}
          />
        </div>
      </div>

      {/* Headline */}
      <div className="absolute left-0 right-0 bottom-28 flex justify-center px-8">
        <p
          className="text-center text-[28px] leading-[1.2] tracking-[-0.01em] italic max-w-[420px]"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#f5e8c8',
            textShadow: '0 2px 8px rgba(0,0,0,0.35)',
          }}
        >
          “{hook}”
        </p>
      </div>

      {/* CTA */}
      <div className="absolute left-0 right-0 bottom-14 flex justify-center">
        <div
          className="px-4 py-2 rounded-full text-[12px] font-medium tracking-[0.08em]"
          style={{
            color: '#1e3a2f',
            background: 'linear-gradient(160deg, #dcc487, #a68b4b)',
            boxShadow: '0 6px 18px rgba(200,169,110,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          {cta}
        </div>
      </div>

      {/* Mark */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
        <div
          className="w-5 h-5 rounded-[5px] flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #dcc487, #a68b4b)',
            opacity: 0.75,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 7L4 5L6 6L8 3" stroke="#1e3a2f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-[9.5px] tracking-[0.18em] uppercase" style={{ color: 'rgba(220,196,135,0.7)' }}>
          Northfield
        </span>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(1000px 600px at 50% 40%, transparent 60%, rgba(0,0,0,0.35) 100%)',
        }}
      />
    </div>
  );
}

function CanvasBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="px-2 py-1 rounded-md text-[10.5px] tracking-[0.08em] font-medium"
      style={{
        color: '#dcc487',
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(200,169,110,0.25)',
      }}
    >
      {children}
    </button>
  );
}

function LayerIcon({ kind }: { kind: string }) {
  const common = 'w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center';
  if (kind === 'bg') {
    return (
      <div className={common} style={{ background: 'linear-gradient(160deg, #d4bb85, #8c6a45)' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round">
          <rect x="1.5" y="1.5" width="9" height="9" rx="1" />
        </svg>
      </div>
    );
  }
  if (kind === 'subject') {
    return (
      <div className={common} style={{ background: 'linear-gradient(160deg, #6d4f33, #3b2d1e)' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#dcc487" strokeWidth="1.3" strokeLinecap="round">
          <rect x="2" y="3" width="8" height="7" rx="0.5" />
          <path d="M2 6H10M6 3V10" />
        </svg>
      </div>
    );
  }
  if (kind === 'headline') {
    return (
      <div className={common} style={{ background: '#1e3a2f' }}>
        <span className="text-[12px]" style={{ color: '#dcc487', fontFamily: 'var(--font-heading)', fontStyle: 'italic' }}>
          T
        </span>
      </div>
    );
  }
  if (kind === 'cta') {
    return (
      <div className={common} style={{ background: 'linear-gradient(160deg, #dcc487, #a68b4b)' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#1e3a2f" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 6H9M9 6L7 4M9 6L7 8" />
        </svg>
      </div>
    );
  }
  return (
    <div className={common} style={{ background: '#faf7f2', border: '1px solid #d8d0c4' }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 8L4 5L6 6L8 3L10 5" stroke="#a68b4b" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
