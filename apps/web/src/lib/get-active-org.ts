import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { createClient } from "@/lib/supabase/server";
import { db, schema } from "@treeproai/db";

export async function getActiveOrg() {
  const cookieStore = cookies();
  const activeOrgId = cookieStore.get("active-org-id")?.value;
  if (activeOrgId) {
    return activeOrgId;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const userOrg = await db
    .select({ orgId: schema.orgUsers.orgId })
    .from(schema.orgUsers)
    .where(eq(schema.orgUsers.userId, user.id))
    .limit(1);

  const fallbackOrgId = userOrg[0]?.orgId ?? null;

  if (fallbackOrgId) {
    try {
      cookieStore.set("active-org-id", fallbackOrgId, {
        httpOnly: true,
        path: "/",
      });
    } catch {
      // Setting cookies inside certain server contexts (like React Server Components)
      // may throw. We intentionally swallow the error because the caller can still
      // use the returned value immediately.
    }
  }

  return fallbackOrgId;
}

