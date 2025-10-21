import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { addresses } from "./addresses";

export const customerStatus = ["ACTIVE", "INACTIVE"] as const;

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).notNull(),
  emailCiphertext: varchar("email_ciphertext", { length: 4096 }),
  emailHash: varchar("email_hash", { length: 64 }),
  phoneCiphertext: varchar("phone_ciphertext", { length: 4096 }),
  phoneHash: varchar("phone_hash", { length: 64 }),
  addressId: uuid("address_id").references(() => addresses.id, { onDelete: "set null" }),
  status: varchar("status", { length: 32 }).default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_customers_company").on(t.companyId),
    statusIdx: index("idx_customers_status").on(t.status),
    emailIdx: index("idx_customers_email_hash").on(t.emailHash),
    phoneIdx: index("idx_customers_phone_hash").on(t.phoneHash),
    createdIdx: index("idx_customers_created_at").on(t.createdAt)
  };
});