import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { LeadsController } from "./leads.controller";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

@Module({
  controllers: [LeadsController]
})
export class LeadsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/leads');
      }
}