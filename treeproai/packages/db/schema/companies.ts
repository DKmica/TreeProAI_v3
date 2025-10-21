import { pgTable, uuid, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  settings: jsonb("settings").$type<Record<string, unknown>>().default({}).notNull()
}, (t) => ({
  slugIdx: index("idx_companies_slug").on(t.slug),
  createdIdx: index("idx_companies_created_at").on(t.createdAt)
}));