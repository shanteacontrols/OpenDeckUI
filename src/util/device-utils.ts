// Hex conversion

export const hexToDec = (val: string): number => parseInt(val, 16);

export const convertToHex = (value: number | number[]): string | string[] => {
  return Array.isArray(value)
    ? value.map((val: number) => val.toString(16))
    : value.toString(16);
};

// Byte conversion

export const convertDataValuesToSingleByte = (values: number[]): number[] => {
  const convertedValues: number[] = [];

  for (let index = 0; index < values.length / 2; index++) {
    const pos = index * 2;
    convertedValues.push(values[pos] + values[pos + 1]);
  }

  return convertedValues;
};

// Arrays & serialization

export const arrayEqual = (a1: number[], a2: number[]): boolean =>
  a1.length === a2.length && a1.every((value, index) => value === a2[index]);

// Date formatting

export const getDifferenceInMs = (date1: Date, date2: Date): number =>
  Math.abs(date2.getTime() - date1.getTime());

export const padZeros = (input: number): string => `0000${input}`.slice(-2);

export const formatDate = (date?: Date): string => {
  if (!date) {
    return "";
  }

  const hours = date.getHours();
  const mins = padZeros(date.getMinutes());
  const seconds = padZeros(date.getSeconds());
  const amPm = hours < 12 ? "AM" : "PM";

  return `${padZeros(hours)}:${mins}:${seconds} ${amPm}`;
};
