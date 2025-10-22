import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { db } from "@repo/db";
import { orgs, orgUsers } from "@repo/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const cookieStore = cookies();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userOrgsResult = await db
    .select({
      id: orgs.id,
      name: orgs.name,
    })
    .from(orgUsers)
    .where(eq(orgUsers.userId, user.id))
    .leftJoin(orgs, eq(orgUsers.orgId, orgs.id));

  // Filter out any potential nulls from the join and ensure we have valid orgs
  const validUserOrgs = userOrgsResult
    .filter((o) => o.id && o.name)
    .map((o) => ({ id: o.id!, name: o.name! }));

  if (validUserOrgs.length === 0) {
    // TODO: Redirect to a dedicated /create-organization page
    // For now, redirecting to login is a safe fallback.
    redirect("/login");
  }

  const activeOrgIdFromCookie = cookieStore.get("active-org-id")?.value;
  let activeOrg = validUserOrgs.find((org) => org.id === activeOrgIdFromCookie);

  // If no active org is in the cookie, or the cookie points to an org the user
  // no longer has access to, we must set a valid one.
  if (!activeOrg) {
    // Default to the user's first organization
    activeOrg = validUserOrgs[0];
    
    // This server-side cookie set requires a redirect to apply.
    // The new cookie will be available on the next request.
    cookieStore.set("active-org-id", activeOrg.id, {
      httpOnly: true,
      path: "/",
    });
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header user={user} userOrgs={validUserOrgs} activeOrg={activeOrg} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}