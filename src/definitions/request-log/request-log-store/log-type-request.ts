import { LogType, ILogEntryBase } from "./state";
import { addBuffered } from "./actions";
import { convertToHexString, ensureString } from "../../../util";
import { requestStack } from "../../device/device-store/request-qeueue";

export interface ILogEntryRequest extends ILogEntryBase {
  type: LogType.Request;
  dataHex: string;
  dataDec: string;
  payloadHex: string;
  payloadDec: string;
}
const wrapData = (data: Array) =>
  Array.isArray(data) ? [240, 0, 83, 67, ...data, 247] : [];

const receivedValue = (request) => {
  const data = [];
  const fieldsToAdd = [
    request.messageStatus,
    request.messagePart,
    request.specialRequestId,
  ];
  fieldsToAdd.forEach((field: number) => {
    if (field !== undefined) {
      data.push(field);
    }
  });
  if (Array.isArray(request.responseData)) {
    data.push(...request.responseData);
  }
  return data;
};

export const addRequest = (requestId: number): void => {
  const request = requestStack.value[requestId];

  const payload = wrapData(request.payload);
  const payloadHex = payload && ensureString(convertToHexString(payload));
  const payloadDec = payload && ensureString(payload);

  const data = wrapData(receivedValue(request));
  const dataHex = data && ensureString(convertToHexString(data));
  const dataDec = data && ensureString(data);

  addBuffered({
    type: LogType.Request,
    requestId,
    dataHex,
    dataDec,
    payloadHex,
    payloadDec,
  } as ILogEntryRequest);
};
