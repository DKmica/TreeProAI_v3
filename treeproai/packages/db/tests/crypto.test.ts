import { describe, it, expect, beforeAll } from 'vitest';
import { encryptPII, decryptPII, hashPII } from '../src/crypto';

describe('PII Crypto Functions', () => {
  beforeAll(() => {
    // Set a dummy key for testing purposes
    process.env.PII_ENCRYPTION_KEY = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='; // 32 bytes base64
  });

  it('should encrypt and decrypt a value successfully', () => {
    const original = 'test@example.com';
    const encrypted = encryptPII(original);
    const decrypted = decryptPII(encrypted);

    expect(encrypted).not.toBe(original);
    expect(decrypted).toBe(original);
  });

  it('should produce a consistent hash for the same input', () => {
    const value = 'test@example.com';
    const hash1 = hashPII(value);
    const hash2 = hashPII(value);
    expect(hash1).toBe(hash2);
    expect(hash1).toBe('f295c913852c254459982a8037b0e634f14339d3a52506a46953a56ce633c2b3');
  });

  it('should produce a different hash for different input', () => {
    const hash1 = hashPII('a@b.com');
    const hash2 = hashPII('c@d.com');
    expect(hash1).not.toBe(hash2);
  });

  it('should handle decryption errors gracefully', () => {
    const decrypted = decryptPII('invalid:ciphertext');
    expect(decrypted).toBe('DECRYPTION_ERROR');
  });
});