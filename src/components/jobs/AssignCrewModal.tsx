import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

type Crew = {
  id: string;
  name: string;
};

const formSchema = z.object({
  crew_id: z.string().min(1, { message: "Please select a crew." }),
});

type AssignCrewModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  job: { id: string; customer_name: string; crew_id: string | null } | null;
  onSuccess: () => void;
};

const AssignCrewModal = ({
  isOpen,
  onOpenChange,
  job,
  onSuccess,
}: AssignCrewModalProps) => {
  const [crews, setCrews] = React.useState<Crew[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    const fetchCrews = async () => {
      const { data, error } = await supabase.from("crews").select("id, name");
      if (error) {
        showError("Could not fetch crews.");
      } else {
        setCrews(data);
      }
    };
    if (isOpen) {
      fetchCrews();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (job) {
      form.reset({ crew_id: job.crew_id || "" });
    }
  }, [job, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!job) return;
    setIsSubmitting(true);

    const { error } = await supabase
      .from("jobs")
      .update({ crew_id: values.crew_id === "not-assigned" ? null : values.crew_id })
      .eq("id", job.id);

    setIsSubmitting(false);

    if (error) {
      showError(error.message);
    } else {
      const selectedCrew = crews.find(c => c.id === values.crew_id);
      showSuccess(`Job for ${job.customer_name} assigned to ${selectedCrew?.name || 'Not Assigned'}.`);
      onSuccess();
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Crew</DialogTitle>
          <DialogDescription>
            Assign a crew to the job for {job.customer_name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="crew_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crew</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a crew" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="not-assigned">Not Assigned</SelectItem>
                      {crews.map((crew) => (
                        <SelectItem key={crew.id} value={crew.id}>
                          {crew.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Assigning..." : "Assign Crew"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCrewModal;