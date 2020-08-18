import { reactive } from "vue";
import { Input, Output } from "webmidi";
import { Request } from "../../../definitions";

export enum DeviceConnectionState {
  Closed = "closed",
  Pending = "pending",
  Open = "open",
}

export interface IRequestConfig {
  block: number;
  index: number;
  section: number;
  value?: number | number[];
}

export interface IBusRequestConfig {
  command: Request;
  config?: IRequestConfig;
  handler: (data: any) => void;
}

export interface IStackedRequest extends IBusRequestConfig {
  responseCount: number;
  onFinished: () => void;
}

// State

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
  buttons: number;
  encoders: number;
  analogInputs: number;
  LEDs: number;
};

// State

export const defaultState: IDeviceState = {
  outputId: (null as unknown) as string,
  input: (null as unknown) as Input,
  output: (null as unknown) as Output,
  connectionState: (null as unknown) as DeviceConnectionState,
  connectionPromise: (null as unknown) as Promise<any>,
  valueSize: (null as unknown) as number,
  valuesPerMessageRequest: (null as unknown) as number,
  boardName: (null as unknown) as string,
  firmwareFileLocation: (null as unknown) as string,
  firmwareVersion: (null as unknown) as string,
  bootLoaderSupport: false,
  activePreset: (null as unknown) as number,
  supportedPresetsCount: (null as unknown) as number,
  buttons: 0,
  encoders: 0,
  analogInputs: 0,
  LEDs: 0,
  touchscreens: 0,
};

export const state = reactive(defaultState);
