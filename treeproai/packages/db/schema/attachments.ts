import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { quoteRequests } from "./quote_requests";

export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().notNull(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  quoteRequestId: uuid("quote_request_id").references(() => quoteRequests.id, { onDelete: "cascade" }),
  s3Key: varchar("s3_key", { length: 1024 }).notNull(),
  contentType: varchar("content_type", { length: 128 }),
  sizeBytes: varchar("size_bytes", { length: 32 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => {
  return {
    companyIdx: index("idx_attachments_company").on(t.companyId),
    requestIdx: index("idx_attachments_request").on(t.quoteRequestId),
    createdIdx: index("idx_attachments_created_at").on(t.createdAt)
  };
});