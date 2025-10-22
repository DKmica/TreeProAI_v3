"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useApiClient from "@/hooks/useApiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScheduleJobModal } from "@/components/schedule-job-modal";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;
  const apiClient = useApiClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const response = await apiClient.get(`/jobs/${jobId}`);
      return response.data;
    },
    enabled: !!jobId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Job #{job.id.substring(0, 8)}</h1>
        <Badge>{job.status}</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          {job.status === "PENDING" && (
            <Button onClick={() => setIsModalOpen(true)}>Schedule Job</Button>
          )}
          {job.status === "SCHEDULED" && (
            <p>Scheduled for: {new Date(job.scheduledAt).toLocaleString()}</p>
          )}
          {job.status !== "PENDING" && job.status !== "SCHEDULED" && (
             <Button className="mt-4" disabled>Create Invoice (Not Implemented)</Button>
          )}
        </CardContent>
      </Card>
      <ScheduleJobModal
        jobId={jobId}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}