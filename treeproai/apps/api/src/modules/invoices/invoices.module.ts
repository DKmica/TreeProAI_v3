import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { InvoicesController } from "./invoices.controller";
import { StripeService } from "./stripe.service";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

@Module({
  controllers: [InvoicesController],
  providers: [StripeService],
  exports: [StripeService],
})
export class InvoicesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/invoices');
      }
}