"use client";

import { useStore } from "@/lib/workspace-store";

export function KeyboardShortcuts() {
  const { closeShortcutHelp, shortcutHelpOpen } = useStore();
  if (!shortcutHelpOpen) return null;

  const shortcuts = [
    ["⌘/Ctrl + K", "فتح لوحة الأوامر"],
    ["← / →", "التنقل بين المراحل"],
    ["G ثم 1-7", "قفز سريع إلى مرحلة"],
    ["R", "إعادة تشغيل المرحلة الحالية"],
    ["Esc", "إغلاق اللوحات"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10100d]/45 p-6 backdrop-blur-md">
      <div
        className="w-full max-w-[420px] rounded-2xl border p-5 shadow-2xl"
        style={{ background: "#fffaf2", borderColor: "rgba(200,169,110,0.28)" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[22px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
            الاختصارات
          </h2>
          <button onClick={closeShortcutHelp} className="rounded-lg px-3 py-1 text-[12px]" style={{ background: "#f1e7d5", color: "#5a5145" }}>
            إغلاق
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {shortcuts.map(([key, label]) => (
            <div key={key} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "#f7efe1" }}>
              <span className="text-[13px] font-semibold" style={{ color: "#1f1d1a" }}>
                {label}
              </span>
              <kbd dir="ltr" className="rounded-md border px-2 py-1 text-[11px]" style={{ borderColor: "#dbcaa7", color: "#8a6a35" }}>
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
