import { pgTable, uuid, varchar, numeric, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { quotes } from "./quotes";
import { randomUUID } from "node:crypto";

export const invoiceStatus = pgEnum("invoice_status", ["PENDING", "SENT", "PAID", "VOID"]);

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
  status: invoiceStatus("status").default("PENDING").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).default("0").notNull(),
  stripePayLinkUrl: varchar("stripe_pay_link_url", { length: 2048 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_invoices_company").on(t.companyId),
  statusIdx: index("idx_invoices_status").on(t.status),
  createdIdx: index("idx_invoices_created_at").on(t.createdAt)
}));