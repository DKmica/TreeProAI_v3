import { Module } from "@nestjs/common";
import { NwsController } from "./nws.controller";

@Module({
  controllers: [NwsController],
})
export class NwsModule {}