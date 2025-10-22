"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addCustomer } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : "Save Customer"}
    </Button>
  );
}

export function CustomerForm({ onFormAction }: { onFormAction?: (state: { message: string }) => void }) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(addCustomer, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      toast({
        title: "Success",
        description: "Customer added successfully.",
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
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="John Doe" required />
        {state.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" />
        {state.errors?.email && <p className="text-sm text-red-500 mt-1">{state.errors.email.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" placeholder="(123) 456-7890" />
         {state.errors?.phone && <p className="text-sm text-red-500 mt-1">{state.errors.phone.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" placeholder="123 Main St, Anytown, USA" />
        {state.errors?.address && <p className="text-sm text-red-500 mt-1">{state.errors.address.join(", ")}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}