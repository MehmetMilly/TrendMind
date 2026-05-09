"use client";

import React from "react";
import { ArrowRight, Eye, EyeOff, Info } from "lucide-react";

import { useStore } from "@/lib/workspace-store";

const STORAGE_KEY = "trendmind.settings.v1";

type SettingsState = {
  openrouterKey: string;
  tavilyKey: string;
  lang: "ar" | "en";
};

function loadSettings(): SettingsState {
  if (typeof window === "undefined") {
    return { openrouterKey: "", tavilyKey: "", lang: "ar" };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { openrouterKey: "", tavilyKey: "", lang: "ar" };
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    return {
      openrouterKey: typeof parsed.openrouterKey === "string" ? parsed.openrouterKey : "",
      tavilyKey: typeof parsed.tavilyKey === "string" ? parsed.tavilyKey : "",
      lang: parsed.lang === "en" ? "en" : "ar",
    };
  } catch {
    return { openrouterKey: "", tavilyKey: "", lang: "ar" };
  }
}

export function SettingsClient() {
  const { setActivePhase, activePhase } = useStore();
  const [settings, setSettings] = React.useState<SettingsState>(() => loadSettings());
  const [showOpenRouter, setShowOpenRouter] = React.useState(false);
  const [showTavily, setShowTavily] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // best effort only
    }

    document.documentElement.lang = settings.lang;
    document.documentElement.dir = settings.lang === "ar" ? "rtl" : "ltr";
  }, [settings]);

  function updateSettings(patch: Partial<SettingsState>) {
    setSettings((current) => ({ ...current, ...patch }));
    setSaved(false);
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // best effort only
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-full pb-20" style={{ background: "linear-gradient(160deg, #f9f6f0 0%, #f1ebe0 100%)" }}>
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b px-6" style={{ background: "rgba(253,250,245,0.88)", borderColor: "#e4ded4", backdropFilter: "blur(18px)" }}>
        <button
          onClick={() => setActivePhase(activePhase)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
          style={{ color: "#5a5145", background: "rgba(200,169,110,0.08)" }}
        >
          <ArrowRight size={14} />
          العودة إلى مساحة العمل
        </button>
        <span dir="ltr" className="text-[20px] leading-none" style={{ fontFamily: "var(--font-wordmark)", color: "#1f1d1a" }}>
          TrendMind
        </span>
        <div className="w-[120px]" />
      </header>

      <div className="mx-auto max-w-[760px] px-6 py-10">
        <h1 className="text-[36px] leading-none" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
          الإعدادات
        </h1>

        <section className="mt-10">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#a68b4b" }}>
            مفاتيح API
          </div>
          <p className="mb-5 text-[13px] leading-[1.7]" style={{ color: "#6b6258" }}>
            يتم تخزين المفاتيح محليًا في هذا المتصفح حتى يمكن تهيئة تدفقات التحليل والبحث دون مغادرة التطبيق.
          </p>

          <div className="space-y-4">
            <KeyField
              label="مفتاح OpenRouter"
              value={settings.openrouterKey}
              onChange={(value) => updateSettings({ openrouterKey: value })}
              show={showOpenRouter}
              onToggleShow={() => setShowOpenRouter((value) => !value)}
              details="يُستخدم لاستشارة الذكاء الاصطناعي في التحليلات."
            />
            <KeyField
              label="مفتاح Tavily"
              value={settings.tavilyKey}
              onChange={(value) => updateSettings({ tavilyKey: value })}
              show={showTavily}
              onToggleShow={() => setShowTavily((value) => !value)}
              details="محجوز لتكامل الأبحاث."
            />
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#a68b4b" }}>
            اللغة
          </div>
          <p className="mb-5 text-[13px]" style={{ color: "#6b6258" }}>
            اختر لغة الواجهة لهذا المتصفح.
          </p>

          <div className="flex items-center gap-3">
            <LangButton active={settings.lang === "ar"} label="العربية" onClick={() => updateSettings({ lang: "ar" })} />
            <LangButton active={settings.lang === "en"} label="English" onClick={() => updateSettings({ lang: "en" })} />
          </div>
        </section>

        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={save}
            className="rounded-xl px-6 py-3 text-[14px] font-bold transition-all"
            style={{
              color: "#f0e8d8",
              background: "linear-gradient(160deg, #3d7a5f, #163326)",
              boxShadow: "0 6px 22px rgba(22,51,38,0.22)",
            }}
          >
            حفظ الإعدادات
          </button>
          {saved ? (
            <span className="text-[13px] font-medium animate-fade-in" style={{ color: "#3d7a5f" }}>
              تم الحفظ محليًا
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function KeyField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  details,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  details: string;
}) {
  return (
    <div className="rounded-2xl border p-5" style={{ background: "#fdfaf5", borderColor: "#e4ded4", boxShadow: "0 4px 14px rgba(31,29,26,0.04)" }}>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-[13px] font-semibold" style={{ color: "#1f1d1a" }}>
          {label}
        </label>
        <div className="group relative">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all"
            style={{ color: "#a68b4b", background: "rgba(200,169,110,0.1)" }}
          >
            <Info size={12} />
            التفاصيل
          </button>
          <div className="pointer-events-none absolute left-0 top-8 z-20 w-[300px] rounded-xl border p-4 text-[12px] leading-[1.7] opacity-0 shadow-xl transition-opacity group-hover:opacity-100" style={{ background: "#fff8eb", borderColor: "rgba(200,169,110,0.35)", color: "#5a4d39" }}>
            {details}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border px-4 py-3 focus-within:border-[#c8a96e]" style={{ borderColor: "#e4ded4", background: "rgba(255,255,255,0.6)" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 bg-transparent font-mono text-[13px] outline-none"
          style={{ color: "#1f1d1a" }}
          dir="ltr"
        />
        <button type="button" onClick={onToggleShow} style={{ color: "#a68b4b" }}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

function LangButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border px-5 py-3 text-[13px] font-semibold transition-all"
      style={{
        borderColor: active ? "#c8a96e" : "#e4ded4",
        background: active ? "#fcf8ef" : "#fdfaf5",
        color: active ? "#1f1d1a" : "#6b6560",
        boxShadow: active ? "0 4px 14px rgba(200,169,110,0.18)" : "none",
      }}
    >
      {label}
    </button>
  );
}
