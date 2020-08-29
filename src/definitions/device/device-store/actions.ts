import semverGt from "semver/functions/gt";
import marked from "marked";
import { Input, Output } from "webmidi";
import FileSaver from "file-saver";

import {
  logger,
  delay,
  arrayEqual,
  convertToHex,
  hexToDec,
} from "../../../util";
import { Request } from "../../../definitions";
import router from "../../../router";
import {
  Request,
  ISectionDefinition,
  SectionType,
  Block,
  BlockMap,
  IOpenDeckRelease,
  IOpenDeckTag,
  GitHubTagsUrl,
  GitHubContentsUrl,
  GitHubReleasesUrl,
  getBoardDefinition,
} from "../../../definitions";
import { midiStore } from "../../midi";

import {
  IDeviceState,
  IRequestConfig,
  DeviceConnectionState,
  ControlDisableType,
} from "./interface";
import { deviceState, defaultState } from "./state";
import { sendMessage, handleSysExEvent } from "./request-qeueue";
import {
  attachMidiEventHandlers,
  detachMidiEventHandlers,
} from "./midi-event-handlers";

let connectionWatcherTimer = null;

// Actions

const isControlDisabled = (def: ISectionDefinition): boolean =>
  deviceState.unsupportedComponents[def.block][def.key];

export const disableControl = (
  def: ISectionDefinition,
  type: ControlDisableType,
): void =>
  (deviceState.unsupportedComponents[def.block][def.key] = type || !type);

const reset = (): void => {
  if (deviceState.input) {
    sendMessage({
      command: Request.CloseConnection,
      handler: () =>
        (deviceState.connectionState = DeviceConnectionState.Closed),
    });
    deviceState.input.removeListener("sysex", "all"); // make sure we don't duplicate listeners
    detachMidiEventHandlers(deviceState.input);
  }

  Object.assign(deviceState, defaultState);
};

const setInfo = (data: Partial<IDeviceState>): void => {
  Object.assign(deviceState, data);
};

