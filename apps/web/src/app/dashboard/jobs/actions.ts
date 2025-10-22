"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrg } from "@/lib/get-active-org";
import { db, schema } from "@treeproai/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const JobIdSchema = z.string().uuid();

export async function deleteJob(jobId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Error: Not authenticated" };
  }

  const activeOrgId = await getActiveOrg();
  if (!activeOrgId) {
    return { message: "Error: No active organization found." };
  }

  try {
    const validatedId = JobIdSchema.parse(jobId);

    const [deletedJob] = await db
      .delete(schema.jobs)
      .where(
        and(eq(schema.jobs.id, validatedId), eq(schema.jobs.orgId, activeOrgId))
      )
      .returning({ id: schema.jobs.id });

    if (!deletedJob) {
      return { message: "Error: Job not found or you do not have permission to delete it." };
    }

    revalidatePath("/dashboard/jobs");
    return { message: `Deleted job ${deletedJob.id}` };
  } catch (error) {
    console.error(error);
    return { message: "Error: Could not delete job." };
  }
}