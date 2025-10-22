import { Controller, Post, Body } from "@nestjs/common";
import { alertQueue } from "../../queues";

@Controller("nws")
export class NwsController {
  @Post("ingest")
  async onAlert(@Body() alert: any) {
    // Enqueue a job for the worker to handle the alert
    await alertQueue.add("handle-alert", { alert });
    return { status: "accepted" };
  }
}