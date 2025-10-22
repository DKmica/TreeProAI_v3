import { Controller, Get, Post, Param, Req, UseGuards, Body, NotFoundException } from "@nestjs/common";
import { getDb, schema, eq, and } from "@treeproai/db";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { SchedulingService } from "./scheduling.service";
import { z } from "zod";

const ScheduleJobSchema = z.object({
  scheduledAt: z.string().datetime(),
  // crewId could be added here
});

@ApiTags("Jobs")
@ApiBearerAuth()
@Controller({ path: "jobs", version: "1" })
@UseGuards(RolesGuard)
export class JobsController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get()
  @Roles("owner", "admin", "member")
  async list(@Req() req: any) {
    const db = getDb();
    const jobs = await db.query.jobs.findMany({
      where: eq(schema.jobs.companyId, req.companyId),
      orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
    });
    return jobs;
  }

  @Get(":id")
  @Roles("owner", "admin", "member")
  async getById(@Param("id") id: string, @Req() req: any) {
    const db = getDb();
    const job = await db.query.jobs.findFirst({
      where: and(eq(schema.jobs.id, id), eq(schema.jobs.companyId, req.companyId)),
    });
    if (!job) throw new NotFoundException("Job not found");
    return job;
  }

  @Post(":id/schedule/suggest")
  @Roles("owner", "admin")
  async suggest(@Param("id") id: string, @Req() req: any) {
    const suggestions = await this.schedulingService.getScheduleSuggestions(id, req.companyId);
    return suggestions;
  }

  @Post(":id/schedule")
  @Roles("owner", "admin")
  async schedule(@Param("id") id: string, @Req() req: any, @Body() body: unknown) {
    const { scheduledAt } = ScheduleJobSchema.parse(body);
    const db = getDb();
    const [job] = await db
      .update(schema.jobs)
      .set({ scheduledAt, status: "SCHEDULED" })
      .where(and(eq(schema.jobs.id, id), eq(schema.jobs.companyId, req.companyId)))
      .returning();
    
    if (!job) throw new NotFoundException("Job not found or could not be updated.");
    return job;
  }
}