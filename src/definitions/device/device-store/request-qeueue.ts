import { Ref, ref } from "vue";
import { InputEventBase } from "webmidi";
import { deviceState } from "./state";
import { DeviceConnectionState } from "./interface";
import { logger, convertDataValuesToSingleByte } from "../../../util";
import {
  requestDefinitions,
  Request,
  IRequestDefinition,
  findRequestDefinitionByConfig,
} from "../../request";
import {
  RequestType,
  openDeckManufacturerId,
  ComponentInfoRequestID,
  RequestState,
} from "../../interface";
import { ErrorCode, getErrorDefinition } from "../../error";
import {
  requestLog,
  MidiEventTypeMMC,
} from "../../request-log/request-log-store";
import { midiStore, ControlDisableType } from "../../midi";
import { ensureConnection } from "./actions";

interface IRequestParams {
  command: Request;
  config?: IRequestConfig;
  handler: (data: any) => void;
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
  expectedResponseCount: number;
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

export const requestQueue: IRequestQueue = {
  activeRequestId: ref((null as unknown) as number),
  nextRequestId: 100, // Must be over 0 to avoid conflicts with boolean checks
};

const getNextRequestId = () => {
  requestQueue.nextRequestId += 1;
  return requestQueue.nextRequestId;
};

export const requestStack = ref({} as Record<number, IQueuedRequest>);

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

  const requestToStore = {
    ...request,
    id,
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
    deviceState.output.sendSysex(openDeckManufacturerId, request.payload);
    request.time.started = new Date();
    requestQueue.activeRequestId.value = id;
    request.state = RequestState.Sent;

    const definition = requestDefinitions[request.command];
    if (definition.expectsNoResponse) {
      requestQueue.activeRequestId.value = null;
      request.state = RequestState.Done;
      request.promiseResolve();
    }
  } catch (error) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQUEST_SEND_ERROR,
      requestId: id,
      error,
    });
    request.state = RequestState.Error;
    request.promiseReject();
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

const onRequestDone = (
  id: number,
  messageStatus: number,
  messagePart: number,
  specialRequestId: number,
  responseData: number[],
  parsed: number | number[] | string,
) => {
  const request = requestStack.value[id];
  if (!request) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_DATA_MISSING,
      requestId: id,
    });
    return;
  }

  // Check response status
  if (messageStatus > 1) {
    request.state = RequestState.Error;
    const errorDefinition = getErrorDefinition(messageStatus);
    request.errorMessage = errorDefinition.description;
    request.promiseReject(errorDefinition.code);

    requestLog.actions.addError({
      message: errorDefinition.description,
      errorCode: errorDefinition.code,
      requestId: id,
    });

    if (request.config) {
      const definition = findRequestDefinitionByConfig(request.config);
      // Disable this control in UI if not supported
      if (definition && messageStatus === ErrorCode.NOT_SUPPORTED) {
        midiStore.actions.disableControl(
          definition,
          ControlDisableType.NotSupported,
        );
      }
      // Show notice that firmware doesn't support this control
      if (definition && messageStatus === ErrorCode.INDEX) {
        midiStore.actions.disableControl(
          definition,
          ControlDisableType.MissingIndex,
        );
      }
    }
  } else {
    request.state = RequestState.Done;
    request.responseData = responseData;
    request.parsed = parsed;
    request.messagePart = messagePart;
    request.messageStatus = messageStatus;
    request.specialRequestId = specialRequestId;
    request.promiseResolve();
  }

  request.time.finished = new Date();
  requestQueue.activeRequestId.value = (null as unknown) as number;

  const nextId = id + 1;
  if (requestStack.value[nextId]) {
    startRequest(nextId);
  }
};

const parseEventDataSingleByte = (
  eventData: Uint8Array,
  request: IQueuedRequest,
) => {
  const response = Array.from(eventData);
  const definition = requestDefinitions[request.command];

  const messageStatus = response[4];
  const messagePart = response[5];
  const data = response.slice(6, -1);
  const parsed = definition.parser ? definition.parser(data) : undefined;

  return {
    messageStatus,
    messagePart,
    data,
    parsed,
  };
};

