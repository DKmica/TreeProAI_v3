import { pgTable, uuid, varchar, timestamp, index, boolean, pgEnum } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { randomUUID } from "node:crypto";

export const equipmentKind = pgEnum("equipment_kind", ["TRUCK", "CHIPPER", "STUMP_GRINDER", "SAW"]);

export const equipment = pgTable("equipment", {
  id: uuid("id").primaryKey().$defaultFn(() => randomUUID()),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 128 }).notNull(),
  kind: equipmentKind("kind"),
  available: boolean("available").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  companyIdx: index("idx_equipment_company").on(t.companyId),
}));