import { state, ILogEntry, LogType, LogFilter } from "./state";
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

export const toggleLogFilter = (filter: LogFilter): void => {
  state.logFilter[filter] = !state.logFilter[filter];
  saveToStorage("logFilter", state.logFilter);
};

export const toggleLog = (): void => {
  state.showRequestLog = !state.showRequestLog;
  saveToStorage("showRequestLog", state.showRequestLog);
};

export const toggleHexValues = (): void => {
  state.showHexValues = !state.showHexValues;
  saveToStorage("showHexValues", state.showHexValues);
};

export const clearRequestLog = (): void => {
  state.stack = [];
};

const maxStackSize = 50;
const trimDebounceMS = 10;

const pushBuffer = () => {
  if (state.stack.length > maxStackSize) {
    state.stack = state.stack.slice(0, maxStackSize);
  }
};

const debouncedLogUpdate = debounce(pushBuffer, trimDebounceMS, {
  leading: true,
  maxWait: trimDebounceMS,
  trailing: false,
});

export const addBuffered = (logEntry: ILogEntry): void => {
  const { type, block, index } = logEntry;
  const time = new Date();
  const timeAbs = time.getTime();

  // Add highlights
  if (type === LogType.Info) {
    const blockHighlights = state.highlights[block];
    if (!blockHighlights) {
      logger.error(`Unknown highlight block with id ${block}`);
      return;
    }

    blockHighlights[index] = timeAbs;
  }

  // Skip logging if Log is disabled
  if (!state.showRequestLog) {
    return;
  }

  // Skip log types not included in filter (better memory handling)
  const skipLogging =
    type === LogType.Midi
      ? !state.logFilter[LogFilter.Midi]
      : !state.logFilter[LogFilter.System];

  if (skipLogging) {
    return;
  }

  let payload = logEntry.payload;
  if (payload) {
    if (typeof payload === "string") {
      payload = payload.split(",");
    }
    if (!Array.isArray(payload)) {
      payload = Array.from(payload);
    }
  }

  // Push to log stack
  state.stack.unshift({
    ...logEntry,
    payload,
    time,
    timeAbs,
  });
  debouncedLogUpdate();
};

// Export

export const requestLogActions = {
  clearRequestLog,
  getFilteredLogs,
  addRequest,
  addInfo,
  addError,
  addMidi,
  toggleLogFilter,
  toggleLog,
  toggleHexValues,
};

export type IRequestLogActions = typeof requestLogActions;
