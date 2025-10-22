import { pgTable, uuid, varchar, jsonb, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { randomUUID } from "node:crypto";

export const webhookKind = pgEnum("webhook_kind", ["STRIPE", "CLERK"]);

export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  kind: webhookKind("kind").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  companyIdx: index("idx_webhooks_company").on(t.companyId),
  createdIdx: index("idx_webhooks_created_at").on(t.createdAt)
}));