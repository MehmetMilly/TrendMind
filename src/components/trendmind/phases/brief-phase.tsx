'use client';

import React, { useState, useCallback } from 'react';
import { useCampaign } from '@/lib/campaign-context';
import type { BriefFormData } from '@/lib/campaign-context';

// ─── Micro components ────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-[0.1em] block mb-3"
      style={{ color: '#a68b4b' }}
    >
      {children}
    </span>
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <label className="block mb-1.5">
      <span className="text-[12px] font-semibold" style={{ color: '#3d3835' }}>
        {children}
      </span>
      {hint && (
        <span className="text-[10.5px] font-normal ml-2" style={{ color: '#b5b0a8' }}>
          {hint}
        </span>
      )}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all duration-200 outline-none"
      style={{
        background: '#faf7f2',
        border: '1px solid #e4ded4',
        color: '#2c2c2c',
        fontFamily: 'var(--font-body)',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.45)';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 169, 110, 0.08)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#e4ded4';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3.5 py-2.5 rounded-lg text-[13px] leading-relaxed resize-none transition-all duration-200 outline-none"
      style={{
        background: '#faf7f2',
        border: '1px solid #e4ded4',
        color: '#2c2c2c',
        fontFamily: 'var(--font-body)',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.45)';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 169, 110, 0.08)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#e4ded4';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-lg text-[13px] transition-all duration-200 outline-none appearance-none cursor-pointer"
      style={{
        background: '#faf7f2',
        border: '1px solid #e4ded4',
        color: '#2c2c2c',
        fontFamily: 'var(--font-body)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%239b9590' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '36px',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.45)';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 169, 110, 0.08)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#e4ded4';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function ChipGroup({
  items,
  onRemove,
  onAdd,
  addPlaceholder,
}: {
  items: string[];
  onRemove: (index: number) => void;
  onAdd: (value: string) => void;
  addPlaceholder: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all duration-150 group cursor-default"
          style={{
            background: 'rgba(200, 169, 110, 0.08)',
            color: '#6b5d4a',
            border: '1px solid rgba(200, 169, 110, 0.15)',
          }}
        >
          {item}
          <button
            onClick={() => onRemove(i)}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity duration-150"
            style={{ color: '#8a7a6b' }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2L6 6M6 2L2 6" />
            </svg>
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={addPlaceholder}
        className="min-w-[120px] flex-1 px-2 py-1 text-[11.5px] outline-none bg-transparent"
        style={{
          color: '#2c2c2c',
          fontFamily: 'var(--font-body)',
        }}
      />
    </div>
  );
}

function BannedChipGroup({
  items,
  onRemove,
  onAdd,
  addPlaceholder,
}: {
  items: string[];
  onRemove: (index: number) => void;
  onAdd: (value: string) => void;
  addPlaceholder: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all duration-150 group cursor-default"
          style={{
            background: 'rgba(180, 80, 60, 0.06)',
            color: '#9b5a4a',
            border: '1px solid rgba(180, 80, 60, 0.12)',
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="opacity-50 flex-shrink-0">
            <circle cx="4" cy="4" r="3" />
            <path d="M2.5 5.5L5.5 2.5" />
          </svg>
          {item}
          <button
            onClick={() => onRemove(i)}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity duration-150"
            style={{ color: '#9b5a4a' }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2L6 6M6 2L2 6" />
            </svg>
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={addPlaceholder}
        className="min-w-[120px] flex-1 px-2 py-1 text-[11.5px] outline-none bg-transparent"
        style={{
          color: '#2c2c2c',
          fontFamily: 'var(--font-body)',
        }}
      />
    </div>
  );
}

// ─── Save‑toast icon ─────────────────────────────────────────────────

function SaveCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#4a9070" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 7.5L5.8 9.8L10.5 4.5" />
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

function DocumentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2H4.5C3.9 2 3.5 2.4 3.5 3V13C3.5 13.6 3.9 14 4.5 14H11.5C12.1 14 12.5 13.6 12.5 13V5L9.5 2Z" />
      <path d="M9.5 2V5H12.5" />
      <path d="M6 8H10M6 10.5H10" />
    </svg>
  );
}

// ─── Brief Phase ─────────────────────────────────────────────────────

export function BriefPhase() {
  const {
    briefData,
    updateBriefField,
    briefDraftSaved,
    saveBriefDraft,
    goToNextPhase,
  } = useCampaign();

  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveDraft = useCallback(() => {
    saveBriefDraft();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  }, [saveBriefDraft]);

  const handleContinue = useCallback(() => {
    saveBriefDraft();
    goToNextPhase();
  }, [saveBriefDraft, goToNextPhase]);

  const handlePillarRemove = useCallback(
    (index: number) => {
      updateBriefField(
        'brandPillars',
        briefData.brandPillars.filter((_, i) => i !== index),
      );
    },
    [briefData.brandPillars, updateBriefField],
  );

  const handlePillarAdd = useCallback(
    (value: string) => {
      updateBriefField('brandPillars', [...briefData.brandPillars, value]);
    },
    [briefData.brandPillars, updateBriefField],
  );

  const handleBannedRemove = useCallback(
    (index: number) => {
      updateBriefField(
        'bannedPhrases',
        briefData.bannedPhrases.filter((_, i) => i !== index),
      );
    },
    [briefData.bannedPhrases, updateBriefField],
  );

  const handleBannedAdd = useCallback(
    (value: string) => {
      updateBriefField('bannedPhrases', [...briefData.bannedPhrases, value]);
    },
    [briefData.bannedPhrases, updateBriefField],
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-phase-enter overflow-hidden">
      {/* Phase header */}
      <div className="px-8 pt-7 pb-5 flex-shrink-0">
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: 'linear-gradient(135deg, rgba(200, 169, 110, 0.12), rgba(200, 169, 110, 0.06))',
              border: '1px solid rgba(200, 169, 110, 0.15)',
            }}
          >
            <DocumentIcon />
          </div>
          <div>
            <h2
              className="text-[22px] font-normal tracking-[-0.02em] leading-tight"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#2c2c2c',
              }}
            >
              Campaign Brief
            </h2>
            <p
              className="text-[12.5px] mt-1.5 leading-relaxed max-w-[480px]"
              style={{ color: '#9b9590' }}
            >
              Define the campaign scope, audience, and creative direction. Completing this brief will activate all agents for deep analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Subtle divider */}
      <div className="mx-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(228, 222, 212, 0.8), rgba(228, 222, 212, 0.3))' }} />

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-8 pt-6 pb-8">
        <div className="max-w-[640px]">

          {/* ── Section: Campaign Identity ──────────────────────── */}
          <SectionLabel>Campaign Identity</SectionLabel>

          <div className="space-y-4 mb-7">
            <div>
              <FieldLabel>Campaign Title</FieldLabel>
              <TextInput
                value={briefData.campaignTitle}
                onChange={(v) => updateBriefField('campaignTitle', v)}
                placeholder="e.g. Q4 Holiday Push"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel hint="Company or project">Brand / Project Name</FieldLabel>
                <TextInput
                  value={briefData.brand}
                  onChange={(v) => updateBriefField('brand', v)}
                  placeholder="Brand name"
                />
              </div>
              <div>
                <FieldLabel>Business Type</FieldLabel>
                <TextInput
                  value={briefData.businessType}
                  onChange={(v) => updateBriefField('businessType', v)}
                  placeholder="e.g. Premium lifestyle"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Platform</FieldLabel>
                <SelectInput
                  value={briefData.platform}
                  onChange={(v) => updateBriefField('platform', v)}
                  options={['X (Twitter)', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'Multi-platform']}
                />
              </div>
              <div>
                <FieldLabel>Primary Language</FieldLabel>
                <SelectInput
                  value={briefData.primaryLanguage}
                  onChange={(v) => updateBriefField('primaryLanguage', v)}
                  options={['English', 'Spanish', 'French', 'German', 'Portuguese', 'Japanese', 'Arabic']}
                />
              </div>
            </div>
          </div>

          {/* ── Section: Audience & Goal ────────────────────────── */}
          <SectionLabel>Audience &amp; Goal</SectionLabel>

          <div className="space-y-4 mb-7">
            <div>
              <FieldLabel hint="What success looks like">Goal</FieldLabel>
              <TextArea
                value={briefData.goal}
                onChange={(v) => updateBriefField('goal', v)}
                placeholder="Describe the primary campaign goal…"
                rows={2}
              />
            </div>

            <div>
              <FieldLabel>Target Audience</FieldLabel>
              <TextArea
                value={briefData.targetAudience}
                onChange={(v) => updateBriefField('targetAudience', v)}
                placeholder="Who is this campaign for?"
                rows={2}
              />
            </div>

            <div>
              <FieldLabel>Campaign Focus</FieldLabel>
              <TextInput
                value={briefData.campaignFocus}
                onChange={(v) => updateBriefField('campaignFocus', v)}
                placeholder="Key themes separated by commas"
              />
            </div>
          </div>

          {/* ── Section: Creative Direction ─────────────────────── */}
          <SectionLabel>Creative Direction</SectionLabel>

          <div className="space-y-4 mb-7">
            <div>
              <FieldLabel>Tone of Voice</FieldLabel>
              <TextInput
                value={briefData.toneOfVoice}
                onChange={(v) => updateBriefField('toneOfVoice', v)}
                placeholder="e.g. Warm, refined, editorial"
              />
            </div>

            <div>
              <FieldLabel hint="Press Enter to add">Brand Pillars</FieldLabel>
              <div
                className="rounded-lg px-3 py-2.5 min-h-[42px]"
                style={{
                  background: '#faf7f2',
                  border: '1px solid #e4ded4',
                }}
              >
                <ChipGroup
                  items={briefData.brandPillars}
                  onRemove={handlePillarRemove}
                  onAdd={handlePillarAdd}
                  addPlaceholder="Add pillar…"
                />
              </div>
            </div>

            <div>
              <FieldLabel hint="Phrases to avoid">Banned Phrases</FieldLabel>
              <div
                className="rounded-lg px-3 py-2.5 min-h-[42px]"
                style={{
                  background: '#faf7f2',
                  border: '1px solid #e4ded4',
                }}
              >
                <BannedChipGroup
                  items={briefData.bannedPhrases}
                  onRemove={handleBannedRemove}
                  onAdd={handleBannedAdd}
                  addPlaceholder="Add phrase…"
                />
              </div>
            </div>
          </div>

          {/* ── Section: Additional Context ─────────────────────── */}
          <SectionLabel>Additional Context</SectionLabel>

          <div className="mb-8">
            <div>
              <FieldLabel hint="Optional — anything the agents should know">Extra Context</FieldLabel>
              <TextArea
                value={briefData.extraContext}
                onChange={(v) => updateBriefField('extraContext', v)}
                placeholder="Add any extra context, references, or constraints…"
                rows={4}
              />
            </div>
          </div>

          {/* ── Actions ────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between pt-5"
            style={{ borderTop: '1px solid rgba(228, 222, 212, 0.7)' }}
          >
            <div className="flex items-center gap-3">
              {/* Save Draft */}
              <button
                onClick={handleSaveDraft}
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
                Save Draft
              </button>

              {/* Saved confirmation */}
              {showSavedToast && (
                <span className="flex items-center gap-1.5 text-[11px] font-medium animate-fade-in" style={{ color: '#4a9070' }}>
                  <SaveCheckIcon />
                  Draft saved
                </span>
              )}
              {briefDraftSaved && !showSavedToast && (
                <span className="text-[10.5px] font-medium" style={{ color: '#b5b0a8' }}>
                  Draft saved
                </span>
              )}
            </div>

            {/* Continue CTA */}
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[12.5px] font-semibold transition-all duration-250"
              style={{
                background: 'linear-gradient(135deg, #c8a96e, #a68b4b)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(166, 139, 75, 0.3), 0 1px 2px rgba(0,0,0,0.06)',
                border: 'none',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(166, 139, 75, 0.4), 0 1px 2px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-0.5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(166, 139, 75, 0.3), 0 1px 2px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Continue to Research
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
