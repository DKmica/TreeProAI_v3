"use client";

import { useApiClient } from "@/hooks/useApiClient";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { get } = useApiClient();
  const [leads, setLeads] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsRes = await get("/leads");
        setLeads(leadsRes.data);
        
        const quotesRes = await get("/quotes");
        setQuotes(quotesRes.data);
        
        const jobsRes = await get("/jobs");
        setJobs(jobsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    
    fetchData();
  }, [get]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Leads</h2>
          <p className="text-3xl font-bold">{leads.length}</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Quotes</h2>
          <p className="text-3xl font-bold">{quotes.length}</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">Jobs</h2>
          <p className="text-3xl font-bold">{jobs.length}</p>
        </div>
      </div>
    </div>
  );
}