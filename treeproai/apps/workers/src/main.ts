import "dotenv/config";
import { quoteWorker, scheduleWorker, alertWorker } from "./queues";

function setupWorkerListeners(workerName: string, worker: any) {
  worker.on("completed", (job: any, result: any) => {
    console.log(`${workerName} job ${job.id} completed with result:`, result);
  });

  worker.on("failed", (job: any, err: Error) => {
    console.error(`${workerName} job ${job.id} failed with error:`, err.message);
  });
}

console.log("🚀 Starting workers...");

setupWorkerListeners("Quote", quoteWorker);
setupWorkerListeners("Schedule", scheduleWorker);
setupWorkerListeners("Alert", alertWorker);

console.log("✅ Workers are running and waiting for jobs.");