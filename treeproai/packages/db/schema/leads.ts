import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { customers } from "./customers";

export const leadStatus = ["NEW", "QUALIFIED", "QUOTED", "WON", "LOST"] as const;
export const leadSource = ["WEB", "PHONE", "REFERRAL", "WALKIN"] as const;

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  source: varchar("source", { length: 32 }).default("WEB").notNull(),
  status: varchar("status", { length: 32 }).default("NEW").notNull(),
  notes: varchar("notes", { length: 2048 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_leads_company").on(t.companyId),
    statusIdx: index("idx_leads_status").on(t.status),
    createdIdx: index("idx_leads_created_at").on(t.createdAt)
  };
});