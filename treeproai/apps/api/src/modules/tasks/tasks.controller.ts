import { Controller, Get, Param, Req, UseGuards, NotFoundException } from "@nestjs/common";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RbacGuard } from "../../common/guards/rbac.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Controller("tasks")
@UseGuards(AuthGuard, RbacGuard)
export class TasksController {
  constructor(@InjectQueue("analyzeImages") private readonly analyzeImagesQueue: Queue) {}

  @Get(":id")
  @Roles("OWNER", "MANAGER", "SALES", "CREW")
  async getTask(@Param("id") id: string, @Req() req: any) {
    const job = await this.analyzeImagesQueue.getJob(id);

    if (!job) {
      throw new NotFoundException("Task not found");
    }

    // Ensure the task belongs to the user's company
    if (job.data.companyId !== req.companyId) {
      throw new NotFoundException("Task not found");
    }

    const status = await job.getState();
    const isFinished = await job.isCompleted() || await job.isFailed();

    return {
      id: job.id,
      status: status, // e.g., completed, failed, active, waiting
      isFinished,
      progress: job.progress,
      result: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}