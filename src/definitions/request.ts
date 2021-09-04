import {
  MessageStatus,
  Wish,
  Amount,
  RequestType,
  IRequestDefinition,
  IBlockDefinition,
  ISectionDefinition,
  SectionType,
} from "./interface";
import { BlockMap } from "./block";
import { IRequestConfig, IDeviceState } from "./device";
import {
  convertValueToDoubleByte,
  convertDataValuesToSingleByte,
} from "../util";

export enum Request {
  // Predefined
  CloseConnection = "CloseConnection",
  Handshake = "Handshake",
  GetValueSize = "GetValueSize",
  GetValuesPerMessage = "GetValuesPerMessage",
  // Custom
  GetFirmwareVersion = "GetFirmwareVersion",
  IdentifyBoard = "IdentifyBoard",
  GetFirmwareVersionAndHardwareUid = "GetFirmwareVersionAndHardwareUid",
  GetNumberOfSupportedComponents = "GetNumberOfSupportedComponents",
  GetNumberOfSupportedPresets = "GetNumberOfSupportedPresets",
  Reboot = "Reboot",
  Backup = "Backup",
  GetBootLoaderSupport = "GetBootLoaderSupport",
  BootloaderMode = "BootloaderMode",
  FactoryReset = "FactoryReset",
  GetValue = "GetValue",
  SetValue = "SetValue",
  GetSectionValues = "GetSectionValues",
  // UI Internal
  RestoreBackup = "RestoreBackup",
  FirmwareUpdate = "FirmwareUpdate",
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
    parser: (data: number[]): number => {
      // Response is either [1] in single byte protocol or
      // [0, 2] in double byte protocol
      if (data.length > 1) {
        return convertDataValuesToSingleByte(data)[0];
      }

      return data[0] || 1;
    },
  },
  [Request.GetValuesPerMessage]: {
    key: Request.GetValuesPerMessage,
    type: RequestType.Predefined,
    isConnectionInfoRequest: true,
    specialRequestId: 3,
    decodeDoubleByte: true,
    parser: (response: number[]): number => response[0],
  },

  // Custom

  [Request.GetFirmwareVersion]: {
    key: Request.GetFirmwareVersion,
    type: RequestType.Custom,
    specialRequestId: 86, // Hex: 56
    isConnectionInfoRequest: true,
    decodeDoubleByte: true,
    parser: (response: number[]): string =>
      "v" + response[0] + "." + response[1] + "." + response[2],
  },
  [Request.IdentifyBoard]: {
    key: Request.IdentifyBoard,
    type: RequestType.Custom,
    specialRequestId: 66, // Hex: 42
    decodeDoubleByte: true,
    parser: (response: number[]): number[] => response.slice(0, 4),
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
    decodeDoubleByte: true,
    parser: (response: number[]): Record<number, number> => {
      const componentCounts = {};

      Object.values(BlockMap).forEach((blockDef: IBlockDefinition) => {
        if (blockDef.componentCountResponseIndex !== undefined) {
          componentCounts[blockDef.block] =
            response[blockDef.componentCountResponseIndex];
        }
      });

      return componentCounts;
    },
  },
  [Request.GetNumberOfSupportedPresets]: {
    key: Request.GetNumberOfSupportedPresets,
    type: RequestType.Custom,
    specialRequestId: 80, // Hex: 50
    isConnectionInfoRequest: true,
    decodeDoubleByte: true,
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
    decodeDoubleByte: true,
    parser: (response: number[]): number => response[0],
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
  [Request.Backup]: {
    key: Request.Backup,
    type: RequestType.Custom,
    specialRequestId: 27, // Hex: 1B
    hasMultiPartResponse: true,
    isSystemOperation: true,
  },

  // Configuration requests

  [Request.GetValue]: {
    key: Request.GetValue,
    type: RequestType.Configuration,
    decodeDoubleByte: true,
    responseEmbedsRequest: true,
    getPayload: (config: IRequestConfig, state: IDeviceState): number[] => {
      const payload = [
        MessageStatus.Request,
        0, // msg part
        Wish.Get,
        Amount.Single,
        config.block,
        config.section,
      ];

      if (state.valueSize === 1) {
        payload.push(config.index);
      } else {
        payload.push(
          ...convertValueToDoubleByte(config.index), // 2 byte index
          0, // new value MSB (unused, but required)
          0, // new value LSB (unused, but required)
        );
      }

      return payload;
    },
  },
  [Request.SetValue]: {
    key: Request.SetValue,
    type: RequestType.Configuration,
    decodeDoubleByte: true,
    responseEmbedsRequest: true,
    getPayload: (config: IRequestConfig, state: IDeviceState): number[] => {
      const payload = [
        MessageStatus.Request,
        0, // msg part
        Wish.Set,
        Amount.Single,
        config.block,
        config.section,
      ];

      if (state.valueSize === 1) {
        payload.push(config.index, config.value); // Two byte protocol requires value to be sent
      } else {
        payload.push(
          ...convertValueToDoubleByte(config.index), // 2 byte index
          ...convertValueToDoubleByte(config.value), // 2 byte value
        );
      }
      return payload;
    },
  },
  [Request.GetSectionValues]: {
    key: Request.GetSectionValues,
    type: RequestType.Configuration,
    decodeDoubleByte: true,
    responseEmbedsRequest: true,
    hasMultiPartResponse: true,
    getPayload: (config: IRequestConfig, state: IDeviceState): number[] => {
      const payload = [
        MessageStatus.Request,
        126, // one extra message containing the copy of the original request will be sent with the status byte ACK
        Wish.Get,
        Amount.All,
        config.block,
        config.section,
      ];

      if (state.valueSize === 1) {
        payload.push(0);
      } else {
        payload.push(
          0, // 2 byte index
          0, // 2 byte index
          0, // new value MSB (unused, but required)
          0, // new value LSB (unused, but required)
        );
      }

      return payload;
    },
  },

  // Internal request types, not sent to the board

  [Request.RestoreBackup]: {
    key: Request.RestoreBackup,
    type: RequestType.Custom,
    isSystemOperation: true,
  },
  [Request.FirmwareUpdate]: {
    key: Request.FirmwareUpdate,
    type: RequestType.Custom,
    isSystemOperation: true,
    expectsNoResponse: true,
  },
};

export const findSectionDefinitionByConfig = (
  config: IRequestConfig,
): ISectionDefinition | undefined => {
  const blockDef = BlockMap[config.block];
  if (!blockDef) {
    throw new Error(`Missing block definition for block "${config.block}"`);
  }

  const matchSection = (def: ISectionDefinition) =>
    def.section === config.section;
  const isSettingType = (def: ISectionDefinition) =>
    def.type === SectionType.Setting;
  const matchesSettingIndex = (def: ISectionSetting) =>
    def.settingIndex === config.index;

  return Object.values(blockDef.sections).find(
    (def) =>
      matchSection(def) &&
      (!isSettingType(def) || matchesSettingIndex(def as ISectionSetting)),
  );
};
