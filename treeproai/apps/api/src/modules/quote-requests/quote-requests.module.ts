import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { QuoteRequestsController } from "./quote-requests.controller";
import { BullModule } from "@nestjs/bullmq";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

@Module({
  imports: [
    BullModule.registerQueue({ name: "analysis" }),
  ],
  controllers: [QuoteRequestsController],
})
export class QuoteRequestsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/quote-requests');
      }
}