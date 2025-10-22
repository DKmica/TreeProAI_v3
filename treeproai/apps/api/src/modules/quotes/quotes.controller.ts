import { Controller, Get, Post, Param, Req, UseGuards, Body, NotFoundException } from "@nestjs/common";
import { getDb, schema, eq } from "@treeproai/db";
import { notificationsQueue } from "@/queues";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { z } from "zod";

const SendQuoteSchema = z.object({
  method: z.enum(["email", "sms"]),
  recipient: z.string(),
});

@ApiTags("Quotes")
@ApiBearerAuth()
@Controller({ path: "quotes", version: "1" })
@UseGuards(RolesGuard)
export class QuotesController {
  @Get(":id")
  @Roles("owner", "admin", "member")
  async getById(@Param("id") id: string, @Req() req: any) {
    const db = getDb();
    const quote = await db.query.quotes.findFirst({
      where: (q, { and }) => and(eq(q.id, id), eq(q.companyId, req.companyId)),
      with: {
        quoteItems: true,
      },
    });
    if (!quote) throw new NotFoundException("Quote not found");
    return quote;
  }

  @Post(":id/send")
  @Roles("owner", "admin", "member")
  async sendQuote(@Param("id") id: string, @Req() req: any, @Body() body: unknown) {
    const { method, recipient } = SendQuoteSchema.parse(body);
    await notificationsQueue.add("send-quote", {
      quoteId: id,
      companyId: req.companyId,
      method,
      recipient,
    });
    await getDb().update(schema.quotes).set({ status: "SENT" }).where(eq(schema.quotes.id, id));
    return { message: "Quote sending process initiated." };
  }

  @Post(":id/accept")
  @Roles("owner", "admin", "member")
  async acceptQuote(@Param("id") id: string, @Req() req: any) {
    const db = getDb();
    const [job] = await db.insert(schema.jobs).values({
        companyId: req.companyId,
        quoteId: id,
        status: "PENDING",
    }).returning();
    await db.update(schema.quotes).set({ status: "ACCEPTED" }).where(eq(schema.quotes.id, id));
    return { jobId: job.id };
  }
}