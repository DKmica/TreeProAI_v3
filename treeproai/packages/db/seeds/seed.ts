import "dotenv/config";
import { getDb } from "../src/index";
import { companies } from "../schema/companies";
import { users } from "../schema/users";
import { addresses } from "../schema/addresses";
import { customers } from "../schema/customers";
import { leads } from "../schema/leads";
import { crews } from "../schema/crews";
import { equipment } from "../schema/equipment";
import { packEncrypted } from "../src/crypto";
import { randomUUID } from "node:crypto";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const db = getDb();

  const companyId = randomUUID();
  const companySlug = "demo-arbor-co";
  await db.insert(companies).values({
    id: companyId,
    name: "Demo Arbor Co.",
    slug: companySlug
  });

  const userData = [
    { role: "OWNER", clerkUserId: "owner_demo_1" },
    { role: "MANAGER", clerkUserId: "manager_demo_1" },
    { role: "SALES", clerkUserId: "sales_demo_1" },
    { role: "CREW", clerkUserId: "crew_demo_1" }
  ] as const;

  for (const u of userData) {
    const id = randomUUID();
    const email = `${u.role.toLowerCase()}@${companySlug}.local`;
    const phone = `555-01${String(id).slice(0, 2)}`;
    const encEmail = packEncrypted(email);
    const encPhone = packEncrypted(phone);
    await db.insert(users).values({
      id,
      companyId,
      clerkUserId: u.clerkUserId,
      emailCiphertext: encEmail.ciphertext,
      emailHash: encEmail.hash,
      phoneCiphertext: encPhone.ciphertext,
      phoneHash: encPhone.hash,
      role: u.role as any
    });
  }

  const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Sam", "Quinn", "Avery", "Jamie"];
  const lastNames = ["Green", "Oak", "Pine", "Willow", "Maple", "Cedar", "Birch", "Elm", "Ash", "Spruce"];
  const cities = ["Springfield", "Riverton", "Lakeside", "Hillview", "Fairfield"];
  const states = ["CA", "OR", "WA", "CO", "AZ"];

  const customerIds: string[] = [];
  for (let i = 0; i < 10; i++) {
    const id = randomUUID();
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const addrId = randomUUID();
    const email = `${name.replace(" ", ".").toLowerCase()}@example.com`;
    const phone = `555-1${String(i).padStart(2, "0")}-000`;
    const encEmail = packEncrypted(email);
    const encPhone = packEncrypted(phone);

    await db.insert(addresses).values({
      id: addrId,
      companyId,
      line1: `${100 + i} Tree Ln`,
      city: pick(cities),
      state: pick(states),
      postalCode: `90${String(100 + i)}`
    });

    await db.insert(customers).values({
      id,
      companyId,
      name,
      addressId: addrId,
      emailCiphertext: encEmail.ciphertext,
      emailHash: encEmail.hash,
      phoneCiphertext: encPhone.ciphertext,
      phoneHash: encPhone.hash,
      status: "ACTIVE"
    });

    customerIds.push(id);
  }

  // 20 leads linked to random customers
  const leadStatuses = ["NEW", "QUALIFIED", "QUOTED", "WON", "LOST"];
  const leadSources = ["WEB", "PHONE", "REFERRAL", "WALKIN"];

  for (let i = 0; i < 20; i++) {
    await db.insert(leads).values({
      id: randomUUID(),
      companyId,
      customerId: pick(customerIds),
      source: pick(leadSources),
      status: pick(leadStatuses) as any,
      notes: i % 3 === 0 ? "Customer mentioned large oak near driveway." : undefined
    });
  }

  // Seed basic crew and equipment
  await db.insert(crews).values({
    id: randomUUID(),
    companyId,
    name: "Alpha Crew",
    size: "4",
    hourlyRate: "125.00"
  });

  await db.insert(equipment).values({
    id: randomUUID(),
    companyId,
    name: "Bucket Truck",
    ratePerHour: "65.00",
    notes: "42ft reach"
  });

  console.log("Seed complete: company_id =", companyId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});