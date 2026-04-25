'use client';

import React from 'react';
import { ActivityMessage } from '@/lib/trendmind-data';

function FeedAvatar({ gradient, initials }: { gradient: [string, string]; initials: string }) {
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9.5px] font-bold flex-shrink-0"
      style={{
        background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
        color: '#fff',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1), 0 0 0 1.5px rgba(255,255,255,0.12) inset',
        letterSpacing: '0.04em',
      }}>
      {initials}
    </div>
  );
}

function FeedItem({ msg, index }: { msg: ActivityMessage; index: number }) {
  return (
    <div
      className="flex gap-2.5 px-4 py-3 animate-fade-in transition-colors duration-150"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200, 169, 110, 0.03)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <FeedAvatar gradient={msg.avatarGradient} initials={msg.agentInitials} />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] leading-[1.6]" style={{ color: '#4a4540' }}>
          <span className="font-semibold" style={{ color: '#2c2c2c' }}>{msg.agentName}</span>{' '}
          {msg.message}
        </p>
        {msg.subItems && (
          <ul className="mt-1.5 ml-0.5 space-y-1">
            {msg.subItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px]" style={{ color: '#8a857e' }}>
                <span
                  className="mt-[5px] w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: '#c8a96e' }}
                />
                {item}
              </li>
            ))}
          </ul>
        )}
        <span className="text-[10px] mt-1.5 block font-medium" style={{ color: '#c0bbb4' }}>{msg.timestamp}</span>
      </div>
    </div>
  );
}

export function ActivityFeed({ messages }: { messages: ActivityMessage[] }) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ borderTop: '1px solid #e4ded4' }}>
      {/* Section label */}
      <div className="px-4 pt-3 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#b5b0a8' }}>
          Recent Activity
        </span>
      </div>
      <div className="pb-1">
        {messages.map((msg, i) => (
          <React.Fragment key={msg.id}>
            <FeedItem msg={msg} index={i} />
            {i < messages.length - 1 && (
              <div className="mx-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, #ebe6dd 20%, #ebe6dd 80%, transparent)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
