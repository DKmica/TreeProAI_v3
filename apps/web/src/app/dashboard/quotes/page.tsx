"use client";

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
import { quotes as quotesSchema } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function QuotesPage() {
  const cookieStore = cookies();
  const activeOrgId = cookieStore.get("active-org-id")?.value;

  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const quotes = await db.query.quotes.findMany({
    where: eq(quotesSchema.orgId, activeOrgId),
    with: {
      customer: true,
    },
    orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quotes</CardTitle>
            <CardDescription>
              Create and manage quotes for your customers.
            </CardDescription>
          </div>
          {/* Add Quote Button will go here */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length > 0 ? (
              quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.customer.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{quote.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(Number(quote.total) || 0)}
                  </TableCell>
                  <TableCell>
                    {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {/* Actions dropdown will go here */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No quotes found. Get started by creating a new quote.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}