import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto";

/**
 * PII encryption using AES-256-GCM.
 * Key is provided via env PII_ENCRYPTION_KEY as base64 of 32 bytes.
 */

function getKey(): Buffer {
  const b64 = process.env.PII_ENCRYPTION_KEY;
  if (!b64) {
    throw new Error("PII_ENCRYPTION_KEY env var is required");
  }
  const key = Buffer.from(b64, "base64");
  if (key.length !== 32) {
    throw new Error("PII_ENCRYPTION_KEY must decode to 32 bytes");
  }
  return key;
}

export function hashPII(value: string): string {
  const normalized = value.trim().toLowerCase();
  return createHash("sha256").update(normalized).digest("hex");
}

/**
 * Returns a compact ciphertext string "ivHex:tagHex:cipherHex"
 */
export function encryptPII(plain: string): string {
  const key = getKey();
  const iv = randomBytes(12); // GCM standard nonce length
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${ciphertext.toString("hex")}`;
}

export function decryptPII(compact: string): string {
  const [ivHex, tagHex, cipherHex] = compact.split(":");
  if (!ivHex || !tagHex || !cipherHex) {
    throw new Error("Invalid ciphertext format");
  }
  const key = getKey();
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const ciphertext = Buffer.from(cipherHex, "hex");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}

export function packEncrypted(value: string) {
  return {
    ciphertext: encryptPII(value),
    hash: hashPII(value)
  };
}