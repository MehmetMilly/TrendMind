'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Agent, ActivityMessage } from './trendmind-data';

// ─── Phase definitions ───────────────────────────────────────────────

export type PhaseId = 'brief' | 'research' | 'strategy' | 'drafting' | 'results';

export interface Phase {
  id: PhaseId;
  index: number;
  label: string;
  shortLabel: string;
}

export const PHASES: Phase[] = [
  { id: 'brief',    index: 0, label: 'Brief',    shortLabel: 'Brief' },
  { id: 'research', index: 1, label: 'Research',  shortLabel: 'Research' },
  { id: 'strategy', index: 2, label: 'Strategy',  shortLabel: 'Strategy' },
  { id: 'drafting', index: 3, label: 'Drafting',  shortLabel: 'Drafting' },
  { id: 'results',  index: 4, label: 'Results',   shortLabel: 'Results' },
];

// ─── Brief form data ─────────────────────────────────────────────────

export interface BriefFormData {
  campaignTitle: string;
  brand: string;
  businessType: string;
  platform: string;
  goal: string;
  targetAudience: string;
  campaignFocus: string;
  primaryLanguage: string;
  toneOfVoice: string;
  brandPillars: string[];
  bannedPhrases: string[];
  extraContext: string;
}

export const DEFAULT_BRIEF: BriefFormData = {
  campaignTitle: 'Q4 Holiday Push',
  brand: 'TrendMind Retail Collective',
  businessType: 'Premium lifestyle / sustainable gifting',
  platform: 'X (Twitter)',
  goal: 'Create a holiday campaign direction that feels premium, culturally relevant, and conversion-oriented without losing warmth.',
  targetAudience: 'Style-conscious professionals and thoughtful holiday shoppers who value sustainability, presentation, and intentional gifting.',
  campaignFocus: 'Holiday gifting, cultural relevance, elevated lifestyle storytelling',
  primaryLanguage: 'English',
  toneOfVoice: 'Warm, refined, editorial, intelligent, calm',
  brandPillars: ['Premium quality', 'Intentional gifting', 'Sustainable elegance', 'Modern cultural awareness'],
  bannedPhrases: ['best deal ever', 'hurry now', 'cheap gifts', 'viral hack'],
  extraContext: 'This campaign should feel elevated and emotionally resonant. The output should avoid loud promotional energy and instead feel tastefully persuasive, visually rich, and seasonally relevant.',
};

// ─── Phase-specific agent overrides ──────────────────────────────────

export interface PhaseAgentConfig {
  agents: Agent[];
  activity: ActivityMessage[];
}

export const BRIEF_AGENTS: Agent[] = [
  { id: 'campaign-director',  name: 'Campaign Director',  status: 'Ready',              statusColor: 'green',  avatarGradient: ['#c8a96e', '#a68b4b'], initials: 'CD' },
  { id: 'brand-strategist',   name: 'Brand Strategist',   status: 'Waiting for brief',  statusColor: 'amber',  avatarGradient: ['#5b8a72', '#3d7a5f'], initials: 'BS' },
  { id: 'trend-scout',        name: 'Trend Scout',        status: 'Standby',            statusColor: 'gray',   avatarGradient: ['#8b6f4e', '#6b5535'], initials: 'TS' },
  { id: 'visual-director',    name: 'Visual Director',    status: 'Standby',            statusColor: 'gray',   avatarGradient: ['#7a6b8a', '#5a4d6a'], initials: 'VD' },
  { id: 'content-architects', name: 'Content Architects', status: 'Idle',               statusColor: 'gray',   avatarGradient: ['#6b8a7a', '#4d6a5a'], initials: 'CA' },
  { id: 'performance-critic', name: 'Performance Critic', status: 'Waiting',            statusColor: 'gray',   avatarGradient: ['#8a7a6b', '#6a5a4d'], initials: 'PC' },
];

export const BRIEF_ACTIVITY: ActivityMessage[] = [
  {
    id: 'b1',
    agentName: 'Campaign Director',
    agentInitials: 'CD',
    avatarGradient: ['#c8a96e', '#a68b4b'],
    message: 'is awaiting final campaign inputs before orchestrating the agent team.',
    timestamp: 'Just now',
  },
  {
    id: 'b2',
    agentName: 'Brand Strategist',
    agentInitials: 'BS',
    avatarGradient: ['#5b8a72', '#3d7a5f'],
    message: 'is ready to shape positioning once the brief is confirmed.',
    timestamp: '1 min ago',
  },
  {
    id: 'b3',
    agentName: 'Visual Director',
    agentInitials: 'VD',
    avatarGradient: ['#7a6b8a', '#5a4d6a'],
    message: 'is standing by for mood and aesthetic direction.',
    timestamp: '2 min ago',
  },
  {
    id: 'b4',
    agentName: 'Trend Scout',
    agentInitials: 'TS',
    avatarGradient: ['#8b6f4e', '#6b5535'],
    message: 'will begin cultural signal analysis once the brief scope is locked.',
    timestamp: '3 min ago',
  },
];

