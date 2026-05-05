"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { PHASES, PHASE_SEQUENCE } from "@/lib/campaign-data";
import type {
  BriefPatch,
  CampaignBootstrap,
  CampaignBrief,
  CampaignSummary,
  CampaignWorkspace,
  CreateCampaignInput,
  PhaseId,
  PhaseStatus,
} from "@/lib/types";

type InspectorKind =
  | "research"
  | "angle"
  | "draft-atom"
  | "variant"
  | "persona"
  | "layer"
  | null;

interface InspectorSelection {
  kind: InspectorKind;
  id: string | null;
}

interface DirectorDraft {
  phase: PhaseId;
  note: string;
}

interface StoreValue {
  campaigns: CampaignSummary[];
  campaign: CampaignWorkspace | null;
  activeCampaignId: string | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  brief: CampaignBrief | null;
  phaseStatus: Record<PhaseId, PhaseStatus>;
  activePhase: PhaseId;
  savingBrief: boolean;
  runPending: boolean;
  campaignDrawerOpen: boolean;
  directorOpen: boolean;
  directorDraft: DirectorDraft;
  inspector: InspectorSelection;
  trialPlaybackState: "idle" | "running" | "complete";
  trialPlaybackTick: number;
  phaseTransitionTarget: PhaseId | null;
  commandPaletteOpen: boolean;
  shortcutHelpOpen: boolean;
  visitedPhases: Set<PhaseId>;
  openInspector: (kind: Exclude<InspectorKind, null>, id: string) => void;
  closeInspector: () => void;
  openCampaignDrawer: () => void;
  closeCampaignDrawer: () => void;
  openDirector: (phase?: PhaseId) => void;
  closeDirector: () => void;
  setDirectorDraft: (draft: DirectorDraft) => void;
  startTrialReplay: () => void;
  resetTrialReplay: () => void;
  selectCampaign: (campaignId: string) => Promise<void>;
  createCampaign: (input: CreateCampaignInput) => Promise<void>;
  updateBrief: <K extends keyof CampaignBrief>(key: K, value: CampaignBrief[K]) => void;
  flushBriefSave: () => Promise<void>;
  startFullRun: () => Promise<void>;
  rerunPhase: (phase: PhaseId, note?: string) => Promise<void>;
  storeDirectorNote: () => Promise<void>;
  applyDirectorRun: () => Promise<void>;
  setSelectedAngleId: (angleId: string) => Promise<void>;
  setSelectedVariantId: (variantId: string) => Promise<void>;
  refreshCampaign: (silent?: boolean) => Promise<void>;
  setActivePhase: (phase: PhaseId) => void;
  scrollToPhase: (phase: PhaseId) => void;
  registerSectionRef: (phase: PhaseId, node: HTMLElement | null) => void;
  acceptPhaseTransition: () => void;
  cancelPhaseTransition: () => void;
  clearPhaseTransition: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openShortcutHelp: () => void;
  closeShortcutHelp: () => void;
  exportCampaign: () => void;
  shareCampaign: () => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

async function readJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? "حدث خطأ غير متوقع في TrendMind.");
  return payload;
}

function derivePhaseStatus(campaign: CampaignWorkspace | null) {
  return PHASES.reduce<Record<PhaseId, PhaseStatus>>((acc, phase) => {
    acc[phase.id] = campaign?.phases[phase.id]?.status ?? (phase.id === "brief" ? "ready" : "idle");
    return acc;
  }, {} as Record<PhaseId, PhaseStatus>);
}

function markDownstreamStale(campaign: CampaignWorkspace) {
  const next = structuredClone(campaign) as CampaignWorkspace;
  for (const phase of PHASES) {
    if (phase.id === "brief") continue;
    const current = next.phases[phase.id];
    if (current.status === "idle" || current.status === "pending") continue;
    current.status = "stale";
    current.staleReason = "تغير الإيجاز. أعد تشغيل هذه المرحلة لتحديثها.";
  }
  return next;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside WorkspaceProvider.");
  return context;
}

