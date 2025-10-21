import { pgTable, uuid, varchar, numeric, timestamp, index, text } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { randomUUID } from "node:crypto";

export const equipment = pgTable("equipment", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 128 }).notNull(),
  ratePerHour: numeric("rate_per_hour", { precision: 10, scale: 2 }).default("0").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_equipment_company").on(t.companyId),
  createdIdx: index("idx_equipment_created_at").on(t.createdAt)
}));