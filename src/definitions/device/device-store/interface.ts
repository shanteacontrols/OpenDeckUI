export enum DeviceConnectionState {
  Closed = "closed",
  Pending = "pending",
  Open = "open",
}

export enum ControlDisableType {
  NotSupported = "not_supported",
  MissingIndex = "missing_index",
}

export interface IRequestConfig {
  block: number;
  section: number;
  index: number;
  value?: number | number[];
}

export type IDeviceState = {
  outputId: string;
  input: Input;
  output: Output;
  isBootloaderMode: boolean;
  connectionState: DeviceConnectionState;
  connectionPromise?: Promise<any>;
  valueSize: number;
  valuesPerMessageRequest: number;
  boardName: string;
  firmwareFileName: string;
  firmwareVersion: string;
  bootLoaderSupport: boolean;
  activePreset: number;
  supportedPresetsCount: number;
  numberOfComponents: Array<number>;
  unsupportedComponents: Record<number, Record<string, ControlDisableType>>; // block, key, type
  isSystemOperationRunning: boolean;
  systemOperationPercentage: number;
  viewSettings: Record<Block, IViewSettingState>;
};
