import { Controller, Post, Get, Body, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { getDb, schema, eq } from "@/db/index";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";

const CreateLeadSchema = z.object({
  customerId: z.string().uuid().optional(),
  source: z.enum(["WEB_UPLOAD", "MANUAL", "REFERRAL"]).default("MANUAL"),
});

@ApiTags("Leads")
@ApiBearerAuth()
@Controller({ path: "leads", version: "1" })
@UseGuards(RolesGuard)
export class LeadsController {
  @Post()
  @Roles("owner", "admin", "member")
  async create(@Body() body: unknown, @Req() req: any) {
    const input = CreateLeadSchema.parse(body);
    const db = getDb();
    const [lead] = await db.insert(schema.leads).values({
      companyId: req.companyId,
      customerId: input.customerId,
      source: input.source,
      status: "NEW",
    }).returning();

    return { id: lead.id };
  }

  @Get()
  @Roles("owner", "admin", "member")
  async list(@Req() req: any) {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.leads)
      .where(eq(schema.leads.companyId, req.companyId))
      .orderBy(schema.leads.createdAt.desc());
    return { data: rows };
  }
}