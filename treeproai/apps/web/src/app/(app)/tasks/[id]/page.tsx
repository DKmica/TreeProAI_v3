"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useApiClient from "@/hooks/useApiClient";
import { Bot, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function TaskPollingPage() {
  const params = useParams();
  const taskId = params.id as string;
  const apiClient = useApiClient();
  const router = useRouter();

  const { data: task, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await apiClient.get(`/tasks/${taskId}`);
      return response.data;
    },
    refetchInterval: (query) => {
      const taskData = query.state.data as any;
      return taskData?.isFinished ? false : 2000;
    },
    enabled: !!taskId,
  });

  useEffect(() => {
    if (task?.isFinished) {
      if (task.status === "completed" && task.result?.quoteId) {
        toast.success("Analysis complete!");
        router.push(`/quotes/${task.result.quoteId}`);
      } else {
        toast.error("Analysis failed.", { description: task.failedReason });
        router.push("/dashboard");
      }
    }
  }, [task, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <XCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-muted-foreground">Could not fetch task status.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Bot className="w-16 h-16 text-primary mb-4 animate-pulse" />
      <h1 className="text-2xl font-bold">Analyzing Your Trees...</h1>
      <p className="text-muted-foreground">
        Our AI is processing the images. This may take a moment.
      </p>
      <p className="text-sm text-muted-foreground mt-4">Task Status: {task?.status || "initializing"}</p>
    </div>
  );
}