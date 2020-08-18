import { MessageStatus, Wish, Amount } from ".";
import { IRequestConfig } from "../store/modules/device/state";

export enum RequestType {
  Predefined = "predefined",
  Custom = "custom",
  Configuration = "configuration",
}

export interface IRequestDefinition {
  type: RequestType;
  key: Request;
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

export enum Request {
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

  [Request.Handshake]: {
    key: Request.Handshake,
    type: RequestType.Predefined,
    specialRequestId: 1,
    isConnectionInfoRequest: true,
  },
  [Request.CloseConnection]: {
    key: Request.CloseConnection,
    type: RequestType.Predefined,
    specialRequestId: 0,
    expectsNoResponse: true,
    isConnectionInfoRequest: true,
  },
  [Request.GetValueSize]: {
    key: Request.GetValueSize,
    type: RequestType.Predefined,
    isConnectionInfoRequest: true,
    specialRequestId: 2,
    parser: (response: number[]): number => response[0],
  },
  [Request.GetValuesPerMessage]: {
    key: Request.GetValuesPerMessage,
    type: RequestType.Predefined,
    isConnectionInfoRequest: true,
    specialRequestId: 3,
    parser: (response: number[]): number[] => response,
  },

  // Custom

  [Request.GetFirmwareVersion]: {
    key: Request.GetFirmwareVersion,
    type: RequestType.Custom,
    specialRequestId: 86, // Hex: 56
    isConnectionInfoRequest: true,
    parser: (response: number[]): string =>
      "v" + response[0] + "." + response[1] + "." + response[2],
  },
  [Request.GetHardwareUid]: {
    key: Request.GetHardwareUid,
    type: RequestType.Custom,
    specialRequestId: 66, // Hex: 42
  },
  [Request.GetFirmwareVersionAndHardwareUid]: {
    key: Request.GetFirmwareVersionAndHardwareUid,
    type: RequestType.Custom,
    isConnectionInfoRequest: true,
    specialRequestId: 67, // Hex: 43
  },
  [Request.GetNumberOfSupportedComponents]: {
    key: Request.GetNumberOfSupportedComponents,
    type: RequestType.Custom,
    specialRequestId: 77, // Hex: 4D
    parser: (response: number[]): IDeviceComponentCounts => ({
      buttons: response[0],
      encoders: response[1],
      analogInputs: response[2],
      LEDs: response[3],
    }),
  },
  [Request.GetNumberOfSupportedPresets]: {
    key: Request.GetNumberOfSupportedPresets,
    type: RequestType.Custom,
    specialRequestId: 80, // Hex: 50
    isConnectionInfoRequest: true,
    parser: (response: number[]): number => response[0],
  },
  [Request.Reboot]: {
    key: Request.Reboot,
    type: RequestType.Custom,
    isConnectionInfoRequest: true,
    expectsNoResponse: true,
    specialRequestId: 127, // Hex: 7F
  },
  [Request.GetBootLoaderSupport]: {
    key: Request.GetBootLoaderSupport,
    type: RequestType.Custom,
    specialRequestId: 81, // Hex: 51
  },
  [Request.BootloaderMode]: {
    key: Request.BootloaderMode,
    type: RequestType.Custom,
    isConnectionInfoRequest: true,
    expectsNoResponse: true,
    specialRequestId: 85, // Hex: 55
  },
  [Request.FactoryReset]: {
    key: Request.FactoryReset,
    type: RequestType.Custom,
    isConnectionInfoRequest: true,
    expectsNoResponse: true,
    specialRequestId: 68, // Hex: 44
  },
  [Request.DisableProcessing]: {
    key: Request.DisableProcessing,
    type: RequestType.Custom,
    specialRequestId: 100, // Hex: 64
  },
  [Request.EnableProcessing]: {
    key: Request.EnableProcessing,
    type: RequestType.Custom,
    specialRequestId: 101, // Hex: 65
  },

  // Configuration requests

  [Request.GetValue]: {
    key: Request.GetValue,
    type: RequestType.Configuration,
    getPayload: (config: IRequestConfig): number[] => [
      MessageStatus.Request,
      0, // msg part
      Wish.Get,
      Amount.Single,
      config.block,
      config.section,
      config.index,
    ],
  },
  [Request.SetValue]: {
    key: Request.SetValue,
    type: RequestType.Configuration,
    getPayload: (config: IRequestConfig): number[] => [
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
