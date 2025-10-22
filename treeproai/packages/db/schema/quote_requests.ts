import { pgTable, uuid, timestamp, index, text, varchar } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { customers } from "./customers";
import { addresses } from "./addresses";
import { randomUUID } from "node:crypto";

export const quoteRequests = pgTable("quote_requests", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  addressId: uuid("address_id").references(() => addresses.id, { onDelete: "set null" }),
  imageKeys: varchar("image_keys", { length: 1024 }).array().notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  companyIdx: index("idx_quote_requests_company").on(t.companyId),
  createdIdx: index("idx_quote_requests_created_at").on(t.createdAt)
}));