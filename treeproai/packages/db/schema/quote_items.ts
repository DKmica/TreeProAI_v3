import { pgTable, uuid, varchar, numeric, timestamp, index, text, pgEnum } from "drizzle-orm/pg-core";
import { quotes } from "./quotes";
import { randomUUID } from "node:crypto";

export const quoteItemKind = pgEnum("quote_item_kind", ["SERVICE", "DISCOUNT", "FEE"]);

export const quoteItems = pgTable("quote_items", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  quoteId: uuid("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  kind: quoteItemKind("kind").default("SERVICE").notNull(),
  description: text("description").notNull(),
  qty: numeric("qty", { precision: 10, scale: 2 }).default("1").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  quoteIdx: index("idx_quote_items_quote").on(t.quoteId),
}));