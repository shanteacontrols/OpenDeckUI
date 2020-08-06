import { state, ILogEntry, LogType } from "./state";
import { addError } from "./log-type-error";
import { addRequest } from "./log-type-request";
import { addMidi } from "./log-type-midi";
import { addInfo } from "./log-type-info";
import { debounce } from "lodash-es";

// Actions

const delayShort = 100;
const delayLong = 700;
const bufferSlowdownRequests = 30;
const keepMidiLogsForMs = 500;
const keepInfoLogsForMs = 500;

let lastBufferPushTime = new Date();
const midiBuffer = [] as ILogEntry[];
let delayMs = delayShort;

export const getFilteredLogs = (
  filterBy: (log: ILogEntry) => boolean,
): ILogEntry[] => state.stack.filter(filterBy);

const pushBufferToStack = () => {
  const now = new Date();
  const lastPush = lastBufferPushTime.valueOf();

  if (lastPush > now.valueOf() - delayMs) {
    return;
  }

  lastBufferPushTime = now;

  // Adjust buffer delay
  if (midiBuffer.length > bufferSlowdownRequests) {
    delayMs = delayLong;
  } else {
    delayMs = delayShort;
  }

  state.stack.push(...midiBuffer);
  midiBuffer.length = 0;
};

const isLogFresh = (log: ILogEntry) => {
  const now = new Date().valueOf();
  if (LogType.Info === log.type) {
    return log.time.valueOf() > now - keepInfoLogsForMs;
  }
  if (LogType.Midi === log.type && state.stack.length > 100) {
    return log.time.valueOf() > now - keepMidiLogsForMs;
  }
  return true;
};

const pruneOld = () => {
  setTimeout(() => debouncedPrune(), 300);
  const lengthBefore = state.stack.length;
  if (lengthBefore === 0) {
    return;
  }

  const filtered = getFilteredLogs(isLogFresh);

  state.prunedCount = state.prunedCount + lengthBefore - filtered.length;
  state.stack = Array.from(filtered);
};

const debouncedPush = debounce(pushBufferToStack, 50, { maxWait: 500 });
const debouncedPrune = debounce(pruneOld, 250, { maxWait: 1000 });

export const addBuffered = (logEntry: ILogEntry): void => {
  midiBuffer.push(logEntry);
  debouncedPush();
  debouncedPrune();
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
