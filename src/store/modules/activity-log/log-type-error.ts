import { LogType, ILogEntryBase, state } from "./state";
import { ErrorCode, getErrorDefinition } from "../../../definitions";
import { logger } from "../../../util";

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

  if (params.errorCode) {
    const definition = getErrorDefinition(params.errorCode);
    logger.error(definition.description, params.error);
  } else {
    logger.error(definition.message, params.error);
  }
};
