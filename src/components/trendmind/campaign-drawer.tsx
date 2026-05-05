"use client";

import { FolderOpen, Plus, Sparkles } from "lucide-react";
import React from "react";

import { useStore } from "@/lib/workspace-store";

export function CampaignDrawer() {
  const {
    activeCampaignId,
    campaignDrawerOpen,
    campaigns,
    closeCampaignDrawer,
    createCampaign,
    runPending,
    selectCampaign,
  } = useStore();

  const [form, setForm] = React.useState({
    campaignName: "",
    brandName: "",
    productName: "",
    platform: "X",
  });

  return (
    <aside
      className="relative z-30 flex h-full flex-col overflow-hidden border-l transition-[width,opacity] duration-300"
      style={{
        width: campaignDrawerOpen ? 300 : 0,
        opacity: campaignDrawerOpen ? 1 : 0,
        background: "linear-gradient(180deg, #f8f4ed 0%, #f2ece1 100%)",
        borderColor: "#e4ded4",
      }}
    >
      <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "#e4ded4" }}>
        <div>
          <div className="text-[8.5px] uppercase tracking-[0.22em]" style={{ color: "#a68b4b" }}>
            الحملات
          </div>
          <h2
            className="mt-0.5 text-[15px] tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}
          >
            اختر أو أنشئ
          </h2>
        </div>
        <button
          onClick={closeCampaignDrawer}
          className="rounded-md px-2 py-1 text-[10px] font-medium"
          style={{ color: "#6b6560", background: "rgba(200,169,110,0.08)" }}
        >
          إغلاق
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={14} color="#a68b4b" />
            <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#9b9590" }}>
              مساحة جديدة
            </span>
          </div>

          <div className="space-y-2">
            <Field
              label="الحملة"
              value={form.campaignName}
              onChange={(campaignName) => setForm((current) => ({ ...current, campaignName }))}
              placeholder="إطلاق الربيع"
            />
            <Field
              label="العلامة"
              value={form.brandName}
              onChange={(brandName) => setForm((current) => ({ ...current, brandName }))}
              placeholder="اسم العلامة"
            />
            <Field
              label="المنتج"
              value={form.productName}
              onChange={(productName) => setForm((current) => ({ ...current, productName }))}
              placeholder="اسم المنتج"
            />
            <Field
              label="المنصة"
              value={form.platform}
              onChange={(platform) => setForm((current) => ({ ...current, platform }))}
              placeholder="X"
            />
          </div>

          <button
            disabled={runPending || !form.campaignName.trim() || !form.brandName.trim() || !form.productName.trim()}
            onClick={async () => {
              await createCampaign(form);
              setForm({
                campaignName: "",
                brandName: "",
                productName: "",
                platform: "X",
              });
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium transition-all"
            style={{
              color: "#f0e8d8",
              background: "linear-gradient(160deg, #3d7a5f, #1e3a2f)",
              opacity:
                runPending || !form.campaignName.trim() || !form.brandName.trim() || !form.productName.trim()
                  ? 0.65
                  : 1,
            }}
          >
            <Plus size={14} />
            إنشاء حملة
          </button>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2">
            <FolderOpen size={14} color="#a68b4b" />
            <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#9b9590" }}>
              الحملات الأخيرة
            </span>
          </div>

          <div className="space-y-2">
            {campaigns.map((campaign) => {
              const active = campaign.id === activeCampaignId;
              return (
                <button
                  key={campaign.id}
                  onClick={() => void selectCampaign(campaign.id)}
                  className="w-full rounded-xl border px-3 py-3 text-start transition-all"
                  style={{
                    borderColor: active ? "#c8a96e" : "#e4ded4",
                    background: active ? "#fcf8ef" : "#fdfaf5",
                    boxShadow: active ? "0 6px 20px rgba(200,169,110,0.14)" : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-medium" style={{ color: "#1f1d1a" }}>
                        {campaign.name}
                      </div>
                      <div className="truncate text-[10px]" style={{ color: "#9b9590" }}>
                        {campaign.brandName} · {campaign.platform}
                      </div>
                    </div>
                    <StatusTag status={campaign.status} />
                  </div>
                  <div className="mt-2 text-[9px]" style={{ color: "#b0a99e" }}>
                    تم التحديث {new Date(campaign.updatedAt).toLocaleString("ar")}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#9b9590" }}>
        {label}
      </div>
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border bg-transparent px-3 py-2 text-[12px]"
        style={{ borderColor: "#e4ded4", color: "#1f1d1a" }}
      />
    </label>
  );
}

function StatusTag({ status }: { status: string }) {
  const styles: Record<string, { color: string; background: string }> = {
    draft: { color: "#8a6a5a", background: "rgba(138,106,90,0.1)" },
    running: { color: "#3d7a5f", background: "rgba(61,122,95,0.1)" },
    ready: { color: "#1e3a2f", background: "rgba(200,169,110,0.14)" },
    attention: { color: "#b25b50", background: "rgba(178,91,80,0.1)" },
  };
  const style = styles[status] ?? styles.draft;

  return (
    <span
      className="rounded-full px-2 py-[3px] text-[9px] font-medium uppercase tracking-[0.14em]"
      style={style}
    >
      {status === "draft"
        ? "مسودة"
        : status === "running"
          ? "قيد التشغيل"
          : status === "ready"
            ? "جاهزة"
            : "انتباه"}
    </span>
  );
}
