import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { randomUUID } from "node:crypto";

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).notNull(),
  emailCiphertext: varchar("email_ciphertext", { length: 512 }),
  emailHash: varchar("email_hash", { length: 64 }),
  phoneCiphertext: varchar("phone_ciphertext", { length: 512 }),
  phoneHash: varchar("phone_hash", { length: 64 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  companyIdx: index("idx_customers_company").on(t.companyId),
  emailHashIdx: index("idx_customers_email_hash").on(t.emailHash),
  createdIdx: index("idx_customers_created_at").on(t.createdAt)
}));