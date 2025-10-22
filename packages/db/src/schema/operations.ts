import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orgs } from "./orgs";
import { customers } from "./crm";
import { quotes } from "./financials";
import { invoices } from "./financials";

export const crews = pgTable("crews", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const crewsRelations = relations(crews, ({ one }) => ({
  org: one(orgs, {
    fields: [crews.orgId],
    references: [orgs.id],
  }),
}));

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
  status: text("status").notNull().default("scheduled"),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date", { withTimezone: true }),
  completedDate: timestamp("completed_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  org: one(orgs, { fields: [jobs.orgId], references: [orgs.id] }),
  customer: one(customers, { fields: [jobs.customerId], references: [customers.id] }),
  quote: one(quotes, { fields: [jobs.quoteId], references: [quotes.id] }),
  invoices: many(invoices),
}));