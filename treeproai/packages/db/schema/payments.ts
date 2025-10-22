import { pgTable, uuid, varchar, numeric, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { invoices } from "./invoices";
import { randomUUID } from "node:crypto";

export const paymentStatus = pgEnum("payment_status", ["PENDING", "SUCCEEDED", "FAILED"]);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: paymentStatus("status").default("PENDING").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  invoiceIdx: index("idx_payments_invoice").on(t.invoiceId),
  statusIdx: index("idx_payments_status").on(t.status),
}));