import { pgTable, uuid, varchar, numeric, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { quoteRequests } from "./quote_requests";
import { randomUUID } from "node:crypto";

export const quoteStatus = pgEnum("quote_status", ["DRAFT", "SENT", "ACCEPTED", "REJECTED"]);

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  quoteRequestId: uuid("quote_request_id").references(() => quoteRequests.id, { onDelete: "set null" }),
  status: quoteStatus("status").default("DRAFT").notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).default("0").notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).default("0").notNull(),
  pricingVersion: varchar("pricing_version", { length: 32 }).default("v1-heuristic").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  companyIdx: index("idx_quotes_company").on(t.companyId),
  statusIdx: index("idx_quotes_status").on(t.status),
  createdIdx: index("idx_quotes_created_at").on(t.createdAt)
}));