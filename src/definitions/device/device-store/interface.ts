export enum DeviceConnectionState {
  Closed = "closed",
  Pending = "pending",
  Open = "open",
}

export enum DfuState {
  Idle = "idle",
  RebootingToApplication = "rebooting_to_application",
  RebootingToBootloader = "rebooting_to_bootloader",
  WaitingForDfuDevice = "waiting_for_dfu_device",
  DfuReady = "dfu_ready",
  Uploading = "uploading",
  WaitingForApplication = "waiting_for_application",
  Error = "error",
}

export enum DfuTransport {
  Midi = "midi",
  WebUsb = "webusb",
}

export const webUsbDfuVirtualOutputId = "__webusb_dfu__";

export enum ControlDisableType {
  NotSupported = "not_supported",
  MissingIndex = "missing_index",
  UartInterfaceAllocated = "uart_interface_allocated",
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
  lastApplicationOutputName: string;
  dfuState: DfuState;
  dfuTransport: DfuTransport;
  dfuProgress: number;
  dfuStatusLog: Array<string>;
  dfuError: string;
  dfuDeviceLabel: string;
  viewSettings: Record<Block, IViewSettingState>;
};
