import { relations } from "drizzle-orm";
import { jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orgs } from "./orgs";

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const customersRelations = relations(customers, ({ one, many }) => ({
  org: one(orgs, { fields: [customers.orgId], references: [orgs.id] }),
  leads: many(leads),
  quotes: many(quotes),
  jobs: many(jobs),
  invoices: many(invoices),
}));

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  source: text("source"),
  status: text("status").notNull().default("new"),
  score: numeric("score"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const leadsRelations = relations(leads, ({ one }) => ({
  org: one(orgs, { fields: [leads.orgId], references: [orgs.id] }),
  customer: one(customers, { fields: [leads.customerId], references: [customers.id] }),
}));