import { Controller, Post, Param, Req, UseGuards, Body, NotFoundException } from "@nestjs/common";
import { getDb, schema, eq } from "@/db/index";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { StripeService } from "./stripe.service";
import { z } from "zod";

const CreateInvoiceSchema = z.object({
  jobId: z.string().uuid(),
});

@ApiTags("Invoices")
@ApiBearerAuth()
@Controller({ path: "invoices", version: "1" })
@UseGuards(RolesGuard)
export class InvoicesController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @Roles("owner", "admin")
  async createInvoice(@Body() body: unknown, @Req() req: any) {
    const { jobId } = CreateInvoiceSchema.parse(body);
    const db = getDb();
    const job = await db.query.jobs.findFirst({
        where: (j, { and }) => and(eq(j.id, jobId), eq(j.companyId, req.companyId)),
        with: { quote: true }
    });
    if (!job || !job.quote) throw new NotFoundException("Job or associated quote not found.");

    const [invoice] = await db.insert(schema.invoices).values({
        companyId: req.companyId,
        jobId,
        total: job.quote.total,
        status: "DRAFT",
    }).returning();

    return { id: invoice.id };
  }

  @Post(":id/paylink")
  @Roles("owner", "admin")
  async createPayLink(@Param("id") id: string, @Req() req: any) {
    const db = getDb();
    const [invoice] = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id));
    if (!invoice) throw new NotFoundException("Invoice not found.");

    const session = await this.stripeService.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: { name: `Payment for Invoice #${id.substring(0, 8)}` },
                unit_amount: Math.round(parseFloat(invoice.total) * 100),
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        metadata: {
            invoice_id: id,
            company_id: req.companyId,
        }
    });

    await db.update(schema.invoices).set({ status: "SENT" }).where(eq(schema.invoices.id, id));
    return { url: session.url };
  }
}