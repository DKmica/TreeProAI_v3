import { pgTable, uuid, varchar, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { randomUUID } from "node:crypto";

export const userRole = pgEnum("user_role", ["OWNER", "MANAGER", "SALES", "CREW"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
  emailCiphertext: varchar("email_ciphertext", { length: 4096 }),
  emailHash: varchar("email_hash", { length: 64 }),
  phoneCiphertext: varchar("phone_ciphertext", { length: 4096 }),
  phoneHash: varchar("phone_hash", { length: 64 }),
  role: userRole("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_users_company").on(t.companyId),
  emailIdx: index("idx_users_email_hash").on(t.emailHash),
  phoneIdx: index("idx_users_phone_hash").on(t.phoneHash),
  createdIdx: index("idx_users_created_at").on(t.createdAt)
}));