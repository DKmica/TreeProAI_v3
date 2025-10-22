"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { QuoteForm } from "./quote-form";
import type { customers } from "@repo/db/schema";

type Customer = typeof customers.$inferSelect;

export function AddQuoteDialog({ customers }: { customers: Customer[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Quote
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Quote</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new quote for a customer.
          </DialogDescription>
        </DialogHeader>
        <QuoteForm
          customers={customers}
          onFormAction={(state) => {
            if (state.message === "success") {
              setOpen(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}