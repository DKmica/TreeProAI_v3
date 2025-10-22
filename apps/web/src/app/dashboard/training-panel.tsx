"use client";

import { type ReactNode, useState, useTransition } from "react";
import {
  AlertTriangle,
  BookOpen,
  BriefcaseBusiness,
  ClipboardList,
  Database,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import type { TrainingResult, TrainingServiceStatus } from "./actions";
import { trainAiCore } from "./actions";

const initialState: TrainingResult = {
  ok: false,
  message: "No training run has been executed yet.",
};

const iconMap: Record<string, ReactNode> = {
  customers: <Users className="h-4 w-4" />,
  leads: <ClipboardList className="h-4 w-4" />,
  quotes: <Database className="h-4 w-4" />,
  jobs: <BriefcaseBusiness className="h-4 w-4" />,
  knowledge_base: <BookOpen className="h-4 w-4" />,
};

const getServiceIcon = (service: TrainingServiceStatus) => {
  return iconMap[service.key] ?? <Database className="h-4 w-4" />;
};

export function TrainingPanel() {
  const [state, setState] = useState<TrainingResult>(initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleTrainClick = () => {
    startTransition(async () => {
      const result = await trainAiCore();
      setState(result);
      toast({
        title: result.ok ? "AI training dataset ready" : "Unable to prepare dataset",
        description: result.message,
        variant: result.ok ? "default" : "destructive",
      });
    });
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Central AI Core Training</CardTitle>
          <CardDescription>
            Generate a consolidated dataset that powers TreeProAI insights across leads, customers, quotes, and jobs.
          </CardDescription>
        </div>
        <Button onClick={handleTrainClick} disabled={isPending} aria-busy={isPending}>
          {isPending ? "Preparing dataset..." : "Train AI Core"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant={state.ok ? "default" : "secondary"}>
              {state.summary?.totalExamples ?? 0} total training records
            </Badge>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>Customers: {state.summary?.segments.customers ?? 0}</span>
              <span>Leads: {state.summary?.segments.leads ?? 0}</span>
              <span>Quotes: {state.summary?.segments.quotes ?? 0}</span>
              <span>Jobs: {state.summary?.segments.jobs ?? 0}</span>
              <span>Knowledge: {state.summary?.segments.knowledgeBase ?? 0}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
        </div>

        {state.services && state.services.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              AI service readiness
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {state.services.map((service) => (
                <div
                  key={service.key}
                  className="flex items-start gap-3 rounded-lg border bg-background/80 p-4 shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      service.ready ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {service.ready ? getServiceIcon(service) : <AlertTriangle className="h-4 w-4" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium leading-none">{service.label}</p>
                      <Badge variant={service.ready ? "default" : "outline"}>
                        {service.records} records
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Recent dataset samples</h3>
          {state.sample && state.sample.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[200px]">Identifier</TableHead>
                  <TableHead>Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.sample.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium capitalize">
                      {entry.type.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{entry.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.content}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              {state.ok
                ? "The dataset is empty. Add customers, leads, quotes, and jobs to feed the AI core."
                : state.message}
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Each training run prepares normalized records that can be sent to your vector store or fine-tuning pipeline.
          The dataset never leaves your infrastructure; TreeProAI simply assembles the information you already manage.
        </p>
      </CardContent>
    </Card>
  );
}

