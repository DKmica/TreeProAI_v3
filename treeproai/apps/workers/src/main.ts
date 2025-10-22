import { Worker } from "bullmq";
import "dotenv/config";

import quoteProcessor from "./processors/quote";
import scheduleProcessor from "./processors/schedule";
import alertProcessor from "./processors/alerts";

const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : "localhost",
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port, 10) : 6379,
};

console.log("Starting workers...");

export const quoteWorker = new Worker("quote", quoteProcessor, { connection });
export const scheduleWorker = new Worker("schedule", scheduleProcessor, { connection });
export const alertWorker = new Worker("alerts", alertProcessor, { connection });

console.log("Workers started.");

// Graceful shutdown
const shutdown = async () => {
  console.log("Closing workers...");
  await Promise.all([
    quoteWorker.close(),
    scheduleWorker.close(),
    alertWorker.close(),
  ]);
  console.log("Workers closed.");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);