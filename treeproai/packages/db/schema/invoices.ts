import { pgTable, uuid, varchar, numeric, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { jobs } from "./jobs";
import { randomUUID } from "node:crypto";

export const invoiceStatus = pgEnum("invoice_status", ["DRAFT", "SENT", "PAID", "VOID"]);

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  status: invoiceStatus("status").default("DRAFT").notNull(),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  companyIdx: index("idx_invoices_company").on(t.companyId),
  statusIdx: index("idx_invoices_status").on(t.status),
  createdIdx: index("idx_invoices_created_at").on(t.createdAt)
}));