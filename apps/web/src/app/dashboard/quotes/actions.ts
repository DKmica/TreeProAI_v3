"use server";

import { db } from "@repo/db";
import { quotes } from "@repo/db/schema";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

const LineItemSchema = z.object({
  description: z.string().min(1, "Description cannot be empty."),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
});

const AddQuoteSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID."),
  expiresAt: z.coerce.date().optional(),
  lineItems: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0 && parsed.every(item => LineItemSchema.safeParse(item).success);
    } catch {
      return false;
    }
  }, { message: "At least one valid line item is required." }),
});

const UpdateQuoteSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid("Invalid customer ID."),
  expiresAt: z.coerce.date().optional(),
  status: z.string().min(1, "Status is required."),
  lineItems: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0 && parsed.every(item => LineItemSchema.safeParse(item).success);
    } catch {
      return false;
    }
  }, { message: "At least one valid line item is required." }),
});

export async function addQuote(prevState: any, formData: FormData) {
  const activeOrgId = cookies().get("active-org-id")?.value;

  if (!activeOrgId) {
    return { message: "Error: Active organization not found." };
  }

  const validatedFields = AddQuoteSchema.safeParse({
    customerId: formData.get("customerId"),
    expiresAt: formData.get("expiresAt"),
    lineItems: formData.get("lineItems"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Error.",
    };
  }
  
  const lineItems = JSON.parse(validatedFields.data.lineItems) as z.infer<typeof LineItemSchema>[];
  
  // Server-side calculation of total for data integrity
  const total = lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  try {
    await db.insert(quotes).values({
      orgId: activeOrgId,
      customerId: validatedFields.data.customerId,
      expiresAt: validatedFields.data.expiresAt,
      lineItems: lineItems,
      total: total.toFixed(2),
      status: "draft", // Default status
    });

    revalidatePath("/dashboard/quotes");
    return { message: "success" };
  } catch (e) {
    console.error(e);
    return { message: "Database Error: Failed to create quote." };
  }
}

export async function updateQuote(prevState: any, formData: FormData) {
  const activeOrgId = cookies().get("active-org-id")?.value;

  if (!activeOrgId) {
    return { message: "Error: Active organization not found." };
  }

  const validatedFields = UpdateQuoteSchema.safeParse({
    id: formData.get("id"),
    customerId: formData.get("customerId"),
    expiresAt: formData.get("expiresAt"),
    status: formData.get("status"),
    lineItems: formData.get("lineItems"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Error.",
    };
  }

  const lineItems = JSON.parse(validatedFields.data.lineItems) as z.infer<typeof LineItemSchema>[];
  const total = lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  try {
    const updated = await db
      .update(quotes)
      .set({
        customerId: validatedFields.data.customerId,
        expiresAt: validatedFields.data.expiresAt,
        status: validatedFields.data.status,
        lineItems: lineItems,
        total: total.toFixed(2),
      })
      .where(and(eq(quotes.id, validatedFields.data.id), eq(quotes.orgId, activeOrgId)))
      .returning({ id: quotes.id });

    if (updated.length === 0) {
      return { message: "Error: Quote not found or you do not have permission to edit it." };
    }

    revalidatePath("/dashboard/quotes");
    return { message: "success" };
  } catch (e) {
    console.error(e);
    return { message: "Database Error: Failed to update quote." };
  }
}

export async function deleteQuote(quoteId: string) {
  const activeOrgId = cookies().get("active-org-id")?.value;

  if (!activeOrgId) {
    return { message: "Error: Active organization not found." };
  }

  try {
    const deleted = await db
      .delete(quotes)
      .where(and(eq(quotes.id, quoteId), eq(quotes.orgId, activeOrgId)))
      .returning({ id: quotes.id });

    if (deleted.length === 0) {
      return { message: "Error: Quote not found or you do not have permission to delete it." };
    }

    revalidatePath("/dashboard/quotes");
    return { message: "success" };
  } catch (e) {
    return { message: "Database Error: Failed to delete quote." };
  }
}