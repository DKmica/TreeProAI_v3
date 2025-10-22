"use server";

import { db, schema } from "@treeproai/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

const CustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const UpdateCustomerSchema = z.object({
  id: z.string(),
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
    await db.insert(schema.customers).values({
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

export async function updateCustomer(prevState: any, formData: FormData) {
  const activeOrgId = cookies().get("active-org-id")?.value;

  if (!activeOrgId) {
    return { message: "Error: Active organization not found." };
  }

  const validatedFields = UpdateCustomerSchema.safeParse({
    id: formData.get("id"),
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

  const { id, name, email, phone, address } = validatedFields.data;

  try {
    const updated = await db
      .update(schema.customers)
      .set({
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
      })
      .where(
        and(
          eq(schema.customers.id, id),
          eq(schema.customers.orgId, activeOrgId),
        ),
      )
      .returning({ id: schema.customers.id });

    if (updated.length === 0) {
      return { message: "Error: Customer not found or you do not have permission to edit it." };
    }

    revalidatePath("/dashboard/customers");
    return { message: "success" };
  } catch (e) {
    return { message: "Database Error: Failed to update customer." };
  }
}

export async function deleteCustomer(customerId: string) {
  const activeOrgId = cookies().get("active-org-id")?.value;

  if (!activeOrgId) {
    return { message: "Error: Active organization not found." };
  }

  try {
    // The `where` clause ensures users can only delete customers within their active org.
    // This is a second layer of protection on top of RLS.
    const deleted = await db
      .delete(schema.customers)
      .where(
        and(
          eq(schema.customers.id, customerId),
          eq(schema.customers.orgId, activeOrgId),
        ),
      )
      .returning({ id: schema.customers.id });

    if (deleted.length === 0) {
      return { message: "Error: Customer not found or you do not have permission to delete it." };
    }

    revalidatePath("/dashboard/customers");
    return { message: "success" };
  } catch (e) {
    return { message: "Database Error: Failed to delete customer." };
  }
}