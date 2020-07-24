import { state, IDeviceState, DeviceConnectionState } from "./state";
import {
  SysExCommand,
  IDeviceComponentCounts,
  IBlockDefinition,
  convertDefinitionsToArray,
  DefinitionType,
  IBlockSettingDefinition,
  Block,
} from "../../../definitions";
import { sendMessage, handleSysExEvent } from "./device-promise-qeueue";
import { attachMidiEventHandlers } from "./midi-event-handlers";
import { Input, Output } from "webmidi";
import { midiStore } from "../midi";

// Actions

const setInfo = (data: Partial<IDeviceState>): void => {
  Object.assign(state, data);
};

export const connectDeviceStoreToInput = async (
  inputId: string
): Promise<any> => {
  await midiStore.actions.loadMidi();
  const { input, output } = await midiStore.actions.findInputOutput(inputId);

  state.inputId = inputId;
  state.input = input as Input;
  state.output = output as Output;

  state.input.removeListener("sysex"); // make sure we don't duplicate listeners
  state.input.addListener("sysex", "all", handleSysExEvent);
  attachMidiEventHandlers(state.input);

  state.connectionState = DeviceConnectionState.Open;
  await prepareConnectionInfo();
  state.connectionPromise = (null as unknown) as Promise<any>;

  // These requests won't run until connection promise is finished
  await loadDeviceInfo();
};

const connectDevice = async (inputId: string): Promise<void> => {
  if (typeof inputId !== "string") {
    throw new Error("MISSING OR INVALID DEVICE INPUT ID");
  }
  if (state.connectionState === DeviceConnectionState.Open) {
    return;
  }
  if (state.connectionPromise) {
    return state.connectionPromise;
  }

  // All subsequent connect attempts should receive the same promise as response
  state.connectionPromise = connectDeviceStoreToInput(inputId);

  return state.connectionPromise;
};

const prepareConnectionInfo = async (): Promise<any> => {
  await sendMessage({
    command: SysExCommand.Handshake,
    handler: () => ({}),
  });
  await sendMessage({
    command: SysExCommand.GetValueSize,
    handler: (valueSize: number) => setInfo({ valueSize }),
  });
  await sendMessage({
    command: SysExCommand.GetValuesPerMessage,
    handler: (valuesPerMessageRequest: number) =>
      setInfo({ valuesPerMessageRequest }),
  });
  await sendMessage({
    command: SysExCommand.GetFirmwareVersion,
    handler: (firmwareVersion: string) => setInfo({ firmwareVersion }),
  });
};

const loadDeviceInfo = async (): Promise<any> => {
  await sendMessage({
    command: SysExCommand.GetHardwareUid,
    handler: (boardName: string) => setInfo({ boardName }),
  });
  await sendMessage({
    command: SysExCommand.GetNumberOfSupportedComponents,
    handler: (components: IDeviceComponentCounts) => setInfo(components),
  });
};

export const getComponentSettings = async (
  componentDefinition: Dictionary<IBlockDefinition>,
  block: number,
  filterType: DefinitionType,
  customIndex?: number
): Promise<any> => {
  const settings = {} as any;
  const definitionsArray = convertDefinitionsToArray(componentDefinition);

  const tasks = definitionsArray
    .filter((definition) => definition.type === filterType)
    .map((definition) => {
      const index =
        customIndex || (definition as IBlockSettingDefinition).settingIndex;
      const config = { block, section: definition.section, index };

      const handler = (result: number[]) => {
        settings[definition.key] = result[0];
      };
      return sendMessage({
        command: SysExCommand.GetValue,
        handler,
        config,
      });
    });

  await Promise.all(tasks);

  return settings;
};

export interface IGetValueOptions {
  block: number;
  section: number;
  index: number;
}

export const setComponentSectionValue = async (
  config: IGetValueOptions,
  value: number,
  handler: (val: any) => void
): Promise<any> =>
  await sendMessage({
    command: SysExCommand.SetValue,
    handler,
    config: {
      ...config,
      value,
    },
  });

// Export

export interface IDeviceActions {
  setInfo: (data: Partial<IDeviceState>) => void;
  connectDevice: (inputId: string) => Promise<void>;
  loadDeviceInfo: () => Promise<void>;
  getComponentSettings: (
    definition: Dictionary<IBlockDefinition>,
    block: Block,
    filterType: DefinitionType,
    customIndex?: number
  ) => Promise<any>;
  setComponentSectionValue: (
    config: IGetValueOptions,
    value: number,
    handler: () => void
  ) => Promise<any>;
}

export const deviceStoreActions: IDeviceActions = {
  setInfo,
  connectDevice,
  loadDeviceInfo,
  getComponentSettings,
  setComponentSectionValue,
};
