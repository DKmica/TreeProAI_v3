import { pgTable, uuid, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const tenantSettings = pgTable("tenant_settings", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 128 }).notNull(),
  value: jsonb("value").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_tenant_settings_company").on(t.companyId),
    keyIdx: index("idx_tenant_settings_key").on(t.key)
  };
});