import { describe, it, expect } from "vitest";
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  S3_ENDPOINT: z.string().url(),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1)
});

describe("Env schema", () => {
  it("validates minimal required env", () => {
    const env = {
      DATABASE_URL: "postgres://localhost:5432/db",
      S3_ENDPOINT: "http://localhost:9000",
      S3_BUCKET: "bucket",
      S3_ACCESS_KEY: "minio",
      S3_SECRET_KEY: "minio"
    };
    expect(() => EnvSchema.parse(env)).not.toThrow();
  });
});