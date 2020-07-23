import { Input, Output, InputEventBase } from "webmidi";
import {
  state,
  DeviceConnectionState,
  IBusRequestConfig,
  IStackedRequest,
} from "./state";
import {
  logger,
  convertDataValuesToSingleByte,
  PromiseQueue,
} from "../../../util";
import { midiStore } from "../midi";
import {
  RequestType,
  requestDefinitions,
  openDeckManufacturerId,
  getErrorDefinition,
} from "../../../definitions";

const requestStack = [] as IStackedRequest[];
const pq = new PromiseQueue({ concurrency: 1 });

export const connectDeviceStoreToInput = async (
  inputId: string
): Promise<any> => {
  await midiStore.actions.loadMidi();
  const { input, output } = await midiStore.actions.findInputOutput(inputId);

  state.inputId = inputId;
  state.input = input as Input;
  state.output = output as Output;
  state.input.addListener("sysex", "all", handleResponse);
  state.connectionState = DeviceConnectionState.Open;
  state.connectionPromise = (null as unknown) as Promise<any>;
};

export const handleResponse = (event: InputEventBase<"sysex">): void => {
  const request = requestStack[0];
  const { handler, onFinished, command } = request;
  const { type, parser, expectedResponseCount } = requestDefinitions[command];
  request.responseCount++;

  const receivedAllExpectedResponses = expectedResponseCount
    ? request.responseCount === expectedResponseCount
    : true; // single response expected

  const dataPosition = 6;
  const responseDataSlice = event.data.slice(dataPosition, -1);

  // Ensure we are working with array of single byte values
  const responseData =
    state.valueSize === 2 && type !== RequestType.Predefined
      ? convertDataValuesToSingleByte(responseDataSlice)
      : responseDataSlice;

  // Check response code
  const responseCode = event.data[4];
  if (responseCode > 1) {
    const errorDefinition = getErrorDefinition(responseCode);
    logger.error(`${errorDefinition.key}: ${errorDefinition.description}`);
    onFinished();
    // throw new Error(errorDefinition.key);
    // @TODO: show alert/modal with error details
  }

  // For multipart responses, we call handler multiple times
  const data = Array.from(responseData);
  const dataToReturn = parser ? parser(data) : data;
  handler(dataToReturn);

  if (receivedAllExpectedResponses) {
    logger.log("DONE:", request, event.data, responseData);
    onFinished();
    return;
  }
  logger.log("MULTIPART RESPONSE");
};

export const sendMessage = async (params: IBusRequestConfig): Promise<any> => {
  const { command, config } = params;

  if (state.connectionPromise) {
    await state.connectionPromise;
  }

  return pq.add(() => {
    const request = {
      responseCount: 0,
      onFinished: (null as unknown) as () => void,
      onError: (null as unknown) as (msg: string, error: Error) => void,
      ...params,
    };

    return new Promise((resolve, reject) => {
      try {
        const { getPayload } = requestDefinitions[command];
        const payload = getPayload(config);
        logger.log(command, config, payload);

        request.onFinished = () => {
          requestStack.shift();
          resolve();
        };
        request.onError = (msg: string, error: Error) => {
          requestStack.shift();
          reject(error);
          logger.error(msg, error);
        };
        requestStack.push(request);

        state.output.sendSysex(openDeckManufacturerId, payload);
      } catch (error) {
        reject(error);
        logger.error(error);
      }
    });
  });
};
