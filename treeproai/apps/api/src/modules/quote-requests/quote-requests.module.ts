import { Module } from "@nestjs/common";
import { QuoteRequestsController } from "./quote-requests.controller";

@Module({
  controllers: [QuoteRequestsController]
})
export class QuoteRequestsModule {}