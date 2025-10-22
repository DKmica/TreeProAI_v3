"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateCustomer } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { customers } from "@repo/db/schema";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

type Customer = typeof customers.$inferSelect;

export function EditCustomerForm({ customer, onFormAction }: { customer: Customer; onFormAction?: (state: { message: string }) => void }) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateCustomer, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      toast({
        title: "Success",
        description: "Customer updated successfully.",
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

  return (
    <form action={dispatch} className="grid gap-4 py-4">
      <input type="hidden" name="id" value={customer.id} />
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={customer.name} required />
        {state.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={customer.email ?? ""} />
        {state.errors?.email && <p className="text-sm text-red-500 mt-1">{state.errors.email.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={customer.phone ?? ""} />
         {state.errors?.phone && <p className="text-sm text-red-500 mt-1">{state.errors.phone.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" defaultValue={customer.address ?? ""} />
        {state.errors?.address && <p className="text-sm text-red-500 mt-1">{state.errors.address.join(", ")}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}