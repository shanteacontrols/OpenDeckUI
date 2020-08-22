import { state, ILogEntry, LogType } from "./state";
import { addError } from "./log-type-error";
import { addRequest } from "./log-type-request";
import { addMidi } from "./log-type-midi";
import { addInfo } from "./log-type-info";
import { saveToStorage } from "../../../util";

// Actions

export const getFilteredLogs = (
  filterBy: (log: ILogEntry) => boolean,
): ILogEntry[] => state.stack.filter(filterBy);

export const toggleLogFilter = (type: LogType): void => {
  state.logFilter[type] = !state.logFilter[type];
  saveToStorage("logFilter", state.logFilter);
};

export const toggleLog = (): void => {
  state.showRequestLog = !state.showRequestLog;
  saveToStorage("showRequestLog", state.showRequestLog);
};

export const addBuffered = (logEntry: ILogEntry): void => {
  // Add highlights
  const { type, block, index, time } = logEntry;
  if (type === LogType.Info) {
    const blockHighlights = state.highlights[block];
    if (!blockHighlights) {
      logger.error(`Unknown highlight block with id ${block}`);
      return;
    }

    blockHighlights[index] = time.getTime();
  }

  // Push to log stack
  state.stack.push(logEntry);
  state.stack = state.stack.slice(-99);
};

// Export

export const requestLogActions = {
  clear: (): void => {
    state.stack = [];
  },
  getFilteredLogs,
  addRequest,
  addInfo,
  addError,
  addMidi,
  toggleLogFilter,
  toggleLog,
};

export type IRequestLogActions = typeof requestLogActions;
