'use client';

import React from 'react';

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 8.5V12.5H11.5V8.5" />
      <path d="M8 2.5V9.5" />
      <path d="M5.5 5L8 2.5L10.5 5" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2.5V10" />
      <path d="M5 7L8 10L11 7" />
      <path d="M3.5 12.5H12.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 2V3.5M8 12.5V14M2 8H3.5M12.5 8H14M3.8 3.8L4.9 4.9M11.1 11.1L12.2 12.2M3.8 12.2L4.9 11.1M11.1 4.9L12.2 3.8" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="12" cy="8" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TopBarButton({
  icon,
  label,
  showLabel = true,
}: {
  icon: React.ReactNode;
  label: string;
  showLabel?: boolean;
}) {
  return (
    <button
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200"
      style={{
        color: '#7a756e',
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(200, 169, 110, 0.08)';
        e.currentTarget.style.color = '#2c2c2c';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#7a756e';
      }}
      title={label}
    >
      {icon}
      {showLabel && <span>{label}</span>}
    </button>
  );
}

function IconOnlyButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
      style={{
        color: '#9b9590',
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(200, 169, 110, 0.1)';
        e.currentTarget.style.color = '#6b6560';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#9b9590';
      }}
      title={label}
    >
      {icon}
    </button>
  );
}

export function TopBar() {
  return (
    <header
      className="flex items-center justify-between px-6 h-[48px] flex-shrink-0"
      style={{
        borderBottom: '1px solid #e4ded4',
        background: 'linear-gradient(180deg, #faf7f2 0%, #f7f3ec 100%)',
      }}
    >
      {/* Left: Page title */}
      <h1
        className="text-[17px] font-normal tracking-[-0.01em]"
        style={{
          fontFamily: 'var(--font-heading)',
          color: '#2c2c2c',
        }}
      >
        Q4 Holiday Push – Strategy Thread
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-0.5">
        <TopBarButton icon={<ShareIcon />} label="Share" />
        <TopBarButton icon={<ExportIcon />} label="Export" />
        {/* Subtle divider between labeled and icon-only actions */}
        <div className="w-px h-4 mx-1.5" style={{ background: '#e4ded4' }} />
        <IconOnlyButton icon={<SettingsIcon />} label="Settings" />
        <IconOnlyButton icon={<MoreIcon />} label="More" />
      </div>
    </header>
  );
}
