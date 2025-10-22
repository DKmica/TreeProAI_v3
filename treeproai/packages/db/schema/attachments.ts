import { pgTable, uuid, varchar, timestamp, index, pgEnum, bigint } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { randomUUID } from "node:crypto";

export const attachmentKind = pgEnum("attachment_kind", ["QUOTE_REQUEST", "JOB_PHOTO", "INVOICE_PDF"]);

export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  s3Key: varchar("s3_key", { length: 1024 }).notNull().unique(),
  kind: attachmentKind("kind").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  companyIdx: index("idx_attachments_company").on(t.companyId),
}));