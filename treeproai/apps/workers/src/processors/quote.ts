import { Job } from "bullmq";

export default async function (job: Job) {
  switch (job.name) {
    case "analyze":
      console.log(`Processing quote analysis job ${job.id} with data:`, job.data);
      // TODO: call ai-gateway -> services (vision, tabular) -> compose quote
      // TODO: persist to quotes table and emit Event
      // For now, returning a placeholder
      return { quoteId: "new-quote-id", hazards: [], priceMin: 100, priceMax: 200 };
    default:
      console.warn(`Unknown job name in quote queue: ${job.name}`);
      throw new Error(`Unknown job name in quote queue: ${job.name}`);
  }
}