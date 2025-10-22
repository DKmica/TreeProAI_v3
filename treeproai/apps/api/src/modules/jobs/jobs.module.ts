import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { JobsController } from "./jobs.controller";
import { SchedulingService } from "./scheduling.service";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

@Module({
  controllers: [JobsController],
  providers: [SchedulingService],
})
export class JobsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/jobs');
      }
}