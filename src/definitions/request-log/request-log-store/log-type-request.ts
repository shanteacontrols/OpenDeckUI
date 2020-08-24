import { LogType, ILogEntryBase } from "./state";
import { addBuffered } from "./actions";

export interface ILogEntryRequest extends ILogEntryBase {
  type: LogType.Request;
}

export const addRequest = (requestId: number): void => {
  addBuffered({
    type: LogType.Request,
    requestId,
  } as ILogEntryRequest);
};