export const RESEARCH_AGENTS: Agent[] = [
  { id: 'campaign-director',  name: 'Campaign Director',  status: 'Active',     statusColor: 'green',  avatarGradient: ['#c8a96e', '#a68b4b'], initials: 'CD' },
  { id: 'brand-strategist',   name: 'Brand Strategist',   status: 'Monitoring', statusColor: 'blue',   avatarGradient: ['#5b8a72', '#3d7a5f'], initials: 'BS' },
  { id: 'trend-scout',        name: 'Trend Scout',        status: 'Processing', statusColor: 'amber',  avatarGradient: ['#8b6f4e', '#6b5535'], initials: 'TS' },
  { id: 'visual-director',    name: 'Visual Director',    status: 'Curating',   statusColor: 'purple', avatarGradient: ['#7a6b8a', '#5a4d6a'], initials: 'VD' },
  { id: 'content-architects', name: 'Content Architects', status: 'Standby',    statusColor: 'gray',   avatarGradient: ['#6b8a7a', '#4d6a5a'], initials: 'CA' },
  { id: 'performance-critic', name: 'Performance Critic', status: 'Waiting',    statusColor: 'gray',   avatarGradient: ['#8a7a6b', '#6a5a4d'], initials: 'PC' },
];

export const RESEARCH_ACTIVITY: ActivityMessage[] = [
  {
    id: 'r1',
    agentName: 'Trend Scout',
    agentInitials: 'TS',
    avatarGradient: ['#8b6f4e', '#6b5535'],
    message: 'identified 4 relevant seasonal cultural signals.',
    subItems: ['Soft luxury, intentional shopping, gifting rituals, modern warmth.'],
    timestamp: 'Just now',
  },
  {
    id: 'r2',
    agentName: 'Visual Director',
    agentInitials: 'VD',
    avatarGradient: ['#7a6b8a', '#5a4d6a'],
    message: 'grouped references around soft luxury gifting.',
    timestamp: '1 min ago',
  },
  {
    id: 'r3',
    agentName: 'Brand Strategist',
    agentInitials: 'BS',
    avatarGradient: ['#5b8a72', '#3d7a5f'],
    message: 'is reviewing audience resonance patterns.',
    timestamp: '3 min ago',
  },
  {
    id: 'r4',
    agentName: 'Campaign Director',
    agentInitials: 'CD',
    avatarGradient: ['#c8a96e', '#a68b4b'],
    message: 'updated the campaign direction based on new research.',
    timestamp: '5 min ago',
  },
];

// ─── Context ─────────────────────────────────────────────────────────

interface CampaignContextValue {
  // Phase state
  activePhase: PhaseId;
  highestUnlockedIndex: number;
  setActivePhase: (id: PhaseId) => void;
  goToNextPhase: () => void;
  canNavigateTo: (id: PhaseId) => boolean;
  isPhaseComplete: (id: PhaseId) => boolean;

  // Brief data
  briefData: BriefFormData;
  updateBriefField: <K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) => void;
  briefDraftSaved: boolean;
  saveBriefDraft: () => void;

  // Phase-aware agent config
  phaseAgents: Agent[];
  phaseActivity: ActivityMessage[];
}

const CampaignContext = createContext<CampaignContextValue | null>(null);

export function useCampaign() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useCampaign must be used within CampaignProvider');
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [activePhase, setActivePhaseRaw] = useState<PhaseId>('brief');
  const [highestUnlockedIndex, setHighestUnlocked] = useState(0);
  const [briefData, setBriefData] = useState<BriefFormData>(DEFAULT_BRIEF);
  const [briefDraftSaved, setBriefDraftSaved] = useState(false);

  const canNavigateTo = useCallback(
    (id: PhaseId) => {
      const phase = PHASES.find((p) => p.id === id);
      return phase ? phase.index <= highestUnlockedIndex : false;
    },
    [highestUnlockedIndex],
  );

  const isPhaseComplete = useCallback(
    (id: PhaseId) => {
      const phase = PHASES.find((p) => p.id === id);
      return phase ? phase.index < highestUnlockedIndex : false;
    },
    [highestUnlockedIndex],
  );

  const setActivePhase = useCallback(
    (id: PhaseId) => {
      if (canNavigateTo(id)) setActivePhaseRaw(id);
    },
    [canNavigateTo],
  );

  const goToNextPhase = useCallback(() => {
    const current = PHASES.find((p) => p.id === activePhase);
    if (!current || current.index >= PHASES.length - 1) return;
    const nextIndex = current.index + 1;
    setHighestUnlocked((prev) => Math.max(prev, nextIndex));
    setActivePhaseRaw(PHASES[nextIndex].id);
  }, [activePhase]);

  const updateBriefField = useCallback(
    <K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) => {
      setBriefData((prev) => ({ ...prev, [key]: value }));
      setBriefDraftSaved(false);
    },
    [],
  );

  const saveBriefDraft = useCallback(() => {
    setBriefDraftSaved(true);
  }, []);

  // Phase-aware agent data
  const phaseAgents = useMemo(() => {
    if (activePhase === 'brief') return BRIEF_AGENTS;
    if (activePhase === 'research') return RESEARCH_AGENTS;
    return BRIEF_AGENTS;
  }, [activePhase]);

  const phaseActivity = useMemo(() => {
    if (activePhase === 'brief') return BRIEF_ACTIVITY;
    if (activePhase === 'research') return RESEARCH_ACTIVITY;
    return BRIEF_ACTIVITY;
  }, [activePhase]);

  const value = useMemo<CampaignContextValue>(
    () => ({
      activePhase,
      highestUnlockedIndex,
      setActivePhase,
      goToNextPhase,
      canNavigateTo,
      isPhaseComplete,
      briefData,
      updateBriefField,
      briefDraftSaved,
      saveBriefDraft,
      phaseAgents,
      phaseActivity,
    }),
    [
      activePhase,
      highestUnlockedIndex,
      setActivePhase,
      goToNextPhase,
      canNavigateTo,
      isPhaseComplete,
      briefData,
      updateBriefField,
      briefDraftSaved,
      saveBriefDraft,
      phaseAgents,
      phaseActivity,
    ],
  );

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
}
