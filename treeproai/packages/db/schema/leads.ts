import { pgTable, uuid, varchar, timestamp, index, pgEnum, text } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { customers } from "./customers";
import { randomUUID } from "node:crypto";

export const leadStatus = pgEnum("lead_status", ["NEW", "QUALIFIED", "QUOTED", "WON", "LOST"]);
export const leadSource = pgEnum("lead_source", ["WEB", "PHONE", "REFERRAL", "WALKIN"]);

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  source: leadSource("source").default("WEB").notNull(),
  status: leadStatus("status").default("NEW").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_leads_company").on(t.companyId),
  statusIdx: index("idx_leads_status").on(t.status),
  createdIdx: index("idx_leads_created_at").on(t.createdAt)
}));