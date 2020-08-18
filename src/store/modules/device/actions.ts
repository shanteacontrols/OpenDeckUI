import semverGt from "semver/functions/gt";
import marked from "marked";
import {
  state,
  defaultState,
  IDeviceState,
  DeviceConnectionState,
} from "./state";
import {
  Request,
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
import {
  attachMidiEventHandlers,
  detachMidiEventHandlers,
} from "./midi-event-handlers";
import { Input, Output } from "webmidi";
import { midiStore } from "../midi";
import { logger, arrayEqual } from "../../../util";
import { Request } from "../../../definitions";
import router from "../../../router";

// Actions

const setInfo = (data: Partial<IDeviceState>): void => {
  Object.assign(state, data);
};

let connectionWatcherTimer = null;

const connectionWatcher = async (): Promise<void> => {
  stopDeviceConnectionWatcher();

  try {
    if (!state.outputId) {
      return router.push({ name: "home" });
    }

    const output = await midiStore.actions.findOutputById(state.outputId);
    if (!output) {
      return router.push({ name: "home" });
    }

    if (state.connectionState !== DeviceConnectionState.Open) {
      await connectDevice(state.outputId);
    }
  } catch (err) {
    logger.error("Device connection watcher error", err);
    return router.push({ name: "home" });
  }

  connectionWatcherTimer = setTimeout(() => connectionWatcher(), 1000);
};

const startDeviceConnectionWatcher = (): Promise<void> => connectionWatcher();

const stopDeviceConnectionWatcher = (): Promise<void> => {
  if (connectionWatcherTimer) {
    clearTimeout(connectionWatcherTimer);
    connectionWatcherTimer = null;
  }
};

export const connectDeviceStoreToInput = async (
  outputId: string,
): Promise<any> => {
  await midiStore.actions.loadMidi();
  const { input, output } = await midiStore.actions.matchInputOutput(outputId);

  state.outputId = outputId;
  state.input = input as Input;
  state.output = output as Output;

  state.input.removeListener("sysex", "all"); // make sure we don't duplicate listeners
  detachMidiEventHandlers(state.input);

  state.input.addListener("sysex", "all", handleSysExEvent);
  attachMidiEventHandlers(state.input);

  await sendMessage({
    command: Request.Handshake,
    handler: () => ({}),
  });
  await sendMessage({
    command: Request.GetValueSize,
    handler: (valueSize: number) => setInfo({ valueSize }),
  });
  await sendMessage({
    command: Request.GetValuesPerMessage,
    handler: (valuesPerMessageRequest: number) =>
      setInfo({ valuesPerMessageRequest }),
  });
  await sendMessage({
    command: Request.GetFirmwareVersion,
    handler: (firmwareVersion: string) => setInfo({ firmwareVersion }),
  });
  state.connectionState = DeviceConnectionState.Open;
  state.connectionPromise = (null as unknown) as Promise<any>;
  startDeviceConnectionWatcher();

  // These requests won't run until connection promise is finished
  await loadDeviceInfo();
};

const connectDevice = async (outputId: string): Promise<void> => {
  if (typeof outputId !== "string") {
    throw new Error("MISSING OR INVALID DEVICE OUTPUT ID");
  }

  if (state.connectionPromise) {
    return state.connectionPromise;
  }
  state.connectionState = DeviceConnectionState.Pending;

  // All subsequent connect attempts should receive the same promise as response
  state.connectionPromise = connectDeviceStoreToInput(outputId);

  return state.connectionPromise;
};

export const closeConnection = async (): Promise<any> => {
  stopDeviceConnectionWatcher();
  if (state.input) {
    state.input.removeListener("sysex", "all"); // make sure we don't duplicate listeners
    detachMidiEventHandlers(state.input);
    sendMessage({
      command: Request.CloseConnection,
      handler: () => (state.connectionState = DeviceConnectionState.Closed),
    });
  }

  state.connectionState = DeviceConnectionState.Closed;
  Object.assign(state, defaultState);
};

export const ensureConnection = async (): Promise<any> => {
  if (state.connectionState !== DeviceConnectionState.Closed) {
    return;
  }

  await sendMessage({
    command: Request.Handshake,
    handler: () => ({}),
  });
  state.connectionState = DeviceConnectionState.Open;
};

export const startBootLoaderMode = async (): Promise<any> => {
  await sendMessage({
    command: Request.BootloaderMode,
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
  await sendConnectionAffectingMessage(Request.FactoryReset, handler);
};

export const startReboot = async (): Promise<any> => {
  const handler = () => logger.log("Reboot mode started");
  await sendConnectionAffectingMessage(Request.Reboot, handler);
};

const sendConnectionAffectingMessage = async (
  command: Request,
  handler: () => void,
): Promise<any> => {
  state.connectionState = DeviceConnectionState.Pending;

  await sendMessage({
    command: Request.Handshake,
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
    command: Request.GetHardwareUid,
    handler: (value: number[]) => {
      const board = getBoardDefinition(value);
      const boardName = (board && board.name) || "UNKNOWN BOARD";
      const firmwareFileLocation = board && board.firmwareFileLocation;

      setInfo({ boardName, firmwareFileLocation });
    },
  });
  await sendMessage({
    command: Request.GetNumberOfSupportedComponents,
    handler: (components: IDeviceComponentCounts) => setInfo(components),
  });
  try {
    await sendMessage({
      command: Request.GetBootLoaderSupport,
      handler: (bootLoaderSupport: string) => setInfo({ bootLoaderSupport }),
    });
  } catch (err) {
    logger.error(
      "Error while checking for bootloader support, setting to false",
      err,
    );
    setInfo({ bootLoaderSupport: false });
  }

  await sendMessage({
    command: Request.GetNumberOfSupportedPresets,
    handler: (supportedPresetsCount: number) =>
      setInfo({ supportedPresetsCount }),
  });
};

export const getComponentSettings = async (
  componentDefinition: Dictionary<IBlockDefinition>,
  block: number,
  definitionType: DefinitionType,
  componentIndex?: number,
): Promise<any> => {
  await ensureConnection();

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
        if (definition.onLoad) {
          definition.onLoad(result[0]);
        }
      };

      return sendMessage({
        command: Request.GetValue,
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
    command: Request.SetValue,
    handler,
    config: {
      ...config,
      value,
    },
  });

// Export

export interface IDeviceActions {
  setInfo: (data: Partial<IDeviceState>) => void;
  connectDevice: (outputId: string) => Promise<void>;
  closeConnection: () => Promise<void>;
  ensureConnection: () => Promise<void>;
  loadDeviceInfo: () => Promise<void>;
  startUpdatesCheck: () => Promise<void>;
  startBootLoaderMode: () => Promise<void>;
  startFactoryReset: () => Promise<void>;
  startReboot: () => Promise<void>;
  startDeviceConnectionWatcher: () => void;
  stopDeviceConnectionWatcher: () => void;
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
  startDeviceConnectionWatcher,
  stopDeviceConnectionWatcher,
  startFirmwareUpdate,
  loadDeviceInfo,
  getComponentSettings,
  setComponentSectionValue,
};
