import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { vector } from "pgvector/drizzle-orm";
import { orgs } from "./orgs";
import { relations } from "drizzle-orm";

export const kbChunks = pgTable("kb_chunks", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1024 }).notNull(),
  sourceRef: text("source_ref"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const kbChunksRelations = relations(kbChunks, ({ one }) => ({
  org: one(orgs, {
    fields: [kbChunks.orgId],
    references: [orgs.id],
  }),
}));