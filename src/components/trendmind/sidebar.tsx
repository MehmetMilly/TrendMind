'use client';

import React from 'react';
import { TrendMindLogo } from './logo';
import { threads } from '@/lib/trendmind-data';

// SVG icons as small components
function LibraryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="5" height="5.5" rx="1" />
      <rect x="9" y="2" width="5" height="4" rx="1" />
      <rect x="2" y="9.5" width="5" height="4.5" rx="1" />
      <rect x="9" y="8" width="5" height="6" rx="1" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13L5.5 7.5L9 10L14 4" />
      <path d="M12 4H14V6" />
    </svg>
  );
}

function CampaignIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3L13 7.5L3 12V3Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M6 2.5V9.5M2.5 6H9.5" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="7" cy="7" r="5.5" />
      <path d="M5.5 5.8C5.5 4.9 6.2 4.2 7 4.2S8.5 4.9 8.5 5.8C8.5 6.7 7 7.2 7 8" />
      <circle cx="7" cy="10" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside
      className="flex flex-col h-full w-[232px] flex-shrink-0 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1e3a2f 0%, #172f25 50%, #1a3329 100%)',
        borderRight: '1px solid rgba(200, 169, 110, 0.08)',
      }}
    >
      {/* Logo area */}
      <div className="px-5 pt-4 pb-3.5">
        <TrendMindLogo />
      </div>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200, 169, 110, 0.2), transparent)' }} />

      {/* Nav items */}
      <nav className="px-3 pt-3.5 flex-1 overflow-y-auto">
        {/* Library */}
        <NavItem icon={<LibraryIcon />} label="Library" />

        {/* Analytics */}
        <NavItem icon={<AnalyticsIcon />} label="Analytics" />

        {/* Campaigns section */}
        <div className="mt-4 mb-1">
          <div className="flex items-center justify-between px-2.5 mb-1">
            <div className="flex items-center gap-2" style={{ color: '#c8a96e' }}>
              <CampaignIcon />
              <span className="text-[12px] font-semibold tracking-[0.06em] uppercase">Campaigns</span>
            </div>
            <button
              className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200"
              style={{
                color: 'rgba(200, 169, 110, 0.7)',
                background: 'rgba(200, 169, 110, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(200, 169, 110, 0.18)';
                e.currentTarget.style.color = '#c8a96e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(200, 169, 110, 0.08)';
                e.currentTarget.style.color = 'rgba(200, 169, 110, 0.7)';
              }}
              title="New Campaign"
            >
              <PlusIcon />
            </button>
          </div>

          {/* Thread list */}
          <div className="mt-1.5 space-y-px">
            {threads.map((thread) => (
              <button
                key={thread.id}
                className="w-full text-left px-3 py-[7px] rounded-lg text-[12px] leading-snug transition-all duration-200 block"
                style={{
                  color: thread.active ? '#f0e8d8' : '#918980',
                  background: thread.active
                    ? 'rgba(200, 169, 110, 0.12)'
                    : 'transparent',
                  borderLeft: thread.active
                    ? '2px solid #c8a96e'
                    : '2px solid transparent',
                  fontWeight: thread.active ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!thread.active) {
                    e.currentTarget.style.background = 'rgba(200, 169, 110, 0.06)';
                    e.currentTarget.style.color = '#c8c0b0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!thread.active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#918980';
                  }
                }}
              >
                {thread.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Botanical decoration */}
      <div className="absolute bottom-16 left-0 w-full pointer-events-none opacity-[0.06]">
        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          {/* Leaf 1 */}
          <path
            d="M-20 140C20 105 60 80 80 62C90 52 85 36 70 27C55 18 35 22 25 36C15 50 20 72 40 88C50 96 30 122 -10 140"
            fill="#c8a96e"
            opacity="0.6"
          />
          {/* Leaf 2 */}
          <path
            d="M40 140C60 115 90 98 110 85C120 79 125 65 115 54C105 43 85 45 78 58C70 71 80 88 95 96C105 103 85 128 55 140"
            fill="#c8a96e"
            opacity="0.35"
          />
          {/* Leaf 3 */}
          <path
            d="M100 140C110 124 130 108 150 99C160 95 168 82 160 71C152 60 135 59 126 71C118 83 125 98 140 105C148 109 138 132 115 140"
            fill="#c8a96e"
            opacity="0.2"
          />
          {/* Stem lines */}
          <path d="M30 140C45 115 65 94 75 78" stroke="#c8a96e" strokeWidth="0.8" opacity="0.4" />
          <path d="M80 140C85 120 100 103 110 90" stroke="#c8a96e" strokeWidth="0.8" opacity="0.3" />
        </svg>
      </div>

      {/* Bottom section */}
      <div className="px-4 pb-3.5 pt-2 relative z-10">
        <div className="h-px mb-2.5" style={{ background: 'linear-gradient(90deg, transparent, rgba(200, 169, 110, 0.2), transparent)' }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* User avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(145deg, #c8a96e, #a68b4b)',
                color: '#fff',
                textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                letterSpacing: '0.06em',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15), 0 0 0 1.5px rgba(255,255,255,0.1) inset',
              }}
            >
              JD
            </div>
            <span className="text-[12.5px] font-medium" style={{ color: '#c8c0b0' }}>
              Julien Davis
            </span>
          </div>
          <button
            className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              color: '#918980',
              background: 'rgba(200, 169, 110, 0.06)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(200, 169, 110, 0.15)';
              e.currentTarget.style.color = '#c8a96e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(200, 169, 110, 0.06)';
              e.currentTarget.style.color = '#918980';
            }}
            title="Help"
          >
            <HelpIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-lg text-[12.5px] font-medium transition-all duration-200 mb-px"
      style={{ color: '#c8c0b0' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(200, 169, 110, 0.06)';
        e.currentTarget.style.color = '#f0e8d8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#c8c0b0';
      }}
    >
      {icon}
      {label}
    </button>
  );
}
