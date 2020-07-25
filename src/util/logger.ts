import { midiStore } from "../store";

const log = (...params: any[]): void => {
  if (!midiStore.state.log) {
    return;
  }

  console.log(...params);
};

const error = (message: string, error?: Error): void => {
  if (!midiStore.state.log) {
    return;
  }

  console.error(message);
  if (error) {
    console.error(error);
  }
};

export const logger = {
  log,
  error,
};

export default logger;
