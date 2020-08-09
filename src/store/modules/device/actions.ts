import semverGt from "semver/functions/gt";
import marked from "marked";
import { state, IDeviceState, DeviceConnectionState } from "./state";
import {
  SysExCommand,
  IDeviceComponentCounts,
  IBlockDefinition,
  IBoardDefinition,
  convertDefinitionsToArray,
  DefinitionType,
  IBlockSettingDefinition,
  Block,
  Boards,
} from "../../../definitions";
import { sendMessage, handleSysExEvent } from "./device-promise-qeueue";
import { attachMidiEventHandlers } from "./midi-event-handlers";
import { Input, Output } from "webmidi";
import { midiStore } from "../midi";
import { logger, arrayEqual } from "../../../util";
import { SysExCommand } from "../../../definitions/definitions-requests.ts";

// Actions

const setInfo = (data: Partial<IDeviceState>): void => {
  Object.assign(state, data);
};

let connectionWatcherTimer = null;

const connectionWatcher = async (): Promise<void> => {
  if (connectionWatcherTimer) {
    clearTimeout(connectionWatcherTimer);
  }

  try {
    if (state.connectionState !== DeviceConnectionState.Open && state.inputId) {
      const { input } = await midiStore.actions.findInputOutput(state.inputId);
      if (input) {
        await connectDevice(state.inputId);
      }
    }
  } catch (err) {
    logger.error("Device connection watcher error", err);
  }

  connectionWatcherTimer = setTimeout(() => connectionWatcher(), 2000);
};

const startConnectionWatcher = (): Promise<void> => connectionWatcher();

export const connectDeviceStoreToInput = async (
  inputId: string,
): Promise<any> => {
  await midiStore.actions.loadMidi();
  const { input, output } = await midiStore.actions.findInputOutput(inputId);

  state.inputId = inputId;
  state.input = input as Input;
  state.output = output as Output;

  state.input.removeListener("sysex"); // make sure we don't duplicate listeners
  state.input.addListener("sysex", "all", handleSysExEvent);
  attachMidiEventHandlers(state.input);

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
  state.connectionState = DeviceConnectionState.Open;
  state.connectionPromise = (null as unknown) as Promise<any>;
  startConnectionWatcher();

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
  state.connectionState = DeviceConnectionState.Pending;

  // All subsequent connect attempts should receive the same promise as response
  state.connectionPromise = connectDeviceStoreToInput(inputId);

  return state.connectionPromise;
};

export const closeConnection = async (): Promise<any> => {
  state.connectionState = DeviceConnectionState.Closed;
  await sendMessage({
    command: SysExCommand.CloseConnection,
    handler: () => (state.connectionState = DeviceConnectionState.Closed),
  });
};

export const ensureConnection = async (): Promise<any> => {
  if (state.connectionState !== DeviceConnectionState.Closed) {
    return;
  }

  await sendMessage({
    command: SysExCommand.Handshake,
    handler: () => ({}),
  });
  state.connectionState = DeviceConnectionState.Open;
};

export const startBootLoaderMode = async (): Promise<any> => {
  await sendMessage({
    command: SysExCommand.BootloaderMode,
    handler: () => logger.log("Bootloader mode started"),
  });
};

interface IOpenDeckRelease {
  url: string;
  id: string;
  node_id: string;
  name: string;
  tag_name: string;
  created_at: string;
  published_at: string;
  zipball_url: string;
  tarball_url: string;
  body: string;
  assets: Array<any>;
  html_description: string;
}

interface IOpenDeckTag {
  name: string;
  zipball_url: string;
  tarball_url: string;
  commit: {
    sha: string;
    url: string;
  };
  node_id: string;
}

const ghTagsUrl = "https://api.github.com/repos/paradajz/OpenDeck/tags";
const ghContentsUrl = "https://api.github.com/repos/paradajz/OpenDeck/contents";
const ghReleasesUrl = "https://api.github.com/repos/paradajz/OpenDeck/releases";

export const startFirmwareUpdate = async (
  tagNameTouse: string,
): Promise<Array<IOpenDeckTag>> => {
  try {
    const tags: IOpenDeckTag[] = await fetch(ghTagsUrl).then((response) =>
      response.json(),
    );
    const release = tags.filter((tag) => tag.name === tagNameTouse);

    if (!release.length) {
      logger.error("Cannot find firmware upate tag");
      return;
    }

    if (release.length > 1) {
      logger.error("Multiple firmware update tags found");
      return;
    }

    const fwFilePath = state.firmwareFileLocation;

    const tag = release[0];
    const sourceFileUrl = `${ghContentsUrl}/${fwFilePath}?ref=${tag.name}`;

    const sourceFileJson: IOpenDeckTag[] = await fetch(
      sourceFileUrl,
    ).then((response) => response.json());

    const sourceFileRaw: IOpenDeckTag[] = await fetch(
      sourceFileJson.download_url,
    );

    const firmwareContents = await sourceFileRaw.text();

    logger.log(firmwareContents);
  } catch (error) {
    logger.error("Error while processing firmware update", error);
  }
};

