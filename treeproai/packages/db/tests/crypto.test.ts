import { describe, it, expect } from "vitest";
import { encryptPII, decryptPII, hashPII } from "../src/crypto";

process.env.PII_ENCRYPTION_KEY = "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=";

describe("PII crypto helpers", () => {
  it("encrypts and decrypts correctly", () => {
    const plain = "test@example.com";
    const cipher = encryptPII(plain);
    const out = decryptPII(cipher);
    expect(out).toEqual(plain);
  });

  it("hashPII normalizes and hashes deterministically", () => {
    const h1 = hashPII(" Test@Example.com ");
    const h2 = hashPII("test@example.com");
    expect(h1).toEqual(h2);
    expect(h1).toMatch(/^[a-f0-9]{64}$/);
  });
});