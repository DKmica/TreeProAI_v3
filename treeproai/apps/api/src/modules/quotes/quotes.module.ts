import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { QuotesController } from "./quotes.controller";
import { BullModule } from "@nestjs/bullmq";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

@Module({
  imports: [
    BullModule.registerQueue({ name: "notifications" }),
  ],
  controllers: [QuotesController],
})
export class QuotesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/quotes');
      }
}