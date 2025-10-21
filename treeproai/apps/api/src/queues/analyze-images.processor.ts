import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { getDb, schema } from "@treeproai/db";
import { randomUUID } from "node:crypto";

@Processor("analyzeImages")
export class AnalyzeImagesProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    const { quoteRequestId, companyId } = job.data;
    const db = getDb();

    // 1) Validate images exist in S3
    // In a full implementation, we would check S3 here
    // For now, we'll assume the images exist

    // 2) Call ai-vision:/analyze
    // In a full implementation, we would call the AI service here
    // For now, we'll use mock data
    const mockVisionResult = {
      trees: [
        {
          id: "tree_1",
          label: "Oak",
          confidence: 0.85,
          bbox: [100, 100, 300, 500],
          heightEstimateM: 12.5,
          dbhEstimateCm: 45
        },
        {
          id: "tree_2",
          label: "Maple",
          confidence: 0.72,
          bbox: [400, 150, 600, 450],
          heightEstimateM: 9.2,
          dbhEstimateCm: 32
        }
      ],
      confidence: 0.78,
      notes: ["Heuristic mode: using reference object scaling", "EXIF focal length: 24mm"]
    };

    // 3) Call ai-pricing:/price (with region rates)
    // In a full implementation, we would call the AI service here
    // For now, we'll use mock data
    const mockPricingResult = {
      baseLabor: 375.0,
      equipmentCost: 0.0,
      disposalCost: 3.5,
      priceBeforeOH: 378.5,
      price: 567.75,
      priceRange: [482.59, 652.91],
      confidence: 0.82,
      notes: ["Heuristic pricing: deterministic formula", "Estimated 3.0 hours for 2 trees"]
    };

    // 4) Persist results to quotes (DRAFT)
    const quoteId = randomUUID();
    await db.insert(schema.quotes).values({
      id: quoteId,
      companyId,
      leadId: null, // Would be linked in a full implementation
      status: "DRAFT",
      currency: "USD",
      subtotal: mockPricingResult.price.toString(),
      total: mockPricingResult.price.toString(),
      confidence: mockPricingResult.confidence.toString(),
      aiFindings: mockVisionResult
    });

    return { quoteId };
  }
}