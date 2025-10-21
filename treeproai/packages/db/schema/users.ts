import { pgTable, uuid, varchar, timestamp, index, pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["OWNER", "MANAGER", "SALES", "CREW"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull(),
  emailCiphertext: varchar("email_ciphertext", { length: 4096 }),
  emailHash: varchar("email_hash", { length: 64 }),
  phoneCiphertext: varchar("phone_ciphertext", { length: 4096 }),
  phoneHash: varchar("phone_hash", { length: 64 }),
  role: userRole("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_users_company").on(t.companyId),
    emailIdx: index("idx_users_email_hash").on(t.emailHash),
    phoneIdx: index("idx_users_phone_hash").on(t.phoneHash),
    createdIdx: index("idx_users_created_at").on(t.createdAt)
  };
});

// Import dependency to satisfy references
import { companies } from "./companies";