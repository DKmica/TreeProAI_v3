import "dotenv/config";
import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../schema/index";

export * from "./crypto";

let db: NodePgDatabase<typeof schema>;
let pool: Pool;

export function getDb() {
  if (db) {
    return db;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL env var is required");
  }
  pool = new Pool({ connectionString });
  db = drizzle(pool, { schema });
  return db;
}

export async function disconnectDb() {
  if (pool) {
    await pool.end();
  }
}

export { schema };