import { pgSchema } from "drizzle-orm/pg-core";

// Create a schema that references Supabase's auth schema
export const authSchema = pgSchema("auth");

// You can't manage auth.users with Drizzle, but you can reference it
// This allows us to create foreign keys to the users table
export const users = authSchema.table("users", {
  id: "uuid",
});