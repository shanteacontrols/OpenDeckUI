import { Ref, ref } from "vue";
import { InputEventBase } from "webmidi";
import {
  state,
  DeviceConnectionState,
  IBusRequestConfig,
  IRequestConfig,
} from "./state";
import { logger, convertDataValuesToSingleByte } from "../../../util";
import {
  RequestType,
  requestDefinitions,
  openDeckManufacturerId,
  getErrorDefinition,
  Request,
  IRequestDefinition,
  ErrorCode,
} from "../../../definitions";
import { findDefinitionByRequestConfig } from "../../../definitions";
import { activityLog, MidiEventTypeMMC } from "../activity-log";
import { midiStore } from "../midi";
import { ControlDisableType } from "../midi/state";
import { ensureConnection } from "./actions";

const componentInfoMessageId = 73;

export enum RequestState {
  Pending = "pending",
  Sent = "sent",
  Error = "error",
  Done = "done",
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

interface IRequestProcessor {
  activeRequestId: Ref<number>;
  maxRequestId: number;
}

export const requestProcessor: IRequestProcessor = {
  activeRequestId: ref((null as unknown) as number),
  maxRequestId: 100, // Must be over 0 to avoid conflicts with boolean checks
};

export const requestStack = ref({} as Record<number, IQueuedRequest>);

const addRequestToProcessor = (
  request: Omit<
    IQueuedRequest,
    "id" | "state" | "responseCount" | "responseData" | "time"
  >,
) => {
  const id = requestProcessor.maxRequestId + 1;
  requestProcessor.maxRequestId = id;
  if (requestStack.value[id]) {
    activityLog.actions.addError({
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
  activityLog.actions.addRequest(id);

  if (!requestProcessor.activeRequestId.value) {
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
    activityLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_DATA_MISSING,
      requestId: id,
    });
    return;
  }

  if (requestProcessor.activeRequestId.value) {
    activityLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_ALREADY_ACTIVE,
      requestId: id,
    });
    return;
  }

  request.time.started = new Date();
  state.output.sendSysex(openDeckManufacturerId, request.payload);

  requestProcessor.activeRequestId.value = id;
  request.state = RequestState.Sent;

  const definition = requestDefinitions[request.command];
  if (definition.expectsNoResponse) {
    requestProcessor.activeRequestId.value = null;
    request.state = RequestState.Done;
    request.promiseResolve();
  }
};

const getActiveRequest = (): IQueuedRequest => {
  const id = requestProcessor.activeRequestId.value;
  if (!id) {
    return;
  }

  const request = requestStack.value[id];
  if (!request) {
    activityLog.actions.addError({
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
    activityLog.actions.addError({
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

    activityLog.actions.addError({
      message: errorDefinition.description,
      errorCode: errorDefinition.code,
      requestId: id,
    });

    if (request.config) {
      const definition = findDefinitionByRequestConfig(request.config);
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
  requestProcessor.activeRequestId.value = (null as unknown) as number;

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
      activityLog.actions.addError({
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
    activityLog.actions.addError({
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
  if (eventData[6] !== componentInfoMessageId) {
    return false;
  }

  const block = eventData[7];
  const index =
    state.valueSize === 2
      ? convertDataValuesToSingleByte(eventData.slice(8, 9))[0]
      : eventData[8];

  activityLog.actions.addInfo({
    block,
    index,
    payload: eventData,
  });

  return true;
};

const parseEventData = (eventData: Uint8Array, request: IQueuedRequest) =>
  state.valueSize === 2
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
      activityLog.actions.addMidi({
        type: MidiEventTypeMMC[event.data[4]],
        data: [event.data[4]],
      });
      return;
    }

    activityLog.actions.addError({
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

  return definition.getPayload(config, state);
};

export const sendMessage = async (params: IBusRequestConfig): Promise<any> => {
  const { command, handler, config } = params;
  const definition = requestDefinitions[command];

  // Delay any data requests until connection info messages exchanged
  if (!definition.isConnectionInfoRequest) {
    if (state.connectionPromise) {
      await state.connectionPromise;
    } else if (state.connectionState !== DeviceConnectionState.Open) {
      await ensureConnection();
    }
  }

  return new Promise((resolve, reject) => {
    const payload = prepareRequestPayload(definition, config);

    addRequestToProcessor({
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
