import { Ref, ref } from "vue";
import { InputEventBase } from "webmidi";
import { deviceState } from "./state";
import {
  DeviceConnectionState,
  ControlDisableType,
  IRequestConfig,
} from "./interface";
import { disableControl } from "./actions";
import {
  arrayEqual,
  convertDataValuesToSingleByte,
  delay,
} from "../../../util";
import {
  requestDefinitions,
  Request,
  IRequestDefinition,
  findSectionDefinitionByConfig,
} from "../../request";
import {
  RequestType,
  openDeckManufacturerId,
  ComponentInfoRequestID,
  RequestState,
  IRequestDefinition,
} from "../../interface";
import { ErrorCode, getErrorDefinition } from "../../error";
import {
  requestLog,
  MidiEventTypeMMC,
} from "../../request-log/request-log-store";
import { ensureConnection } from "./actions";

interface IRequestParams {
  command: Request;
  config?: IRequestConfig;
  payload?: number[];
  handler: (data: any) => void;
}

export interface IProcessedEventData {
  data: number[];
  messageStatus: number;
  messagePart: number;
}

export interface IQueuedRequest {
  id: number;
  state: RequestState;
  command: Request;
  promiseResolve: () => void;
  promiseReject: (code?: ErrorCode) => void;
  config?: IRequestConfig;
  payload: number[];
  handler: (data: any) => void;
  responseCount: number;
  responseData?: number[];
  messageStatus?: number;
  messagePart?: number;
  parsed?: number[] | number | string;
  errorMessage?: string;
  time: {
    created: Date;
    started: Date;
    finished: Date;
  };
}

interface IRequestQueue {
  activeRequestId: Ref<number>;
  nextRequestId: number;
}

export const requestStack = ref<Record<number, IQueuedRequest>>({});

export const requestQueue: IRequestQueue = {
  activeRequestId: ref((null as unknown) as number),
  nextRequestId: 100, // Must be over 0 to avoid conflicts with boolean checks
};

const getNextRequestId = () => {
  requestQueue.nextRequestId += 1;
  return requestQueue.nextRequestId;
};

const getDefinition = (command: Command): IRequestDefinition =>
  requestDefinitions[command];

const isEventMidiMMC = (event: InputEventBase<"sysex">) =>
  event.data.length === 6 &&
  Object.keys(MidiEventTypeMMC).includes(String(event.data[4]));

const addToQueue = async (
  request: Omit<
    IQueuedRequest,
    "id" | "state" | "responseCount" | "responseData" | "time"
  >,
) => {
  const id = getNextRequestId();

  if (requestStack.value[id]) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_ID_CONFLICT,
      requestId: id,
    });
    return;
  }

  const { specialRequestId } = getDefinition(request.command);
  const requestToStore = {
    ...request,
    id,
    specialRequestId,
    state: RequestState.Pending,
    responseCount: 0,
    time: {
      created: new Date(),
      started: (null as unknown) as Date,
      finished: (null as unknown) as Date,
    },
  };

  requestStack.value[id] = requestToStore;
  requestLog.actions.addRequest(id);

  if (!requestQueue.activeRequestId.value) {
    startRequest(id);
  }
};

export const purgeFinishedRequests = (): void => {
  Object.keys(requestStack.value).forEach((key: string) => {
    const id = Number(key);
    const request: IQueuedRequest = requestStack.value[id];
    if ([RequestState.Done, RequestState.Error].includes(request.state)) {
      delete requestStack.value[id];
    }
  });
};

const startRequest = async (id: number) => {
  const request = requestStack.value[id];
  if (!request) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_DATA_MISSING,
      requestId: id,
    });
    return;
  }

  if (requestQueue.activeRequestId.value) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_ALREADY_ACTIVE,
      requestId: id,
    });
    return;
  }

  try {
    const reqDef = getDefinition(request.command);

    if (reqDef.isSystemOperation) {
      deviceState.isSystemOperationRunning = true;
    }

    deviceState.output.sendSysex(openDeckManufacturerId, request.payload);
    request.time.started = new Date();
    requestQueue.activeRequestId.value = id;
    request.state = RequestState.Sent;

    if (reqDef.expectsNoResponse) {
      requestQueue.activeRequestId.value = null;
      request.state = RequestState.Done;
      request.promiseResolve();
    } else if (request.command === Request.RestoreBackup) {
      // Fail requests after 2 seconds of no response
      delay(2000).then(() => {
        if (request.state === RequestState.Sent) {
          onRequestFail(request, ErrorCode.UI_QUEUE_REQ_TIMED_OUT);
        }
      });
    }
  } catch (error) {
    onRequestFail(request, ErrorCode.UI_QUEUE_REQUEST_SEND_ERROR);
  }
};

