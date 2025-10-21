import { pgTable, uuid, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 64 }).notNull(),
  status: varchar("status", { length: 32 }).default("RECEIVED").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  receivedAt: timestamp("received_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_webhooks_company").on(t.companyId),
    statusIdx: index("idx_webhooks_status").on(t.status),
    receivedIdx: index("idx_webhooks_received_at").on(t.receivedAt)
  };
});