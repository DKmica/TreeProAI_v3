import { Controller, Post, Get, Body, Req, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RbacGuard } from "../../common/guards/rbac.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { getDb, schema, packEncrypted } from "@treeproai/db";
import { randomUUID } from "node:crypto";

const CreateCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(32).optional()
});

@Controller("customers")
@UseGuards(AuthGuard, RbacGuard)
export class CustomersController {
  @Post()
  @Roles("OWNER", "MANAGER", "SALES")
  async create(@Body() body: unknown, @Req() req: any) {
    const input = CreateCustomerSchema.parse(body);
    const db = getDb();
    const id = randomUUID();
    let emailCiphertext: string | undefined;
    let emailHash: string | undefined;
    let phoneCiphertext: string | undefined;
    let phoneHash: string | undefined;

    if (input.email) {
      const p = packEncrypted(input.email);
      emailCiphertext = p.ciphertext;
      emailHash = p.hash;
    }
    if (input.phone) {
      const p = packEncrypted(input.phone);
      phoneCiphertext = p.ciphertext;
      phoneHash = p.hash;
    }

    await db.insert(schema.customers).values({
      id,
      companyId: req.companyId,
      name: input.name,
      emailCiphertext,
      emailHash,
      phoneCiphertext,
      phoneHash,
      status: "ACTIVE"
    });

    return { id };
  }

  @Get()
  @Roles("OWNER", "MANAGER", "SALES", "CREW")
  async list(@Req() req: any) {
    const db = getDb();
    const rows = await db
      .select({
        id: schema.customers.id,
        name: schema.customers.name,
        status: schema.customers.status,
        createdAt: schema.customers.createdAt
      })
      .from(schema.customers)
      .where(schema.customers.companyId.eq(req.companyId))
      .orderBy(schema.customers.createdAt.desc());

    return { data: rows };
  }
}