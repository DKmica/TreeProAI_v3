import { Queue } from "bullmq";
import "dotenv/config";

const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : "localhost",
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port, 10) : 6379,
};

export const analysisQueue = new Queue("analysis", { connection });
export const notificationsQueue = new Queue("notifications", { connection });