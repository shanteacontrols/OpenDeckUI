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
} from "../../../definitions";

const componentInfoMessageId = 73;

enum RequestState {
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
  promiseReject: () => void;
  config?: IRequestConfig;
  payload: number[];
  handler: (data: any) => void;
  responseCount: number;
  errorMessage?: string;
  expectedResponseCount: number;
  time: {
    created: Date;
    started: Date;
    finished: Date;
  };
}

export interface IInfoMessage {
  received: Date;
  block: number;
  index: number;
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
export const activityStack = ref([] as Array<IInfoMessage>);

const addRequestToProcessor = (
  request: Omit<IRequestInProcess, "id" | "state" | "responseCount" | "time">
) => {
  const id = requestProcessor.maxRequestId++;
  if (requestStack.value[id]) {
    throw new Error(`Request ID already used ${id}`);
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

  logger.log("NEW REQUEST STORED", id);

  if (!requestProcessor.activeRequestId.value) {
    startRequest(id);
  }
};

export const purgeInfoMessages = (): void => {
  activityStack.value = [];
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
  logger.log("STARTING REQUEST", id);

  const request = requestStack.value[id];
  if (!request) {
    throw new Error(`Missing request ${id}`);
  }

  if (requestProcessor.activeRequestId.value) {
    throw new Error(
      `Another request is still being processed ${id} vs ${requestProcessor.activeRequestId.value}`
    );
  }

  requestProcessor.activeRequestId.value = id;
  request.state = RequestState.Sent;
  request.time.started = new Date();
  state.output.sendSysex(openDeckManufacturerId, request.payload);
};

const getActiveRequest = () => {
  const id = requestProcessor.activeRequestId.value;
  if (!id) {
    logger.error(`No active request found`);
    return;
  }

  const request = requestStack.value[id];
  if (!request) {
    logger.error(`Active request data missing for ${id}`);
  }

  return request;
};

const onRequestDone = (id: number, status: number) => {
  const request = requestStack.value[id];
  if (!request) {
    throw new Error(`Missing request ${id}`);
  }

  // Check response status
  if (status > 1) {
    request.state = RequestState.Error;
    request.promiseReject();

    const errorDefinition = getErrorDefinition(status);

    request.errorMessage = errorDefinition.description;

    logger.error(
      `REQUEST ${id} ERROR: ${errorDefinition.key} - ${errorDefinition.description}`
    );
    // @TODO: show alert/modal with error details
  } else {
    request.state = RequestState.Done;
    request.promiseResolve();
    logger.log("REQUEST DONE", id);
  }

  request.time.finished = new Date();
  requestProcessor.activeRequestId.value = (null as unknown) as number;

  const nextId = id + 1;
  if (requestStack.value[nextId]) {
    startRequest(nextId);
  }
};

const parseEventData = (eventData: Uint8Array) => {
  // 0 START
  // 1 M_ID_0
  // 2 M_ID_1
  // 3 M_ID_2
  // 4 MESSAGE_STATUS
  // 5 MESSAGE_PART
  // 6 SPECIAL_MESSAGE_ID
  // 7 BLOCK
  // 8 INDEX
  // 9 END
  const response = Array.from(eventData);

  return {
    status: response[4],
    messagePart: response[5],
    data: response.slice(6, -1),
  };
};

export const handleSysExResponse = (event: InputEventBase<"sysex">): void => {
  const { status, messagePart, data } = parseEventData(event.data);

  // Handle componentInfo messages separately
  if (data[0] === componentInfoMessageId) {
    activityStack.value.push({
      received: new Date(),
      block: data[1],
      index: data[2],
    });
    logger.log("COMPONENT INFO: BLOCK", data[1], "INDEX", data[2]);
    return;
  }

  logger.log("SYSEX RESPONSE RECEIVED", status, messagePart, data);

  const request = getActiveRequest();
  if (!request) {
    logger.log("RESPONSE NOT MATCHED TO A REQUEST");
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
  const dataToReturn = definition.parser
    ? definition.parser(responseData)
    : responseData;
  handler(dataToReturn);

  if (receivedAllExpectedResponses) {
    onRequestDone(request.id, status);
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
