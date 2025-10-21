import { Controller, Post, Get, Param, Req, UseGuards, Body } from "@nestjs/common";
import { z } from "zod";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RbacGuard } from "../../common/guards/rbac.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { getDb, schema } from "@treeproai/db";
import { randomUUID } from "node:crypto";

const CreateQuoteRequestSchema = z.object({
  leadId: z.string().uuid().optional(),
  attachmentIds: z.array(z.string().uuid()).min(1)
});

@Controller("quote-requests")
@UseGuards(AuthGuard, RbacGuard)
export class QuoteRequestsController {
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
    // In a full implementation, this would enqueue a BullMQ job
    // For now, we'll return a mock task ID
    const taskId = randomUUID();
    return { taskId };
  }
}