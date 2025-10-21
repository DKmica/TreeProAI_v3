"use client";

import { useApiClient } from "@/hooks/useApiClient";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function JobsPage() {
  const { get } = useApiClient();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await get("/jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    
    fetchJobs();
  }, [get]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Scheduled</th>
              <th className="text-left p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b hover:bg-muted/50">
                <td className="p-4">#{job.id.slice(0, 8)}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-muted rounded-full text-xs">
                    {job.status}
                  </span>
                </td>
                <td className="p-4">
                  {job.scheduledDate 
                    ? new Date(job.scheduledDate).toLocaleDateString()
                    : "Not scheduled"}
                </td>
                <td className="p-4">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}