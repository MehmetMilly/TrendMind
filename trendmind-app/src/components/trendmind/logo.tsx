import React from 'react';

export function TrendMindLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {/* Custom icon mark — premium shield/leaf with embedded trend */}
      <div className="relative w-9 h-9 flex-shrink-0">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="logo-shield" x1="6" y1="3" x2="30" y2="33" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#dcc487" />
              <stop offset="50%" stopColor="#c8a96e" />
              <stop offset="100%" stopColor="#a68b4b" />
            </linearGradient>
            <linearGradient id="logo-inner" x1="10" y1="8" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e3a2f" />
              <stop offset="100%" stopColor="#162e24" />
            </linearGradient>
            <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Outer shield — soft rounded top, pointed bottom */}
          <path
            d="M18 3C12 3 7 7 7 12V18C7 24 12 32 18 34C24 32 29 24 29 18V12C29 7 24 3 18 3Z"
            fill="url(#logo-shield)"
            filter="url(#logo-glow)"
          />
          {/* Inner dark shape — creates depth */}
          <path
            d="M18 7C14 7 10.5 9.5 10.5 13V18.5C10.5 23 14 28.5 18 30C22 28.5 25.5 23 25.5 18.5V13C25.5 9.5 22 7 18 7Z"
            fill="url(#logo-inner)"
            opacity="0.85"
          />
          {/* Trend line — upward momentum */}
          <path
            d="M13 21L16 17.5L19.5 19.5L23.5 14"
            stroke="#c8a96e"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Arrow tip */}
          <path
            d="M21.5 13.5L24 14L22.5 16"
            stroke="#c8a96e"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Subtle highlight on shield */}
          <path
            d="M18 3C12 3 7 7 7 12V13C7 8 12 4 18 4C24 4 29 8 29 13V12C29 7 24 3 18 3Z"
            fill="rgba(255,255,255,0.25)"
          />
        </svg>
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span
            className="text-[16px] tracking-[0.04em] font-semibold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#f0e8d8',
            }}
          >
            TrendMind
          </span>
          <span
            className="text-[8.5px] tracking-[0.22em] uppercase mt-1 font-medium"
            style={{ color: 'rgba(200, 169, 110, 0.7)' }}
          >
            AI-Powered Marketing
          </span>
        </div>
      )}
    </div>
  );
}
