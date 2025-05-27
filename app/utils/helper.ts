import Web3 from "web3";
const web3 = new Web3();                      // util instance samo za enc/dec

/** ASCII VIN  →  bytes17 (0x + 34 hex) */
export function vinToBytes17(vin: string): string {
  if (vin.length > 17) throw new Error("VIN > 17 characters");

  // 1. UTF-8 → hex (bez 0x)
  const raw = web3.utils.utf8ToHex(vin).slice(2);

  // 2. dopuni nulama do 34 hex-znaka
  const padded = raw.padEnd(34, "0");

  return "0x" + padded;                       // bytes17 is ready
}

/** bytes17 (0x…) → ASCII VIN */
export function bytes17ToVin(hex: string): string {
  const ascii = web3.utils.hexToAscii(hex);
  return ascii.replace(/\u0000+$/, "");       // skini \0 padding
}
/** string → bytes32 (0x + 64 hex) */
export function strToBytes32(text: string): string {
  const raw = web3.utils.utf8ToHex(text).slice(2);    // npr. "0x68656c6c6f"
    const padded = raw.padEnd(64, "0");

  return "0x" + padded;    
}

/** bytes32 (0x…) → string */
export function bytes32ToStr(bytes32: string): string {
  const ascii = web3.utils.hexToUtf8(bytes32);
  return ascii.replace(/\u0000+$/, "");      // riješi se \0 padding-a
}
