'use client';

// Ambient activity surface. Lives at the very bottom of the workspace
// and rotates through recent agent actions. Replaces the old permanent
// activity rail with a single, light, living line.

import React, { useEffect, useState } from 'react';
import { ACTIVITY, AGENTS } from '@/lib/campaign-data';

export function PulseBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const handle = window.setInterval(() => {
      setIdx((i) => (i + 1) % ACTIVITY.length);
    }, 3200);
    return () => window.clearInterval(handle);
  }, []);

  const current = ACTIVITY[idx];
  const agent = AGENTS[current.by];

  return (
    <div
      className="relative h-[28px] flex items-center px-4 gap-3 flex-shrink-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #f4efe7 0%, #ebe6dd 100%)',
        borderTop: '1px solid #e4ded4',
      }}
    >
      {/* Left — pulse + label */}
      <div className="flex items-center gap-2">
        <div className="relative w-2 h-2">
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: agent.accent }}
          />
          <span
            className="absolute -inset-1 rounded-full animate-signal-pulse"
            style={{ background: agent.accent, opacity: 0.25 }}
          />
        </div>
        <span
          className="text-[9.5px] tracking-[0.18em] uppercase font-medium"
          style={{ color: '#9b9590' }}
        >
          Ambient
        </span>
      </div>

      {/* Current activity — crossfades */}
      <div key={current.id} className="flex-1 flex items-center gap-2 min-w-0 animate-fade-in">
        <span
          className="text-[11px] font-semibold tracking-[0.04em]"
          style={{ color: agent.accent }}
        >
          {agent.short}
        </span>
        <span className="text-[11.5px] truncate" style={{ color: '#6b6560' }}>
          {current.text}
        </span>
      </div>

      {/* Right — time */}
      <span className="text-[10px] tabular-nums" style={{ color: '#9b9590' }}>
        {current.age}
      </span>

      {/* Gold drift */}
      <div
        className="absolute left-0 bottom-0 h-[1px] w-20 animate-ambient-drift"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.55), transparent)' }}
      />
    </div>
  );
}
