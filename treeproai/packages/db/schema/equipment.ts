import { pgTable, uuid, varchar, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const equipment = pgTable("equipment", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 128 }).notNull(),
  ratePerHour: numeric("rate_per_hour", { precision: 10, scale: 2 }).default("0").notNull(),
  notes: varchar("notes", { length: 1024 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_equipment_company").on(t.companyId),
    createdIdx: index("idx_equipment_created_at").on(t.createdAt)
  };
});