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
  SysExCommand,
  IRequestDefinition,
  ErrorCode,
} from "../../../definitions";
import { findDefinitionByRequestConfig } from "../../../definitions/definition-map";
import { activityLog } from "../activity-log";
import { midiStore } from "../midi";

const componentInfoMessageId = 73;

export enum RequestState {
  Pending = "pending",
  Sent = "sent",
  Error = "error",
  Done = "done",
}

export interface IRequestInProcess {
  id: number;
  state: RequestState;
  command: SysExCommand;
  promiseResolve: () => void;
  promiseReject: (code?: ErrorCode) => void;
  config?: IRequestConfig;
  payload: number[];
  handler: (data: any) => void;
  responseCount: number;
  responseData?: number[];
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
  maxRequestId: 1, // Must be over 0 to avoid conflicts with boolean checks
};

export const requestStack = ref({} as Record<number, IRequestInProcess>);

const addRequestToProcessor = (
  request: Omit<
    IRequestInProcess,
    "id" | "state" | "responseCount" | "responseData" | "time"
  >
) => {
  const id = requestProcessor.maxRequestId++;
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
    const request: IRequestInProcess = requestStack.value[id];
    if ([RequestState.Done, RequestState.Error].includes(request.state)) {
      delete requestStack.value[id];
    }
  });
};

const startRequest = (id: number) => {
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

  requestProcessor.activeRequestId.value = id;
  request.state = RequestState.Sent;
  request.time.started = new Date();

  state.output.sendSysex(openDeckManufacturerId, request.payload);
};

const getActiveRequest = () => {
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
  responseCode: number,
  responseData: number[],
  parsed: number | number[] | string
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
  if (responseCode > 1) {
    request.state = RequestState.Error;
    const errorDefinition = getErrorDefinition(responseCode);
    request.errorMessage = errorDefinition.description;
    request.promiseReject(errorDefinition.code);

    activityLog.actions.addError({
      message: errorDefinition.description,
      errorCode: errorDefinition.code,
      requestId: id,
    });

    if (responseCode === ErrorCode.NOT_SUPPORTED) {
      if (!request.config) {
        return;
      }

      const definition = findDefinitionByRequestConfig(request.config);
      if (!definition) {
        return;
      }

      // Disable this control in UI
      midiStore.actions.disableControl(request.config.block, definition.key);
    }

    // @TODO: show alert/modal with error details
  } else {
    request.state = RequestState.Done;
    request.responseData = responseData;
    request.parsed = parsed;
    request.promiseResolve();
  }

  request.time.finished = new Date();
  requestProcessor.activeRequestId.value = (null as unknown) as number;

  const nextId = id + 1;
  if (requestStack.value[nextId]) {
    startRequest(nextId);
  }
};

const parseEventData = (eventData: Uint8Array) => {
  const response = Array.from(eventData);

  return {
    status: response[4],
    messagePart: response[5],
    data: response.slice(6, -1),
  };
};

export const handleSysExEvent = (event: InputEventBase<"sysex">): void => {
  const { status, data } = parseEventData(event.data);

  if (data[0] === componentInfoMessageId) {
    // @TODO: componentInfo messages should trigger a blink on ui element
    // activityLog.actions.addInfo({
    //   block: data[1],
    //   index: data[2],
    //   payload: data,
    // });
    return;
  }

  const request = getActiveRequest();
  if (!request || request.state !== RequestState.Sent) {
    activityLog.actions.addError({
      errorCode: ErrorCode.UI_QUEUE_REQ_NONE_ACTIVE,
      payload: data,
    });
    return;
  }

  const { handler, command, expectedResponseCount } = request;
  const definition = requestDefinitions[command];

  request.responseCount++;

  const receivedAllExpectedResponses = expectedResponseCount
    ? request.responseCount === expectedResponseCount
    : true; // single response expected

  // Ensure we are working with array of single byte values
  const responseData =
    state.valueSize === 2 && definition.type !== RequestType.Predefined
      ? convertDataValuesToSingleByte(data)
      : data;

  // For multipart responses, we call handler multiple times
  const parsed = definition.parser
    ? definition.parser(responseData)
    : undefined;
  handler(parsed || responseData);

  if (receivedAllExpectedResponses) {
    onRequestDone(request.id, status, responseData, parsed);
    return;
  }

  logger.log("MULTIPART RESPONSE");
};

const prepareRequestPayload = (
  definition: IRequestDefinition,
  config?: IRequestConfig
) => {
  if ([RequestType.Custom, RequestType.Predefined].includes(definition.type)) {
    if (!definition.specialRequestId) {
      throw new Error(
        `Missing specialRequestId for definition ${definition.type}`
      );
    }

    return [0, 0, definition.specialRequestId];
  }

  if (!definition.getPayload) {
    throw new Error(`Missing getPayload for definition ${definition.type}`);
  }

  return definition.getPayload(config);
};

export const sendMessage = async (params: IBusRequestConfig): Promise<any> => {
  const { command, handler, config } = params;
  const definition = requestDefinitions[command];

  // Delay any data requests until connection info messages exchanged
  if (!definition.isConnectionInfoRequest && state.connectionPromise) {
    await state.connectionPromise;
  } else if (state.connectionState !== DeviceConnectionState.Open) {
    throw new Error("INVALID CONNECTION STATE, NOT OPEN, BUT NOT CONNECTING");
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
