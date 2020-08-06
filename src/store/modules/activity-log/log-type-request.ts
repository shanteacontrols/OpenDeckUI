import { LogType, ILogEntryBase, state } from "./state";

export interface ILogEntryRequest extends ILogEntryBase {
  type: LogType.Request;
}

export const addRequest = (requestId: number): void => {
  state.stack.push({
    time: new Date(),
    type: LogType.Request,
    requestId,
  } as ILogEntryRequest);
};
