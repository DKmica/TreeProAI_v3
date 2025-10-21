import { pgTable, uuid, varchar, numeric, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { leads } from "./leads";

export const quoteStatus = ["DRAFT", "SENT", "ACCEPTED", "REJECTED"] as const;

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  status: varchar("status", { length: 32 }).default("DRAFT").notNull(),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).default("0"),
  confidence: numeric("confidence", { precision: 5, scale: 2 }).default("0"),
  aiFindings: jsonb("ai_findings").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_quotes_company").on(t.companyId),
    statusIdx: index("idx_quotes_status").on(t.status),
    createdIdx: index("idx_quotes_created_at").on(t.createdAt)
  };
});