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