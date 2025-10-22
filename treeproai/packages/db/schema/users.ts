import { pgTable, uuid, varchar, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const userRole = pgEnum("user_role", ["OWNER", "MANAGER", "SALES", "CREW"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // This is the Clerk User ID
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  emailCiphertext: varchar("email_ciphertext", { length: 512 }).notNull(),
  emailHash: varchar("email_hash", { length: 64 }).notNull(),
  role: userRole("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_users_company").on(t.companyId),
  emailHashIdx: index("idx_users_email_hash").on(t.emailHash),
  createdIdx: index("idx_users_created_at").on(t.createdAt)
}));