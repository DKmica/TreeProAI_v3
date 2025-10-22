import { quoteQueue } from "../queues";

type AnalyzePayload = {
  propertyId: string;
  imageUrls: string[];
};

export async function enqueueQuoteAnalyze(p: AnalyzePayload) {
  await quoteQueue.add("analyze", p);
}