import { reactive } from "vue";
import { Input, Output } from "webmidi";
import {
  DeviceConnectionState,
  DfuState,
  DfuTransport,
  IDeviceState,
} from "./interface";
import { ISysExTransport, SysExTransportType } from "./sysex-transport";
import { Block } from "../../interface";

// State

const unsupportedComponents = {};
const viewSettings = {};

Object.values(Block)
  .filter(Number.isInteger)
  .forEach((blockId) => {
    unsupportedComponents[blockId] = {};
    viewSettings[blockId] = {
      itemsPerPage: 16,
      currentPage: 1,
    };
  });

export interface IViewSettingState {
  viewListAsTable?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
}

export const defaultState: IDeviceState = {
  outputId: (null as unknown) as string,
  input: (null as unknown) as Input,
  output: (null as unknown) as Output,
  transport: (null as unknown) as ISysExTransport,
  transportType: (null as unknown) as SysExTransportType,
  isBootloaderMode: (null as unknown) as boolean,
  connectionState: (null as unknown) as DeviceConnectionState,
  connectionPromise: (null as unknown) as Promise<any>,
  valueSize: (null as unknown) as number,
  valuesPerMessageRequest: (null as unknown) as number,
  boardName: (null as unknown) as string,
  firmwareFileName: (null as unknown) as string,
  firmwareVersion: (null as unknown) as string,
  serialNumber: (null as unknown) as string,
  isBlessingRequired: false,
  isConfigBlessed: true,
  blessingFeatures: [],
  blessingError: (null as unknown) as string,
  activePreset: (null as unknown) as number,
  supportedPresetsCount: (null as unknown) as number,
  numberOfComponents: [] as Array<number>,
  unsupportedComponents,
  isSystemOperationRunning: false,
  systemOperationMessage: (null as unknown) as string,
  systemOperationPercentage: (null as unknown) as number,
  lastApplicationOutputName: (null as unknown) as string,
  dfuState: DfuState.Idle,
  dfuTransport: (null as unknown) as DfuTransport,
  dfuProgress: (null as unknown) as number,
  dfuStatusLog: [],
  dfuError: (null as unknown) as string,
  dfuDeviceLabel: (null as unknown) as string,
  viewSettings,
};

export const deviceState = reactive(defaultState);
