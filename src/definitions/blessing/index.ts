import { logger } from "../../util";
import { blessedSerials, IBlessedSerialEntry } from "./blessed-serials";

export const BLESSING_PAYLOAD_VERSION = 1;
export const BLESSING_PAYLOAD_PREFIX = "opendeck-blessing-v1";
export const BLESSING_CONFIG_FEATURE = "config";
export const BLESSING_ACCESS_CONTACT_MESSAGE =
  "Contact Shantea Controls for access: shanteacontrols@shanteacontrols.com";

export const BLESSING_PUBLIC_KEY_ALGORITHM = "Ed25519";

export const BLESSING_PUBLIC_KEY_SPKI_BASE64 =
  "MCowBQYDK2VwAyEAzGQrFrS7kRNf3NaS1YWtaNcF/tetgutSQYeBZhpJDc0=";

export const BLESSING_PUBLIC_KEY_PEM = [
  "-----BEGIN PUBLIC KEY-----",
  BLESSING_PUBLIC_KEY_SPKI_BASE64,
  "-----END PUBLIC KEY-----",
].join("\n");

export interface IBlessingResult {
  valid: boolean;
  features: string[];
  entry?: IBlessedSerialEntry;
  error?: string;
}

const hexToBytes = (hex: string): Uint8Array => {
  const normalized = hex.replace(/[^0-9a-f]/gi, "");
  const bytes = normalized.match(/.{1,2}/g) || [];

  return new Uint8Array(bytes.map((byte) => parseInt(byte, 16)));
};

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

const base64ToBytes = (value: string): Uint8Array => {
  const binary = atob(value);

  return new Uint8Array(
    Array.from(binary).map((character) => character.charCodeAt(0)),
  );
};

const getSubtleCrypto = (): SubtleCrypto | null => {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    return null;
  }

  return crypto.subtle;
};

const buildBlessingPayload = (entry: IBlessedSerialEntry): string =>
  `${BLESSING_PAYLOAD_PREFIX}|version=${entry.version}|serialHash=${entry.serialHash}|features=${entry.features}`;

const parseFeatures = (features: string): string[] =>
  features
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean);

export const hashBlessingSerial = async (
  serialNumber: string,
): Promise<string> => {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto is not available");
  }

  const hash = await subtle.digest("SHA-256", hexToBytes(serialNumber));

  return bytesToHex(new Uint8Array(hash));
};

export const verifyBlessing = async (
  serialNumber: string,
): Promise<IBlessingResult> => {
  try {
    const subtle = getSubtleCrypto();
    if (!subtle) {
      return {
        valid: false,
        features: [],
        error: "WebCrypto is not available",
      };
    }

    const serialHash = await hashBlessingSerial(serialNumber);
    const entry = blessedSerials.find(
      (blessedSerial) =>
        blessedSerial.version === BLESSING_PAYLOAD_VERSION &&
        blessedSerial.serialHash.toUpperCase() === serialHash,
    );

    if (!entry) {
      return {
        valid: false,
        features: [],
        error: BLESSING_ACCESS_CONTACT_MESSAGE,
      };
    }

    const key = await subtle.importKey(
      "spki",
      base64ToBytes(BLESSING_PUBLIC_KEY_SPKI_BASE64),
      BLESSING_PUBLIC_KEY_ALGORITHM,
      false,
      ["verify"],
    );

    const valid = await subtle.verify(
      BLESSING_PUBLIC_KEY_ALGORITHM,
      key,
      base64ToBytes(entry.signature),
      new TextEncoder().encode(buildBlessingPayload(entry)),
    );

    return {
      valid,
      entry,
      features: valid ? parseFeatures(entry.features) : [],
      error: valid ? undefined : "Blessing signature is invalid",
    };
  } catch (error) {
    logger.warn("Failed to verify device blessing", error);

    return {
      valid: false,
      features: [],
      error: error && error.message ? error.message : String(error),
    };
  }
};

export { blessedSerials };
export type { IBlessedSerialEntry };
