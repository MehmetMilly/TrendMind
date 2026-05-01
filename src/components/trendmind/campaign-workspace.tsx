'use client';

// The main scrolling campaign artifact. One vertical canvas with all
// seven inline phases stitched together by a quiet connector line.

import React from 'react';
import { BriefSection }    from './sections/brief';
import { ResearchSection } from './sections/research';
import { StrategySection } from './sections/strategy';
import { DraftSection }    from './sections/draft';
import { TrialSection }    from './sections/trial';
import { StudioSection }   from './sections/studio';
import { LaunchSection }   from './sections/launch';

export function CampaignWorkspace() {
  return (
    <div
      id="tm-scroll"
      className="flex-1 overflow-y-auto min-h-0 relative"
      style={{
        background:
          'radial-gradient(1200px 600px at 20% -10%, rgba(200,169,110,0.08), transparent 60%), ' +
          'radial-gradient(900px 500px at 100% 80%, rgba(61,122,95,0.05), transparent 60%), ' +
          '#f5f1ea',
      }}
    >
      {/* Thin vertical connector line that visually binds all sections */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none hidden md:block"
        style={{
          left: 'max(2rem, calc((100% - 1180px) / 2 + 2rem))',
          width: '1px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(200,169,110,0.18) 6%, rgba(200,169,110,0.18) 94%, transparent 100%)',
        }}
      />
      {/* Top spacer */}
      <div className="h-3" />

      <BriefSection />
      <Connector />
      <ResearchSection />
      <Connector />
      <StrategySection />
      <Connector />
      <DraftSection />
      <Connector />
      <TrialSection />
      <Connector />
      <StudioSection />
      <Connector />
      <LaunchSection />

      {/* Bottom spacer */}
      <div className="h-16" />
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center my-1">
      <div
        className="w-[1px] h-8 opacity-40"
        style={{ background: 'linear-gradient(180deg, rgba(200,169,110,0.0), rgba(200,169,110,0.9), rgba(200,169,110,0.0))' }}
      />
    </div>
  );
}
