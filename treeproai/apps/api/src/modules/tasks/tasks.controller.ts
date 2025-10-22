import { Controller, Get, Param, Req, UseGuards, NotFoundException } from "@nestjs/common";
import { analysisQueue } from "@/queues";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";

@ApiTags("Tasks")
@ApiBearerAuth()
@Controller({ path: "tasks", version: "1" })
@UseGuards(RolesGuard)
export class TasksController {
  @Get(":id")
  @Roles("owner", "admin", "member")
  async getTask(@Param("id") id: string, @Req() req: any) {
    const job = await analysisQueue.getJob(id);

    if (!job) {
      throw new NotFoundException("Task not found");
    }

    if (job.data.companyId !== req.companyId) {
      throw new NotFoundException("Task not found for this company");
    }

    const status = await job.getState();
    const isFinished = await job.isCompleted() || await job.isFailed();

    return {
      id: job.id,
      status: status,
      isFinished,
      progress: job.progress,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}