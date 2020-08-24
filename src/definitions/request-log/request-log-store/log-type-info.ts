import { LogType, ILogEntryBase } from "./state";
import { addBuffered } from "./actions";
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

export const addInfo = (params: InfoParams): void =>
  addBuffered({
    type: LogType.Info,
    ...params,
  });
