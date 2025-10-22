"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateQuote } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { customers, quotes } from "@repo/db/schema";
import { Trash2 } from "lucide-react";

type Customer = typeof customers.$inferSelect;
type Quote = typeof quotes.$inferSelect;

type LineItem = {
  id: number;
  description: string;
  quantity: number;
  price: number;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function EditQuoteForm({
  quote,
  customers,
  onFormAction,
}: {
  quote: Quote;
  customers: Customer[];
  onFormAction?: (state: { message: string }) => void;
}) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateQuote, initialState);
  const { toast } = useToast();

  const [lineItems, setLineItems] = useState<LineItem[]>(
    (quote.lineItems as any[] || []).map((item, index) => ({ ...item, id: Date.now() + index }))
  );
  const [total, setTotal] = useState(Number(quote.total) || 0);

  useEffect(() => {
    const newTotal = lineItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    setTotal(newTotal);
  }, [lineItems]);

  useEffect(() => {
    if (state.message === "success") {
      toast({
        title: "Success",
        description: "Quote updated successfully.",
      });
      onFormAction?.(state);
    } else if (state.message && state.message !== "" && !state.message.includes("Validation Error")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, onFormAction, toast]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now(), description: "", quantity: 1, price: 0 },
    ]);
  };

  const removeLineItem = (id: number) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="id" value={quote.id} />
      <input type="hidden" name="lineItems" value={JSON.stringify(lineItems.map(({id, ...rest}) => rest))} />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="customerId">Customer</Label>
          <Select name="customerId" required defaultValue={quote.customerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.customerId && <p className="text-sm text-red-500 mt-1">{state.errors.customerId.join(", ")}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" required defaultValue={quote.status}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.status && <p className="text-sm text-red-500 mt-1">{state.errors.status.join(", ")}</p>}
        </div>
      </div>

      <div>
        <Label>Line Items</Label>
        <div className="space-y-2 mt-2">
          {lineItems.map((item) => (
            <div key={item.id} className="flex items-end gap-2">
              <div className="grid gap-1 flex-grow">
                <Label htmlFor={`desc-${item.id}`} className="sr-only">Description</Label>
                <Input
                  id={`desc-${item.id}`}
                  placeholder="Service description"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(item.id, "description", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1 w-20">
                 <Label htmlFor={`qty-${item.id}`} className="sr-only">Quantity</Label>
                <Input
                  id={`qty-${item.id}`}
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(item.id, "quantity", parseFloat(e.target.value) || 0)}
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div className="grid gap-1 w-24">
                <Label htmlFor={`price-${item.id}`} className="sr-only">Price</Label>
                <Input
                  id={`price-${item.id}`}
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleLineItemChange(item.id, "price", parseFloat(e.target.value) || 0)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLineItem(item.id)}
                disabled={lineItems.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="mt-2">
          Add Item
        </Button>
        {state.errors?.lineItems && <p className="text-sm text-red-500 mt-1">{state.errors.lineItems.join(", ")}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="expiresAt">Expires At</Label>
        <Input id="expiresAt" name="expiresAt" type="date" defaultValue={quote.expiresAt ? new Date(quote.expiresAt).toISOString().split('T')[0] : ''} />
        {state.errors?.expiresAt && <p className="text-sm text-red-500 mt-1">{state.errors.expiresAt.join(", ")}</p>}
      </div>

      <div className="text-right font-semibold text-lg">
        Total: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
      </div>

      <SubmitButton />
    </form>
  );
}