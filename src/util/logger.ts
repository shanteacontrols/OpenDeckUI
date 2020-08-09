import { midiStore } from "../store";

const log = (...params: any[]): void => {
  if (!midiStore.state.log) {
    return;
  }

  console.log(...params); // eslint-disable-line no-console
};

const warn = (...params: any[]): void => {
  if (!midiStore.state.log) {
    return;
  }

  console.warn(...params); // eslint-disable-line no-console
};

const error = (message: string, error?: Error): void => {
  if (!midiStore.state.log) {
    return;
  }

  if (message) {
    console.error(message); // eslint-disable-line no-console
  }

  if (error) {
    console.error(error); // eslint-disable-line no-console
  }

  if (!error && !message) {
    throw new Error("Unknown error!");
  }
};

export const logger = {
  log,
  warn,
  error,
};

export default logger;
