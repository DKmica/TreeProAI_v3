import { Module } from "@nestjs/common";
import { MeController } from "./me.controller";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { MiddlewareConsumer, NestModule } from "@nestjs/common";

@Module({
  controllers: [MeController]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/me');
      }
}