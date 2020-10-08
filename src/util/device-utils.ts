// Hex conversion

export const hexToDec = (val: string): number => parseInt(val, 16);

export const convertToHex = (value: number | number[]): string | string[] => {
  return Array.isArray(value)
    ? value.map((val: number) => val.toString(16))
    : value.toString(16);
};

export const convertToHexString = (value: number | number[]): string => {
  return Array.isArray(value)
    ? value.map((val: number) => val.toString(16)).join(", ")
    : value.toString(16);
};

// Byte conversion

export const convertDataValuesToSingleByte = (values: number[]): number[] => {
  if (values.length % 2 !== 0) {
    throw new Error("CANNOT DECODE 2 BYTE VALUE: UNEVEN DATA VALUE LENGTH");
  }

  const converted: number[] = [];

  for (let index = 0; index < values.length / 2; index++) {
    const pos = index * 2;
    converted.push(mergeTo14bit(values[pos], values[pos + 1]));
  }

  return converted;
};

const mergeTo14bit = (high: number, low: number): void => {
  if (high & 0x01) {
    low |= 1 << 7;
  } else {
    low &= ~(1 << 7);
  }

  high >>= 1;

  let joined = high;

  joined <<= 8;
  joined |= low;

  return joined;
};

export const convertValueToDoubleByte = (value: number): number[] => {
  let newHigh = (value >> 8) & 0xff;
  let newLow = value & 0xff;

  newHigh = (newHigh << 1) & 0x7f;

  if ((newLow >> 7) & 0x01) {
    newHigh |= 0x01;
  } else {
    newHigh &= ~0x01;
  }

  newLow &= 0x7f;
  return [newHigh, newLow];
};

// Arrays & serialization

export const arrayEqual = (a1: number[], a2: number[]): boolean =>
  a1.length === a2.length && a1.every((value, index) => value === a2[index]);

// Date formatting

export const getDifferenceInMs = (date1: Date, date2: Date): number =>
  date1 && date2 && Math.abs(date2.getTime() - date1.getTime());

export const padZeros = (input: number): string => `0000${input}`.slice(-2);

export const formatDate = (date?: Date): string => {
  if (!date) {
    return "";
  }

  const h = date.getHours();
  const m = padZeros(date.getMinutes());
  const s = padZeros(date.getSeconds());
  const ms = date.getMilliseconds();

  return `${padZeros(h)}:${m}:${s} ${ms}`;
};

// Use a simple delay that respects a promise chain

export const delay = (ms: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// Transform object members to array

export const ObjectToArray = <T>(object: Dictionary<T>): Array<T> =>
  Object.keys(object).map((key: string) => object[key]);
