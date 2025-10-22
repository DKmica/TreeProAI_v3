import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { AnalyzeImagesProcessor } from "./analyze-images.processor";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : "localhost",
        port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port) : 6379
      }
    }),
    BullModule.registerQueue({
      name: "analyzeImages"
    })
  ],
  providers: [AnalyzeImagesProcessor]
})
export class QueuesModule {}