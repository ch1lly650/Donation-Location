/**
 * Applies the full current schema to a remote Turso (libsql://) database.
 *
 * `prisma db push` / `prisma migrate dev` can't talk to libsql:// URLs
 * directly — their schema-diffing engine only understands `file:` for the
 * sqlite provider (connecting gives P1013: "scheme is not recognized").
 * Workaround: generate the full CREATE TABLE script for the schema and
 * execute it against the remote database over the libsql client directly.
 *
 * Usage (from app/):
 *   DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npm run db:push:remote
 *
 * Caveat: this generates a full "from empty" schema script, so it's meant
 * for first-time setup (or fully resetting an empty remote database). If
 * you change prisma/schema.prisma later and the remote database already
 * has data you want to keep, re-running this will fail with "table already
 * exists" for unchanged tables — write the incremental ALTER/CREATE SQL by
 * hand in that case (Prisma can't introspect a live libsql:// database to
 * diff against automatically).
 */
import { execSync } from "child_process";
import { createClient } from "@libsql/client";

const remoteUrl = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!remoteUrl || !remoteUrl.startsWith("libsql:")) {
  throw new Error(
    "Set DATABASE_URL to your libsql://... Turso URL (and TURSO_AUTH_TOKEN) before running this script."
  );
}

const sql = execSync(
  "npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script",
  { encoding: "utf-8" }
);

const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

async function main() {
  const client = createClient({ url: remoteUrl!, authToken });
  await client.migrate(statements);
  client.close();
  console.log(`Applied ${statements.length} statement(s) to the remote database.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
