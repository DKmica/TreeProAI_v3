import { pgTable, uuid, varchar, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const tenantSettings = pgTable("tenant_settings", {
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  themeJson: jsonb("theme_json"),
  domain: varchar("domain", { length: 255 }),
  logoKey: varchar("logo_key", { length: 1024 }),
}, (t) => ({
  pk: primaryKey({ columns: [t.companyId] }),
}));