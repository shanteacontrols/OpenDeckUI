import { LogType, ILogEntryBase, state } from "./state";
import { ErrorCode } from "../../../definitions";

export interface ILogEntryError extends ILogEntryBase {
  type: LogType.Error;
  message?: string;
  errorCode?: ErrorCode;
  error?: Error;
  requestId?: number;
}

interface ErrorParams {
  message?: string;
  error?: Error;
  errorCode?: ErrorCode;
  payload?: number[];
  requestId?: number;
}

export const addError = (params: ErrorParams): void => {
  state.stack.push({
    type: LogType.Error,
    time: new Date(),
    ...params,
  });
  // logger.error(params.message, params.error);
};
