import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Client, TravelMode } from "@googlemaps/google-maps-services-js";
import { getDb, schema, eq, and } from "@/db/index";

@Injectable()
export class SchedulingService {
  private readonly mapsClient: Client;

  constructor() {
    this.mapsClient = new Client({});
  }

  async getScheduleSuggestions(jobId: string, companyId: string) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key not configured. Cannot provide schedule suggestions.");
      return [];
    }

    const db = getDb();
    const job = await db.query.jobs.findFirst({
      where: and(eq(schema.jobs.id, jobId), eq(schema.jobs.companyId, companyId)),
      with: { quote: { with: { quoteRequest: { with: { address: true } } } } },
    });

    const companyHq = await db.query.addresses.findFirst({
      where: and(eq(schema.addresses.companyId, companyId), eq(schema.addresses.kind, "COMPANY_HQ")),
    });

    if (!job?.quote?.quoteRequest?.address || !companyHq) {
      throw new InternalServerErrorException("Job or company address not found.");
    }

    const origin = { lat: parseFloat(companyHq.lat), lng: parseFloat(companyHq.lng) };
    const destination = { lat: parseFloat(job.quote.quoteRequest.address.lat), lng: parseFloat(job.quote.quoteRequest.address.lng) };

    const response = await this.mapsClient.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        mode: TravelMode.driving,
        key: apiKey,
      },
    });

    const travelDuration = response.data.rows[0].elements[0].duration; // in seconds

    // Simple suggestion logic: next 3 business days, AM/PM slots
    const suggestions = [];
    const now = new Date();
    for (let i = 1; i <= 3; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends

      // AM Slot
      const amSlot = new Date(date);
      amSlot.setHours(9, 0, 0, 0);
      suggestions.push({ scheduledAt: amSlot.toISOString(), travelDuration });

      // PM Slot
      const pmSlot = new Date(date);
      pmSlot.setHours(13, 0, 0, 0);
      suggestions.push({ scheduledAt: pmSlot.toISOString(), travelDuration });
    }

    return suggestions.slice(0, 3); // Return top 3
  }
}