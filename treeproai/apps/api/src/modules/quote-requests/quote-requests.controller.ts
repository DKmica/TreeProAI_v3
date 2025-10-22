import { Controller, Post, Get, Param, Req, UseGuards, Body, NotFoundException } from "@nestjs/common";
import { z } from "zod";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RbacGuard } from "../../common/guards/rbac.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { getDb, schema, eq } from "@treeproai/db";
import { randomUUID } from "node:crypto";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

const CreateQuoteRequestSchema = z.object({
  leadId: z.string().uuid().optional(),
  attachmentIds: z.array(z.string().uuid()).min(1)
});

@Controller("quote-requests")
@UseGuards(AuthGuard, RbacGuard)
export class QuoteRequestsController {
  constructor(@InjectQueue("analyzeImages") private readonly analyzeImagesQueue: Queue) {}

  @Post()
  @Roles("OWNER", "MANAGER", "SALES")
  async create(@Body() body: unknown, @Req() req: any) {
    const input = CreateQuoteRequestSchema.parse(body);
    const db = getDb();
    const id = randomUUID();

    await db.insert(schema.quoteRequests).values({
      id,
      companyId: req.companyId,
      leadId: input.leadId,
      status: "RECEIVED"
    });

    // Link attachments to this quote request
    await db.update(schema.attachments)
      .set({ quoteRequestId: id })
      .where(schema.attachments.id.inArray(input.attachmentIds));

    return { id };
  }

  @Post(":id/analyze")
  @Roles("OWNER", "MANAGER", "SALES")
  async analyze(@Param("id") id: string, @Req() req: any) {
    const db = getDb();
    const quoteRequest = await db.query.quoteRequests.findFirst({
      where: (qr, { and, eq }) => and(
        eq(qr.id, id),
        eq(qr.companyId, req.companyId)
      )
    });

    if (!quoteRequest) {
      throw new NotFoundException("Quote request not found");
    }

    const job = await this.analyzeImagesQueue.add("analyze", {
      quoteRequestId: id,
      companyId: req.companyId
    });

    return { taskId: job.id };
  }
}