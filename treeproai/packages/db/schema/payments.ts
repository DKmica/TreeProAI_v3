import { pgTable, uuid, varchar, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { invoices } from "./invoices";

export const paymentStatus = ["PENDING", "SUCCEEDED", "FAILED"] as const;

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 32 }).default("STRIPE").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  status: varchar("status", { length: 32 }).default("PENDING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_payments_company").on(t.companyId),
    statusIdx: index("idx_payments_status").on(t.status),
    createdIdx: index("idx_payments_created_at").on(t.createdAt)
  };
});