"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApiClient from "@/hooks/useApiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  // This is a mock query. In a real app, you'd fetch from /jobs/:id
  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => ({ id: jobId, status: "PENDING" }),
    enabled: !!jobId,
  });

  const createInvoiceMutation = useMutation({
    mutationFn: () => apiClient.post("/invoices", { jobId }),
    onSuccess: () => {
      toast.success("Invoice created successfully!");
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
    onError: () => toast.error("Failed to create invoice."),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-6">
      <h1 className="text-3xl font-bold">Job #{job.id.substring(0, 8)}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Status: {job.status}</p>
          <Button className="mt-4" onClick={() => createInvoiceMutation.mutate()}>
            Create Invoice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}