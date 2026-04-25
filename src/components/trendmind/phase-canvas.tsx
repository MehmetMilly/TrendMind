'use client';

import React from 'react';

export function PhaseCanvas() {
  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      {/* Canvas container */}
      <div
        className="flex-1 rounded-xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #faf7f2 0%, #f8f4ed 100%)',
          border: '1px solid #e4ded4',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03), 0 0 0 1px rgba(255,255,255,0.5) inset',
        }}
      >
        {/* Canvas header — refined */}
        <div
          className="flex items-center justify-between px-5 h-[40px] flex-shrink-0"
          style={{
            borderBottom: '1px solid rgba(228, 222, 212, 0.7)',
            background: 'rgba(245, 241, 234, 0.6)',
          }}
        >
          <div className="flex items-center gap-2">
            {/* Small phase indicator dot */}
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, #c8a96e, #a68b4b)' }}
            />
            <span className="text-[11.5px] font-medium tracking-wide uppercase" style={{ color: '#9b9590', letterSpacing: '0.08em' }}>
              Active Phase Canvas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10.5px] font-semibold px-2.5 py-1 rounded-md"
              style={{
                background: 'rgba(200, 169, 110, 0.1)',
                color: '#a68b4b',
                border: '1px solid rgba(200, 169, 110, 0.15)',
              }}
            >
              Phase 1 of 5
            </span>
          </div>
        </div>

        {/* Canvas body — premium empty state */}
        <div className="flex-1 relative">
          {/* Subtle radial gradient underlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 40%, rgba(200, 169, 110, 0.04) 0%, transparent 70%)',
            }}
          />

          {/* Refined guide structure — subtle column zones, not wireframe dashes */}
          <div className="absolute inset-0 p-6 pointer-events-none">
            <div className="w-full h-full flex gap-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex-1 rounded-lg"
                  style={{
                    border: '1px solid rgba(228, 222, 212, 0.5)',
                    background: i === 1 ? 'rgba(200, 169, 110, 0.015)' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Subtle cross-hair alignment guides — very faint */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 15%, rgba(228, 222, 212, 0.5) 35%, rgba(228, 222, 212, 0.5) 65%, transparent 85%)' }} />
          </div>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="h-full w-px" style={{ background: 'linear-gradient(180deg, transparent 15%, rgba(228, 222, 212, 0.5) 35%, rgba(228, 222, 212, 0.5) 65%, transparent 85%)' }} />
          </div>

          {/* Center empty-state — elegant and minimal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              {/* Refined watermark icon */}
              <div
                className="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(200, 169, 110, 0.06)',
                  border: '1px solid rgba(200, 169, 110, 0.1)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
                  <path
                    d="M12 3C8 3 5 6 5 9V14C5 18 8 22 12 23C16 22 19 18 19 14V9C19 6 16 3 12 3Z"
                    stroke="#a68b4b"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <path
                    d="M8.5 15L11 12L13.5 13.5L16 10"
                    stroke="#a68b4b"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[13px] font-medium" style={{ color: '#b5b0a8' }}>
                Phase workspace ready
              </p>
              <p className="text-[11px] mt-1.5 max-w-[220px] leading-relaxed" style={{ color: '#c8c2ba' }}>
                Content will populate here once phases are activated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
