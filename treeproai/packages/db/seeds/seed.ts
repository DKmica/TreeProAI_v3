import "dotenv/config";
import { getDb, disconnectDb, packEncrypted } from "../src/index";
import { companies, users, addresses, customers, leads, quoteRequests, quotes, quoteItems } from "../schema";
import { sql } from "drizzle-orm";

async function main() {
  if (!process.env.PII_ENCRYPTION_KEY) {
    throw new Error("PII_ENCRYPTION_KEY must be set for seeding.");
  }
  const db = getDb();
  console.log("Starting seed...");

  // 1. Create a demo company
  const [company] = await db.insert(companies).values({ name: "Demo Arbor Co.", plan: "PRO" }).returning();
  const companyId = company.id;
  console.log(`Created company: ${company.name} (ID: ${companyId})`);

  // 2. Create users
  const ownerEmail = "owner@demo.com";
  const ownerEnc = packEncrypted(ownerEmail);
  await db.insert(users).values({
    id: "user_2i5nOKlW2YI0l5tT3Q8p7gE6r9w", // Example Clerk User ID
    companyId,
    emailCiphertext: ownerEnc.ciphertext,
    emailHash: ownerEnc.hash,
    role: "OWNER"
  });
  console.log(`Created OWNER user: ${ownerEmail}`);

  // 3. Create customers and leads
  const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey"];
  const lastNames = ["Green", "Oak", "Pine", "Willow", "Maple"];
  for (let i = 0; i < 10; i++) {
    const name = `${firstNames[i % 5]} ${lastNames[i % 5]}`;
    const email = `${name.replace(" ", ".").toLowerCase()}.${i}@example.com`;
    const encEmail = packEncrypted(email);

    const [cust] = await db.insert(customers).values({ companyId, name, emailCiphertext: encEmail.ciphertext, emailHash: encEmail.hash }).returning();
    
    // Create 2 leads per customer
    await db.insert(leads).values([{ companyId, customerId: cust.id, source: "WEB_UPLOAD", status: "NEW" }, { companyId, customerId: cust.id, source: "MANUAL", status: "QUALIFIED" }]);
  }
  console.log(`Created 10 customers and 20 leads.`);

  // 4. Create a sample quote request with a draft quote
  const allLeads = await db.select().from(leads).where(sql`${leads.companyId} = ${companyId}`);
  const leadForQuote = allLeads[0];

  const [address] = await db.insert(addresses).values({ companyId, kind: "JOB_SITE", street: "123 Main St", city: "Anytown", state: "CA", zip: "12345" }).returning();

  const imageKeys = [`${companyId}/demo-image-1.jpg`, `${companyId}/demo-image-2.jpg`];
  const [qr] = await db.insert(quoteRequests).values({ companyId, customerId: leadForQuote.customerId, addressId: address.id, imageKeys, notes: "Two large oaks in the front yard." }).returning();
  
  const [quote] = await db.insert(quotes).values({ companyId, quoteRequestId: qr.id, status: "DRAFT", subtotal: "1250.00", total: "1250.00" }).returning();
  
  await db.insert(quoteItems).values([
    { quoteId: quote.id, kind: "SERVICE", description: "Trim large oak tree (front left)", qty: "1", unitPrice: "750.00" },
    { quoteId: quote.id, kind: "SERVICE", description: "Remove medium maple tree (front right)", qty: "1", unitPrice: "500.00" }
  ]);
  
  await db.update(leads).set({ status: "QUOTED" }).where(sql`${leads.id} = ${leadForQuote.id}`);

  console.log(`Created sample quote request and draft quote for lead ${leadForQuote.id}.`);
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
}).finally(async () => {
  await disconnectDb();
});