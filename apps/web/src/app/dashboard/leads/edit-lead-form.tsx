"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateLead } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

type Lead = typeof import('@treeproai/db').schema.leads.$inferSelect;

export function EditLeadForm({ lead, onFormAction }: { lead: Lead; onFormAction?: (state: { message: string }) => void }) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateLead, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === "success") {
      toast({
        title: "Success",
        description: "Lead updated successfully.",
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
      <input type="hidden" name="id" value={lead.id} />
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={lead.name} required />
        {state.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={lead.status}>
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
            <SelectItem value="Won">Won</SelectItem>
          </SelectContent>
        </Select>
        {state.errors?.status && <p className="text-sm text-red-500 mt-1">{state.errors.status.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={lead.email ?? ""} />
        {state.errors?.email && <p className="text-sm text-red-500 mt-1">{state.errors.email.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={lead.phone ?? ""} />
         {state.errors?.phone && <p className="text-sm text-red-500 mt-1">{state.errors.phone.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="source">Source</Label>
        <Input id="source" name="source" defaultValue={lead.source ?? ""} />
        {state.errors?.source && <p className="text-sm text-red-500 mt-1">{state.errors.source.join(", ")}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}