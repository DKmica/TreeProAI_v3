import { pgTable, text, uuid, timestamp, customType } from "drizzle-orm/pg-core";

// Define the custom vector type for pgvector
const vector = (name: string, { dimensions }: { dimensions: number }) =>
  customType<{ data: number[] }>({
    dataType() {
      return `vector(${dimensions})`;
    },
    toDriver(value: number[]): string {
      // Convert array to pgvector's text format: '[1,2,3]'
      return `[${value.join(",")}]`;
    },
    fromDriver(value: string): number[] {
      // Convert pgvector's text format back to an array
      return value.slice(1, -1).split(",").map(parseFloat);
    },
  })(name);

export const kbChunks = pgTable("kb_chunks", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id"),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1024 }).notNull(),
  sourceRef: text("source_ref"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});