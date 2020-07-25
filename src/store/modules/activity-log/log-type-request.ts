import { LogType, ILogEntryBase, state } from "./state";

export interface ILogEntryRequest extends ILogEntryBase {
  type: LogType.Request;
  id: number;
}

export const addRequest = (id: number): void => {
  state.stack.push({
    time: new Date(),
    type: LogType.Request,
    id,
  } as ILogEntryRequest);
};
