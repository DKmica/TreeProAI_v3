import { Queue, Worker, QueueEvents, JobsOptions } from "bullmq";
import "dotenv/config";

const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : "localhost",
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port, 10) : 6379,
};

const defaults: JobsOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 5000 },
  removeOnComplete: true,
  removeOnFail: 500,
};

export const quoteQueue = new Queue("quote", { connection, defaultJobOptions: defaults });
export const scheduleQueue = new Queue("schedule", { connection, defaultJobOptions: defaults });
export const alertQueue = new Queue("alerts", { connection, defaultJobOptions: defaults });

// Quote worker
export const quoteWorker = new Worker(
  "quote",
  async job => {
    console.log(`Processing quote job ${job.id} with data:`, job.data);
    // TODO: call ai-gateway -> services (vision, tabular) -> compose quote
    // TODO: persist to quotes table and emit Event
    // For now, returning a placeholder
    return { quoteId: "new-quote-id", hazards: [], priceMin: 100, priceMax: 200 };
  },
  { connection }
);

// Schedule worker
export const scheduleWorker = new Worker(
  "schedule",
  async job => {
    console.log(`Processing schedule job ${job.id} with data:`, job.data);
    // TODO: call routing service (OR-Tools) with jobs/crews/constraints
    // For now, returning a placeholder
    return { plan: "new-route-plan" };
  },
  { connection }
);

// Alert worker (NWS)
export const alertWorker = new Worker(
  "alerts",
  async job => {
    console.log(`Processing alert job ${job.id} with data:`, job.data);
    // TODO: on NWS alert, fetch affected jobs, rescore/reschedule
  },
  { connection }
);

new QueueEvents("quote", { connection });
new QueueEvents("schedule", { connection });
new QueueEvents("alerts", { connection });