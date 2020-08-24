import { reactive } from "vue";
import { ILogEntryError } from "./log-type-error";
import { ILogEntryRequest } from "./log-type-request";
import { ILogEntryMidi } from "./log-type-midi";
import { ILogEntryInfo } from "./log-type-info";
import { Block } from "../../interface";
import { readFromStorage } from "../../../util";

export enum LogType {
  Info = "info",
  Midi = "midi",
  Request = "request",
  Error = "error",
}

export interface ILogEntryBase {
  time: Date;
  timeAbs: number;
  type: LogType;
  requestId?: number;
}

export type ILogEntry =
  | ILogEntryError
  | ILogEntryMidi
  | ILogEntryInfo
  | ILogEntryRequest;

// State

type blockHighlights = Record<number, number>;

export type IRequestLogState = {
  stack: Array<ILogEntry>;
  highlights: Record<Block, blockHighlights>;
  logFilter: Array<LogType>;
  showRequestLog: boolean;
};

const defaultLogFilter = {
  [LogType.Midi]: true,
};

export const defaultState: IRequestLogState = {
  stack: [] as Array<ILogEntry>,
  highlights: {
    [Block.Global]: {},
    [Block.Button]: {},
    [Block.Encoder]: {},
    [Block.Analog]: {},
    [Block.Led]: {},
    [Block.Display]: {},
  },
  logFilter: defaultLogFilter,
  showRequestLog: false,
};

const loadStateFromStorage = (): IRequestLogState => ({
  ...defaultState,
  logFilter: readFromStorage("logFilter") || defaultLogFilter,
  showRequestLog: readFromStorage("showRequestLog") || false,
});

export const state = reactive<IRequestLogState>(loadStateFromStorage());
