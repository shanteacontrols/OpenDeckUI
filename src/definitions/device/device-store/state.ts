import { reactive } from "vue";
import { Input, Output } from "webmidi";
import { DeviceConnectionState, IDeviceState } from "./interface";
import { Block } from "../../interface";

// State

const unsupportedComponents = {
  [Block.Global]: {},
  [Block.Button]: {},
  [Block.Encoder]: {},
  [Block.Analog]: {},
  [Block.Led]: {},
  [Block.Display]: {},
};

export const defaultState: IDeviceState = {
  outputId: (null as unknown) as string,
  input: (null as unknown) as Input,
  output: (null as unknown) as Output,
  connectionState: (null as unknown) as DeviceConnectionState,
  connectionPromise: (null as unknown) as Promise<any>,
  valueSize: (null as unknown) as number,
  valuesPerMessageRequest: (null as unknown) as number,
  boardName: (null as unknown) as string,
  firmwareFileLocation: (null as unknown) as string,
  firmwareVersion: (null as unknown) as string,
  bootLoaderSupport: false,
  activePreset: (null as unknown) as number,
  supportedPresetsCount: (null as unknown) as number,
  numberOfComponents: [] as Array<number>,
  unsupportedComponents,
  isSystemOperationRunning: false,
};

export const deviceState = reactive(defaultState);
