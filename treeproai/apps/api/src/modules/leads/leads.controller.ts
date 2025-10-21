import { Controller, Post, Get, Body, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RbacGuard } from "../../common/guards/rbac.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { getDb, schema } from "@treeproai/db";
import { randomUUID } from "node:crypto";

const CreateLeadSchema = z.object({
  customerId: z.string().uuid().optional(),
  source: z.enum(["WEB", "PHONE", "REFERRAL", "WALKIN"]).default("WEB"),
  notes: z.string().max(1024).optional()
});

@Controller("leads")
@UseGuards(AuthGuard, RbacGuard)
export class LeadsController {
  @Post()
  @Roles("OWNER", "MANAGER", "SALES")
  async create(@Body() body: unknown, @Req() req: any) {
    const input = CreateLeadSchema.parse(body);
    const db = getDb();
    const id = randomUUID();

    await db.insert(schema.leads).values({
      id,
      companyId: req.companyId,
      customerId: input.customerId,
      source: input.source,
      status: "NEW",
      notes: input.notes
    });

    return { id };
  }

  @Get()
  @Roles("OWNER", "MANAGER", "SALES", "CREW")
  async list(@Req() req: any) {
    const db = getDb();
    const rows = await db
      .select({
        id: schema.leads.id,
        customerId: schema.leads.customerId,
        source: schema.leads.source,
        status: schema.leads.status,
        createdAt: schema.leads.createdAt
      })
      .from(schema.leads)
      .where(schema.leads.companyId.eq(req.companyId))
      .orderBy(schema.leads.createdAt.desc());
    return { data: rows };
  }
}