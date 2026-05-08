"use client";

import { useEffect, useRef, useState } from "react";

const logoSuggestions = [
  {
    title: "Improve colors",
    body: "Increase contrast and reduce color noise so the logo stays clear in small previews and print.",
  },
  {
    title: "Adjust spacing",
    body: "Add safe space around the symbol and wordmark to improve readability inside thumbnails and packaging.",
  },
  {
    title: "Simplify the design",
    body: "Reduce fine details while preserving the core brand mark and identity.",
  },
  {
    title: "Improve clarity",
    body: "Unify edge weight and contrast so the logo works on light and dark backgrounds.",
  },
  {
    title: "Prepare usage versions",
    body: "Create a square social version, horizontal website version, and one-color print version.",
  },
];

const logoPalette = ["#162b22", "#c8a96e", "#f5e8c8", "#3d7a5f"];

const logoPrompt = `You are a senior brand identity designer and AI image prompt engineer.
Analyze the uploaded logo for color harmony, spacing, legibility, scalability, visual hierarchy, and brand consistency.
Generate an improved version while preserving the original brand identity, core symbol, recognizability, and emotional tone.
Do not invent a new brand. Refine only what improves professional quality.
Improve contrast, optical spacing, edge clarity, small-size readability, and print readiness.
Create a polished vector-like logo on a clean neutral background, plus social-media-safe and print-friendly variants.
Avoid generic icons, unrelated symbols, noisy texture, and excessive gradients.`;

