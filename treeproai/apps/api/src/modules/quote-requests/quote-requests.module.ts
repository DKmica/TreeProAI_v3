import { Module } from "@nestjs/common";
import { QuoteRequestsController } from "./quote-requests.controller";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "analyzeImages",
    }),
  ],
  controllers: [QuoteRequestsController],
})
export class QuoteRequestsModule {}