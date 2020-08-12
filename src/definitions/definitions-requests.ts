import { MessageStatus, Wish, Amount } from ".";

export const openDeckManufacturerId = [0, 83, 67]; // Hex [00 53 43]

export enum RequestKind {
  Predefined = "predefined",
  Custom = "custom",
  Configuration = "configuration",
}

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

export interface IRequestDefinition {
  type: RequestKind;
  key: SysExCommand;
  specialRequestId?: number;
  // Flag for priority messages needed for preparing data communication
  isConnectionInfoRequest?: boolean;
  expectsNoResponse?: boolean;
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
  CloseConnection = "CloseConnection",
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
  GetValue = "GetValue",
  SetValue = "SetValue",
}

export const requestDefinitions: Dictionary<IRequestDefinition> = {
  // Predefined

  [SysExCommand.Handshake]: {
    key: SysExCommand.Handshake,
    type: RequestKind.Predefined,
    specialRequestId: 1,
    isConnectionInfoRequest: true,
  },
  [SysExCommand.CloseConnection]: {
    key: SysExCommand.CloseConnection,
    type: RequestKind.Predefined,
    specialRequestId: 0,
    expectsNoResponse: true,
    isConnectionInfoRequest: true,
  },
  [SysExCommand.GetValueSize]: {
    key: SysExCommand.GetValueSize,
    type: RequestKind.Predefined,
    isConnectionInfoRequest: true,
    specialRequestId: 2,
    parser: (response: number[]): number => response[0],
  },
  [SysExCommand.GetValuesPerMessage]: {
    key: SysExCommand.GetValuesPerMessage,
    type: RequestKind.Predefined,
    isConnectionInfoRequest: true,
    specialRequestId: 3,
    parser: (response: number[]): number[] => response,
  },

  // Custom

  [SysExCommand.GetFirmwareVersion]: {
    key: SysExCommand.GetFirmwareVersion,
    type: RequestKind.Custom,
    specialRequestId: 86, // Hex: 56
    isConnectionInfoRequest: true,
    parser: (response: number[]): string =>
      "v" + response[0] + "." + response[1] + "." + response[2],
  },
  [SysExCommand.GetHardwareUid]: {
    key: SysExCommand.GetHardwareUid,
    type: RequestKind.Custom,
    specialRequestId: 66, // Hex: 42
  },
  [SysExCommand.GetFirmwareVersionAndHardwareUid]: {
    key: SysExCommand.GetFirmwareVersionAndHardwareUid,
    type: RequestKind.Custom,
    isConnectionInfoRequest: true,
    specialRequestId: 67, // Hex: 43
  },
  [SysExCommand.GetNumberOfSupportedComponents]: {
    key: SysExCommand.GetNumberOfSupportedComponents,
    type: RequestKind.Custom,
    specialRequestId: 77, // Hex: 4D
    parser: (response: number[]): IDeviceComponentCounts => ({
      buttons: response[0],
      encoders: response[1],
      analogInputs: response[2],
      LEDs: response[3],
    }),
  },
  [SysExCommand.GetNumberOfSupportedPresets]: {
    key: SysExCommand.GetNumberOfSupportedPresets,
    type: RequestKind.Custom,
    specialRequestId: 80, // Hex: 50
    isConnectionInfoRequest: true,
    parser: (response: number[]): number => response[0],
  },
  [SysExCommand.Reboot]: {
    key: SysExCommand.Reboot,
    type: RequestKind.Custom,
    isConnectionInfoRequest: true,
    expectsNoResponse: true,
    specialRequestId: 127, // Hex: 7F
  },
  [SysExCommand.GetBootLoaderSupport]: {
    key: SysExCommand.GetBootLoaderSupport,
    type: RequestKind.Custom,
    specialRequestId: 81, // Hex: 51
  },
  [SysExCommand.BootloaderMode]: {
    key: SysExCommand.BootloaderMode,
    type: RequestKind.Custom,
    isConnectionInfoRequest: true,
    expectsNoResponse: true,
    specialRequestId: 85, // Hex: 55
  },
  [SysExCommand.FactoryReset]: {
    key: SysExCommand.FactoryReset,
    type: RequestKind.Custom,
    isConnectionInfoRequest: true,
    expectsNoResponse: true,
    specialRequestId: 68, // Hex: 44
  },
  [SysExCommand.DisableProcessing]: {
    key: SysExCommand.DisableProcessing,
    type: RequestKind.Custom,
    specialRequestId: 100, // Hex: 64
  },
  [SysExCommand.EnableProcessing]: {
    key: SysExCommand.EnableProcessing,
    type: RequestKind.Custom,
    specialRequestId: 101, // Hex: 65
  },

  // Configuration requests

  [SysExCommand.GetValue]: {
    key: SysExCommand.GetValue,
    type: RequestKind.Configuration,
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
  [SysExCommand.SetValue]: {
    key: SysExCommand.SetValue,
    type: RequestKind.Configuration,
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