const getActiveRequest = (): IQueuedRequest => {
  const id = requestQueue.activeRequestId.value;
  if (!id) {
    return;
  }

  const request = requestStack.value[id];
  if (!request) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_DATA_MISSING,
      requestId: id,
    });
  }

  return request;
};

const parseEventDataSingleByte = (
  processed: IProcessedEventData,
  definition: IRequestDefinition,
): any =>
  definition.parser ? definition.parser(processed.data) : processed.data;

const removeEmbed = (
  processed: IProcessedEventData,
  request: IQueuedRequest,
) => {
  const { data, messageStatus, messagePart } = processed;
  // Ensure response has returned sent request as prefix of data
  const expectedEmbed = [1, ...request.payload.slice(1)];
  const eventData = [messageStatus, messagePart, ...data];
  const foundEmbed = eventData.slice(0, expectedEmbed.length);
  if (!arrayEqual(expectedEmbed, foundEmbed)) {
    throw new Error("EMBEDDED RESPONSE MISMATCH");
  }

  return eventData.slice(expectedEmbed.length);
};

const parseEventDataDoubleByte = (
  processed: IProcessedEventData,
  definition: IRequestDefinition,
  request: IQueuedRequest,
): any => {
  const { data } = processed;
  const { decodeDoubleByte, responseEmbedsRequest } = definition;
  let decoded = data;
  try {
    if (decodeDoubleByte) {
      const dataToDecode = responseEmbedsRequest
        ? removeEmbed(processed, request)
        : data;

      decoded = convertDataValuesToSingleByte(dataToDecode);
    }
  } catch (error) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQUEST_DECODE_ERROR,
      payload: data,
      error,
    });
    return undefined;
  }

  return definition.parser ? definition.parser(decoded) : decoded;
};

const procesInfoMessage = (eventData: Uint8Array): boolean => {
  const data = Array.from(eventData);
  if (data[6] !== ComponentInfoRequestID) {
    return false;
  }

  const block = eventData[7];
  const index =
    deviceState.valueSize === 2
      ? convertDataValuesToSingleByte(eventData.slice(8, 10))[0]
      : eventData[8];

  requestLog.actions.addInfo({
    block,
    index,
    payload: eventData,
  });

  return true;
};

const processEventData = (
  eventData: Uint8Array,
  request: IQueuedRequest,
): IProcessedEventData => {
  const eventDataArray = Array.from(eventData);

  // Responses to backup request should not be processed
  if (request.command === Request.Backup) {
    return { messageStatus: 1, messagePart: 0, data: eventDataArray };
  }

  const messageStatus = eventDataArray[4];
  const messagePart = eventDataArray[5];
  const data = eventDataArray.slice(6, -1);
  const { specialRequestId } = getDefinition(request.command);

  // Trim specialRequestId from data for 2 byte protocol
  if (
    ([1, 2].includes(specialRequestId) && data.length) ||
    (specialRequestId && deviceState.valueSize === 2)
  ) {
    data.shift();
  }

  return {
    messageStatus,
    messagePart,
    data,
  };
};

