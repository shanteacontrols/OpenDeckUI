import {
  MessageStatus,
  Wish,
  Amount,
  Block,
  RequestType,
  IRequestDefinition,
  ISectionDefinition,
} from "./interface";
import { IRequestConfig, IDeviceState, IQueuedRequest } from "./device";
import {
  arrayEqual,
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
    parser: (response: number[]): number => {
      // Response is either [1] in single byte protocol or
      // [0, 2] in double byte protocol
      if (response.length > 1) {
        return convertDataValuesToSingleByte(response.slice(1))[0];
      }

      return response[0] || 1;
    },
  },
  [Request.GetValuesPerMessage]: {
    key: Request.GetValuesPerMessage,
    type: RequestType.Predefined,
    isConnectionInfoRequest: true,
    specialRequestId: 3,
    decode: convertDataValuesToSingleByte,
    parser: (response: number[]): number => response[0],
  },

  // Custom

  [Request.GetFirmwareVersion]: {
    key: Request.GetFirmwareVersion,
    type: RequestType.Custom,
    specialRequestId: 86, // Hex: 56
    isConnectionInfoRequest: true,
    decode: convertDataValuesToSingleByte,
    parser: (response: number[]): string =>
      "v" + response[0] + "." + response[1] + "." + response[2],
  },
  [Request.IdentifyBoard]: {
    key: Request.IdentifyBoard,
    type: RequestType.Custom,
    specialRequestId: 66, // Hex: 42
    decode: convertDataValuesToSingleByte,
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
    decode: convertDataValuesToSingleByte,
    parser: (response: number[]): any => ({
      [Block.Button]: response[0],
      [Block.Encoder]: response[1],
      [Block.Analog]: response[2],
      [Block.Led]: response[3],
    }),
  },
  [Request.GetNumberOfSupportedPresets]: {
    key: Request.GetNumberOfSupportedPresets,
    type: RequestType.Custom,
    specialRequestId: 80, // Hex: 50
    isConnectionInfoRequest: true,
    decode: convertDataValuesToSingleByte,
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
    decode: convertDataValuesToSingleByte,
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
    decode: (response: number[], request: IQueuedRequest): number[] => {
      const expectedEmbed = [1, ...request.payload.slice(1)];
      const foundEmbed = response.slice(0, expectedEmbed.length);
      const data = response.slice(expectedEmbed.length);

      if (!arrayEqual(expectedEmbed, foundEmbed)) {
        throw new Error("EMBEDDED RESPONSE MISMATCH");
      }

      return convertDataValuesToSingleByte(data);
    },
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
        payload.push(config.index); // Two byte protocol requires value to be sent
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
    decode: (response: number[]): number[] =>
      convertDataValuesToSingleByte(response.slice(-2)),
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
};

export const findRequestDefinitionByConfig = (
  config: IRequestConfig,
): ISectionDefinition | undefined => {
  const definitions = BlockMap[config.block];
  if (!definitions) {
    return;
  }

  const matchSection = (def: ISectionDefinition) =>
    def.section === config.section;
  const isSettingType = (def: ISectionDefinition) =>
    def.type === SectionType.Setting;
  const matchesSettingIndex = (def: ISectionSetting) =>
    def.settingIndex === config.index;
  return Object.values(definitions).find(
    (def) =>
      matchSection(def) &&
      (!isSettingType(def) || matchesSettingIndex(def as ISectionSetting)),
  );
};
