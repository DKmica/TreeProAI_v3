import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RbacGuard } from "../../common/guards/rbac.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("tasks")
@UseGuards(AuthGuard, RbacGuard)
export class TasksController {
  @Get(":id")
  @Roles("OWNER", "MANAGER", "SALES", "CREW")
  async getTask(@Param("id") id: string, @Req() req: any) {
    // In a full implementation, this would check BullMQ job status
    // For now, we'll return a mock status
    return {
      id,
      status: "done",
      result: {
        quoteId: "mock-quote-id"
      }
    };
  }
}