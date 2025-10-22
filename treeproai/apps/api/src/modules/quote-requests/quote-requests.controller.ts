import { Controller, Post, Param, Req, UseGuards, Body, NotFoundException } from "@nestjs/common";
import { z } from "zod";
import { getDb, schema, eq } from "@/db/index";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";

const CreateQuoteRequestSchema = z.object({
  customerId: z.string().uuid().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  imageKeys: z.array(z.string()).min(1),
  notes: z.string().optional(),
});

@ApiTags("Quote Requests")
@ApiBearerAuth()
@Controller({ path: "quote-requests", version: "1" })
@UseGuards(RolesGuard)
export class QuoteRequestsController {
  constructor(@InjectQueue("analysis") private readonly analysisQueue: Queue) {}

  @Post()
  @Roles("owner", "admin", "member")
  async create(@Body() body: unknown, @Req() req: any) {
    const input = CreateQuoteRequestSchema.parse(body);
    const db = getDb();

    const [address] = await db.insert(schema.addresses).values({
        companyId: req.companyId,
        kind: 'JOB_SITE',
        ...input.address
    }).returning();

    const [qr] = await db.insert(schema.quoteRequests).values({
      companyId: req.companyId,
      customerId: input.customerId,
      addressId: address.id,
      imageKeys: input.imageKeys,
      notes: input.notes,
    }).returning();

    return { id: qr.id };
  }

  @Post(":id/analyze")
  @Roles("owner", "admin", "member")
  async analyze(@Param("id") id: string, @Req() req: any) {
    const db = getDb();
    const [quoteRequest] = await db.select().from(schema.quoteRequests).where(eq(schema.quoteRequests.id, id) && eq(schema.quoteRequests.companyId, req.companyId));

    if (!quoteRequest) {
      throw new NotFoundException("Quote request not found");
    }

    const job = await this.analysisQueue.add("analyze-quote-request", {
      quoteRequestId: id,
      companyId: req.companyId
    });

    return { taskId: job.id };
  }
}