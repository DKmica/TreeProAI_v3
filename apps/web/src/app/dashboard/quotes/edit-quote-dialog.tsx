"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditQuoteForm } from "./edit-quote-form";
import type { customers, quotes } from "@repo/db/schema";

type Customer = typeof customers.$inferSelect;
type Quote = typeof quotes.$inferSelect;

export function EditQuoteDialog({
  quote,
  customers,
  open,
  onOpenChange,
}: {
  quote: Quote;
  customers: Customer[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
          <DialogDescription>
            Update the details for this quote.
          </DialogDescription>
        </DialogHeader>
        <EditQuoteForm
          quote={quote}
          customers={customers}
          onFormAction={(state) => {
            if (state.message === "success") {
              onOpenChange(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}