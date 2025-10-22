import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

@Module({
  controllers: [UploadsController]
})
export class UploadsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/uploads/presign');
      }
}