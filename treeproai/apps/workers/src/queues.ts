import { Queue, QueueEvents, JobsOptions } from "bullmq";
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

new QueueEvents("quote", { connection });
new QueueEvents("schedule", { connection });
new QueueEvents("alerts", { connection });