import { loadEnvConfig } from "@next/env";
import { z } from "zod";

declare global {
  var __trendmindEnvLoaded: boolean | undefined;
}

if (!global.__trendmindEnvLoaded) {
  loadEnvConfig(process.cwd());
  global.__trendmindEnvLoaded = true;
}

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_BASE_URL: z
    .string()
    .url()
    .default("https://openrouter.ai/api/v1"),
  OPENROUTER_MODEL: z
    .string()
    .default("google/gemini-3.1-pro"),
  OPENROUTER_FALLBACK_MODEL: z
    .string()
    .default("google/gemini-2.5-flash"),
  OPENROUTER_TIMEOUT_MS: z.coerce.number().int().positive().default(240000),
  TRENDMIND_DB_MODE: z.enum(["pglite", "pg", "auto"]).default("auto"),
  TRENDMIND_ALLOW_SYNTHETIC_FALLBACKS: z
    .enum(["true", "false"])
    .default("false"),
  TAVILY_API_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | null = null;

function normalizeOptional(value: string | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;

  cachedEnv = serverEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: normalizeOptional(process.env.DIRECT_URL),
    OPENROUTER_API_KEY: normalizeOptional(process.env.OPENROUTER_API_KEY),
    OPENROUTER_BASE_URL: normalizeOptional(process.env.OPENROUTER_BASE_URL),
    OPENROUTER_MODEL: normalizeOptional(process.env.OPENROUTER_MODEL),
    OPENROUTER_FALLBACK_MODEL: normalizeOptional(
      process.env.OPENROUTER_FALLBACK_MODEL,
    ),
    OPENROUTER_TIMEOUT_MS: normalizeOptional(process.env.OPENROUTER_TIMEOUT_MS),
    TRENDMIND_DB_MODE: normalizeOptional(process.env.TRENDMIND_DB_MODE),
    TRENDMIND_ALLOW_SYNTHETIC_FALLBACKS: normalizeOptional(
      process.env.TRENDMIND_ALLOW_SYNTHETIC_FALLBACKS,
    ),
    TAVILY_API_KEY: normalizeOptional(process.env.TAVILY_API_KEY),
    NEXT_PUBLIC_APP_URL: normalizeOptional(process.env.NEXT_PUBLIC_APP_URL),
  });

  return cachedEnv;
}

export function getIntegrationHealth() {
  const env = getServerEnv();

  return {
    ai: Boolean(env.OPENROUTER_API_KEY),
    research: Boolean(env.TAVILY_API_KEY),
  };
}
