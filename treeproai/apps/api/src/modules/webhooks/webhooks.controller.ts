import { Controller, Post, Req, Headers, BadRequestException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StripeService } from "../invoices/stripe.service";
import { getDb, schema, eq } from "@/db/index";
import Stripe from "stripe";

@ApiTags("Webhooks")
@Controller({ path: "webhooks", version: "1" })
export class WebhooksController {
  constructor(private readonly stripeService: StripeService) {}

  @Post("stripe")
  async handleStripeWebhook(@Headers("stripe-signature") sig: string, @Req() req: any) {
    if (!sig) throw new BadRequestException("Missing Stripe signature");
    
    let event: Stripe.Event;
    try {
      event = this.stripeService.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const invoiceId = session.metadata?.invoice_id;
      if (invoiceId) {
        const db = getDb();
        await db.update(schema.invoices).set({ status: "PAID" }).where(eq(schema.invoices.id, invoiceId));
        console.log(`Invoice ${invoiceId} marked as PAID.`);
      }
    }

    return { received: true };
  }
}