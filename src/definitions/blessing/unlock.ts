export const CONFIG_UNLOCK_SECTION = 5;
export const CONFIG_UNLOCK_WORDS = 4;
export const CONFIG_UNLOCK_WORD_MASK = 0x3fff;
export const CONFIG_UNLOCK_TOKEN_SEED_A = "opendeck-config-unlock-v1-a";
export const CONFIG_UNLOCK_TOKEN_SEED_B = "opendeck-config-unlock-v1-b";

const CONFIG_UNLOCK_FNV_OFFSET_BASIS = 2166136261;
const CONFIG_UNLOCK_FNV_PRIME = 16777619;

const hexToBytes = (hex: string): Uint8Array => {
  const normalized = hex.replace(/[^0-9a-f]/gi, "");
  const bytes = normalized.match(/.{1,2}/g) || [];

  return new Uint8Array(bytes.map((byte) => parseInt(byte, 16)));
};

const fnv1a = (domain: string, serial: Uint8Array): number => {
  let hash = CONFIG_UNLOCK_FNV_OFFSET_BASIS >>> 0;

  for (let index = 0; index < domain.length; index++) {
    hash ^= domain.charCodeAt(index);
    hash = Math.imul(hash, CONFIG_UNLOCK_FNV_PRIME) >>> 0;
  }

  serial.forEach((byte) => {
    hash ^= byte;
    hash = Math.imul(hash, CONFIG_UNLOCK_FNV_PRIME) >>> 0;
  });

  return hash >>> 0;
};

const splitHash = (hash: number): number[] => [
  hash & CONFIG_UNLOCK_WORD_MASK,
  (hash >>> 14) & CONFIG_UNLOCK_WORD_MASK,
];

export const buildConfigUnlockToken = (serialNumber: string): number[] => {
  const serial = hexToBytes(serialNumber);

  return [
    ...splitHash(fnv1a(CONFIG_UNLOCK_TOKEN_SEED_A, serial)),
    ...splitHash(fnv1a(CONFIG_UNLOCK_TOKEN_SEED_B, serial)),
  ].slice(0, CONFIG_UNLOCK_WORDS);
};
