import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { getDb, schema, eq } from "@treeproai/db";
import { randomUUID } from "node:crypto";
import { HttpService } from "@nestjs/axios";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { firstValueFrom } from "rxjs";
import FormData from "form-data";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";

// Type definitions for AI service responses
interface VisionResult {
  trees: any[];
  confidence: number;
  notes: string[];
}

interface PricingResult {
  price: number;
  confidence: number;
}

@Injectable()
@Processor("analyzeImages")
export class AnalyzeImagesProcessor extends WorkerHost {
  private readonly s3: S3Client;

  constructor(private readonly httpService: HttpService) {
    super();
    this.s3 = new S3Client({
      region: "auto", // R2/Minio compatible
      endpoint: process.env.S3_ENDPOINT!,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
    });
  }

  async process(job: Job<{ quoteRequestId: string; companyId: string }>): Promise<{ quoteId: string }> {
    const { quoteRequestId, companyId } = job.data;
    const db = getDb();

    await db.update(schema.quoteRequests).set({ status: "PROCESSING" }).where(eq(schema.quoteRequests.id, quoteRequestId));

    try {
      // 1. Get attachments from DB
      const attachments = await db.query.attachments.findMany({
        where: eq(schema.attachments.quoteRequestId, quoteRequestId),
      });
      if (!attachments.length) throw new Error("No attachments found");

      // For now, we only process the first image
      const attachment = attachments[0];

      // 2. Fetch image from S3
      const getObjectCmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: attachment.s3Key });
      const s3Response = await this.s3.send(getObjectCmd);
      if (!s3Response.Body) throw new Error("S3 object has no body");
      const imageBuffer = await s3Response.Body.transformToByteArray();

      // 3. Call ai-vision:/analyze
      const visionForm = new FormData();
      visionForm.append('file', imageBuffer, {
        filename: attachment.s3Key.split('/').pop() || 'image.jpg',
        contentType: attachment.contentType || 'image/jpeg',
      });
      const visionResponse: AxiosResponse<VisionResult> = await firstValueFrom(
        this.httpService.post(`${process.env.AI_VISION_URL}/analyze`, visionForm, {
          headers: visionForm.getHeaders(),
        })
      );
      const visionResult = visionResponse.data;

      // 4. Call ai-pricing:/price
      const pricingPayload = { trees: visionResult.trees };
      const pricingResponse: AxiosResponse<PricingResult> = await firstValueFrom(
        this.httpService.post(`${process.env.AI_PRICING_URL}/price`, pricingPayload)
      );
      const pricingResult = pricingResponse.data;

      // 5. Persist results to quotes (DRAFT)
      const quoteId = randomUUID();
      const quoteRequest = await db.query.quoteRequests.findFirst({ where: eq(schema.quoteRequests.id, quoteRequestId) });
      await db.insert(schema.quotes).values({
        id: quoteId,
        companyId,
        leadId: quoteRequest?.leadId,
        status: "DRAFT",
        subtotal: pricingResult.price.toString(),
        total: pricingResult.price.toString(),
        confidence: pricingResult.confidence.toString(),
        aiFindings: visionResult,
      });

      await db.update(schema.quoteRequests).set({ status: "DONE" }).where(eq(schema.quoteRequests.id, quoteRequestId));
      return { quoteId };
    } catch (error) {
      await db.update(schema.quoteRequests).set({ status: "ERROR" }).where(eq(schema.quoteRequests.id, quoteRequestId));
      throw error; // Propagate error to fail the job
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error, prev: string) {
    console.error(`Job ${job?.id} failed with error: ${error.message} (previous state: ${prev})`);
  }
}