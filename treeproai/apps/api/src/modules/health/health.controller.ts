import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get("healthz")
  healthz() {
    return { ok: true };
  }

  @Get("readyz")
  readyz() {
    // In a full implementation, check DB/Redis connectivity.
    return { ready: true };
  }
}