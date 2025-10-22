import { Job } from "bullmq";

export default async function (job: Job) {
  console.log(`Processing schedule job ${job.id} with data:`, job.data);
  // TODO: call routing service (OR-Tools) with jobs/crews/constraints
  // For now, returning a placeholder
  return { plan: "new-route-plan" };
}