export const handleSysExEvent = (event: InputEventBase<"sysex">): void => {
  if (procesInfoMessage(event.data)) {
    return;
  }

  // Note: MMC MIDI messages are sent as regular SYSEX events
  if (isEventMidiMMC(event)) {
    requestLog.actions.addMidi({
      type: MidiEventTypeMMC[event.data[4]],
      data: [event.data[4]],
    });
    return;
  }

  const request = getActiveRequest();
  if (!request) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_DATA_MISSING,
    });
    return;
  }

  if (request.state !== RequestState.Sent) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_NONE_ACTIVE,
      payload: event.data,
    });
    return;
  }

  request.responseCount++;

  const definition = getDefinition(request.command);
  const { hasMultiPartResponse } = definition;

  const processed = processEventData(event.data, request);
  const { messageStatus, data } = processed;

  // Note: Fix issue with input output matching handshake response
  if (request.specialRequestId && event.data[6] !== request.specialRequestId) {
    return;
  }

  // Handle errors
  if (messageStatus > 1) {
    return onRequestFail(request, messageStatus);
  }

  let parsed;
  if (request.command !== Request.Backup) {
    parsed =
      deviceState.valueSize === 2
        ? parseEventDataDoubleByte(processed, definition, request)
        : parseEventDataSingleByte(processed, definition);
  }

  const { handler } = request;
  const isLastMultipartMessage = handler(parsed || data);

  // For multipart responses, we expect handler to return true after  last message
  const receivedAllExpectedResponses =
    !hasMultiPartResponse || isLastMultipartMessage;

  if (receivedAllExpectedResponses) {
    return onRequestDone(request, processed, parsed);
  }
};

const onRequestDone = (
  request: IQueuedRequest,
  processed: IProcessedEventData,
  parsed: number | number[] | string,
) => {
  const { messageStatus, messagePart, data } = processed;
  request.state = RequestState.Done;
  request.responseData = data;
  request.parsed = parsed;
  request.messagePart = messagePart;
  request.messageStatus = messageStatus;
  request.promiseResolve();
  request.time.finished = new Date();

  continueNextRequest();
};

const onRequestFail = (request: IQueuedRequest, messageStatus: number) => {
  request.state = RequestState.Error;
  const errorDefinition = getErrorDefinition(messageStatus);
  request.errorMessage = errorDefinition.description;
  request.promiseReject(errorDefinition.code);

  requestLog.actions.addError({
    errorCode: errorDefinition.code,
    requestId: request.id,
  });

  if (request.config) {
    const sectionDef = findSectionDefinitionByConfig(request.config);
    if (sectionDef && messageStatus === ErrorCode.NOT_SUPPORTED) {
      disableControl(sectionDef, ControlDisableType.NotSupported);
    }
    if (sectionDef && messageStatus === ErrorCode.INDEX) {
      disableControl(sectionDef, ControlDisableType.MissingIndex);
    }
  }

  continueNextRequest();
};

const continueNextRequest = () => {
  requestQueue.activeRequestId.value = (null as unknown) as number;

  if (deviceState.isSystemOperationRunning) {
    deviceState.isSystemOperationRunning = false;
  }

  const pendingRequests = Object.values(requestStack.value).filter(
    (req) => req.state === RequestState.Pending,
  );

  const nextId = pendingRequests.length && pendingRequests[0].id;
  if (nextId) {
    return startRequest(nextId);
  }
};

const prepareRequestPayload = (
  definition: IRequestDefinition,
  config?: IRequestConfig,
) => {
  if ([RequestType.Custom, RequestType.Predefined].includes(definition.type)) {
    if (definition.specialRequestId === undefined) {
      throw new Error(
        `Missing specialRequestId for definition ${definition.key}`,
      );
    }

    return [0, 0, definition.specialRequestId];
  }

  if (!definition.getPayload) {
    throw new Error(`Missing getPayload for definition ${definition.type}`);
  }

  return definition.getPayload(config, deviceState);
};

export const sendMessage = async (params: IRequestParams): Promise<any> => {
  const { command, handler, config, payload } = params;
  const definition = getDefinition(command);

  // Delay any data requests until connection info messages exchanged
  if (!definition.isConnectionInfoRequest) {
    if (deviceState.connectionPromise) {
      await deviceState.connectionPromise;
    } else if (deviceState.connectionState !== DeviceConnectionState.Open) {
      await ensureConnection();
    }
  }

  return new Promise((resolve, reject) => {
    return addToQueue({
      command,
      payload: payload || prepareRequestPayload(definition, config),
      handler,
      config,
      promiseResolve: resolve,
      promiseReject: reject,
    });
  });
};
