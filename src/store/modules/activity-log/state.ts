import { reactive } from "vue";
import { ILogEntryError } from "./log-type-error";
import { ILogEntryRequest } from "./log-type-request";
import { ILogEntryMidi } from "./log-type-midi";
import { ILogEntryInfo } from "./log-type-info";
import { Block } from "../../../definitions";
import { readFromStorage } from "../../store-util";

export enum LogType {
  Info = "info",
  Midi = "midi",
  Request = "request",
  Error = "error",
}

export interface ILogEntryBase {
  time: Date;
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

export type IActivityLogState = {
  stack: Array<ILogEntry>;
  highlights: Record<Block, blockHighlights>;
  logFilter: Array<LogType>;
};

const defaultLogFilter = {
  [LogType.Midi]: true,
};

export const defaultState: IActivityLogState = {
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
  showActivityLog: false,
};

const loadStateFromStorage = (): IActivityLogState => ({
  ...defaultState,
  logFilter: readFromStorage("logFilter") || defaultLogFilter,
  showActivityLog: readFromStorage("showActivityLog") || false,
});

export const state = reactive<IActivityLogState>(loadStateFromStorage());
