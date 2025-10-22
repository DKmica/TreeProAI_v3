"use server";

import { db } from "@repo/db";
import { customers } from "@repo/db/schema";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function addCustomer(prevState: any, formData: FormData) {
  const activeOrgId = cookies().get("active-org-id")?.value;

  if (!activeOrgId) {
    return { message: "Error: Active organization not found." };
  }

  const validatedFields = CustomerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Error.",
    };
  }

  try {
    await db.insert(customers).values({
      orgId: activeOrgId,
      name: validatedFields.data.name,
      email: validatedFields.data.email || null,
      phone: validatedFields.data.phone || null,
      address: validatedFields.data.address || null,
    });

    revalidatePath("/dashboard/customers");
    return { message: "success" };
  } catch (e) {
    return { message: "Database Error: Failed to create customer." };
  }
}