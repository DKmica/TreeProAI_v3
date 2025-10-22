import { boolean, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";

export const orgs = pgTable("orgs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const orgUsers = pgTable("org_users", {
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // 'admin', 'member'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.orgId, table.userId] }),
}));

// Drizzle relations for type safety and query building
export const orgsRelations = relations(orgs, ({ one, many }) => ({
  owner: one(users, {
    fields: [orgs.ownerId],
    references: [users.id],
  }),
  members: many(orgUsers),
}));

export const orgUsersRelations = relations(orgUsers, ({ one }) => ({
  org: one(orgs, {
    fields: [orgUsers.orgId],
    references: [orgs.id],
  }),
  user: one(users, {
    fields: [orgUsers.userId],
    references: [users.id],
  }),
}));