import {
  closeDatabaseConnections,
  ensureDatabase,
} from "../src/lib/db";

async function main() {
  await ensureDatabase();
  console.log("TrendMind database is ready.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await closeDatabaseConnections();
});
