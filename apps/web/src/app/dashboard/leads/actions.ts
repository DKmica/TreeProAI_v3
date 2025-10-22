"use server";

import { db } from "@repo/db";
import { leads } from "@repo/db/schema";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

const LeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  source: z.string().optional(),
});

const UpdateLeadSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  source: z.string().optional(),
  status: z.string(),
});

export async function addLead(prevState: any, formData: FormData) {
  const activeOrgId = cookies().get("active-org-id")?.value;

  if (!activeOrgId) {
    return { message: "Error: Active organization not found." };
  }

  const validatedFields = LeadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    source: formData.get("source"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Error.",
    };
  }

  try {
    await db.insert(leads).values({
      orgId: activeOrgId,
      name: validatedFields.data.name,
      email: validatedFields.data.email || null,
      phone: validatedFields.data.phone || null,
      source: validatedFields.data.source || null,
      // Status defaults to 'New' in the database schema
    });

    revalidatePath("/dashboard/leads");
    return { message: "success" };
  } catch (e) {
    return { message: "Database Error: Failed to create lead." };
  }
}

export async function updateLead(prevState: any, formData: FormData) {
  const activeOrgId = cookies().get("active-org-id")?.value;

  if (!activeOrgId) {
    return { message: "Error: Active organization not found." };
  }

  const validatedFields = UpdateLeadSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    source: formData.get("source"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Error.",
    };
  }

  const { id, name, email, phone, source, status } = validatedFields.data;

  try {
    const updated = await db
      .update(leads)
      .set({
        name,
        email: email || null,
        phone: phone || null,
        source: source || null,
        status,
      })
      .where(and(eq(leads.id, id), eq(leads.orgId, activeOrgId)))
      .returning({ id: leads.id });

    if (updated.length === 0) {
      return { message: "Error: Lead not found or you do not have permission to edit it." };
    }

    revalidatePath("/dashboard/leads");
    return { message: "success" };
  } catch (e) {
    return { message: "Database Error: Failed to update lead." };
  }
}

export async function deleteLead(leadId: string) {
  const activeOrgId = cookies().get("active-org-id")?.value;

  if (!activeOrgId) {
    return { message: "Error: Active organization not found." };
  }

  try {
    const deleted = await db
      .delete(leads)
      .where(and(eq(leads.id, leadId), eq(leads.orgId, activeOrgId)))
      .returning({ id: leads.id });

    if (deleted.length === 0) {
      return { message: "Error: Lead not found or you do not have permission to delete it." };
    }

    revalidatePath("/dashboard/leads");
    return { message: "success" };
  } catch (e) {
    return { message: "Database Error: Failed to delete lead." };
  }
}