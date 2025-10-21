import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { quotes } from "./quotes";
import { crews } from "./crews";

export const jobStatus = ["SCHEDULED", "IN_PROGRESS", "DONE", "CANCELLED"] as const;

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
  status: varchar("status", { length: 32 }).default("SCHEDULED").notNull(),
  scheduledDate: timestamp("scheduled_date"),
  crewId: uuid("crew_id").references(() => crews.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_jobs_company").on(t.companyId),
    statusIdx: index("idx_jobs_status").on(t.status),
    createdIdx: index("idx_jobs_created_at").on(t.createdAt)
  };
});