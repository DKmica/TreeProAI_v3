import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Health")
@Controller()
export class HealthController {
  @Get("healthz")
  healthz() {
    return { ok: true, status: "healthy" };
  }

  @Get("readyz")
  readyz() {
    // In a real app, check DB/Redis connectivity here
    return { ok: true, status: "ready" };
  }
}