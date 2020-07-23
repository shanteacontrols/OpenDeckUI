import { reactive } from "vue";
import { Input, Output } from "webmidi";
import { SysExCommand } from "../../../definitions";

export enum DeviceConnectionState {
  Closed = "closed",
  Pending = "pending",
  Open = "open",
}

export interface IBusRequestConfig {
  command: SysExCommand;
  config?: any;
  handler: (data: any) => void;
}

export interface IStackedRequest extends IBusRequestConfig {
  responseCount: number;
  onFinished: () => void;
}

// State

export type IDeviceState = {
  inputId: string;
  input: Input;
  output: Output;
  connectionState: DeviceConnectionState;
  connectionPromise?: Promise<any>;
  valueSize: number;
  valuesPerMessageRequest: number;
  boardName: string;
  firmwareVersion: string;
  buttons: number;
  encoders: number;
  analogInputs: number;
  LEDs: number;
  showMsbControls: boolean;
};

// State

export const defaultState: IDeviceState = {
  inputId: (null as unknown) as string,
  input: (null as unknown) as Input,
  output: (null as unknown) as Output,
  connectionState: (null as unknown) as DeviceConnectionState,
  connectionPromise: (null as unknown) as Promise<any>,
  valueSize: (null as unknown) as number,
  valuesPerMessageRequest: (null as unknown) as number,
  boardName: (null as unknown) as string,
  firmwareVersion: (null as unknown) as string,
  buttons: 0,
  encoders: 0,
  analogInputs: 0,
  LEDs: 0,
  showMsbControls: false,
};

export const state = reactive(defaultState);
