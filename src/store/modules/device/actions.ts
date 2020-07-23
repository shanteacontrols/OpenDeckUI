import {
  state,
  IDeviceState,
  DeviceConnectionState,
  IBusRequestConfig,
} from "./state";
import {
  SysExCommand,
  IDeviceComponentCounts,
  IBlockDefinition,
  convertDefinitionsToArray,
  DefinitionType,
  IBlockSettingDefinition,
  Block,
} from "../../../definitions";
import {
  sendMessage,
  connectDeviceStoreToInput,
} from "./device-promise-qeueue";
// Actions

const setInfo = (data: Partial<IDeviceState>): void => {
  Object.assign(state, data);
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

  state.connectionPromise = connectDeviceStoreToInput(inputId);

  return state.connectionPromise.then(async () => {
    await handshake();
    await loadDeviceInfo();
  });
};

const handshake = async (): Promise<any> => {
  await sendMessage({
    command: SysExCommand.Handshake,
    handler: () => ({}),
  });
};

const loadDeviceInfo = async (): Promise<any> => {
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
        command: SysExCommand.GetComponentConfig,
        handler,
        config,
      });
    });

  await Promise.all(tasks);

  return settings;
};

export interface IGetComponentConfigOptions {
  block: number;
  section: number;
  index: number;
}

export const setComponentSectionValue = async (
  config: IGetComponentConfigOptions,
  value: number,
  handler: (val: any) => void
): Promise<any> =>
  await sendMessage({
    command: SysExCommand.SetComponentConfig,
    handler,
    config: {
      ...config,
      value,
    },
  });

// Export

export interface IDeviceActions {
  setInfo: (data: Partial<IDeviceState>) => void;
  sendMessage: (config: IBusRequestConfig) => Promise<void>;
  connectDevice: (inputId: string) => Promise<void>;
  getComponentSettings: (
    definition: Dictionary<IBlockDefinition>,
    block: Block,
    filterType: DefinitionType,
    customIndex?: number
  ) => Promise<any>;
  setComponentSectionValue: (
    config: IGetComponentConfigOptions,
    value: number,
    handler: () => void
  ) => Promise<any>;
}

export const deviceStoreActions: IDeviceActions = {
  setInfo,
  sendMessage,
  connectDevice,
  getComponentSettings,
  setComponentSectionValue,
};
