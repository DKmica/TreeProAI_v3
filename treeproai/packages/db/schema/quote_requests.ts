import { pgTable, uuid, timestamp, index, varchar } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { leads } from "./leads";

export const quoteRequests = pgTable("quote_requests", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 32 }).default("RECEIVED").notNull(),
  requestedAt: timestamp("requested_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_quote_requests_company").on(t.companyId),
    statusIdx: index("idx_quote_requests_status").on(t.status),
    createdIdx: index("idx_quote_requests_requested_at").on(t.requestedAt)
  };
});