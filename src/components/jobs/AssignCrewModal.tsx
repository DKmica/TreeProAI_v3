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
import { showSuccess } from "@/utils/toast";

const mockCrews = ["Crew A", "Crew B", "Crew C", "Not Assigned"];

const formSchema = z.object({
  crew: z.string().min(1, { message: "Please select a crew." }),
});

type AssignCrewModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  job: { id: string; customerName: string; crew: string } | null;
  onSuccess: () => void;
};

const AssignCrewModal = ({
  isOpen,
  onOpenChange,
  job,
  onSuccess,
}: AssignCrewModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (job) {
      form.reset({ crew: job.crew === "Not Assigned" ? "" : job.crew });
    }
  }, [job, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(`Assigning crew for job ${job?.id}:`, values);
    showSuccess(`Crew ${values.crew} assigned to job for ${job?.customerName}.`);
    onSuccess();
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Crew</DialogTitle>
          <DialogDescription>
            Assign a crew to the job for {job.customerName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="crew"
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
                      {mockCrews.map((crewName) => (
                        <SelectItem key={crewName} value={crewName}>
                          {crewName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Assign Crew</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCrewModal;