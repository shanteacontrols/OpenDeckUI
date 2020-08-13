import { state, ILogEntry, LogType } from "./state";
import { addError } from "./log-type-error";
import { addRequest } from "./log-type-request";
import { addMidi } from "./log-type-midi";
import { addInfo } from "./log-type-info";

// Actions

const keepInfoLogsForMs = 250;

export const getFilteredLogs = (
  filterBy: (log: ILogEntry) => boolean,
): ILogEntry[] => state.stack.filter(filterBy);

const pruneInfoLogsForAnimation = (log: ILogEntry) => {
  const now = new Date().valueOf();
  if (LogType.Info === log.type) {
    return log.time.valueOf() > now - keepInfoLogsForMs;
  }
  return true;
};

export const addBuffered = (logEntry: ILogEntry): void => {
  state.stack.push(logEntry);

  const filtered = state.stack.filter(pruneInfoLogsForAnimation).slice(-100);
  state.stack = Array.from(filtered);
};

// Export

export const activityLogActions = {
  clear: (): void => {
    state.prunedCount = state.prunedCount + state.stack.length;
    state.stack = [];
  },
  getFilteredLogs,
  addRequest,
  addInfo,
  addError,
  addMidi,
};

export type IActivityLogActions = typeof activityLogActions;
