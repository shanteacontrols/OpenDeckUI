import { LogType, ILogEntryBase, state } from "./state";
import { Block } from "../../../definitions";

export interface ILogEntryInfo extends ILogEntryBase {
  type: LogType.Info;
  block: Block;
  index: number;
  payload: number[];
}

interface InfoParams {
  block: Block;
  index: number;
  payload: number[];
}

export const addInfo = (params: InfoParams): void => {
  state.stack.push({
    type: LogType.Info,
    time: new Date(),
    ...params,
  });
};
