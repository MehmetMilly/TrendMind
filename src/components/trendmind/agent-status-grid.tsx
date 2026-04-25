'use client';

import React from 'react';
import { Agent } from '@/lib/trendmind-data';

function AgentAvatar({ gradient, initials, size = 'md' }: { gradient: [string, string]; initials: string; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-7 h-7 text-[9.5px]' : 'w-9 h-9 text-[11px]';
  return (
    <div className={`${dim} rounded-full flex items-center justify-center font-bold flex-shrink-0 relative`}
      style={{
        background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
        color: '#fff',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        boxShadow: `0 2px 6px rgba(0,0,0,0.12), 0 0 0 2px rgba(255,255,255,0.15) inset`,
        letterSpacing: '0.04em',
      }}>
      {initials}
    </div>
  );
}

function StatusIndicator({ color, status }: { color: string; status: string }) {
  const colors: Record<string, string> = {
    green: '#4a9070',
    amber: '#c8a96e',
    blue: '#5b8a9e',
    gray: '#b5b0a8',
    purple: '#7a6b8a',
  };
  const isActive = color === 'green' || color === 'amber';
  const bgColors: Record<string, string> = {
    green: 'rgba(74, 144, 112, 0.08)',
    amber: 'rgba(200, 169, 110, 0.08)',
    blue: 'rgba(91, 138, 158, 0.08)',
    gray: 'rgba(155, 149, 144, 0.06)',
    purple: 'rgba(122, 107, 138, 0.08)',
  };

  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
      style={{ background: bgColors[color] || bgColors.gray }}
    >
      <span
        className={`inline-block w-[5px] h-[5px] rounded-full ${isActive ? 'animate-pulse-dot' : ''}`}
        style={{ background: colors[color] || colors.gray }}
      />
      <span className="text-[9px] font-medium" style={{ color: colors[color] || colors.gray }}>
        {status}
      </span>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-lg transition-all duration-200 cursor-default group"
      style={{ minWidth: 0 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(200, 169, 110, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <AgentAvatar gradient={agent.avatarGradient} initials={agent.initials} />
      <span
        className="text-[10px] font-semibold text-center leading-tight mt-0.5"
        style={{ color: '#3d3835' }}
      >
        {agent.name}
      </span>
      <StatusIndicator color={agent.statusColor} status={agent.status} />
    </div>
  );
}

export function AgentStatusGrid({ agents }: { agents: Agent[] }) {
  return (
    <div
      className="grid grid-cols-3 gap-0.5 p-2 rounded-xl"
      style={{
        background: 'linear-gradient(180deg, #faf7f2 0%, #f7f3ec 100%)',
        border: '1px solid #e8e2d8',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      {agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
    </div>
  );
}

export { AgentAvatar };
