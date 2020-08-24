import { state, ILogEntry, LogType } from "./state";
import { addError } from "./log-type-error";
import { addRequest } from "./log-type-request";
import { addMidi } from "./log-type-midi";
import { addInfo } from "./log-type-info";
import { saveToStorage } from "../../../util";
import { debounce } from "lodash-es";

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

const buffer = [];
const maxStackSize = 50;

const pushBuffer = () => {
  if (!buffer.length) {
    return;
  }

  state.stack.push(...buffer);
  if (state.stack.length > maxStackSize) {
    state.stack = state.stack.slice(-maxStackSize);
  }
};

const debouncedLogUpdate = debounce(pushBuffer, 10, {
  maxWait: 20,
  leading: true,
  trailing: false,
});

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
  buffer.push(logEntry);
  debouncedLogUpdate();
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
