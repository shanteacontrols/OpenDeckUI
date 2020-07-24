import { MessageStatus, Wish, Amount } from ".";
import { arrayEqual } from "../util";

export const openDeckManufacturerId = [0, 83, 67]; // Hex [00 53 43]

export enum RequestType {
  Predefined = "predefined",
  Custom = "custom",
  Configuration = "configuration",
}

const Boards = [
  {
    name: "Arduino Leonardo",
    id: [24, 58, 76, 24],
  },
  {
    name: "Arduino Mega",
    id: [9, 16, 0, 18],
  },
  {
    name: "Arduino Pro Micro",
    id: [27, 107, 33, 98],
  },
  {
    name: "Arduino Uno",
    id: [105, 67, 14, 63],
  },
  {
    name: "Teensy++ 2.0",
    id: [112, 11, 64, 30],
  },
  {
    name: "DubFocus",
    id: [57, 92, 109, 93],
  },
  {
    name: "Bergamot",
    id: [48, 106, 107, 21],
  },
  {
    name: "STM32F4 Discovery",
    id: [43, 19, 68, 122],
  },
  {
    name: "Jamiel",
    id: [125, 12, 108, 80],
  },
  {
    name: "Jose",
    id: [3, 109, 68, 30],
  },
  {
    name: "Cardamom",
    id: [99, 82, 54, 48],
  },
];

export interface IRequestDefinition {
  type: RequestType;
  specialRequestId?: number;
  // Flag for priority messages needed for preparing data communication
  isConnectionInfoRequest?: boolean;
  // predefinedBytes?: {
  //   messageStatus: MessageStatus;
  //   messagePart: 0; // @TODO: calculate on the fly
  //   wish: Wish;
  //   amount: Amount;
  // };
  getPayload?: (config?: any) => number[];
  parser?: (response: number[]) => any;
}

export interface IDeviceComponentCounts {
  buttons: number;
  encoders: number;
  analogInputs: number;
  LEDs: number;
}

export enum SysExCommand {
  // Predefined
  Handshake = "Handshake",
  GetValueSize = "GetValueSize",
  GetValuesPerMessage = "GetValuesPerMessage",
  // Custom
  GetFirmwareVersion = "GetFirmwareVersion",
  GetHardwareUid = "GetHardwareUid",
  GetFirmwareVersionAndHardwareUid = "GetFirmwareVersionAndHardwareUid",
  GetNumberOfSupportedComponents = "GetNumberOfSupportedComponents",
  GetNumberOfSupportedPresets = "GetNumberOfSupportedPresets",
  Reboot = "Reboot",
  GetBootLoaderSupport = "GetBootLoaderSupport",
  BootloaderMode = "BootloaderMode",
  FactoryReset = "FactoryReset",
  DisableProcessing = "DisableProcessing",
  EnableProcessing = "EnableProcessing",
  // Configuration
  GetComponentConfig = "GetComponentConfig",
  SetComponentConfig = "SetComponentConfig",
}

export const requestDefinitions: Dictionary<IRequestDefinition> = {
  // Predefined

  [SysExCommand.Handshake]: {
    type: RequestType.Predefined,
    specialRequestId: 1,
    isConnectionInfoRequest: true,
  },
  [SysExCommand.GetValueSize]: {
    type: RequestType.Predefined,
    isConnectionInfoRequest: true,
    specialRequestId: 2,
    parser: (response: number[]): number => response[0],
  },
  [SysExCommand.GetValuesPerMessage]: {
    type: RequestType.Predefined,
    isConnectionInfoRequest: true,
    specialRequestId: 3,
    parser: (response: number[]): number[] => response,
  },

  // Custom

  [SysExCommand.GetFirmwareVersion]: {
    type: RequestType.Custom,
    specialRequestId: 86, // Hex: 56
    isConnectionInfoRequest: true,
    parser: (response: number[]): string =>
      "v" + response[0] + "." + response[1] + "." + response[2],
  },
  [SysExCommand.GetHardwareUid]: {
    type: RequestType.Custom,
    specialRequestId: 66, // Hex: 42
    parser: (value: number[]): string => {
      const board = Boards.find((b: any) => arrayEqual(b.id, value));
      return board ? board.name : "UNKNOWN BOARD";
    },
  },
  [SysExCommand.GetFirmwareVersionAndHardwareUid]: {
    type: RequestType.Custom,
    isConnectionInfoRequest: true,
    specialRequestId: 67, // Hex: 43
  },
  [SysExCommand.GetNumberOfSupportedComponents]: {
    type: RequestType.Custom,
    specialRequestId: 77, // Hex: 4D
    parser: (response: number[]): IDeviceComponentCounts => ({
      buttons: response[0],
      encoders: response[1],
      analogInputs: response[2],
      LEDs: response[3],
    }),
  },
  [SysExCommand.GetNumberOfSupportedPresets]: {
    type: RequestType.Custom,
    specialRequestId: 80, // Hex: 50
  },
  [SysExCommand.Reboot]: {
    type: RequestType.Custom,
    specialRequestId: 127, // Hex: 7F
  },
  [SysExCommand.GetBootLoaderSupport]: {
    type: RequestType.Custom,
    specialRequestId: 81, // Hex: 51
  },
  [SysExCommand.BootloaderMode]: {
    type: RequestType.Custom,
    specialRequestId: 85, // Hex: 55
  },
  [SysExCommand.FactoryReset]: {
    type: RequestType.Custom,
    specialRequestId: 68, // Hex: 44
  },
  [SysExCommand.DisableProcessing]: {
    type: RequestType.Custom,
    specialRequestId: 100, // Hex: 64
  },
  [SysExCommand.EnableProcessing]: {
    type: RequestType.Custom,
    specialRequestId: 101, // Hex: 65
  },

  // Configuration requests

  [SysExCommand.GetComponentConfig]: {
    type: RequestType.Configuration,
    // predefinedBytes: {
    //   messageStatus: MessageStatus.Request,
    //   messagePart: 0, // @TODO: calculate on the fly
    //   wish: Wish.Get,
    //   amount: Amount.Single,
    // },
    getPayload: (config: {
      block: number;
      section: number;
      index: number;
    }): number[] => [
      MessageStatus.Request,
      0, // msg part
      Wish.Get,
      Amount.Single,
      config.block,
      config.section,
      config.index,
    ],
  },
  [SysExCommand.SetComponentConfig]: {
    type: RequestType.Configuration,
    // predefinedBytes: {
    //   messageStatus: MessageStatus.Request,
    //   messagePart: 0, // @TODO: calculate on the fly
    //   wish: Wish.Set,
    //   amount: Amount.Single,
    // },
    getPayload: (config: {
      block: number;
      section: number;
      index: number;
      value: number;
    }): number[] => [
      MessageStatus.Request,
      0, // msg part
      Wish.Set,
      Amount.Single,
      config.block,
      config.section,
      config.index,
      config.value,
    ],
  },
};