export function LogoIntelligenceStudio() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function acceptFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return nextUrl;
    });
    setFileName(file.name);
    setAnalysisReady(false);
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisReady(true);
    }, 1300);
  }

  return (
    <div className="mb-3 rounded-2xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[8.5px] uppercase tracking-[0.2em]" style={{ color: "#a68b4b" }}>
            Logo Intelligence
          </div>
          <h3 className="mt-1 text-[17px] tracking-[-0.01em]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
            Logo upload and brand refinement
          </h3>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[9px] font-semibold" style={{ color: "#1e3a2f", background: "rgba(61,122,95,0.1)" }}>
          Demo preview
        </span>
      </div>

      <div className="grid grid-cols-[0.9fr_1.4fr] gap-3 max-lg:grid-cols-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            acceptFile(event.dataTransfer.files?.[0]);
          }}
          className="flex min-h-[250px] w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition-all"
          style={{
            borderColor: isDragging ? "#3d7a5f" : "#d8d0c4",
            background: isDragging ? "rgba(61,122,95,0.08)" : "#faf7f2",
          }}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => acceptFile(event.target.files?.[0])} />
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Uploaded logo" className="max-h-[150px] max-w-[82%] object-contain drop-shadow-md" />
              <span className="mt-3 max-w-full truncate text-[10px] font-medium" style={{ color: "#5a5550" }}>
                {fileName}
              </span>
            </>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl text-[13px] font-bold" style={{ background: "#162b22", color: "#dcc487" }}>
                UP
              </span>
              <strong className="mt-3 text-[13px]" style={{ color: "#1f1d1a" }}>
                Drag your logo here
              </strong>
              <span className="mt-1 max-w-[250px] text-[11px] leading-[1.6]" style={{ color: "#6b6560" }}>
                PNG, JPG, or WEBP. After upload, you will see a comparison and an API-ready AI analysis.
              </span>
            </>
          )}
        </button>

        <div className="min-h-[250px] rounded-xl border p-3" style={{ borderColor: "#ece5d8", background: "#f8f4ed" }}>
          {!previewUrl ? (
            <div className="flex h-full items-center justify-center text-center">
              <p className="max-w-sm text-[12px] leading-[1.7]" style={{ color: "#6b6560" }}>
                Upload a brand logo to see the original, an enhanced preview, Brand Score, color palette,
                typography suggestions, social preview, and packaging mockup.
              </p>
            </div>
          ) : isAnalyzing ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-transparent" style={{ borderTopColor: "#3d7a5f", borderRightColor: "#c8a96e" }} />
              <h4 className="mt-3 text-[14px]" style={{ fontFamily: "var(--font-heading)", color: "#1f1d1a" }}>
                Analyzing logo identity
              </h4>
              <p className="mt-1 text-[11px]" style={{ color: "#6b6560" }}>
                Checking colors, spacing, clarity, social usage, and print readiness.
              </p>
            </div>
          ) : analysisReady ? (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <LogoPreview title="Before" image={previewUrl} />
                <LogoPreview title="After" image={previewUrl} enhanced />
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-3 max-sm:grid-cols-1">
                <div className="rounded-xl border p-3 text-center" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
                  <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
                    Brand Score
                  </div>
                  <div className="mt-2 text-[28px] font-semibold" style={{ color: "#162b22", fontFamily: "var(--font-heading)" }}>
                    8.4
                  </div>
                  <div className="text-[10px]" style={{ color: "#9b9590" }}>
                    /10
                  </div>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
                  <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
                    Suggested palette
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {logoPalette.map((color) => (
                      <span key={color} className="h-7 w-7 rounded-full border" style={{ background: color, borderColor: "rgba(0,0,0,0.1)" }} title={color} />
                    ))}
                  </div>
                  <div className="mt-3 text-[10.5px] leading-[1.55]" style={{ color: "#5a5550" }}>
                    Typography: use a geometric Sans Serif in Medium weight, with subtle letter spacing for print versions.
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {analysisReady ? (
        <div className="mt-3 grid grid-cols-[1.1fr_0.9fr] gap-3 max-lg:grid-cols-1">
          <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
            <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
              Professional suggestions
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 max-sm:grid-cols-1">
              {logoSuggestions.map((item) => (
                <div key={item.title} className="rounded-lg border px-3 py-2" style={{ borderColor: "#ece5d8", background: "#faf7f2" }}>
                  <div className="text-[11px] font-semibold" style={{ color: "#1f1d1a" }}>
                    {item.title}
                  </div>
                  <p className="mt-1 text-[10px] leading-[1.55]" style={{ color: "#5a5550" }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <MiniMock title="Social" image={previewUrl} />
              <MiniMock title="Package" image={previewUrl} box />
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#111a15" }}>
              <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#c8a96e" }}>
                AI prompt engineering
              </div>
              <p className="mt-2 max-h-[120px] overflow-auto text-[10px] leading-[1.55]" dir="ltr" style={{ color: "#f5e8c8" }}>
                {logoPrompt}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LogoPreview({ title, image, enhanced = false }: { title: string; image: string; enhanced?: boolean }) {
  return (
    <div className="rounded-xl border p-2" style={{ borderColor: "#e4ded4", background: enhanced ? "#162b22" : "#fdfaf5" }}>
      <div className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: enhanced ? "#dcc487" : "#9b9590" }}>
        {title}
      </div>
      <div className="flex aspect-square items-center justify-center rounded-lg" style={{ background: enhanced ? "#f8f4ed" : "#f5f1ea" }}>
        <img
          src={image}
          alt={`${title} logo preview`}
          className="max-h-[70%] max-w-[70%] object-contain"
          style={enhanced ? { filter: "contrast(1.12) saturate(1.22) drop-shadow(0 10px 18px rgba(0,0,0,0.18))" } : undefined}
        />
      </div>
    </div>
  );
}

function MiniMock({ title, image, box = false }: { title: string; image: string; box?: boolean }) {
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: "#e4ded4", background: "#fdfaf5" }}>
      <div className="text-[8.5px] uppercase tracking-[0.18em]" style={{ color: "#a68b4b" }}>
        {title}
      </div>
      <div className="mt-2 flex h-[110px] items-center justify-center rounded-lg" style={{ background: box ? "linear-gradient(135deg,#efe8dc,#fffaf2)" : "linear-gradient(135deg,#162b22,#3d7a5f)" }}>
        <div className={box ? "rounded-xl border bg-white p-4 shadow-md" : "rounded-full bg-white p-3"} style={{ borderColor: "#e4ded4" }}>
          <img src={image} alt={`${title} logo mockup`} className="h-12 w-12 object-contain" style={{ filter: "contrast(1.12) saturate(1.18)" }} />
        </div>
      </div>
    </div>
  );
}
