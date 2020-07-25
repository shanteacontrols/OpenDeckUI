import { state, stack, IActivityLogState } from "./state";
import { addError } from "./log-type-error";
import { addRequest } from "./log-type-request";
import { addMidi } from "./log-type-midi";
import { addInfo } from "./log-type-info";

// Actions

const setInfo = (data: Partial<IActivityLogState>): void => {
  Object.assign(state, data);
};

// Export

export const activityLogActions = {
  setInfo,
  clear: (): void => {
    state.stack = [];
    stack.value = [];
  },
  addRequest,
  addInfo,
  addError,
  addMidi,
};

export type IActivityLogActions = typeof activityLogActions;