export function WorkspaceProvider({
  children,
  initialBootstrap,
}: {
  children: React.ReactNode;
  initialBootstrap?: CampaignBootstrap;
}) {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>(
    () => initialBootstrap?.campaigns ?? [],
  );
  const [campaign, setCampaign] = useState<CampaignWorkspace | null>(
    () => initialBootstrap?.activeCampaign ?? null,
  );
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(
    () => initialBootstrap?.activeCampaignId ?? null,
  );
  const [loading, setLoading] = useState(!initialBootstrap);
  const [refreshing, setRefreshing] = useState(false);
  const [savingBrief, setSavingBrief] = useState(false);
  const [runPending, setRunPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignDrawerOpen, setCampaignDrawerOpen] = useState(false);
  const [directorOpen, setDirectorOpen] = useState(false);
  const [directorDraft, setDirectorDraft] = useState<DirectorDraft>({ phase: "draft", note: "" });
  const [inspector, setInspector] = useState<InspectorSelection>({ kind: null, id: null });
  const [activePhase, setActivePhaseRaw] = useState<PhaseId>("brief");
  const [trialPlaybackState, setTrialPlaybackState] = useState<"idle" | "running" | "complete">("idle");
  const [trialPlaybackTick, setTrialPlaybackTick] = useState(0);
  const [phaseTransitionTarget, setPhaseTransitionTarget] = useState<PhaseId | null>(null);
  const [suppressTransitionFrom, setSuppressTransitionFrom] = useState<PhaseId | null>(null);
  const [visitedPhases, setVisitedPhases] = useState<Set<PhaseId>>(() => new Set(["brief"]));
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);

  const briefTimeoutRef = useRef<number | null>(null);
  const pendingBriefRef = useRef<BriefPatch>({});
  const savePromiseRef = useRef<Promise<void> | null>(null);
  const lastTrialVersionRef = useRef<number>(0);
  const lastReadyVersionsRef = useRef<Record<PhaseId, number> | null>(null);

  const updateUrl = useCallback((campaignId: string | null) => {
    const url = new URL(window.location.href);
    if (campaignId) url.searchParams.set("campaign", campaignId);
    else url.searchParams.delete("campaign");
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const refreshCampaign = useCallback(
    async (silent = false) => {
      const requestedCampaignId =
        activeCampaignId ?? new URL(window.location.href).searchParams.get("campaign");
      if (!silent) setRefreshing(true);

      try {
        const bootstrap = await readJson<CampaignBootstrap>(
          `/api/campaigns${requestedCampaignId ? `?campaignId=${requestedCampaignId}` : ""}`,
        );
        setCampaigns(bootstrap.campaigns);
        setCampaign(bootstrap.activeCampaign);
        setActiveCampaignId(bootstrap.activeCampaignId);
        setError(null);
        if (bootstrap.activeCampaignId) updateUrl(bootstrap.activeCampaignId);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "تعذر تحديث TrendMind.");
      } finally {
        setLoading(false);
        if (!silent) setRefreshing(false);
      }
    },
    [activeCampaignId, updateUrl],
  );

  useEffect(() => {
    if (initialBootstrap) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshCampaign();
  }, [initialBootstrap, refreshCampaign]);

  useEffect(() => {
    const activeRun = campaign?.runs[0];
    if (!campaign || !activeRun || !["queued", "running"].includes(activeRun.status)) return;
    const handle = window.setInterval(() => void refreshCampaign(true), 2200);
    return () => window.clearInterval(handle);
  }, [campaign, refreshCampaign]);

  useEffect(() => {
    if (!campaign?.phases.trial.version) return;
    if (campaign.phases.trial.version <= lastTrialVersionRef.current) return;
    lastTrialVersionRef.current = campaign.phases.trial.version;
    setTrialPlaybackTick(0);
    setTrialPlaybackState("idle");
  }, [campaign?.phases.trial.version]);

  useEffect(() => {
    if (trialPlaybackState !== "running" || !campaign?.phases.trial.data) return;
    const selectedVariantId = campaign.selectedVariantId ?? campaign.phases.trial.data.winningVariantId;
    const total = campaign.phases.trial.data.reactions.filter((reaction) => reaction.variantId === selectedVariantId).length;
    const handle = window.setInterval(() => {
      setTrialPlaybackTick((current) => {
        const next = current + 1;
        if (next >= total) {
          setTrialPlaybackState("complete");
          return total;
        }
        return next;
      });
    }, 550);
    return () => window.clearInterval(handle);
  }, [campaign, trialPlaybackState]);

  useEffect(() => {
    if (!campaign) return;
    const nextVersions = PHASE_SEQUENCE.reduce<Record<PhaseId, number>>((acc, phase) => {
      acc[phase] = campaign.phases[phase].version;
      return acc;
    }, {} as Record<PhaseId, number>);

    const lastReadyVersions = lastReadyVersionsRef.current;
    if (!lastReadyVersions) {
      lastReadyVersionsRef.current = nextVersions;
      return;
    }

    let freshPhase: PhaseId | null = null;
    for (const phase of PHASE_SEQUENCE) {
      const record = campaign.phases[phase];
      if (record.status === "ready" && record.version > (lastReadyVersions[phase] ?? 0)) {
        freshPhase = phase;
      }
    }
    lastReadyVersionsRef.current = nextVersions;

    if (!freshPhase || freshPhase !== activePhase || suppressTransitionFrom === activePhase) return;
    const nextPhase = PHASE_SEQUENCE[PHASE_SEQUENCE.indexOf(activePhase) + 1];
    if (!nextPhase) return;
    const handle = window.setTimeout(() => setPhaseTransitionTarget(nextPhase), 0);
    return () => window.clearTimeout(handle);
  }, [activePhase, campaign, suppressTransitionFrom]);

  const saveBriefNow = useCallback(async () => {
    if (!campaign || Object.keys(pendingBriefRef.current).length === 0) return;
    const payload = pendingBriefRef.current;
    pendingBriefRef.current = {};
    setSavingBrief(true);

    const promise = (async () => {
      const nextCampaign = await readJson<CampaignWorkspace>(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setCampaign(nextCampaign);
      setCampaigns((current) =>
        current.map((entry) =>
          entry.id === nextCampaign.id
            ? {
                ...entry,
                name: nextCampaign.name,
                brandName: nextCampaign.brandName,
                status: nextCampaign.status,
                updatedAt: nextCampaign.updatedAt,
              }
            : entry,
        ),
      );
    })();
    savePromiseRef.current = promise;

    try {
      await promise;
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "تعذر حفظ الإيجاز.");
    } finally {
      setSavingBrief(false);
      savePromiseRef.current = null;
    }
  }, [campaign]);

  const flushBriefSave = useCallback(async () => {
    if (briefTimeoutRef.current) {
      window.clearTimeout(briefTimeoutRef.current);
      briefTimeoutRef.current = null;
    }
    if (savePromiseRef.current) {
      await savePromiseRef.current;
      return;
    }
    await saveBriefNow();
  }, [saveBriefNow]);

  const updateBrief = useCallback(
    <K extends keyof CampaignBrief>(key: K, value: CampaignBrief[K]) => {
      setCampaign((current) => {
        if (!current) return current;
        const next = structuredClone(current) as CampaignWorkspace;
        next.brief[key] = value;
        next.name = next.brief.campaignName || "حملة جديدة";
        next.brandName = next.brief.brandName;
        next.phases.brief.data = next.brief;
        next.phases.brief.headline = next.brief.campaignName;
        next.phases.brief.summary = next.brief.goal;
        return markDownstreamStale(next);
      });
      pendingBriefRef.current = { ...pendingBriefRef.current, [key]: value };
      if (briefTimeoutRef.current) window.clearTimeout(briefTimeoutRef.current);
      briefTimeoutRef.current = window.setTimeout(() => void saveBriefNow(), 700);
    },
    [saveBriefNow],
  );

  const selectCampaign = useCallback(
    async (campaignId: string) => {
      setRefreshing(true);
      try {
        const nextCampaign = await readJson<CampaignWorkspace>(`/api/campaigns/${campaignId}`);
        setCampaign(nextCampaign);
        setActiveCampaignId(campaignId);
        lastReadyVersionsRef.current = null;
        updateUrl(campaignId);
        setCampaignDrawerOpen(false);
        setError(null);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "تعذر تحميل الحملة.");
      } finally {
        setRefreshing(false);
      }
    },
    [updateUrl],
  );

  const createCampaign = useCallback(
    async (input: CreateCampaignInput) => {
      setRunPending(true);
      try {
        const nextCampaign = await readJson<CampaignWorkspace>("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        setCampaign(nextCampaign);
        setActiveCampaignId(nextCampaign.id);
        lastReadyVersionsRef.current = null;
        setCampaigns((current) => [
          {
            id: nextCampaign.id,
            name: nextCampaign.name,
            brandName: nextCampaign.brandName,
            platform: nextCampaign.brief.platform,
            status: nextCampaign.status,
            updatedAt: nextCampaign.updatedAt,
            lastRunStatus: null,
          },
          ...current,
        ]);
        setCampaignDrawerOpen(false);
        updateUrl(nextCampaign.id);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "تعذر إنشاء الحملة.");
      } finally {
        setRunPending(false);
      }
    },
    [updateUrl],
  );

  const runCampaign = useCallback(
    async (phase: PhaseId, note?: string) => {
      if (!campaign) return;
      await flushBriefSave();
      setRunPending(true);
      try {
        const payload = await readJson<{ runId: string; campaign: CampaignWorkspace }>(
          `/api/campaigns/${campaign.id}/run`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              startPhase: phase,
              note: note?.trim() || undefined,
              mode: phase === "research" ? "full" : "phase",
            }),
          },
        );
        setCampaign(payload.campaign);
        setError(null);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "تعذر بدء التشغيل.");
      } finally {
        setRunPending(false);
      }
    },
    [campaign, flushBriefSave],
  );

  const startFullRun = useCallback(async () => runCampaign("research"), [runCampaign]);
  const rerunPhase = useCallback(async (phase: PhaseId, note?: string) => runCampaign(phase, note), [runCampaign]);

  const storeDirectorNote = useCallback(async () => {
    if (!campaign || !directorDraft.note.trim()) return;
    try {
      const nextCampaign = await readJson<CampaignWorkspace>(`/api/campaigns/${campaign.id}/revisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(directorDraft),
      });
      setCampaign(nextCampaign);
      setDirectorDraft((current) => ({ ...current, note: "" }));
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "تعذر حفظ التوجيه.");
    }
  }, [campaign, directorDraft]);

  const applyDirectorRun = useCallback(async () => {
    if (!directorDraft.note.trim()) return;
    await rerunPhase(directorDraft.phase, directorDraft.note.trim());
    setDirectorDraft((current) => ({ ...current, note: "" }));
    setDirectorOpen(false);
  }, [directorDraft, rerunPhase]);

  const updateSelection = useCallback(
    async (patch: { selectedAngleId?: string; selectedVariantId?: string }) => {
      if (!campaign) return;
      const nextCampaign = await readJson<CampaignWorkspace>(`/api/campaigns/${campaign.id}/selection`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setCampaign(nextCampaign);
      setError(null);
    },
    [campaign],
  );

  const setSelectedAngleId = useCallback(async (angleId: string) => updateSelection({ selectedAngleId: angleId }), [updateSelection]);
  const setSelectedVariantId = useCallback(async (variantId: string) => updateSelection({ selectedVariantId: variantId }), [updateSelection]);
  const openInspector = useCallback((kind: Exclude<InspectorKind, null>, id: string) => setInspector({ kind, id }), []);
  const closeInspector = useCallback(() => setInspector({ kind: null, id: null }), []);
  const startTrialReplay = useCallback(() => {
    setTrialPlaybackTick(0);
    setTrialPlaybackState("running");
  }, []);
  const resetTrialReplay = useCallback(() => {
    setTrialPlaybackTick(0);
    setTrialPlaybackState("idle");
  }, []);

  const setActivePhase = useCallback(
    (phase: PhaseId) => {
      if (phaseTransitionTarget) {
        setSuppressTransitionFrom(activePhase);
        setPhaseTransitionTarget(null);
      }
      setActivePhaseRaw(phase);
      setVisitedPhases((current) => new Set(current).add(phase));
      if (suppressTransitionFrom && suppressTransitionFrom !== phase) setSuppressTransitionFrom(null);
    },
    [activePhase, phaseTransitionTarget, suppressTransitionFrom],
  );

  const acceptPhaseTransition = useCallback(() => {
    if (!phaseTransitionTarget) return;
    setActivePhaseRaw(phaseTransitionTarget);
    setVisitedPhases((current) => new Set(current).add(phaseTransitionTarget));
    setPhaseTransitionTarget(null);
    setSuppressTransitionFrom(null);
  }, [phaseTransitionTarget]);

  const cancelPhaseTransition = useCallback(() => {
    setSuppressTransitionFrom(activePhase);
    setPhaseTransitionTarget(null);
  }, [activePhase]);

  const exportCampaign = useCallback(() => {
    if (!campaign) return;
    const content = `# ${campaign.name}\n\n${JSON.stringify(campaign, null, 2)}`;
    downloadFile(`${campaign.name.replace(/\s+/g, "-").toLowerCase()}.md`, content, "text/markdown");
  }, [campaign]);

  const shareCampaign = useCallback(async () => {
    if (!campaign) return;
    await navigator.clipboard.writeText(`${window.location.origin}/?campaign=${campaign.id}`);
  }, [campaign]);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
    };
    let awaitingGoto = false;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
        setShortcutHelpOpen(false);
        setDirectorOpen(false);
        setCampaignDrawerOpen(false);
        setInspector({ kind: null, id: null });
        setPhaseTransitionTarget(null);
        return;
      }
      if (event.key === "?") {
        event.preventDefault();
        setShortcutHelpOpen(true);
        return;
      }
      if (event.key.toLowerCase() === "g") {
        awaitingGoto = true;
        window.setTimeout(() => {
          awaitingGoto = false;
        }, 900);
        return;
      }
      if (awaitingGoto && /^[1-7]$/.test(event.key)) {
        event.preventDefault();
        awaitingGoto = false;
        const phase = PHASE_SEQUENCE[Number(event.key) - 1];
        if (phase) setActivePhase(phase);
        return;
      }
      const currentIndex = PHASE_SEQUENCE.indexOf(activePhase);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActivePhase(PHASE_SEQUENCE[Math.min(PHASE_SEQUENCE.length - 1, currentIndex + 1)]);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActivePhase(PHASE_SEQUENCE[Math.max(0, currentIndex - 1)]);
      }
      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        void rerunPhase(activePhase);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePhase, rerunPhase, setActivePhase]);

  const value = useMemo<StoreValue>(
    () => ({
      campaigns,
      campaign,
      activeCampaignId,
      loading,
      refreshing,
      error,
      brief: campaign?.brief ?? null,
      phaseStatus: derivePhaseStatus(campaign),
      activePhase,
      savingBrief,
      runPending,
      campaignDrawerOpen,
      directorOpen,
      directorDraft,
      inspector,
      trialPlaybackState,
      trialPlaybackTick,
      phaseTransitionTarget,
      commandPaletteOpen,
      shortcutHelpOpen,
      visitedPhases,
      openInspector,
      closeInspector,
      openCampaignDrawer: () => setCampaignDrawerOpen(true),
      closeCampaignDrawer: () => setCampaignDrawerOpen(false),
      openDirector: (phase = activePhase) => {
        setDirectorDraft((current) => ({ ...current, phase }));
        setDirectorOpen(true);
      },
      closeDirector: () => setDirectorOpen(false),
      setDirectorDraft,
      startTrialReplay,
      resetTrialReplay,
      selectCampaign,
      createCampaign,
      updateBrief,
      flushBriefSave,
      startFullRun,
      rerunPhase,
      storeDirectorNote,
      applyDirectorRun,
      setSelectedAngleId,
      setSelectedVariantId,
      refreshCampaign,
      setActivePhase,
      scrollToPhase: setActivePhase,
      registerSectionRef: () => undefined,
      acceptPhaseTransition,
      cancelPhaseTransition,
      clearPhaseTransition: () => setPhaseTransitionTarget(null),
      openCommandPalette: () => setCommandPaletteOpen(true),
      closeCommandPalette: () => setCommandPaletteOpen(false),
      openShortcutHelp: () => setShortcutHelpOpen(true),
      closeShortcutHelp: () => setShortcutHelpOpen(false),
      exportCampaign,
      shareCampaign,
    }),
    [
      activeCampaignId,
      activePhase,
      applyDirectorRun,
      campaign,
      campaignDrawerOpen,
      campaigns,
      closeInspector,
      commandPaletteOpen,
      createCampaign,
      directorDraft,
      directorOpen,
      error,
      flushBriefSave,
      inspector,
      loading,
      openInspector,
      phaseTransitionTarget,
      refreshCampaign,
      rerunPhase,
      runPending,
      savingBrief,
      selectCampaign,
      setActivePhase,
      setSelectedAngleId,
      setSelectedVariantId,
      shareCampaign,
      shortcutHelpOpen,
      startFullRun,
      startTrialReplay,
      storeDirectorNote,
      trialPlaybackState,
      trialPlaybackTick,
      updateBrief,
      visitedPhases,
      refreshing,
      resetTrialReplay,
      acceptPhaseTransition,
      cancelPhaseTransition,
      exportCampaign,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
