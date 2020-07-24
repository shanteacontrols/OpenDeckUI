import { ref } from "vue";
import { Block } from "../../../definitions";
import { logger } from "../../../util";

export enum LogType {
  Info = "info",
  Midi = "midi",
  Request = "request",
  Error = "error",
}

export type MidiEventType =
  | "noteon"
  | "noteoff"
  | "controlchange"
  | "programchange"
  | "pitchbend"
  | "clock"
  | "start"
  | "continue"
  | "stop"
  | "activesensing"
  | "reset";

interface ILogEntryBase {
  time: Date;
  type: LogType;
}

export interface ILogEntryRequest extends ILogEntryBase {
  type: LogType.Request;
  id: number;
}

export interface ILogEntryInfo extends ILogEntryBase {
  type: LogType.Info;
  block: Block;
  index: number;
  payload: number[];
}

export interface ILogEntryMidi extends ILogEntryBase {
  type: LogType.Midi;
  eventType: MidiEventType;
  channel?: number;
  data?: number[];
  value?: number;
  controller?: {
    number?: number;
    name?: string;
  };
}

export interface ILogEntryError extends ILogEntryBase {
  type: LogType.Error;
  message: string;
  error?: Error;
}

export type ILogEntry =
  | ILogEntryError
  | ILogEntryMidi
  | ILogEntryInfo
  | ILogEntryRequest;

const stack = ref([] as Array<ILogEntry>);

const addRequest = (id: number): void => {
  stack.value.push({
    time: new Date(),
    type: LogType.Request,
    id,
  });
};

interface InfoParams {
  block: Block;
  index: number;
  payload: number[];
}
const addInfo = (params: InfoParams): void => {
  stack.value.push({
    type: LogType.Info,
    time: new Date(),
    ...params,
  });
};

interface MidiEventParams {
  type: MidiEventType;
  channel?: number;
  data?: Uint8Array;
  value?: number;
  controller?: {
    number?: number;
    name?: string;
  };
}
const addMidi = (params: MidiEventParams): void => {
  const { type, channel, data, value, controller } = params;
  const dataArray = data ? Array.from(data) : [];

  logger.log("Adding midi", params);

  stack.value.push({
    type: LogType.Midi,
    time: new Date(),
    eventType: type,
    channel,
    data: dataArray,
    value,
    controller,
  });
};

interface ErrorParams {
  message: string;
  error?: Error;
  payload?: number[];
}
const addError = (params: ErrorParams): void => {
  stack.value.push({
    type: LogType.Error,
    time: new Date(),
    ...params,
  });
  logger.error(params.message, params.error);
};

export const activityLog = {
  stack,
  clear: (): void => {
    stack.value = [];
  },
  addRequest,
  addInfo,
  addError,
  addMidi,
};

export default activityLog;
