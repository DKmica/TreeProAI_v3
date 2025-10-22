"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditLeadForm } from "./edit-lead-form";
import type { leads } from "@repo/db/schema";

type Lead = typeof import('@treeproai/db').schema.leads.$inferSelect;

export function EditLeadDialog({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update the details for {lead.name}.
          </DialogDescription>
        </DialogHeader>
        <EditLeadForm
          lead={lead}
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