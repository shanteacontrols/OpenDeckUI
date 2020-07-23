import { MessageStatus, Wish, Amount } from ".";
import { arrayEqual } from "../util";

export const openDeckManufacturerId = [0, 83, 67];

export enum RequestType {
  Predefined = "predefined",
  Custom = "custom",
  SetSingleConfig = "setSingleConfig",
  GetSingleConfig = "getSingleConfig",
  Status = "status",
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

interface IRequestDefinition {
  type: RequestType;
  dataPosition?: number;
  expectedResponseCount?: number;
  parser?: (response: number[]) => any;
  getPayload: (config?: any) => number[];
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
  // Configuration
  GetComponentConfig = "GetComponentConfig",
  SetComponentConfig = "SetComponentConfig",
}

export const requestDefinitions: Dictionary<IRequestDefinition> = {
  // Predefined

  [SysExCommand.Handshake]: {
    type: RequestType.Predefined,
    getPayload: (): number[] => [0, 0, 1],
  },
  [SysExCommand.GetValueSize]: {
    type: RequestType.Predefined,
    getPayload: (): number[] => [0, 0, 2],
    parser: (response: number[]): number => response[0],
  },
  [SysExCommand.GetValuesPerMessage]: {
    type: RequestType.Predefined,
    getPayload: (): number[] => [0, 0, 3],
    parser: (response: number[]): number[] => response,
  },

  // Custom

  [SysExCommand.GetFirmwareVersion]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 86],
    parser: (response: number[]): string =>
      "v" + response[0] + "." + response[1] + "." + response[2],
  },
  [SysExCommand.GetHardwareUid]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 66],
    parser: (value: number[]): string => {
      const board = Boards.find((b: any) => arrayEqual(b.id, value));
      return board ? board.name : "UNKNOWN BOARD";
    },
  },
  [SysExCommand.GetFirmwareVersionAndHardwareUid]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 67],
  },
  [SysExCommand.GetNumberOfSupportedComponents]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 77],
    parser: (response: number[]): IDeviceComponentCounts => ({
      buttons: response[0],
      encoders: response[1],
      analogInputs: response[2],
      LEDs: response[3],
    }),
  },
  [SysExCommand.GetNumberOfSupportedPresets]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 80],
  },
  [SysExCommand.Reboot]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 127],
  },
  [SysExCommand.GetBootLoaderSupport]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 81],
  },
  [SysExCommand.BootloaderMode]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 55],
  },
  [SysExCommand.FactoryReset]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 68],
  },
  [SysExCommand.DisableProcessing]: {
    type: RequestType.Custom,
    getPayload: (): number[] => [0, 0, 100],
  },

  // Configuration requests

  [SysExCommand.GetComponentConfig]: {
    type: RequestType.GetSingleConfig,
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
    type: RequestType.SetSingleConfig,
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
