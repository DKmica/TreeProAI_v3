import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { CustomersController } from "./customers.controller";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

@Module({
  controllers: [CustomersController]
})
export class CustomersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/customers');
      }
}