import { pgTable, uuid, varchar, numeric, timestamp, index, text } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { quotes } from "./quotes";
import { randomUUID } from "node:crypto";

export const quoteItems = pgTable("quote_items", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  quoteId: uuid("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).default("1").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).default("0").notNull(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_quote_items_company").on(t.companyId),
  quoteIdx: index("idx_quote_items_quote").on(t.quoteId),
  createdIdx: index("idx_quote_items_created_at").on(t.createdAt)
}));