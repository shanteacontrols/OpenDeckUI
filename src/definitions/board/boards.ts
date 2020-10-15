import { IBoardDefinition } from "../interface";

export const Boards: IBoardDefinition[] = [
  {
    name: "Arduino Leonardo",
    id: [1, 58, 76, 24],
    oldId: [1, 52, 50, 124],
    firmwareFileLocation: null,
  },
  {
    name: "Arduino Mega",
    id: [9, 16, 0, 18],
    oldId: [1, 16, 0, 18],
    firmwareFileLocation: "mega2560.hex",
  },
  {
    name: "Arduino Pro Micro",
    id: [1, 107, 33, 98],
    oldId: [1, 5, 13, 73],
    firmwareFileLocation: null,
  },
  {
    name: "Arduino Uno",
    id: [1, 67, 14, 63],
    oldId: [1, 11, 120, 50],
    firmwareFileLocation: null,
  },
  {
    name: "Teensy++ 2.0",
    id: [112, 11, 64, 30],
    oldId: [1, 11, 64, 30],
    firmwareFileLocation: "teensy2pp.sysex",
  },
  {
    name: "DubFocus v1",
    id: [],
    oldId: [1, 92, 109, 93],
    firmwareFileLocation: null,
  },
  {
    name: "DubFocus 12",
    id: [125, 74, 109, 51],
    oldId: [1, 5, 75, 68],
    firmwareFileLocation: "dubfocus12.sysex",
  },
  {
    name: "DubFocus 16",
    id: [61, 70, 72, 25],
    oldId: [],
    firmwareFileLocation: "dubfocus16.sysex",
  },
  {
    name: "STM32F4 Discovery",
    id: [43, 19, 68, 122],
    oldId: [],
    firmwareFileLocation: "discovery.sysex",
  },
  {
    name: "Jamiel",
    id: [1, 12, 108, 80],
    oldId: [1, 78, 126, 38],
    firmwareFileLocation: null,
  },
  {
    name: "Cardamom",
    id: [99, 82, 54, 48],
    oldId: [],
    firmwareFileLocation: "cardamom.sysex",
  },
  {
    name: "OpenDeck v2",
    id: [122, 56, 41, 19],
    oldId: [],
    firmwareFileLocation: "opendeckv2.sysex",
  },
  {
    name: "OpenDeck v1",
    id: [1, 112, 51, 106],
    oldId: [1, 91, 42, 85],
    firmwareFileLocation: null,
  },
];

export default Boards;
