import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "analyzeImages",
    }),
  ],
  controllers: [TasksController],
})
export class TasksModule {}