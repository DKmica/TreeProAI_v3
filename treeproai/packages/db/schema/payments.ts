import { pgTable, uuid, varchar, numeric, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { invoices } from "./invoices";
import { randomUUID } from "node:crypto";

export const paymentStatus = pgEnum("payment_status", ["PENDING", "SUCCEEDED", "FAILED"]);
export const paymentMethod = pgEnum("payment_method", ["STRIPE", "CASH", "CHECK"]);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: paymentMethod("method").default("STRIPE").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  status: paymentStatus("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_payments_company").on(t.companyId),
  statusIdx: index("idx_payments_status").on(t.status),
  createdIdx: index("idx_payments_created_at").on(t.createdAt)
}));