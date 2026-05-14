import { LogType, ILogEntryBase } from "./state";
import { addBuffered } from "./actions";
import { convertToHexString, ensureString } from "../../../util";

export interface ILogEntryOsc extends ILogEntryBase {
  type: LogType.Osc;
  address: string;
  typeTags: string;
  args: Array<number | string>;
  payloadHex: string;
  payloadDec: string;
}

interface OscParams {
  data: Uint8Array;
}

const alignment = 4;

const readOscString = (
  data: Uint8Array,
  offset: number,
): { value: string; offset: number } | null => {
  const start = offset;

  while (offset < data.length && data[offset] !== 0) {
    offset++;
  }

  if (offset >= data.length) {
    return null;
  }

  const value = new TextDecoder().decode(data.slice(start, offset));
  offset++;

  while (offset % alignment) {
    offset++;
  }

  if (offset > data.length) {
    return null;
  }

  return { value, offset };
};

const readInt32 = (
  data: Uint8Array,
  offset: number,
): { value: number; offset: number } | null => {
  if (offset + 4 > data.length) {
    return null;
  }

  const view = new DataView(data.buffer, data.byteOffset + offset, 4);
  return { value: view.getInt32(0, false), offset: offset + 4 };
};

const readFloat32 = (
  data: Uint8Array,
  offset: number,
): { value: number; offset: number } | null => {
  if (offset + 4 > data.length) {
    return null;
  }

  const view = new DataView(data.buffer, data.byteOffset + offset, 4);
  return { value: view.getFloat32(0, false), offset: offset + 4 };
};

const formatFloat = (value: number): string => {
  if (!Number.isFinite(value)) {
    return `${value}`;
  }

  return Number(value.toFixed(6)).toString();
};

const parseOscPacket = (
  data: Uint8Array,
): { address: string; typeTags: string; args: Array<number | string> } => {
  const addressResult = readOscString(data, 0);

  if (!addressResult) {
    return { address: "<malformed>", typeTags: "", args: [] };
  }

  if (addressResult.offset >= data.length) {
    return { address: addressResult.value, typeTags: ",", args: [] };
  }

  const typeResult = readOscString(data, addressResult.offset);

  if (!typeResult) {
    return { address: addressResult.value, typeTags: "<malformed>", args: [] };
  }

  const args: Array<number | string> = [];
  let offset = typeResult.offset;

  for (const tag of typeResult.value.slice(1)) {
    if (tag === "i") {
      const result = readInt32(data, offset);
      if (!result) {
        break;
      }

      args.push(result.value);
      offset = result.offset;
    }

    if (tag === "f") {
      const result = readFloat32(data, offset);
      if (!result) {
        break;
      }

      args.push(formatFloat(result.value));
      offset = result.offset;
    }

    if (tag === "s") {
      const result = readOscString(data, offset);
      if (!result) {
        break;
      }

      args.push(result.value);
      offset = result.offset;
    }
  }

  return { address: addressResult.value, typeTags: typeResult.value, args };
};

export const addOsc = (params: OscParams): void => {
  const payload = Array.from(params.data);
  const parsed = parseOscPacket(params.data);

  addBuffered({
    type: LogType.Osc,
    ...parsed,
    payloadHex: ensureString(convertToHexString(payload)),
    payloadDec: ensureString(payload),
  });
};
