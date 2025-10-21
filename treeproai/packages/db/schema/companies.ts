import { pgTable, uuid, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
  settings: jsonb("settings").$type<Record<string, unknown>>().default({}).notNull()
}, (t) => {
  return {
    slugIdx: index("idx_companies_slug").on(t.slug),
    createdIdx: index("idx_companies_created_at").on(t.createdAt)
  };
});