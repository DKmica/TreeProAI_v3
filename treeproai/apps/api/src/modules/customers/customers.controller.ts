import { Controller, Post, Get, Body, Req, UseGuards, Param } from "@nestjs/common";
import { z } from "zod";
import { getDb, schema, packEncrypted, eq, decryptPII } from "@/db/index";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";

const CreateCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(32).optional()
});

@ApiTags("Customers")
@ApiBearerAuth()
@Controller({ path: "customers", version: "1" })
@UseGuards(RolesGuard)
export class CustomersController {
  @Post()
  @Roles("owner", "admin", "member")
  async create(@Body() body: unknown, @Req() req: any) {
    const input = CreateCustomerSchema.parse(body);
    const db = getDb();
    
    const values: Partial<typeof schema.customers.$inferInsert> = {
        companyId: req.companyId,
        name: input.name,
    };

    if (input.email) {
      const { ciphertext, hash } = packEncrypted(input.email);
      values.emailCiphertext = ciphertext;
      values.emailHash = hash;
    }
    if (input.phone) {
        const { ciphertext, hash } = packEncrypted(input.phone);
        values.phoneCiphertext = ciphertext;
        values.phoneHash = hash;
    }

    const [customer] = await db.insert(schema.customers).values(values).returning();
    return { id: customer.id };
  }

  @Get()
  @Roles("owner", "admin", "member")
  async list(@Req() req: any) {
    const db = getDb();
    const rows = await db
      .select({
        id: schema.customers.id,
        name: schema.customers.name,
        createdAt: schema.customers.createdAt
      })
      .from(schema.customers)
      .where(eq(schema.customers.companyId, req.companyId))
      .orderBy(schema.customers.createdAt.desc());

    return { data: rows };
  }

  @Get(':id')
  @Roles('owner', 'admin', 'member')
  async getById(@Param('id') id: string, @Req() req: any) {
    const db = getDb();
    const [customer] = await db
      .select()
      .from(schema.customers)
      .where(eq(schema.customers.id, id) && eq(schema.customers.companyId, req.companyId));

    if (!customer) return null;

    return {
      ...customer,
      email: customer.emailCiphertext ? decryptPII(customer.emailCiphertext) : null,
      phone: customer.phoneCiphertext ? decryptPII(customer.phoneCiphertext) : null,
    };
  }
}