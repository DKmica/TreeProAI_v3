"use client";

import { useApiClient } from "../../../hooks/useApiClient";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Send } from "lucide-react";

export default function InvoicesPage() {
  const { get, post } = useApiClient();
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await get("/invoices");
        setInvoices(res.data);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    };
    
    fetchInvoices();
  }, [get]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Quote ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">#{invoice.id.slice(0, 8)}</TableCell>
                <TableCell>#{invoice.quoteId?.slice(0, 8) || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === "PAID" ? "default" : "secondary"}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>${invoice.total}</TableCell>
                <TableCell>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {invoice.status === "PENDING" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Send className="mr-2 h-4 w-4" />
                          Send Pay Link
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Payment Link</DialogTitle>
                          <DialogDescription>
                            Send this payment link to your customer via email or text.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="pay-link">Payment Link</Label>
                            <Input 
                              id="pay-link" 
                              defaultValue={invoice.stripePayLinkUrl || ""} 
                              readOnly
                            />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            This link will take the customer to a secure Stripe payment page.
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={() => navigator.clipboard.writeText(invoice.stripePayLinkUrl || "")}
                          >
                            Copy Link
                          </Button>
                          <Button>
                            Send via Email
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  {invoice.status === "PAID" && (
                    <Button size="sm" variant="outline" disabled>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}