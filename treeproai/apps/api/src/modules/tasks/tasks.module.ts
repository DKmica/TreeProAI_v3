import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { BullModule } from "@nestjs/bullmq";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

@Module({
  imports: [
    BullModule.registerQueue({ name: "analysis" }),
  ],
  controllers: [TasksController],
})
export class TasksModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(ClerkExpressWithAuth())
          .forRoutes('v1/tasks');
      }
}