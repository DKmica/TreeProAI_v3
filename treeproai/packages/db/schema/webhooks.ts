import { pgTable, uuid, varchar, jsonb, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { randomUUID } from "node:crypto";

export const webhookStatus = pgEnum("webhook_status", ["RECEIVED", "PROCESSED", "ERROR"]);

export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 64 }).notNull(),
  status: webhookStatus("status").default("RECEIVED").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_webhooks_company").on(t.companyId),
  statusIdx: index("idx_webhooks_status").on(t.status),
  receivedIdx: index("idx_webhooks_received_at").on(t.receivedAt)
}));