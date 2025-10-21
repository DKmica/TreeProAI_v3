import { pgTable, uuid, varchar, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const crews = pgTable("crews", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 128 }).notNull(),
  size: numeric("size", { precision: 4, scale: 0 }).default("3").notNull(),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_crews_company").on(t.companyId),
    createdIdx: index("idx_crews_created_at").on(t.createdAt)
  };
});