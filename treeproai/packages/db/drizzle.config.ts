import { defineConfig } from "drizzle-kit";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  introspect: {
    casing: "camel",
  },
  verbose: true,
  strict: true,
});