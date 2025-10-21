import { pgTable, uuid, varchar, numeric, timestamp, index, integer } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { randomUUID } from "node:crypto";

export const crews = pgTable("crews", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 128 }).notNull(),
  size: integer("size").default(3).notNull(),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_crews_company").on(t.companyId),
  createdIdx: index("idx_crews_created_at").on(t.createdAt)
}));