export const openDeckManufacturerId = [0, 83, 67]; // Hex [00 53 43]

export enum MessageStatus {
  Request = 0,
  Response = 1,
}

export enum Wish {
  Get = 0,
  Set = 1,
  Backup = 2,
}

export enum Amount {
  Single = 0,
  All = 1,
}

export enum Block {
  Global = 0,
  Button = 1,
  Encoder = 2,
  Analog = 3,
  Led = 4,
  Display = 5,
}
