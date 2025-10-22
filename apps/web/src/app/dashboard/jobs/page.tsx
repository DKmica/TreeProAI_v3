import { createClient } from "@/lib/supabase/server";
import { getActiveOrg } from "@/lib/get-active-org";
import { db, schema } from "@treeproai/db";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobActions } from "./job-actions";

type Job = typeof schema.jobs.$inferSelect & {
  customer: typeof schema.customers.$inferSelect | null;
};

export default async function JobsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const activeOrgId = await getActiveOrg();
  if (!activeOrgId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">No active organization</h1>
        <p>Please select an organization to view jobs.</p>
      </div>
    );
  }

  const jobs: Job[] = await db.query.jobs.findMany({
    where: eq(schema.jobs.orgId, activeOrgId),
    with: {
      customer: true,
    },
    orderBy: [desc(schema.jobs.createdAt)],
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Jobs</h1>
        {/* Add Job button will be wired up next */}
        <Button disabled>Add Job</Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="font-medium">{job.customer?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {job.customer?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{job.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {job.scheduledDate
                      ? new Date(job.scheduledDate).toLocaleDateString()
                      : "Not scheduled"}
                  </TableCell>
                  <TableCell>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <JobActions job={job} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}