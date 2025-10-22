import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orgs } from "./orgs";

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => orgs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => orgs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  source: text("source"), // e.g., 'Website', 'Referral'
  status: text("status").default("New").notNull(), // e.g., 'New', 'Contacted', 'Qualified'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});