'use client';

// Compact top strip. Holds campaign identity, status, and the highest-level
// actions (Share, Export, Director). Deliberately thin — the workspace
// below is the product.

import React from 'react';

export function TopStrip() {
  return (
    <header
      className="flex items-center justify-between h-[44px] px-5 flex-shrink-0 relative"
      style={{
        background: 'linear-gradient(180deg, #faf7f2 0%, #f4efe7 100%)',
        borderBottom: '1px solid #e4ded4',
      }}
    >
      {/* Left — campaign identity */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase" style={{ color: '#9b9590' }}>
          <span>Northfield Supply Co.</span>
          <span style={{ color: '#c8a96e' }}>/</span>
        </div>
        <h1
          className="text-[15px] tracking-[-0.005em] font-medium truncate"
          style={{ fontFamily: 'var(--font-heading)', color: '#2c2c2c' }}
        >
          Q4 Holiday Push
        </h1>
        <StatusPill />
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        <TextBtn label="Director" iconLeft={<ChatIcon />} accent />
        <Divider />
        <TextBtn label="Share" iconLeft={<ShareIcon />} />
        <TextBtn label="Export" iconLeft={<ExportIcon />} />
        <Divider />
        <IconBtn label="More" icon={<MoreIcon />} />
      </div>
    </header>
  );
}

function StatusPill() {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[10.5px] font-medium tracking-[0.04em]"
      style={{
        color: '#3d7a5f',
        background: 'rgba(61, 122, 95, 0.08)',
        border: '1px solid rgba(61, 122, 95, 0.18)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
        style={{ background: '#4a9070' }}
      />
      Live
    </div>
  );
}

function TextBtn({
  label,
  iconLeft,
  accent,
}: {
  label: string;
  iconLeft?: React.ReactNode;
  accent?: boolean;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium transition-all duration-200"
      style={{
        color: accent ? (hover ? '#1e3a2f' : '#3d7a5f') : hover ? '#2c2c2c' : '#6b6560',
        background: accent
          ? hover
            ? 'rgba(61, 122, 95, 0.14)'
            : 'rgba(61, 122, 95, 0.07)'
          : hover
            ? 'rgba(200, 169, 110, 0.12)'
            : 'transparent',
        border: accent ? '1px solid rgba(61, 122, 95, 0.25)' : '1px solid transparent',
      }}
    >
      {iconLeft}
      {label}
    </button>
  );
}

function IconBtn({ label, icon }: { label: string; icon: React.ReactNode }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={label}
      className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200"
      style={{
        color: hover ? '#2c2c2c' : '#9b9590',
        background: hover ? 'rgba(200, 169, 110, 0.12)' : 'transparent',
      }}
    >
      {icon}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-4 mx-1" style={{ background: '#e4ded4' }} />;
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4C2 2.9 2.9 2 4 2H10C11.1 2 12 2.9 12 4V8C12 9.1 11.1 10 10 10H6L3 12.5V10C2.4 10 2 9.6 2 9V4Z" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7.5V11H10V7.5" />
      <path d="M7 2V9" />
      <path d="M4.5 4.5L7 2L9.5 4.5" />
    </svg>
  );
}
function ExportIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2V8.5" />
      <path d="M4.5 6L7 8.5L9.5 6" />
      <path d="M3 11H11" />
    </svg>
  );
}
function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="3.5" cy="7" r="1.1" fill="currentColor" />
      <circle cx="7" cy="7" r="1.1" fill="currentColor" />
      <circle cx="10.5" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}
