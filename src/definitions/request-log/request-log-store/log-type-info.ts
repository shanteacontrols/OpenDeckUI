import { LogType, ILogEntryBase } from "./state";
import { addBuffered } from "./actions";
import { Block } from "../../../definitions";
import { convertToHexString, ensureString } from "../../../util";

export interface ILogEntryInfo extends ILogEntryBase {
  type: LogType.Info;
  block: Block;
  index: number;
  payload: number[];
  payloadHex: string;
  payloadDec: string;
}

interface InfoParams {
  block: Block;
  index: number;
  payload: number[];
}

export const addInfo = (params: InfoParams): void => {
  const { payload } = params;

  const payloadHex = payload && ensureString(convertToHexString(payload));
  const payloadDec = payload && ensureString(Array.from(payload));

  addBuffered({
    type: LogType.Info,
    ...params,
    payloadHex,
    payloadDec,
  });
};
