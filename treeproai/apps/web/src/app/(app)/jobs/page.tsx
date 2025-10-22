"use client";

import { useQuery } from "@tanstack/react-query";
import useApiClient from "@/hooks/useApiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JobsPage() {
  const apiClient = useApiClient();
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await apiClient.get("/jobs");
      return response.data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>}
            {jobs?.map((job: any) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.id.substring(0, 8)}</TableCell>
                <TableCell><Badge>{job.status}</Badge></TableCell>
                <TableCell>{job.scheduledAt ? new Date(job.scheduledAt).toLocaleString() : 'Not Scheduled'}</TableCell>
                <TableCell>
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}