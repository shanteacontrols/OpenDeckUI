import { LogType, ILogEntryBase } from "./state";
import { ErrorCode, getErrorDefinition } from "../../../definitions";
import { logger } from "../../../util";
import { addBuffered } from "./actions";

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
  addBuffered({
    type: LogType.Error,
    ...params,
  });

  if (params.errorCode) {
    const definition = getErrorDefinition(params.errorCode);
    logger.error(definition.description, params.error);
  } else {
    logger.error(definition.message, params.error);
  }
};
