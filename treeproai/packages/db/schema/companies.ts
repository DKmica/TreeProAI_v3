import { pgTable, uuid, varchar, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const companyPlan = pgEnum("company_plan", ["FREE", "PRO", "ENTERPRISE"]);

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 256 }).notNull(),
  plan: companyPlan("plan").default("FREE").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  createdIdx: index("idx_companies_created_at").on(t.createdAt)
}));