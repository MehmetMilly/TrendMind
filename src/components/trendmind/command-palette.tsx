"use client";

import { Search } from "lucide-react";
import React from "react";

import { PHASES } from "@/lib/campaign-data";
import { useStore } from "@/lib/workspace-store";

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[إأآا]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/[ة]/g, "ه")
    .replace(/[\u064b-\u065f]/g, "");
}

export function CommandPalette() {
  const {
    campaign,
    closeCommandPalette,
    commandPaletteOpen,
    exportCampaign,
    openCampaignDrawer,
    openDirector,
    rerunPhase,
    setActivePhase,
    shareCampaign,
    startFullRun,
    activePhase,
  } = useStore();
  const [query, setQuery] = React.useState("");

  if (!commandPaletteOpen) return null;

  const searchable = [
    ...(campaign?.phases.research.data?.items.map((item) => ({
      label: item.title,
      meta: "بحث في الحملة",
      action: () => setActivePhase("research"),
    })) ?? []),
    ...(campaign?.phases.strategy.data?.angles.map((angle) => ({
      label: angle.title,
      meta: "زاوية استراتيجية",
      action: () => setActivePhase("strategy"),
    })) ?? []),
  ];

  const q = normalize(query);
  const filteredSearch = searchable.filter((item) => normalize(item.label).includes(q)).slice(0, 5);

  const runAction = (action: () => void) => {
    action();
    closeCommandPalette();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#10100d]/45 px-4 pt-[12vh] backdrop-blur-md">
      <div
        className="w-full max-w-[680px] overflow-hidden rounded-2xl border shadow-2xl animate-phase-slide-rtl"
        style={{ background: "#fffaf2", borderColor: "rgba(200,169,110,0.28)" }}
      >
        <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "#ece2d1" }}>
          <Search size={18} color="#a68b4b" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن مرحلة، أمر، أو إشارة..."
            className="h-8 flex-1 bg-transparent text-[15px] outline-none"
            style={{ color: "#1f1d1a" }}
          />
          <kbd className="rounded-md border px-2 py-1 text-[10px]" style={{ borderColor: "#e4ded4", color: "#8d8273" }}>
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          <Group title="الانتقال إلى مرحلة">
            {PHASES.map((phase) => (
              <Row
                key={phase.id}
                label={phase.label}
                meta={phase.role}
                onClick={() => runAction(() => setActivePhase(phase.id))}
              />
            ))}
          </Group>

          <Group title="أوامر">
            <Row label="بدء الحملة" meta="تشغيل المسار الكامل" onClick={() => runAction(() => void startFullRun())} />
            <Row label="إعادة بدء المرحلة الحالية" meta="تشغيل موجه لهذه الصفحة" onClick={() => runAction(() => void rerunPhase(activePhase))} />
            <Row label="فتح لوحة المخرج" meta="توجيه أو تعديل القرار" onClick={() => runAction(() => openDirector(activePhase))} />
            <Row label="فتح الحملات" meta="إنشاء أو اختيار حملة" onClick={() => runAction(openCampaignDrawer)} />
            <Row label="مشاركة" meta="نسخ رابط الحملة" onClick={() => runAction(() => void shareCampaign())} />
            <Row label="تصدير" meta="تنزيل حزمة Markdown" onClick={() => runAction(exportCampaign)} />
          </Group>

          {filteredSearch.length ? (
            <Group title="البحث في الحملة">
              {filteredSearch.map((item) => (
                <Row key={`${item.meta}-${item.label}`} label={item.label} meta={item.meta} onClick={() => runAction(item.action)} />
              ))}
            </Group>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-3 last:mb-0">
      <h3 className="mb-1 px-2 text-[10px] font-bold" style={{ color: "#a68b4b" }}>
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function Row({ label, meta, onClick }: { label: string; meta: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-start transition-all hover:bg-[#f4ead8]"
    >
      <span className="text-[13px] font-semibold" style={{ color: "#1f1d1a" }}>
        {label}
      </span>
      <span className="text-[11px]" style={{ color: "#8f877b" }}>
        {meta}
      </span>
    </button>
  );
}
