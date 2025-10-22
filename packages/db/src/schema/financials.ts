import { relations } from "drizzle-orm";
import { jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orgs } from "./orgs";
import { customers } from "./crm";
import { jobs } from "./operations";

export const quotes = pgTable("quotes", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("draft"),
  total: numeric("total").notNull(),
  lineItems: jsonb("line_items"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  org: one(orgs, { fields: [quotes.orgId], references: [orgs.id] }),
  customer: one(customers, { fields: [quotes.customerId], references: [customers.id] }),
  jobs: many(jobs),
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

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
  status: text("status").notNull().default("draft"),
  amount: numeric("amount").notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  org: one(orgs, { fields: [invoices.orgId], references: [orgs.id] }),
  customer: one(customers, { fields: [invoices.customerId], references: [customers.id] }),
  job: one(jobs, { fields: [invoices.jobId], references: [jobs.id] }),
}));