export const startUpdatesCheck = async (): Promise<Array<IOpenDeckRelease>> => {
  const releases = await fetch(ghReleasesUrl).then((response) =>
    response.json(),
  );

  const currentVersion = state.firmwareVersion;

  return releases
    .filter(
      (release) =>
        release.name.length && semverGt(release.name, currentVersion),
    )
    .map((release) => ({
      html_description: marked(release.body, { headerIds: false }),
      ...release,
    }));
};

export const startFactoryReset = async (): Promise<any> => {
  const handler = () => logger.log("Bootloader mode started");
  await sendConnectionAffectingMessage(SysExCommand.FactoryReset, handler);
};

export const startReboot = async (): Promise<any> => {
  const handler = () => logger.log("Reboot mode started");
  await sendConnectionAffectingMessage(SysExCommand.Reboot, handler);
};

const sendConnectionAffectingMessage = async (
  command: SysExCommand,
  handler: () => void,
): Promise<any> => {
  state.connectionState = DeviceConnectionState.Pending;

  await sendMessage({
    command: SysExCommand.Handshake,
    handler: () => ({}),
  });

  await sendMessage({
    command,
    handler,
  });

  // Note: connection watcher will handle reconnecting after restart/factory reset
};

const getBoardDefinition = (value: number[]): IBoardDefinition => {
  const board = Boards.find(
    (b: any) =>
      arrayEqual(b.id, value) || (b.oldId && arrayEqual(b.oldId, value)),
  );

  return board;
};

const loadDeviceInfo = async (): Promise<any> => {
  await sendMessage({
    command: SysExCommand.GetHardwareUid,
    handler: (value: number[]) => {
      const board = getBoardDefinition(value);
      const boardName = (board && board.name) || "UNKNOWN BOARD";
      const firmwareFileLocation = board && board.firmwareFileLocation;

      setInfo({ boardName, firmwareFileLocation });
    },
  });
  await sendMessage({
    command: SysExCommand.GetNumberOfSupportedComponents,
    handler: (components: IDeviceComponentCounts) => setInfo(components),
  });
};

export const getComponentSettings = async (
  componentDefinition: Dictionary<IBlockDefinition>,
  block: number,
  definitionType: DefinitionType,
  componentIndex?: number,
): Promise<any> => {
  const settings = {} as any;

  const filterByType = (definition: IBlockDefinition) =>
    definition.type === definitionType;
  const removeDisabled = (def: IBlockDefinition) =>
    !midiStore.actions.isControlDisabled(def);

  const tasks = convertDefinitionsToArray(componentDefinition)
    .filter(filterByType)
    .filter(removeDisabled)
    .map((definition) => {
      const index =
        typeof componentIndex === "number"
          ? componentIndex
          : (definition as IBlockSettingDefinition).settingIndex;
      const config = {
        block,
        section: definition.section,
        index,
      };

      const handler = (result: number[]) => {
        settings[definition.key] = result[0];
      };

      return sendMessage({
        command: SysExCommand.GetValue,
        handler,
        config,
      }).catch((error) =>
        logger.error("Failed to read component config", error),
      );
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
  handler: (val: any) => void,
): Promise<any> =>
  sendMessage({
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
  closeConnection: () => Promise<void>;
  ensureConnection: () => Promise<void>;
  loadDeviceInfo: () => Promise<void>;
  startUpdatesCheck: () => Promise<void>;
  startBootLoaderMode: () => Promise<void>;
  startFactoryReset: () => Promise<void>;
  startReboot: () => Promise<void>;
  startConnectionWatcher: () => void;
  startFirmwareUpdate: () => Promise<void>;
  getComponentSettings: (
    definition: Dictionary<IBlockDefinition>,
    block: Block,
    definitionType: DefinitionType,
    customIndex?: number,
  ) => Promise<any>;
  setComponentSectionValue: (
    config: IGetValueOptions,
    value: number,
    handler: () => void,
  ) => Promise<any>;
}

export const deviceStoreActions: IDeviceActions = {
  setInfo,
  connectDevice,
  closeConnection,
  ensureConnection,
  startUpdatesCheck,
  startBootLoaderMode,
  startFactoryReset,
  startReboot,
  startConnectionWatcher,
  startFirmwareUpdate,
  loadDeviceInfo,
  getComponentSettings,
  setComponentSectionValue,
};
