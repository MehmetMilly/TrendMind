import fs from "node:fs/promises";
import path from "node:path";

import { PGlite, type Transaction } from "@electric-sql/pglite";
import { Pool, PoolClient, QueryResultRow } from "pg";

import { getServerEnv } from "@/lib/env";

export interface DbClient {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<{ rows: T[] }>;
}

declare global {
  var __trendmindPool: Pool | undefined;
  var __trendmindMigrationPromise: Promise<void> | undefined;
  var __trendmindPglite: PGlite | undefined;
  var __trendmindDbMode: "pg" | "pglite" | undefined;
}

function shouldUseSsl(connectionString: string) {
  return !/(localhost|127\.0\.0\.1)/i.test(connectionString);
}

function resolvePGliteDataDir() {
  if (process.env.TRENDMIND_PGLITE_DIR) {
    return process.env.TRENDMIND_PGLITE_DIR;
  }

  if (process.env.NODE_ENV === "development") {
    return "memory://trendmind";
  }

  if (process.env.VERCEL) {
    return path.join("/tmp", "trendmind-pglite");
  }

  return path.join(String(process.cwd()), ".trendmind-pglite");
}

export function getPool() {
  if (!global.__trendmindPool) {
    const env = getServerEnv();
    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured.");
    }

    global.__trendmindPool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 10,
      connectionTimeoutMillis: 5000,
      ssl: shouldUseSsl(env.DATABASE_URL)
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }

  return global.__trendmindPool;
}

async function getPGlite() {
  if (!global.__trendmindPglite) {
    global.__trendmindPglite = new PGlite(resolvePGliteDataDir());
  }

  return global.__trendmindPglite;
}

async function resolveDbMode() {
  if (global.__trendmindDbMode) return global.__trendmindDbMode;
  const env = getServerEnv();

  // Explicit pglite-only mode (local dev without a cloud DB).
  if (env.TRENDMIND_DB_MODE === "pglite") {
    global.__trendmindDbMode = "pglite";
    await getPGlite();
    return global.__trendmindDbMode;
  }

  // Explicit pg-only mode: use cloud DB, throw on failure (no fallback).
  if (env.TRENDMIND_DB_MODE === "pg") {
    if (!env.DATABASE_URL) {
      throw new Error(
        "TRENDMIND_DB_MODE=pg but DATABASE_URL is not set. " +
          "Provide a Postgres connection string or switch to TRENDMIND_DB_MODE=auto.",
      );
    }
    const pool = getPool();
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    global.__trendmindDbMode = "pg";
    return global.__trendmindDbMode;
  }

  // Auto mode: use cloud DB when DATABASE_URL is provided, otherwise fall back to PGlite.
  if (env.DATABASE_URL?.trim()) {
    try {
      const pool = getPool();
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      global.__trendmindDbMode = "pg";
      console.info("TrendMind: using cloud Postgres database.");
      return global.__trendmindDbMode;
    } catch (error) {
      console.warn(
        "TrendMind: cloud Postgres unavailable, falling back to local PGlite.",
        error instanceof Error ? error.message : error,
      );
    }
  }

  global.__trendmindDbMode = "pglite";
  await getPGlite();
  return global.__trendmindDbMode;
}

async function withRuntimeClient<T>(fn: (client: DbClient) => Promise<T>) {
  const mode = await resolveDbMode();

  if (mode === "pg") {
    const client = await getPool().connect();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  }

  const client = await getPGlite();
  return fn(client as DbClient);
}

async function withRuntimeTransaction<T>(fn: (client: DbClient) => Promise<T>) {
  const mode = await resolveDbMode();

  if (mode === "pg") {
    const client = await getPool().connect();
    try {
      await client.query("BEGIN");
      const result = await fn(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  const client = await getPGlite();
  return client.transaction(async (tx: Transaction) => fn(tx as unknown as DbClient));
}

async function runMigrations() {
  const mode = await resolveDbMode();
  const migrationsDir = path.join(
    String(process.cwd()),
    "src",
    "lib",
    "db",
    "migrations",
  );
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (mode === "pglite") {
    const db = await getPGlite();
    await db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const appliedResult = await db.query<{ version: string }>(
      "SELECT version FROM schema_migrations",
    );
    const applied = new Set(appliedResult.rows.map((row) => row.version));

    for (const file of files) {
      if (applied.has(file)) continue;
      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
      await db.exec(sql);
      await db.query("INSERT INTO schema_migrations (version) VALUES ($1)", [file]);
    }
    return;
  }

  await withRuntimeClient(async (client) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const appliedResult = await client.query<{ version: string }>(
      "SELECT version FROM schema_migrations",
    );
    const applied = new Set(appliedResult.rows.map((row) => row.version));

    for (const file of files) {
      if (applied.has(file)) continue;
      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
      await withRuntimeTransaction(async (transactionClient) => {
        await transactionClient.query(sql);
        await transactionClient.query(
          "INSERT INTO schema_migrations (version) VALUES ($1)",
          [file],
        );
      });
    }
  });
}

export async function ensureDatabase() {
  if (!global.__trendmindMigrationPromise) {
    global.__trendmindMigrationPromise = runMigrations();
  }

  await global.__trendmindMigrationPromise;
}

export async function queryRows<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  await ensureDatabase();
  const result = await withRuntimeClient((client) => client.query<T>(text, params));
  return result.rows;
}

export async function queryRow<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  const rows = await queryRows<T>(text, params);
  return rows[0] ?? null;
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>) {
  await ensureDatabase();
  return withRuntimeClient((client) => fn(client as PoolClient));
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
) {
  await ensureDatabase();
  return withRuntimeTransaction((client) => fn(client as PoolClient));
}

export async function closeDatabaseConnections() {
  if (global.__trendmindPool) {
    await global.__trendmindPool.end();
    global.__trendmindPool = undefined;
  }

  if (global.__trendmindPglite) {
    await global.__trendmindPglite.close();
    global.__trendmindPglite = undefined;
  }

  global.__trendmindMigrationPromise = undefined;
  global.__trendmindDbMode = undefined;
}
