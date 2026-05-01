'use client';

// A slim spine on the left — workspace, campaigns, library, analytics,
// account. Never steals width from the main workspace.

import React from 'react';

interface RailItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

function IconWorkspace() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 4.5L8.5 2L14.5 4.5V12L8.5 14.5L2.5 12V4.5Z" />
      <path d="M2.5 4.5L8.5 7L14.5 4.5" />
      <path d="M8.5 7V14.5" />
    </svg>
  );
}
function IconCampaigns() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12V4L13 8L3 12Z" />
      <path d="M3 12V14" />
    </svg>
  );
}
function IconLibrary() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="4.5" height="5" rx="0.8" />
      <rect x="9" y="2.5" width="4.5" height="4" rx="0.8" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="0.8" />
      <rect x="9" y="8" width="4.5" height="5.5" rx="0.8" />
    </svg>
  );
}
function IconAnalytics() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12.5L5.5 8L8.5 10.5L13.5 3.5" />
      <path d="M11 3.5H13.5V6" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 2.5V4M8 12V13.5M2.5 8H4M12 8H13.5M4.2 4.2L5.2 5.2M10.8 10.8L11.8 11.8M4.2 11.8L5.2 10.8M10.8 5.2L11.8 4.2" />
    </svg>
  );
}

const ITEMS: RailItem[] = [
  { id: 'workspace', label: 'Workspace', icon: <IconWorkspace />, active: true },
  { id: 'campaigns', label: 'Campaigns', icon: <IconCampaigns /> },
  { id: 'library',   label: 'Library',   icon: <IconLibrary /> },
  { id: 'analytics', label: 'Analytics', icon: <IconAnalytics /> },
];

export function NavRail() {
  return (
    <aside
      className="flex flex-col items-center h-full w-[56px] flex-shrink-0 relative"
      style={{
        background: 'linear-gradient(180deg, #1e3a2f 0%, #172f25 55%, #1a3329 100%)',
        borderRight: '1px solid rgba(200, 169, 110, 0.10)',
      }}
    >
      {/* Mark */}
      <div className="pt-4 pb-3">
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #dcc487, #a68b4b)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
          title="TrendMind"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 12L7 8.5L10 10.5L14 5.5" stroke="#1e3a2f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5.5L14 5.5L14 7.5" stroke="#1e3a2f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="h-px w-7 mb-2" style={{ background: 'linear-gradient(90deg, transparent, rgba(200, 169, 110, 0.3), transparent)' }} />

      {/* Items */}
      <nav className="flex flex-col items-center gap-1.5 flex-1 mt-1">
        {ITEMS.map((item) => (
          <RailButton key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2 pb-3">
        <RailButton item={{ id: 'settings', label: 'Settings', icon: <IconSettings /> }} />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold mt-1"
          style={{
            background: 'linear-gradient(145deg, #c8a96e, #a68b4b)',
            color: '#1e3a2f',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
            letterSpacing: '0.04em',
          }}
          title="Julien Davis"
        >
          JD
        </div>
      </div>
    </aside>
  );
}

function RailButton({ item }: { item: RailItem }) {
  const [hover, setHover] = React.useState(false);
  const active = !!item.active;
  return (
    <div className="relative group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button
        className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-200 relative"
        style={{
          color: active ? '#f0e8d8' : hover ? '#dcc487' : '#8a9289',
          background: active
            ? 'linear-gradient(160deg, rgba(200,169,110,0.22), rgba(200,169,110,0.10))'
            : hover
              ? 'rgba(200, 169, 110, 0.08)'
              : 'transparent',
          boxShadow: active ? 'inset 0 0 0 1px rgba(200,169,110,0.32)' : 'none',
        }}
      >
        {active && (
          <span
            className="absolute -left-[9px] top-1.5 bottom-1.5 w-[2px] rounded-full"
            style={{ background: '#c8a96e' }}
          />
        )}
        {item.icon}
      </button>
      {/* Tooltip */}
      <span
        className="pointer-events-none absolute left-[46px] top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] tracking-[0.03em] px-2 py-1 rounded-md transition-opacity duration-150"
        style={{
          opacity: hover ? 1 : 0,
          background: '#1a2f26',
          color: '#dcc487',
          border: '1px solid rgba(200,169,110,0.25)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 40,
        }}
      >
        {item.label}
      </span>
    </div>
  );
}
