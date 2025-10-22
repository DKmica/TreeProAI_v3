import { Injectable } from "@nestjs/common";
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional().default("redis://localhost:6379"),
  S3_ENDPOINT: z.string().url(),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().optional(),
  API_PORT: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional()
});

export type Env = z.infer<typeof EnvSchema>;

@Injectable()
export class EnvService {
  private readonly data: Env;
  constructor() {
    this.data = EnvSchema.parse(process.env);
  }
  get<K extends keyof Env>(key: K): Env[K] {
    return this.data[key];
  }
}