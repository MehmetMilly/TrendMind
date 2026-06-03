import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".claude/**",
      ".vercel/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "tmp/**",
      "test-results/**",
      "CS1301_Tutorial_09_Solutions/**",
      "demo-data/**",
      "trendmind-app/**",
      "docx_render_preview/**",
      "generate_pptx.js",
      "find_heading.js",
      "Full_Plan.md",
      "ONESHOT.md",
      "PRESENTATION_PLAN.md",
      "TrendMind_Presentation*.pptx",
      "TrendMind_UI_Notes_Reorganized.md",
      "Laptop discussion transcript.txt",
      "next-env.d.ts",
      "dev-server*.log",
      "devserver*.log",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
