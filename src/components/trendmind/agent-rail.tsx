'use client';

import React, { useState } from 'react';
import { agents, activityMessages } from '@/lib/trendmind-data';
import { AgentStatusGrid } from './agent-status-grid';
import { ActivityFeed } from './activity-feed';
import { MessageComposer } from './message-composer';

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
      <path d="M8 2L4 6L8 10" />
    </svg>
  );
}

export function AgentRail() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-shrink-0 h-full relative" style={{ transition: 'width 0.3s ease', width: collapsed ? '0px' : '300px' }}>
      {/* Collapse toggle */}
      <button
        className="absolute z-20 flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200"
        style={{
          left: '-10px',
          top: '14px',
          background: '#f5f1ea',
          border: '1px solid #e4ded4',
          color: '#b5b0a8',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        onClick={() => setCollapsed(!collapsed)}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#2c2c2c'; e.currentTarget.style.borderColor = '#c8a96e'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#b5b0a8'; e.currentTarget.style.borderColor = '#e4ded4'; }}
        title={collapsed ? 'Expand agent rail' : 'Collapse agent rail'}
      >
        <CollapseIcon collapsed={collapsed} />
      </button>

      {/* Rail content */}
      {!collapsed && (
        <div className="w-[300px] flex flex-col h-full overflow-hidden animate-fade-in"
          style={{
            borderLeft: '1px solid #e4ded4',
            background: 'linear-gradient(180deg, #f5f1ea 0%, #f2ede5 100%)',
          }}>
          {/* Header */}
          <div className="px-4 h-[48px] flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid #e4ded4' }}>
            <span className="text-[14px] font-normal tracking-[-0.01em]" style={{ color: '#2c2c2c', fontFamily: 'var(--font-heading)' }}>
              Agent Panel
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
              style={{
                background: 'rgba(200, 169, 110, 0.1)',
                color: '#a68b4b',
                border: '1px solid rgba(200, 169, 110, 0.12)',
              }}
            >
              6 agents
            </span>
          </div>

          {/* Status grid */}
          <div className="px-3 pt-3 pb-2 flex-shrink-0">
            <AgentStatusGrid agents={agents} />
          </div>

          {/* Activity feed */}
          <ActivityFeed messages={activityMessages} />

          {/* Composer */}
          <MessageComposer />
        </div>
      )}
    </div>
  );
}
