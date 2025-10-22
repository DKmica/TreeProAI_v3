"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApiClient from "@/hooks/useApiClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";

interface ScheduleJobModalProps {
  jobId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface Suggestion {
  scheduledAt: string;
  travelDuration: { text: string; value: number };
}

export function ScheduleJobModal({ jobId, isOpen, onOpenChange }: ScheduleJobModalProps) {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: suggestions, isLoading: isLoadingSuggestions, refetch } = useQuery<Suggestion[]>({
    queryKey: ["scheduleSuggestions", jobId],
    queryFn: async () => {
      const response = await apiClient.post(`/jobs/${jobId}/schedule/suggest`);
      return response.data;
    },
    enabled: false, // Only fetch when the button is clicked
  });

  const scheduleMutation = useMutation({
    mutationFn: (scheduledAt: string) => apiClient.post(`/jobs/${jobId}/schedule`, { scheduledAt }),
    onSuccess: () => {
      toast.success("Job scheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      onOpenChange(false);
    },
    onError: () => toast.error("Failed to schedule job."),
  });

  const handleSuggest = () => {
    toast.loading("Getting schedule suggestions...");
    refetch().then(() => toast.dismiss());
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      scheduleMutation.mutate(selectedSlot);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Job</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {!suggestions && !isLoadingSuggestions && (
            <Button onClick={handleSuggest}>Suggest Schedule</Button>
          )}
          {isLoadingSuggestions && <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>}
          {suggestions && (
            <RadioGroup onValueChange={setSelectedSlot}>
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <Label key={s.scheduledAt} htmlFor={s.scheduledAt} className="flex items-center gap-4 p-3 border rounded-md has-[:checked]:border-primary">
                    <RadioGroupItem value={s.scheduledAt} id={s.scheduledAt} />
                    <div>
                      <p>{new Date(s.scheduledAt).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Est. travel: {s.travelDuration.text}</p>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedSlot || scheduleMutation.isPending}>
            {scheduleMutation.isPending ? "Scheduling..." : "Confirm Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}