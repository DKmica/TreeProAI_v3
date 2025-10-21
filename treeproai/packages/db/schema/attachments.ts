import { pgTable, uuid, varchar, timestamp, index, bigint } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { quoteRequests } from "./quote_requests";
import { randomUUID } from "node:crypto";

export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  quoteRequestId: uuid("quote_request_id").references(() => quoteRequests.id, { onDelete: "cascade" }),
  s3Key: varchar("s3_key", { length: 1024 }).notNull(),
  contentType: varchar("content_type", { length: 128 }),
  sizeBytes: bigint("size_bytes", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (t) => ({
  companyIdx: index("idx_attachments_company").on(t.companyId),
  requestIdx: index("idx_attachments_request").on(t.quoteRequestId),
  createdIdx: index("idx_attachments_created_at").on(t.createdAt)
}));