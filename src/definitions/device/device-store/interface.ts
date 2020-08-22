export enum DeviceConnectionState {
  Closed = "closed",
  Pending = "pending",
  Open = "open",
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
  connectionState: DeviceConnectionState;
  connectionPromise?: Promise<any>;
  valueSize: number;
  valuesPerMessageRequest: number;
  boardName: string;
  firmwareFileLocation: string;
  firmwareVersion: string;
  bootLoaderSupport: boolean;
  activePreset: number;
  supportedPresetsCount: number;
  numberOfComponents: Array<number>;
};
