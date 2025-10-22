"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Button } from "@repo/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useTransition } from "react";
import { deleteJob } from "./actions";
import { useToast } from "@/components/ui/use-toast";

type Job = typeof import('@treeproai/db').schema.jobs.$inferSelect;

export function JobActions({ job }: { job: Job }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job?")) {
      startTransition(async () => {
        const result = await deleteJob(job.id);
        if (result?.message) {
          toast({
            title: "Job Deletion",
            description: result.message,
          });
        }
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={handleDelete}
          disabled={isPending}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}