const connectionWatcher = async (): Promise<void> => {
  stopDeviceConnectionWatcher();

  try {
    if (!deviceState.outputId) {
      return router.push({ name: "home" });
    }

    const output = await midiStore.actions.findOutputById(deviceState.outputId);
    if (!output) {
      return router.push({ name: "home" });
    }

    if (deviceState.connectionState !== DeviceConnectionState.Open) {
      await connectDevice(deviceState.outputId);
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
  const matched = await midiStore.actions.matchInputOutput(outputId);
  const { input, output } = matched;

  deviceState.outputId = outputId;
  deviceState.input = input as Input;
  deviceState.output = output as Output;

  // make sure we don't duplicate listeners
  deviceState.input.removeListener("sysex", "all");
  deviceState.input.addListener("sysex", "all", handleSysExEvent);
  detachMidiEventHandlers(deviceState.input);
  attachMidiEventHandlers(deviceState.input);

  // Handshake is required before any communication
  await sendMessage({
    command: Request.Handshake,
    handler: () => ({}),
  });

  try {
    await sendMessage({
      command: Request.GetValueSize,
      handler: (valueSize: number) => setInfo({ valueSize }),
    });
  } catch (err) {
    setInfo({ valueSize: 1 });
    logger.error("Failed to read valueSize, assuming 1", err);
  }

  await sendMessage({
    command: Request.GetValuesPerMessage,
    handler: (valuesPerMessageRequest: number) =>
      setInfo({ valuesPerMessageRequest }),
  });
  await sendMessage({
    command: Request.GetFirmwareVersion,
    handler: (firmwareVersion: string) => setInfo({ firmwareVersion }),
  });
  deviceState.connectionState = DeviceConnectionState.Open;
  deviceState.connectionPromise = (null as unknown) as Promise<any>;
  startDeviceConnectionWatcher();

  // These requests won't run until connection promise is finished
  await loadDeviceInfo();
};

const connectDevice = async (outputId: string): Promise<void> => {
  if (typeof outputId !== "string") {
    throw new Error("MISSING OR INVALID DEVICE OUTPUT ID");
  }

  if (deviceState.connectionPromise) {
    return deviceState.connectionPromise;
  }
  deviceState.connectionState = DeviceConnectionState.Pending;

  // All subsequent connect attempts should receive the same promise as response
  deviceState.connectionPromise = connectDeviceStoreToInput(outputId);

  return deviceState.connectionPromise;
};

export const closeConnection = async (): Promise<void> => {
  stopDeviceConnectionWatcher();
  reset();
};

export const ensureConnection = async (): Promise<void> => {
  if (deviceState.connectionState !== DeviceConnectionState.Closed) {
    return;
  }

  await sendMessage({
    command: Request.Handshake,
    handler: () => ({}),
  });
  deviceState.connectionState = DeviceConnectionState.Open;
};

export const startBootLoaderMode = async (): Promise<void> => {
  await sendMessage({
    command: Request.BootloaderMode,
    handler: () => logger.log("Bootloader mode started"),
  });
};

export const startFirmwareUpdate = async (
  tagNameTouse: string,
): Promise<Array<IOpenDeckTag>> => {
  try {
    const tags: IOpenDeckTag[] = await fetch(GitHubTagsUrl).then((response) =>
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

    const fwFilePath = deviceState.firmwareFileLocation;

    const tag = release[0];
    const sourceFileUrl = `${GitHubContentsUrl}/${fwFilePath}?ref=${tag.name}`;

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
  const releases = await fetch(GitHubReleasesUrl).then((response) =>
    response.json(),
  );

  const currentVersion = deviceState.firmwareVersion;

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

export const startFactoryReset = async (): Promise<void> => {
  const handler = () => logger.log("Bootloader mode started");
  await sendMessageAndRebootUi(Request.FactoryReset, handler);
};

export const startReboot = async (): Promise<void> => {
  const handler = () => logger.log("Reboot mode started");
  await sendMessageAndRebootUi(Request.Reboot, handler);
};

const sendMessageAndRebootUi = async (
  command: Request,
  handler: () => void,
): Promise<any> => {
  deviceState.connectionState = DeviceConnectionState.Pending;

  await sendMessage({
    command: Request.Handshake,
    handler: () => ({}),
  });

  sendMessage({
    command,
    handler,
  });

  // Note: router.push doesn't perform url change for some reason, so doing it the old way
  window.location = "/";

  return delay(50).then(closeConnection);
};

const loadDeviceInfo = async (): Promise<void> => {
  await sendMessage({
    command: Request.IdentifyBoard,
    handler: (value: number[]) => {
      const board = getBoardDefinition(value);
      const boardName = (board && board.name) || "UNKNOWN BOARD";
      const firmwareFileLocation = board && board.firmwareFileLocation;

      setInfo({ boardName, firmwareFileLocation });
    },
  });
  await sendMessage({
    command: Request.GetNumberOfSupportedComponents,
    handler: (numberOfComponents: array[]) => setInfo({ numberOfComponents }),
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

// Backup

const startRestore = async (file: File): Promise<void> => {
  const fileContent = await file.text();
  const decodeHexMessageRow = (row: string) => row.split(" ").map(hexToDec);
  const trimKnownBytes = (msg: number[]) => msg.slice(4, -1); // webmidi.js adds these

  const messages = fileContent
    .split("\r\n")
    .map(decodeHexMessageRow)
    .map(trimKnownBytes);

  let errors = false;

  const sendBackupRestoreReq = async (payload) => {
    return sendMessage({
      command: Request.RestoreBackup,
      payload,
      handler: () => null,
    }).catch((error) => {
      logger.error("Failed to restore backup value", error);
      errors = true;
    });
  };

  // Limit to 10 mesages per second
  const startDelayed = (payload) => {
    return delay(100).then(() => sendBackupRestoreReq(payload));
  };

  const promiseChain = messages.reduce((start, payload) => {
    return start
      .then(() => startDelayed(payload))
      .catch(() => startDelayed(payload));
  }, Promise.resolve());

  await promiseChain.catch((error) => {
    logger.error("Backup failed", error);
    errors = true;
  });

  const msg = errors ? "Backup finished with errors" : "Backup finished";
  alert(msg);
};

const startBackup = async (): Promise<void> => {
  let receivedCount = 0;
  let firstResponse = null;
  const backupData = [];

  const handler = (data) => {
    if (!receivedCount) {
      firstResponse = data;
    }
    const isLastMessage = receivedCount && arrayEqual(firstResponse, data);
    const isFirstMessage = receivedCount === 0;

    receivedCount = receivedCount + 1;
    if (!isFirstMessage && !isLastMessage) {
      backupData.push(data.map(convertToHex).join(" "));
    }

    if (isLastMessage) {
      const blob = new Blob([backupData.join("\r\n")], {
        type: "text/plain;charset=utf-8",
      });

      const timeString = new Date()
        .toISOString()
        .slice(0, -8)
        .replace(":", "-")
        .replace("T", "-");

      FileSaver.saveAs(blob, `OpenDeckUI-Backup-${timeString}.sysex`);
    }

    // Signal End of broadcast when response is identical to the first one
    return isLastMessage;
  };

  sendMessage({
    command: Request.Backup,
    handler,
  }).catch((error) => logger.error("Failed to read component config", error));
};

// Section / Component values

const filterSectionsByType = (
  sectionDef: ISectionDefinition,
  type: SectionType,
) => sectionDef.type === type;

const filterOutDisabledSections = (sectionDef: ISectionDefinition) =>
  !isControlDisabled(sectionDef);

const filterOutMsbSections = (sectionDef: ISectionDefinition) =>
  deviceState.valueSize === 1 || !sectionDef.isMsb;

export const getComponentSettings = async (
  block: Block,
  sectionType: SectionType,
  componentIndex?: number,
): Promise<any> => {
  await ensureConnection();

  const settings = {} as any;
  if (!BlockMap[block]) {
    throw new Error(`Block definition not found in BlockMap ${block}`);
  }
  const { sections } = BlockMap[block];

  const tasks = Object.values(sections)
    .filter((sectionDef) => filterSectionsByType(sectionDef, sectionType))
    .filter(filterOutDisabledSections)
    .filter(filterOutMsbSections)
    .map((sectionDef) => {
      const { key, section, onLoad, settingIndex } = sectionDef;
      const index =
        typeof componentIndex === "number" ? componentIndex : settingIndex;

      const handler = (res: number[]): void => {
        const val = res[0];
        settings[key] = val;

        if (onLoad) {
          onLoad(val);
        }
      };

      return sendMessage({
        command: Request.GetValue,
        handler,
        config: { block, section, index },
      }).catch((error) =>
        logger.error("Failed to read component config", error),
      );
    });

  await Promise.all(tasks);

  return settings;
};

export const setComponentSectionValue = async (
  config: IRequestConfig,
  handler: (val: any) => void,
): Promise<void> =>
  sendMessage({
    command: Request.SetValue,
    handler,
    config,
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
  isControlDisabled: (def: ISectionDefinition) => boolean;
  disableControl: (def: ISectionDefinition) => void;
  startBackup: () => Promise<void>;
  startRestore: (file: File) => Promise<void>;
  getComponentSettings: (
    definition: Dictionary<ISectionDefinition>,
    block: Block,
    sectionType: SectionType,
    customIndex?: number,
  ) => Promise<any>;
  setComponentSectionValue: (
    config: IRequestConfig,
    value: number,
    handler: () => void,
  ) => Promise<any>;
}

export const deviceStoreActions: IDeviceActions = {
  reset,
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
  isControlDisabled,
  disableControl,
  startBackup,
  startRestore,
  getComponentSettings,
  setComponentSectionValue,
};
