import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { EnvService } from "../src/config/env";

describe("EnvService", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      DATABASE_URL: "postgres://test:test@localhost:5432/test",
      S3_ENDPOINT: "http://localhost:9000",
      S3_BUCKET: "test-bucket",
      S3_ACCESS_KEY: "test-key",
      S3_SECRET_KEY: "test-secret"
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should parse valid environment variables", () => {
    const envService = new EnvService();
    expect(envService.get("DATABASE_URL")).toBe("postgres://test:test@localhost:5432/test");
    expect(envService.get("S3_BUCKET")).toBe("test-bucket");
  });

  it("should throw an error for missing required variables", () => {
    delete process.env.DATABASE_URL;
    expect(() => new EnvService()).toThrow();
  });
});