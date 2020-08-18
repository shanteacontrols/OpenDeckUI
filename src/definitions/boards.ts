export interface IBoardDefinition {
  name: string;
  id: number[];
  oldId?: number[];
  firmwareFileLocation?: string;
}

export const Boards: IBoardDefinition[] = [
  {
    name: "Arduino Leonardo",
    id: [24, 58, 76, 24],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "Arduino Mega",
    id: [9, 16, 0, 18],
    oldId: [],
    firmwareFileLocation: "bin/compiled/fw/avr/atmega2560/mega2560.hex",
  },
  {
    name: "Arduino Pro Micro",
    id: [27, 107, 33, 98],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "Arduino Uno",
    id: [105, 67, 14, 63],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "Teensy++ 2.0",
    id: [112, 11, 64, 30],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "DubFocus",
    id: [57, 92, 109, 93],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "Bergamot",
    id: [48, 106, 107, 21],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "STM32F4 Discovery",
    id: [43, 19, 68, 122],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "Jamiel",
    id: [125, 12, 108, 80],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "Jose",
    id: [3, 109, 68, 30],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "Cardamom",
    id: [99, 82, 54, 48],
    oldId: [],
    firmwareFileLocation: null,
  },
];
