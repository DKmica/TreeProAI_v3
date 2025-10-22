import { pgTable, uuid, varchar, numeric, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { randomUUID } from "node:crypto";

export const addressKind = pgEnum("address_kind", ["CUSTOMER", "JOB_SITE", "COMPANY_HQ"]);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  kind: addressKind("kind").notNull(),
  street: varchar("street", { length: 256 }).notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  state: varchar("state", { length: 64 }).notNull(),
  zip: varchar("zip", { length: 32 }).notNull(),
  lat: numeric("lat", { precision: 10, scale: 6 }),
  lng: numeric("lng", { precision: 10, scale: 6 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  companyIdx: index("idx_addresses_company").on(t.companyId),
  createdIdx: index("idx_addresses_created_at").on(t.createdAt)
}));