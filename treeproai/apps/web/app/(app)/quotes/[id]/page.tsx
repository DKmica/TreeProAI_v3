"use client";

import { useApiClient } from "../../../hooks/useApiClient";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Home,
  TreePine,
  Trash2,
  Send,
  FileText,
  CreditCard,
} from "lucide-react";

export default function QuoteBuilderPage({ params }: { params: { id: string } }) {
  const { get, post } = useApiClient();
  const [quote, setQuote] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await get(`/quotes/${params.id}`);
        setQuote(res);
        setItems(res.items || []);
      } catch (error) {
        console.error("Failed to fetch quote:", error);
      }
    };
    
    fetchQuote();
  }, [get, params.id]);

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        subtotal: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = (item: any) => {
    return (item.quantity * item.unitPrice).toFixed(2);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2);
  };

  const sendQuote = async () => {
    setIsSending(true);
    try {
      await post(`/quotes/${params.id}/send`);
      // Refresh quote data to show updated status
      const res = await get(`/quotes/${params.id}`);
      setQuote(res);
    } catch (error) {
      console.error("Failed to send quote:", error);
    } finally {
      setIsSending(false);
    }
  };

  const acceptQuote = async () => {
    setIsAccepting(true);
    try {
      await post(`/quotes/${params.id}/accept`);
      // Refresh quote data to show updated status
      const res = await get(`/quotes/${params.id}`);
      setQuote(res);
    } catch (error) {
      console.error("Failed to accept quote:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  if (!quote) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quote Builder</h1>
        <div className="flex gap-2">
          <Button variant="outline" disabled={quote.status !== "DRAFT"}>
            <FileText className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={quote.status !== "DRAFT"}>
                <Send className="mr-2 h-4 w-4" />
                Send Quote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Quote</DialogTitle>
                <DialogDescription>
                  This will send the quote to the customer via email.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Customer Email</Label>
                  <Input id="email" defaultValue={quote.customer?.email || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    defaultValue="Please find your quote attached." 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button onClick={sendQuote} disabled={isSending}>
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="default" 
                disabled={quote.status !== "SENT"}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Accept Quote
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Accept Quote</AlertDialogTitle>
                <AlertDialogDescription>
                  This will create a job from this quote and mark it as accepted.
                  Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={acceptQuote} disabled={isAccepting}>
                  {isAccepting ? "Accepting..." : "Accept"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Quote #{quote.id.slice(0, 8)}</CardTitle>
              <CardDescription>
                Status: <Badge>{quote.status}</Badge>
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">Total: ${calculateTotal()}</div>
              {quote.confidence && (
                <div className="text-sm text-muted-foreground">
                  Confidence: {quote.confidence}%
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>{quote.customer?.address || "Customer address not available"}</span>
            </div>
            
            {quote.aiFindings && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">AI Findings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <TreePine className="h-4 w-4 text-green-500" />
                    <span>{quote.aiFindings.treeCount} trees detected</span>
                  </div>
                  <div>
                    <span className="font-medium">Species:</span> {quote.aiFindings.species}
                  </div>
                  <div>
                    <span className="font-medium">Risk Level:</span> {quote.aiFindings.riskLevel}
                  </div>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      ${calculateSubtotal(item)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center">
              <Button onClick={addItem} variant="outline">
                Add Item
              </Button>
              <div className="text-right">
                <div className="text-lg font-bold">Total: ${calculateTotal()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}