import assert from "node:assert/strict";
import { Client } from "pg";

// Do not load .env files or connect to any database. Every URL is a local fixture.
global.__trendmindEnvLoaded = true;
process.env.DATABASE_URL = "postgresql://db.example.invalid/test";
const cases: ReadonlyArray<readonly [string, boolean, string]> = [
  ["postgresql://db.example.invalid/test", true, "db.example.invalid"],
  ["postgresql://localhost:5432/test", false, "localhost"],
  ["postgresql://127.0.0.1/test", false, "127.0.0.1"],
  ["postgresql://[::1]/test", false, "[::1]"],
  ["postgresql://user:localhost@db.example.invalid/test", true, "db.example.invalid"],
  ["postgresql://db.example.invalid/localhost", true, "db.example.invalid"],
  ["postgresql://localhost.example.invalid/test", true, "localhost.example.invalid"],
  ["postgresql://db.example.invalid/test?host=localhost", false, "localhost"],
  ["postgresql://localhost/test?host=db.example.invalid", true, "db.example.invalid"],
  ["postgresql://localhost/test?host=localhost&host=db.example.invalid", true, "db.example.invalid"],
  ["postgresql://db.example.invalid/test?host=db.example.invalid&host=localhost", false, "localhost"],
  ["postgresql://db.example.invalid/test?host=%2Ftmp", false, "/tmp"],
  ["postgresql://%6cocalhost/test", false, "localhost"],
  ...["disable", "no-verify", "require", "prefer", "verify-ca", "verify-full"].flatMap((mode) => [
    [`postgresql://db.example.invalid/test?sslmode=${mode}`, true, "db.example.invalid"],
    [`postgresql://db.example.invalid/test?sslmode=${mode}&uselibpqcompat=true`, true, "db.example.invalid"],
  ] as const),
  ["postgresql://db.example.invalid/test?ssl=0", true, "db.example.invalid"],
  ["postgresql://db.example.invalid/test?sslmode=verify-full&sslmode=no-verify", true, "db.example.invalid"],
];

async function main() {
  const { getServerEnv } = await import("../src/lib/env");
  const { closeDatabaseConnections, getPool } = await import("../src/lib/db");
  const env = getServerEnv();
  for (const [url, tls, host] of cases) {
    env.DATABASE_URL = url;
    const pool = getPool();
    const client = new Client(pool.options);
    // Inspect the driver's parsed settings too: URL settings override pool.options.
    const settings = (client as unknown as {
      connectionParameters: { host: string; ssl: false | { rejectUnauthorized?: boolean; checkServerIdentity?: unknown } };
    }).connectionParameters;
    assert.equal(settings.host, host, `effective host for ${url}`);
    if (tls) {
      assert.deepEqual(pool.options.ssl, { rejectUnauthorized: true });
      assert.equal(new URL(pool.options.connectionString!).searchParams.get("sslmode"), "verify-full");
      assert.ok(settings.ssl, `TLS required for ${url}`);
      assert.notEqual(settings.ssl.rejectUnauthorized, false, `certificate verification for ${url}`);
      assert.equal(settings.ssl.checkServerIdentity, undefined, `hostname verification for ${url}`);
    } else {
      assert.equal(Boolean(settings.ssl), false, `preserve local connection for ${url}`);
    }
    await closeDatabaseConnections();
  }
  for (const invalid of ["not-a-url", "https://db.example.invalid/test"]) {
    env.DATABASE_URL = invalid;
    assert.throws(getPool, { message: "DATABASE_URL must be a valid PostgreSQL URL." });
  }
  console.log(`Database TLS checks passed for ${cases.length} valid URL fixtures and 2 invalid fixtures, without network access.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
