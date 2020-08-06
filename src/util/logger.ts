import { midiStore } from "../store";

const log = (...params: any[]): void => {
  if (!midiStore.state.log) {
    return;
  }

  console.log(...params); // eslint-disable-line no-console
};

const error = (message: string, error?: Error): void => {
  if (!midiStore.state.log) {
    return;
  }

  console.error(message); // eslint-disable-line no-console
  if (error) {
    console.error(error); // eslint-disable-line no-console
  }
};

export const logger = {
  log,
  error,
};

export default logger;
