import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "trendmind-app/**",
      "docx_render_preview/**",
      "find_heading.js",
      "next-env.d.ts",
      "devserver*.log",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
