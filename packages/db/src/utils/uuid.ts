import { randomBytes } from "node:crypto";

/**
 * Generates a RFC 9562 version 7 UUID.
 *
 * UUID v7 is time-ordered and suitable for primary keys without exposing
 * database sequence values.
 */
export function uuidv7(): string {
  const timestamp = BigInt(Date.now());
  const random = randomBytes(10);
  const bytes = new Uint8Array(16);

  bytes[0] = Number((timestamp >> 40n) & 0xffn);
  bytes[1] = Number((timestamp >> 32n) & 0xffn);
  bytes[2] = Number((timestamp >> 24n) & 0xffn);
  bytes[3] = Number((timestamp >> 16n) & 0xffn);
  bytes[4] = Number((timestamp >> 8n) & 0xffn);
  bytes[5] = Number(timestamp & 0xffn);

  const byte0 = random[0] ?? 0;
  const byte1 = random[1] ?? 0;
  const byte2 = random[2] ?? 0;
  const byte3 = random[3] ?? 0;
  const byte4 = random[4] ?? 0;
  const byte5 = random[5] ?? 0;
  const byte6 = random[6] ?? 0;
  const byte7 = random[7] ?? 0;
  const byte8 = random[8] ?? 0;
  const byte9 = random[9] ?? 0;

  const randomA = (byte0 << 4) | (byte1 >> 4);
  bytes[6] = 0x70 | (randomA >> 8);
  bytes[7] = randomA & 0xff;

  bytes[8] = 0x80 | (byte2 & 0x3f);
  bytes[9] = byte3;
  bytes[10] = byte4;
  bytes[11] = byte5;
  bytes[12] = byte6;
  bytes[13] = byte7;
  bytes[14] = byte8;
  bytes[15] = byte9;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
