"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader, UploadedFile } from "./file-uploader";
import useApiClient from "@/hooks/useApiClient";

const formSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  notes: z.string().optional(),
  files: z.array(z.object({ key: z.string(), url: z.string() })).min(1, "At least one photo is required"),
});

export function QuoteRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiClient = useApiClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
      files: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    toast.loading("Submitting quote request...");

    try {
      // 1. Create the Quote Request
      const qrResponse = await apiClient.post("/quote-requests", {
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zip: values.zip,
        },
        imageKeys: values.files.map((f) => f.key),
        notes: values.notes,
      });
      const quoteRequestId = qrResponse.data.id;
      toast.success("Quote request created.");

      // 2. Trigger the analysis
      toast.loading("Starting AI analysis...");
      const analysisResponse = await apiClient.post(`/quote-requests/${quoteRequestId}/analyze`);
      const taskId = analysisResponse.data.taskId;
      toast.success("Analysis started.");

      // 3. Redirect to the task polling page
      router.push(`/tasks/${taskId}`);
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  const handleFilesChange = (uploadedFiles: UploadedFile[]) => {
    form.setValue(
      "files",
      uploadedFiles.map((f) => ({ key: f.key, url: f.url })),
      { shouldValidate: true }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Job Site Address</h3>
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Anytown" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tree Photos</h3>
          <FormField
            control={form.control}
            name="files"
            render={() => (
              <FormItem>
                <FormControl>
                  <FileUploader onFilesChange={handleFilesChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Notes</h3>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="e.g., Watch out for the dog, power lines nearby..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Analyze & Get Quote"}
        </Button>
      </form>
    </Form>
  );
}