import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite"],
  outputFileTracingExcludes: {
    "*": [
      "./.trendmind-pglite/**/*",
      "./test-results/**/*",
      "./tmp/**/*",
      "./trendmind-app/.next/**/*",
    ],
  },
};

export default nextConfig;
