"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditCustomerForm } from "./edit-customer-form";
import type { customers } from "@treeproai/db/schema";

type Customer = typeof customers.$inferSelect;

export function EditCustomerDialog({
  customer,
  open,
  onOpenChange,
}: {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update the details for {customer.name}.
          </DialogDescription>
        </DialogHeader>
        <EditCustomerForm
          customer={customer}
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