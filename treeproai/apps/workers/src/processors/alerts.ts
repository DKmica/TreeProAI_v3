import { Job } from "bullmq";

export default async function (job: Job) {
  console.log(`Processing alert job ${job.id} with data:`, job.data);
  // TODO: on NWS alert, fetch affected jobs, rescore/reschedule
}