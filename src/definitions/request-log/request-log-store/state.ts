import { reactive } from "vue";
import { ILogEntryError } from "./log-type-error";
import { ILogEntryRequest } from "./log-type-request";
import { ILogEntryMidi } from "./log-type-midi";
import { ILogEntryInfo } from "./log-type-info";
import { ILogEntrySystem } from "./log-type-system";
import { Block } from "../../interface";
import { readFromStorage } from "../../../util";

export enum LogType {
  System = "system",
  Info = "info",
  Midi = "midi",
  Request = "request",
  Error = "error",
}

export enum LogFilter {
  Midi = "midi",
  System = "system",
}

export interface ILogEntryBase {
  id: string;
  time: Date;
  timeString: string;
  type: LogType;
  requestId?: number;
}

export type ILogEntry =
  | ILogEntrySystem
  | ILogEntryError
  | ILogEntryMidi
  | ILogEntryInfo
  | ILogEntryRequest;

// State

type blockHighlights = Record<number, number>;

const defaultLogFilter: Record<string, boolean> = {
  [LogFilter.Midi]: true,
};

const highlights: Record<Block, blockHighlights> = {};
Object.values(Block).forEach((block: number) => {
  highlights[block] = {};
});

export const defaultState = {
  stack: [] as Array<ILogEntry>,
  highlights,
  logFilter: defaultLogFilter,
  showRequestLog: false,
  showHexValues: false,
  suspendMidiLogs: false,
};

export type IRequestLogState = typeof defaultState;

const loadStateFromStorage = (): IRequestLogState => ({
  ...defaultState,
  logFilter: readFromStorage("logFilter") || defaultLogFilter,
  showRequestLog: readFromStorage("showRequestLog") || false,
});

export const state = reactive<IRequestLogState>(loadStateFromStorage());
