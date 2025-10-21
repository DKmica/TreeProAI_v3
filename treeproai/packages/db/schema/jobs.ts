import { pgTable, uuid, varchar, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { quotes } from "./quotes";
import { crews } from "./crews";
import { randomUUID } from "node:crypto";

export const jobStatus = pgEnum("job_status", ["SCHEDULED", "IN_PROGRESS", "DONE", "CANCELLED"]);

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
  status: jobStatus("status").default("SCHEDULED").notNull(),
  scheduledDate: timestamp("scheduled_date", { withTimezone: true }),
  crewId: uuid("crew_id").references(() => crews.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_jobs_company").on(t.companyId),
  statusIdx: index("idx_jobs_status").on(t.status),
  createdIdx: index("idx_jobs_created_at").on(t.createdAt)
}));