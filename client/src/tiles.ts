// -- Client-Side Tile Logic --
// Mirrors Cairo's tile functions so the grid renders without network calls.
// If these diverge from the contract, the client grid won't match what the contract allows.

import { hash } from "starknet";

// Layer-1 randomness on the client: same Poseidon hash and threshold as actions.cairo.
export function hasContent(
  player: string,
  level: number,
  x: number,
  y: number
): boolean {
  const h = hash.computePoseidonHashOnElements([
    BigInt(player),
    BigInt(level),
    BigInt(x),
    BigInt(y),
  ]);
  const bucket = Number(BigInt(h) & 0xffn);
  return bucket < 51; // 51/256 ≈ 20%
}

// Reads a single bit from the dug bitmap. Same encoding as Cairo: bit index = y*10 + x.
export function isDug(dug: string, x: number, y: number): boolean {
  const idx = BigInt(y * 10 + x);
  const mask = BigInt(dug);
  return ((mask >> idx) & 1n) === 1n;
}
