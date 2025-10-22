import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { getDb, schema, eq } from "@/db/index";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";

interface VisionResult {
  trees: any[];
  confidence: number;
  notes: string[];
}

interface PricingResult {
  price: number;
  line_items: any[];
  confidence: number;
}

@Injectable()
@Processor("analysis")
export class AnalysisProcessor extends WorkerHost {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  async process(job: Job<{ quoteRequestId: string; companyId: string }>): Promise<{ quoteId: string }> {
    const { quoteRequestId, companyId } = job.data;
    const db = getDb();

    try {
      const [qr] = await db.select().from(schema.quoteRequests).where(eq(schema.quoteRequests.id, quoteRequestId));
      if (!qr) throw new Error("Quote request not found");

      await job.updateProgress(10);

      // 1. Call ai-vision:/analyze
      const visionResponse: AxiosResponse<VisionResult> = await firstValueFrom(
        this.httpService.post(process.env.AI_VISION_URL + '/analyze', { image_keys: qr.imageKeys })
      );
      const visionResult = visionResponse.data;
      await job.updateProgress(50);

      // 2. Call ai-pricing:/price
      const pricingResponse: AxiosResponse<PricingResult> = await firstValueFrom(
        this.httpService.post(process.env.AI_PRICING_URL + '/price', { vision_json: visionResult })
      );
      const pricingResult = pricingResponse.data;
      await job.updateProgress(80);

      // 3. Persist results to quotes and quote_items
      const [quote] = await db.insert(schema.quotes).values({
        companyId,
        quoteRequestId,
        status: "DRAFT",
        subtotal: pricingResult.price.toString(),
        total: pricingResult.price.toString(),
      }).returning();

      if (pricingResult.line_items) {
        const itemsToInsert = pricingResult.line_items.map(item => ({
            quoteId: quote.id,
            kind: 'SERVICE',
            description: item.description,
            qty: item.qty.toString(),
            unitPrice: item.unit_price.toString(),
        }));
        await db.insert(schema.quoteItems).values(itemsToInsert);
      }
      
      await job.updateProgress(100);
      return { quoteId: quote.id };

    } catch (error) {
      console.error(`Job ${job.id} failed`, error);
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error) {
    console.error(`Job ${job?.id} failed with error: ${error.message}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    console.log(`Job ${job.id} completed with result:`, result);
  }
}