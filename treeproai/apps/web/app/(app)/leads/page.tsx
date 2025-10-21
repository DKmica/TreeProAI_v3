"use client";

import { useApiClient } from "@/hooks/useApiClient";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function LeadsPage() {
  const { get } = useApiClient();
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await get("/leads");
        setLeads(res.data);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      }
    };
    
    fetchLeads();
  }, [get]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Lead
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Source</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-muted/50">
                <td className="p-4">Lead #{lead.id.slice(0, 8)}</td>
                <td className="p-4">{lead.source}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-muted rounded-full text-xs">
                    {lead.status}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}