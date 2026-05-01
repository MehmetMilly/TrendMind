'use client';

// ── Workspace store ─────────────────────────────────────────────────
// One shared state for the whole TrendMind living-campaign workspace:
// brief inputs, phase statuses, inspector selection, trial playback, and
// which draft/angle the user has currently elevated to Studio & Launch.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  BriefState,
  DEFAULT_BRIEF,
  PHASES,
  PhaseId,
  PhaseStatus,
} from './campaign-data';

// ── Inspector ───────────────────────────────────────────────────────

export type InspectorKind =
  | 'research'
  | 'angle'
  | 'draft-atom'
  | 'variant'
  | 'persona'
  | 'layer'
  | null;

export interface InspectorSelection {
  kind: InspectorKind;
  id: string | null;
}

// ── Store value ─────────────────────────────────────────────────────

interface StoreValue {
  // Phase lifecycle
  phaseStatus: Record<PhaseId, PhaseStatus>;
  activePhase: PhaseId;
  scrollToPhase: (id: PhaseId) => void;
  registerSectionRef: (id: PhaseId, node: HTMLElement | null) => void;
  setActivePhase: (id: PhaseId) => void;

  // Brief
  brief: BriefState;
  updateBrief: <K extends keyof BriefState>(key: K, value: BriefState[K]) => void;
  briefDirtyFor: PhaseId[]; // which downstream phases are stale

  // Strategy selection (which angle we’re committing to in Draft & Studio)
  selectedAngleId: 'a' | 'b' | 'c';
  setSelectedAngleId: (id: 'a' | 'b' | 'c') => void;

  // Draft winner (the variant elevated into Studio / Launch)
  selectedVariantId: string;
  setSelectedVariantId: (id: string) => void;

  // Inspector
  inspector: InspectorSelection;
  openInspector: (kind: Exclude<InspectorKind, null>, id: string) => void;
  closeInspector: () => void;

  // Trial playback
  trialPhase: 'idle' | 'running' | 'complete';
  trialTick: number; // 0..N, progresses through reactions
  startTrial: () => void;
  resetTrial: () => void;
}

const StoreCtx = createContext<StoreValue | null>(null);

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within <WorkspaceProvider>');
  return ctx;
}

// ── Provider ────────────────────────────────────────────────────────

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [brief, setBrief] = useState<BriefState>(DEFAULT_BRIEF);
  const [activePhase, setActivePhaseRaw] = useState<PhaseId>('brief');
  const [selectedAngleId, setSelectedAngleId] = useState<'a' | 'b' | 'c'>('b');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('v2');
  const [inspector, setInspector] = useState<InspectorSelection>({ kind: null, id: null });
  const [briefDirtyFor, setBriefDirtyFor] = useState<PhaseId[]>([]);

  const [trialPhase, setTrialPhase] = useState<'idle' | 'running' | 'complete'>('idle');
  const [trialTick, setTrialTick] = useState(0);

  // All phases seed as "ready" — the workspace is a living artifact
  // that already exists, the user is supervising, not starting.
  const [phaseStatus] = useState<Record<PhaseId, PhaseStatus>>({
    brief:    'ready',
    research: 'ready',
    strategy: 'ready',
    draft:    'ready',
    trial:    'ready',
    studio:   'ready',
    launch:   'ready',
  });

  // Section refs for anchor scroll
  const sectionRefs = useRef<Partial<Record<PhaseId, HTMLElement>>>({});
  const registerSectionRef = useCallback((id: PhaseId, node: HTMLElement | null) => {
    if (node) sectionRefs.current[id] = node;
    else delete sectionRefs.current[id];
  }, []);

  const scrollToPhase = useCallback((id: PhaseId) => {
    const node = sectionRefs.current[id];
    if (!node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActivePhaseRaw(id);
  }, []);

  const setActivePhase = useCallback((id: PhaseId) => {
    setActivePhaseRaw(id);
  }, []);

  // Active phase observer: whichever section header is near the top wins.
  useEffect(() => {
    const scrollRoot = document.getElementById('tm-scroll');
    if (!scrollRoot) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry most in view (smallest top distance to 0)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        if (visible[0]) {
          const id = visible[0].target.getAttribute('data-phase') as PhaseId | null;
          if (id) setActivePhaseRaw(id);
        }
      },
      {
        root: scrollRoot,
        rootMargin: '-15% 0px -70% 0px',
        threshold: [0, 0.1, 0.5, 1],
      },
    );
    PHASES.forEach((p) => {
      const node = sectionRefs.current[p.id];
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const updateBrief = useCallback(
    <K extends keyof BriefState>(key: K, value: BriefState[K]) => {
      setBrief((prev) => ({ ...prev, [key]: value }));
      // Mark all downstream phases as having drifted from the new brief.
      setBriefDirtyFor(['research', 'strategy', 'draft', 'trial', 'studio', 'launch']);
    },
    [],
  );

  const openInspector = useCallback((kind: Exclude<InspectorKind, null>, id: string) => {
    setInspector({ kind, id });
  }, []);
  const closeInspector = useCallback(() => setInspector({ kind: null, id: null }), []);

  // Trial playback loop
  useEffect(() => {
    if (trialPhase !== 'running') return;
    const handle = window.setInterval(() => {
      setTrialTick((t) => {
        const next = t + 1;
        if (next >= 15) {
          setTrialPhase('complete');
          return 15;
        }
        return next;
      });
    }, 650);
    return () => window.clearInterval(handle);
  }, [trialPhase]);

  const startTrial = useCallback(() => {
    setTrialTick(0);
    setTrialPhase('running');
  }, []);
  const resetTrial = useCallback(() => {
    setTrialTick(0);
    setTrialPhase('idle');
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      phaseStatus,
      activePhase,
      scrollToPhase,
      registerSectionRef,
      setActivePhase,
      brief,
      updateBrief,
      briefDirtyFor,
      selectedAngleId,
      setSelectedAngleId,
      selectedVariantId,
      setSelectedVariantId,
      inspector,
      openInspector,
      closeInspector,
      trialPhase,
      trialTick,
      startTrial,
      resetTrial,
    }),
    [
      phaseStatus,
      activePhase,
      scrollToPhase,
      registerSectionRef,
      setActivePhase,
      brief,
      updateBrief,
      briefDirtyFor,
      selectedAngleId,
      selectedVariantId,
      inspector,
      openInspector,
      closeInspector,
      trialPhase,
      trialTick,
      startTrial,
      resetTrial,
    ],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
