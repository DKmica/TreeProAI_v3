import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { HttpModule } from "@nestjs/axios";
import { AnalysisProcessor } from "./analysis.processor";
import { NotificationsProcessor } from "./notifications.processor";

@Module({
  imports: [
    HttpModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : "localhost",
        port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port, 10) : 6379,
      },
    }),
    BullModule.registerQueue({
      name: "analysis",
    }),
    BullModule.registerQueue({
      name: "notifications",
    }),
  ],
  providers: [AnalysisProcessor, NotificationsProcessor],
})
export class QueuesModule {}