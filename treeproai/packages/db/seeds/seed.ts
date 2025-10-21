import "dotenv/config";
import { getDb, disconnectDb, packEncrypted } from "../src/index";
import { companies, users, addresses, customers, leads, crews, equipment, leadStatus, leadSource, userRole } from "../schema";
import { randomUUID } from "node:crypto";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  if (!process.env.PII_ENCRYPTION_KEY) {
    throw new Error("PII_ENCRYPTION_KEY must be set for seeding.");
  }
  const db = getDb();

  console.log("Starting seed...");

  // 1. Create a demo company
  const companySlug = "demo-arbor-co";
  const [company] = await db.insert(companies).values({
    name: "Demo Arbor Co.",
    slug: companySlug
  }).returning();
  const companyId = company.id;
  console.log(`Created company: ${company.name} (ID: ${companyId})`);

  // 2. Create users for the company
  const userData = [
    { role: userRole.enumValues[0], clerkUserId: "owner_demo_1" }, // OWNER
    { role: userRole.enumValues[1], clerkUserId: "manager_demo_1" }, // MANAGER
    { role: userRole.enumValues[2], clerkUserId: "sales_demo_1" }, // SALES
    { role: userRole.enumValues[3], clerkUserId: "crew_demo_1" } // CREW
  ] as const;

  for (const u of userData) {
    const email = `${u.role.toLowerCase()}@${companySlug}.local`;
    const phone = `555-0100-${String(Math.floor(Math.random() * 90) + 10)}`;
    const encEmail = packEncrypted(email);
    const encPhone = packEncrypted(phone);
    await db.insert(users).values({
      companyId,
      clerkUserId: u.clerkUserId,
      emailCiphertext: encEmail.ciphertext,
      emailHash: encEmail.hash,
      phoneCiphertext: encPhone.ciphertext,
      phoneHash: encPhone.hash,
      role: u.role
    });
  }
  console.log(`Created ${userData.length} users.`);

  // 3. Create 10 customers
  const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Sam", "Quinn", "Avery", "Jamie"];
  const lastNames = ["Green", "Oak", "Pine", "Willow", "Maple", "Cedar", "Birch", "Elm", "Ash", "Spruce"];
  const cities = ["Springfield", "Riverton", "Lakeside", "Hillview", "Fairfield"];
  const states = ["CA", "OR", "WA", "CO", "AZ"];
  
  const customerIds: string[] = [];
  for (let i = 0; i < 10; i++) {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const email = `${name.replace(" ", ".").toLowerCase()}.${i}@example.com`;
    const phone = `555-1${String(i).padStart(2, "0")}-1234`;
    const encEmail = packEncrypted(email);
    const encPhone = packEncrypted(phone);

    const [addr] = await db.insert(addresses).values({
      companyId,
      line1: `${100 + i} Tree Ln`,
      city: pick(cities),
      state: pick(states),
      postalCode: `90${String(100 + i)}`
    }).returning();

    const [cust] = await db.insert(customers).values({
      companyId,
      name,
      addressId: addr.id,
      emailCiphertext: encEmail.ciphertext,
      emailHash: encEmail.hash,
      phoneCiphertext: encPhone.ciphertext,
      phoneHash: encPhone.hash,
      status: "ACTIVE"
    }).returning();
    customerIds.push(cust.id);
  }
  console.log(`Created ${customerIds.length} customers.`);

  // 4. Create 20 leads linked to random customers
  for (let i = 0; i < 20; i++) {
    await db.insert(leads).values({
      companyId,
      customerId: pick(customerIds),
      source: pick(leadSource.enumValues),
      status: pick(leadStatus.enumValues),
      notes: i % 3 === 0 ? "Customer mentioned large oak near driveway." : undefined
    });
  }
  console.log(`Created 20 leads.`);

  // 5. Seed basic crew and equipment
  await db.insert(crews).values({
    companyId,
    name: "Alpha Crew",
    size: 4,
    hourlyRate: "125.00"
  });
  console.log("Created 'Alpha Crew'.");

  await db.insert(equipment).values({
    companyId,
    name: "Bucket Truck",
    ratePerHour: "65.00",
    notes: "42ft reach"
  });
  console.log("Created 'Bucket Truck' equipment.");

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
}).finally(async () => {
  await disconnectDb();
});