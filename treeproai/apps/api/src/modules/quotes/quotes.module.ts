import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { QuotesController } from "./quotes.controller";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

@Module({
  imports: [],
  controllers: [QuotesController],
})
export class QuotesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/quotes');
      }
}