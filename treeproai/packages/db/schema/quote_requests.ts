import { pgTable, uuid, timestamp, index, varchar, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { leads } from "./leads";
import { randomUUID } from "node:crypto";

export const quoteRequestStatus = pgEnum("quote_request_status", ["RECEIVED", "PROCESSING", "DONE", "ERROR"]);

export const quoteRequests = pgTable("quote_requests", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),
  status: quoteRequestStatus("status").default("RECEIVED").notNull(),
  requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_quote_requests_company").on(t.companyId),
  statusIdx: index("idx_quote_requests_status").on(t.status),
  createdIdx: index("idx_quote_requests_requested_at").on(t.requestedAt)
}));