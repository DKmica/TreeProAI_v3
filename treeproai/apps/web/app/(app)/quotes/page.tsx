"use client";

import { useApiClient } from "@/hooks/useApiClient";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function QuotesPage() {
  const { get } = useApiClient();
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await get("/quotes");
        setQuotes(res.data);
      } catch (error) {
        console.error("Failed to fetch quotes:", error);
      }
    };
    
    fetchQuotes();
  }, [get]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id} className="border-b hover:bg-muted/50">
                <td className="p-4">#{quote.id.slice(0, 8)}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-muted rounded-full text-xs">
                    {quote.status}
                  </span>
                </td>
                <td className="p-4">${quote.total}</td>
                <td className="p-4">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}