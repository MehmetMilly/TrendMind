"use client";

import React from "react";

import { AGENTS } from "@/lib/campaign-data";
import { useStore } from "@/lib/workspace-store";

import { SectionShell } from "./section-shell";

export function BriefSection() {
  const { brief, updateBrief } = useStore();
  if (!brief) return null;

  return (
    <SectionShell id="brief">
      <div
        className="overflow-hidden rounded-xl"
        style={{
          background: "#fdfaf5",
          border: "1px solid #e4ded4",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <div className="flex items-center gap-0" style={{ borderBottom: "1px solid #ece5d8" }}>
          <Field
            label="Campaign"
            value={brief.campaignName}
            onChange={(value) => updateBrief("campaignName", value)}
            className="flex-[1.3]"
            heading
          />
          <Field
            label="Brand"
            value={brief.brandName}
            onChange={(value) => updateBrief("brandName", value)}
            className="flex-1"
            border
          />
          <Field
            label="Platform"
            value={brief.platform}
            onChange={(value) => updateBrief("platform", value)}
            className="flex-[0.6]"
            border
          />
        </div>

        <div className="grid grid-cols-[1fr_0.6fr_0.8fr] gap-0" style={{ borderBottom: "1px solid #ece5d8" }}>
          <Field
            label="Product"
            value={brief.productName}
            onChange={(value) => updateBrief("productName", value)}
            className="px-4 py-2.5"
          />
          <Field
            label="Language"
            value={brief.language}
            onChange={(value) => updateBrief("language", value)}
            className="px-4 py-2.5"
            border
          />
          <Field
            label="Tone"
            value={brief.tone}
            onChange={(value) => updateBrief("tone", value)}
            className="px-4 py-2.5"
            border
          />
        </div>

        <TextArea
          label="Goal"
          value={brief.goal}
          onChange={(value) => updateBrief("goal", value)}
          rows={2}
          accent="#a68b4b"
        />

        <TextArea
          label="Value proposition"
          value={brief.valueProposition}
          onChange={(value) => updateBrief("valueProposition", value)}
          rows={2}
        />

        <TextArea
          label="Audience"
          value={brief.audience}
          onChange={(value) => updateBrief("audience", value)}
          rows={2}
        />

        <div className="grid grid-cols-3 gap-0" style={{ borderBottom: "1px solid #ece5d8" }}>
          <ChipGroup
            label="Pillars"
            values={brief.pillars}
            onChange={(values) => updateBrief("pillars", values)}
            accent="#3d7a5f"
          />
          <ChipGroup
            label="Avoid"
            values={brief.avoid}
            onChange={(values) => updateBrief("avoid", values)}
            accent="#8a6a5a"
            border
          />
          <ChipGroup
            label="Guardrails"
            values={brief.guardrails}
            onChange={(values) => updateBrief("guardrails", values)}
            accent="#4f6e87"
            border
          />
        </div>

        <div className="grid grid-cols-2 gap-0" style={{ borderBottom: "1px solid #ece5d8" }}>
          <ChipGroup
            label="Brand links"
            values={brief.brandLinks}
            onChange={(values) => updateBrief("brandLinks", values)}
            accent="#6b6560"
          />
          <ChipGroup
            label="References"
            values={brief.references}
            onChange={(values) => updateBrief("references", values)}
            accent="#a68b4b"
            border
          />
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr] gap-0">
          <TextArea
            label="Context"
            value={brief.context}
            onChange={(value) => updateBrief("context", value)}
            rows={3}
            italic
          />
          <TextArea
            label="Call to action"
            value={brief.callToAction}
            onChange={(value) => updateBrief("callToAction", value)}
            rows={3}
            border
          />
        </div>

        <div className="flex items-center justify-between px-4 py-2" style={{ background: "#f0ebe1" }}>
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.08em]" style={{ color: "#9b9590" }}>
            <span className="h-1 w-1 rounded-full" style={{ background: AGENTS.director.accent }} />
            <span style={{ color: AGENTS.director.accent }}>{AGENTS.director.short}</span>
            <span>· source of truth</span>
          </div>
          <div className="text-[9px]" style={{ color: "#9b9590" }}>
            All downstream phases read from this brief.
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
  className,
  border,
  heading,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  border?: boolean;
  heading?: boolean;
}) {
  return (
    <div
      className={className ?? "px-4 py-2.5"}
      style={border ? { borderLeft: "1px solid #ece5d8" } : undefined}
    >
      <div className="mb-1 text-[8.5px] font-bold uppercase tracking-[0.2em]" style={{ color: "#b0a99e" }}>
        {label}
      </div>
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent outline-none"
        style={{
          color: "#1f1d1a",
          fontFamily: heading ? "var(--font-heading)" : undefined,
          fontSize: heading ? "15px" : "13px",
          letterSpacing: heading ? "-0.01em" : "0",
        }}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
  accent,
  border,
  italic,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  accent?: string;
  border?: boolean;
  italic?: boolean;
}) {
  return (
    <div
      className="px-4 py-3"
      style={{
        borderBottom: label === "Call to action" || label === "Context" ? undefined : "1px solid #ece5d8",
        borderLeft: border ? "1px solid #ece5d8" : undefined,
      }}
    >
      <div className="mb-1 text-[8.5px] font-bold uppercase tracking-[0.2em]" style={{ color: accent ?? "#b0a99e" }}>
        {label}
      </div>
      <textarea
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full resize-none bg-transparent text-[13px] leading-[1.55] outline-none"
        style={{
          color: label === "Audience" ? "#3a3631" : "#1f1d1a",
          fontStyle: italic ? "italic" : "normal",
          fontFamily: italic ? "var(--font-heading)" : undefined,
        }}
      />
    </div>
  );
}

function ChipGroup({
  label,
  values,
  onChange,
  accent,
  border,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  accent: string;
  border?: boolean;
}) {
  const [draft, setDraft] = React.useState("");

  return (
    <div className="px-4 py-2.5" style={border ? { borderLeft: "1px solid #ece5d8" } : undefined}>
      <div className="mb-1.5 text-[8.5px] font-bold uppercase tracking-[0.2em]" style={{ color: "#b0a99e" }}>
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className="inline-flex items-center gap-1 rounded-full px-1.5 py-[2px] text-[10.5px] font-medium"
            style={{
              color: accent,
              background: `${accent}10`,
              border: `1px solid ${accent}22`,
            }}
          >
            {value}
            <button
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              className="opacity-30 transition-opacity hover:opacity-100"
            >
              ×
            </button>
          </span>
        ))}
        <input
          aria-label={`${label} input`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && draft.trim()) {
              event.preventDefault();
              onChange([...values, draft.trim()]);
              setDraft("");
            }
          }}
          placeholder="+"
          className="w-8 bg-transparent px-1 text-[10.5px] outline-none"
          style={{ color: "#9b9590" }}
        />
      </div>
    </div>
  );
}
