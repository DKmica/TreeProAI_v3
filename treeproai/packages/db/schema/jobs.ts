import { pgTable, uuid, varchar, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { quotes } from "./quotes";
import { crews } from "./crews";
import { randomUUID } from "node:crypto";

export const jobStatus = pgEnum("job_status", ["PENDING", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  status: jobStatus("status").default("PENDING").notNull(),
  crewId: uuid("crew_id").references(() => crews.id, { onDelete: "set null" }),
  equipmentIds: uuid("equipment_ids").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  companyIdx: index("idx_jobs_company").on(t.companyId),
  statusIdx: index("idx_jobs_status").on(t.status),
  createdIdx: index("idx_jobs_created_at").on(t.createdAt)
}));