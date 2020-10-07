import { IBoardDefinition } from "../interface";

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
    firmwareFileLocation: "mega2560.hex",
  },
  {
    name: "Arduino Mega 6mux",
    id: [21, 118, 38, 40],
    oldId: [],
    firmwareFileLocation: "mega2560_6mux.sysex",
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
    firmwareFileLocation: "teensy2pp.sysex",
  },
  {
    name: "DubFocus v1",
    id: [57, 92, 109, 93],
    oldId: [],
    firmwareFileLocation: null,
  },
  {
    name: "DubFocus 12",
    id: [125, 74, 109, 51],
    oldId: [],
    firmwareFileLocation: "dubfocus12.sysex",
  },
  {
    name: "DubFocus 16",
    id: [61, 70, 72, 25],
    oldId: [],
    firmwareFileLocation: "dubfocus16.sysex",
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
    firmwareFileLocation: "discovery.sysex",
  },
  {
    name: "Jamiel",
    id: [125, 12, 108, 80],
    oldId: [],
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
];

export default Boards;
