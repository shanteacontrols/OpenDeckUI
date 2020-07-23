import { Ref, ref } from "vue";
import { InputEventBase } from "webmidi";
import { state, DeviceConnectionState, IBusRequestConfig } from "./state";
import { logger, convertDataValuesToSingleByte } from "../../../util";
import {
  RequestType,
  requestDefinitions,
  openDeckManufacturerId,
  getErrorDefinition,
  SysExCommand,
  IRequestDefinition,
} from "../../../definitions";

enum RequestState {
  Pending = "pending",
  Sent = "sent",
  Error = "error",
  Done = "done",
}

// interface IRequestData {
//   messageStatus: MessageStatus;
//   messagePart: number; // @TODO: calculate on the fly
//   wish: Wish;
//   amount: Amount;
//   block?: Block;
//   section?: number;
//   index?: number;
//   value?: number[];
// }

export interface IRequestInProcess {
  id: number;
  state: RequestState;
  command: SysExCommand;
  promiseResolve: () => void;
  promiseReject: () => void;
  // data?: IRequestData;
  payload: number[];
  handler: (data: any) => void;
  responseCount: number;
  responseStatus?: number;
  expectedResponseCount: number;
}

interface IRequestProcessor {
  activeRequestId: Ref<number>;
  maxRequestId: number;
  requestMap: Map<number, IRequestInProcess>;
}

export const requestProcessor: IRequestProcessor = {
  activeRequestId: ref((null as unknown) as number),
  maxRequestId: 1, // Must be over 0 to avoid conflicts with boolean checks
  requestMap: new Map(),
};

const addRequestToProcessor = (request: Partial<IRequestInProcess>) => {
  const id = requestProcessor.maxRequestId++;
  if (requestProcessor.requestMap.has(id)) {
    throw new Error(`Request ID already used ${id}`);
  }

  requestProcessor.requestMap.set(id, {
    ...request,
    id,
    state: RequestState.Pending,
    responseCount: 0,
  } as IRequestInProcess);

  logger.log("NEW REQUEST STORED", id);

  if (!requestProcessor.activeRequestId.value) {
    startRequest(id);
  }
};

export const purgeFinishedRequests = (): void => {
  requestProcessor.requestMap.forEach(
    (request: IRequestInProcess, id: number) => {
      if (request.state === RequestState.Done) {
        requestProcessor.requestMap.delete(id);
      }
    }
  );
};

const startRequest = (id: number) => {
  logger.log("STARTING REQUEST", id);

  const request = requestProcessor.requestMap.get(id);
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
  state.output.sendSysex(openDeckManufacturerId, request.payload);
};

const getActiveRequest = () => {
  if (!requestProcessor.activeRequestId.value) {
    throw new Error(`No active request found`);
  }

  const request = requestProcessor.requestMap.get(
    requestProcessor.activeRequestId.value
  );

  if (!request) {
    throw new Error(
      `Active request data missing for ${requestProcessor.activeRequestId.value}`
    );
  }

  return request;
};

const onRequestDone = (id: number, status: number) => {
  const request = requestProcessor.requestMap.get(id);
  if (!request) {
    throw new Error(`Missing request ${id}`);
  }

  request.responseStatus = status;

  // Check response status
  if (status > 1) {
    request.state = RequestState.Error;
    request.promiseReject();

    const errorDefinition = getErrorDefinition(status);
    logger.error(
      `REQUEST ${id} ERROR: ${errorDefinition.key} - ${errorDefinition.description}`
    );
    // @TODO: show alert/modal with error details
  } else {
    request.state = RequestState.Done;
    request.promiseResolve();
    logger.log("REQUEST DONE", id);
  }

  requestProcessor.activeRequestId.value = (null as unknown) as number;

  const nextId = id + 1;
  if (requestProcessor.requestMap.has(nextId)) {
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
  const { status, data } = parseEventData(event.data);

  // Handle componentInfo messages separately
  if (data[0] === 73) {
    logger.log("COMPONENT INFO: SECTION", data[1], "INDEX", data[2]);
    return;
  }

  logger.log("SYSEX RESPONSE RECEIVED", status, data);

  const request = getActiveRequest();
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
  config?: IBusRequestConfig
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

  // Only allow handshake req to go through while connecting
  // Handshake needs to be done before we can consider state connected
  if (command !== SysExCommand.Handshake && state.connectionPromise) {
    await state.connectionPromise;
  } else if (state.connectionState !== DeviceConnectionState.Open) {
    throw new Error("INVALID CONNECTION STATE, NOT OPEN, BUT NOT CONNECTING");
  }

  return new Promise((resolve, reject) => {
    const definition = requestDefinitions[command];
    const payload = prepareRequestPayload(definition, config);

    addRequestToProcessor({
      command,
      payload,
      handler,
      promiseResolve: resolve,
      promiseReject: reject,
      expectedResponseCount: 1,
    });
  });
};
