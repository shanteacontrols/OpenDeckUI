import { ref, reactive } from "vue";
import { ILogEntryError } from "./log-type-error";
import { ILogEntryRequest } from "./log-type-request";
import { ILogEntryMidi } from "./log-type-midi";
import { ILogEntryInfo } from "./log-type-info";

export enum LogType {
  Info = "info",
  Midi = "midi",
  Request = "request",
  Error = "error",
}

export interface ILogEntryBase {
  time: Date;
  type: LogType;
}

export type ILogEntry =
  | ILogEntryError
  | ILogEntryMidi
  | ILogEntryInfo
  | ILogEntryRequest;

// State

export type IActivityLogState = {
  stack: Array<ILogEntry>;
};

export const defaultState: IActivityLogState = {
  stack: [] as Array<ILogEntry>,
};

export const state = reactive<IActivityLogState>(defaultState);

export const stack = ref([] as Array<ILogEntry>);
