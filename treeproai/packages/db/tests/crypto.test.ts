import { describe, it, expect, beforeAll } from "vitest";
import { encryptPII, decryptPII, hashPII } from "../src/crypto";
import { randomBytes } from "node:crypto";

describe("PII crypto helpers", () => {
  beforeAll(() => {
    if (!process.env.PII_ENCRYPTION_KEY) {
      process.env.PII_ENCRYPTION_KEY = randomBytes(32).toString("base64");
    }
  });

  it("encrypts and decrypts correctly", () => {
    const plain = "test@example.com";
    const cipher = encryptPII(plain);
    const out = decryptPII(cipher);
    expect(out).toEqual(plain);
    expect(cipher).not.toEqual(plain);
  });

  it("hashPII normalizes and hashes deterministically", () => {
    const h1 = hashPII(" Test@Example.com ");
    const h2 = hashPII("test@example.com");
    expect(h1).toEqual(h2);
    expect(h1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("throws on invalid ciphertext format", () => {
    expect(() => decryptPII("invalid-format")).toThrow("Invalid ciphertext format");
  });
});