const parseEventDataDoubleByte = (
  eventData: Uint8Array,
  request: IQueuedRequest,
) => {
  let data = Array.from(eventData).slice(4, -1);
  const definition = requestDefinitions[request.command];
  const messageStatus = data[0];
  const messagePart = data[1];
  const { specialRequestId } = definition;

  if (specialRequestId) {
    // Remove status/part bytes for special request decoding
    data = data.slice(2);
    const requestIdShifted = data.shift();
    if (requestIdShifted !== specialRequestId) {
      requestLog.actions.addError({
        errorCode: ErrorCode.UI_QUEUE_SPECIAL_REQ_ID_MISMATCH,
        message: `Special Request ID mismatch ${specialRequestId} vs ${requestIdShifted}`,
        payload: event.data,
      });
    }
  }

  let decoded;
  try {
    decoded = (definition.decode && definition.decode(data, request)) || data;
  } catch (error) {
    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQUEST_DECODE_ERROR,
      message: "Failed to decode request data",
      payload: data,
      error,
    });
  }
  const parsed = definition.parser ? definition.parser(decoded) : decoded;

  return {
    messageStatus,
    messagePart,
    data,
    parsed,
    specialRequestId,
  };
};

const procesInfoMessage = (eventData: Uint8Array): boolean => {
  if (eventData[6] !== ComponentInfoRequestID) {
    return false;
  }

  const block = eventData[7];
  const index =
    deviceState.valueSize === 2
      ? convertDataValuesToSingleByte(eventData.slice(8, 9))[0]
      : eventData[8];

  requestLog.actions.addInfo({
    block,
    index,
    payload: eventData,
  });

  return true;
};

const parseEventData = (eventData: Uint8Array, request: IQueuedRequest) =>
  deviceState.valueSize === 2
    ? parseEventDataDoubleByte(eventData, request)
    : parseEventDataSingleByte(eventData, request);

export const handleSysExEvent = (event: InputEventBase<"sysex">): void => {
  if (procesInfoMessage(event.data)) {
    return;
  }

  const request = getActiveRequest();
  if (!request || request.state !== RequestState.Sent) {
    // Note: MMC MIDI events are sent as SYSEX events, so handle them specifically here
    if (
      event.data.length === 6 &&
      Object.keys(MidiEventTypeMMC).includes(String(event.data[4]))
    ) {
      requestLog.actions.addMidi({
        type: MidiEventTypeMMC[event.data[4]],
        data: [event.data[4]],
      });
      return;
    }

    requestLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_NONE_ACTIVE,
      payload: event.data,
    });
    return;
  }

  const { handler, expectedResponseCount } = request;
  const {
    messageStatus,
    messagePart,
    specialRequestId,
    data,
    parsed,
  } = parseEventData(event.data, request);

  request.responseCount++;

  const receivedAllExpectedResponses = expectedResponseCount
    ? request.responseCount === expectedResponseCount
    : true; // single response expected

  // For multipart responses, we call handler multiple times
  handler(parsed || data);

  if (receivedAllExpectedResponses) {
    onRequestDone(
      request.id,
      messageStatus,
      messagePart,
      specialRequestId,
      data,
      parsed,
    );
    return;
  }

  logger.log("MULTIPART RESPONSE");
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
  const { command, handler, config } = params;
  const definition = requestDefinitions[command];

  // Delay any data requests until connection info messages exchanged
  if (!definition.isConnectionInfoRequest) {
    if (deviceState.connectionPromise) {
      await deviceState.connectionPromise;
    } else if (deviceState.connectionState !== DeviceConnectionState.Open) {
      await ensureConnection();
    }
  }

  return new Promise((resolve, reject) => {
    const payload = prepareRequestPayload(definition, config);

    return addToQueue({
      command,
      payload,
      handler,
      config,
      promiseResolve: resolve,
      promiseReject: reject,
      expectedResponseCount: 1,
    });
  });
};
