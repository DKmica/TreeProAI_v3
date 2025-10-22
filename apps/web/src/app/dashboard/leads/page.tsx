import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db } from "@repo/db";
import { leads as leadsSchema } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LeadsPage() {
  const cookieStore = cookies();
  const activeOrgId = cookieStore.get("active-org-id")?.value;

  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const leads = await db
    .select()
    .from(leadsSchema)
    .where(eq(leadsSchema.orgId, activeOrgId))
    .orderBy(leadsSchema.createdAt);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leads</CardTitle>
            <CardDescription>
              Manage your potential customers and track their progress.
            </CardDescription>
          </div>
          {/* Add Lead Button will go here */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.status}</Badge>
                  </TableCell>
                  <TableCell>{lead.source || "-"}</TableCell>
                  <TableCell>{lead.email || "-"}</TableCell>
                  <TableCell>{lead.phone || "-"}</TableCell>
                  <TableCell>
                    {/* Actions dropdown will go here */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No leads found. Get started by adding a new lead.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}