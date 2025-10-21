"use client";

import { useApiClient } from "../../hooks/useApiClient";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function CustomersPage() {
  const { get } = useApiClient();
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await get("/customers");
        setCustomers(res.data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    
    fetchCustomers();
  }, [get]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Customer
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email || "N/A"}</TableCell>
                <TableCell>{customer.phone || "N/A"}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-muted rounded-full text-xs">
                    {customer.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}