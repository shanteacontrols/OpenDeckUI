import semverGt from "semver/functions/gt";
import semverClean from "semver/functions/clean";
import semverGte from "semver/functions/gte";
import marked from "marked";
import { Input, Output } from "webmidi";
import FileSaver from "file-saver";
import { logger, delay, arrayEqual, convertToHex } from "../../../util";
import router from "../../../router";
import {
  Request,
  ISectionDefinition,
  SectionType,
  BlockMap,
  IOpenDeckRelease,
  GitHubReleasesUrl,
  getBoardDefinition,
} from "../../../definitions";
import { Block } from "../../interface";
import {
  sendMessagesFromFileWithDelay,
  newLineCharacter,
} from "./actions-utility";
import { midiStore } from "../../midi";
import { requestLog } from "../../request-log";
import { alertPrompt } from "../../../composables";
import {
  IDeviceState,
  IRequestConfig,
  DeviceConnectionState,
  ControlDisableType,
  DfuState,
  DfuTransport,
  webUsbDfuVirtualOutputId,
} from "./interface";
import {
  getNetworkDfuAddressFromOutputId,
  getWebConfigAddressFromOutputId,
  isNetworkDfuOutputId,
  isWebConfigOutputId,
  MidiSysExTransport,
  NetworkDfuTransport,
  SysExTransportType,
  takeNetworkDfuTransport,
  WebConfigSysExTransport,
} from "./transports";
import { deviceState, defaultState, IViewSettingState } from "./state";
import { sendMessage, handleSysExEvent, resetQueue } from "./request-qeueue";
import {
  attachMidiEventHandlers,
  detachMidiEventHandlers,
} from "./midi-event-handlers";
import {
  BLESSING_ACCESS_CONTACT_MESSAGE,
  BLESSING_CONFIG_FEATURE,
  buildConfigUnlockToken,
  verifyBlessing,
} from "../../blessing";

let connectionWatcherTimer = null;
let heartbeatTimer = null;
let heartbeatInFlight = false;
let activeDfuDevice = null;
let activeDfuOutEndpoint = null;
let activeDfuInEndpoint = null;
let dfuStatusReaderPromise = null;

const appReconnectTimeoutMs = 45000;
const appDisconnectTimeoutMs = 8000;
const rebootHandshakeTimeoutMs = 2000;
const devicePollIntervalMs = 250;
const heartbeatIntervalMs = 2000;
const heartbeatTimeoutMs = 2500;
const dfuChunkSize = 64;
const webUsbFinalizeTimeoutMs = 5000;
const opendeckUsbVendorId = 0x1209;
const opendeckWebUsbDfuProductId = 0x8474;
const blessingMinimumFirmwareVersion = "8.0.0";

// Actions

const isControlDisabled = (def: ISectionDefinition): ControlDisableType =>
  deviceState.unsupportedComponents[def.block][def.key];

export const disableControl = (
  def: ISectionDefinition,
  type: ControlDisableType,
): void =>
  (deviceState.unsupportedComponents[def.block][def.key] = type || !type);

const resetDeviceStore = async (): void => {
  resetQueue();

  if (deviceState.input) {
    deviceState.input.removeListener("sysex", "all"); // make sure we don't duplicate listeners
    detachMidiEventHandlers(deviceState.input);
  }

  if (deviceState.transport) {
    deviceState.transport.close();
  }

  Object.assign(deviceState, defaultState);
};

const setInfo = (data: Partial<IDeviceState>): void => {
  Object.assign(deviceState, data);
};

const isBlessingRequiredForFirmware = (firmwareVersion: string): boolean => {
  const version =
    typeof firmwareVersion === "string" ? semverClean(firmwareVersion) : null;

  return !!version && semverGte(version, blessingMinimumFirmwareVersion);
};

const isBlessingRequired = (isKnownBoard: boolean): boolean =>
  isBlessingRequiredForFirmware(deviceState.firmwareVersion) || !isKnownBoard;

const resetBlessingState = (): void => {
  deviceState.isBlessingRequired = false;
  deviceState.isConfigBlessed = true;
  deviceState.blessingFeatures = [];
  deviceState.blessingError = (null as unknown) as string;
};

const unlockFirmwareConfiguration = async (): Promise<void> => {
  const token = buildConfigUnlockToken(deviceState.serialNumber);

  logger.log("Configuration unlock token", token);

  for (let index = 0; index < token.length; index++) {
    logger.log("Sending configuration unlock word", {
      index,
      value: token[index],
    });

    await sendMessage({
      command: Request.ConfigUnlock,
      handler: () => null,
      config: {
        block: Block.Global,
        section: 0,
        index,
        value: token[index],
      },
    });
  }
};

const requestAndVerifyBlessing = async (
  isKnownBoard: boolean,
): Promise<void> => {
  const isRequired = isBlessingRequired(isKnownBoard);

  logger.log("Blessing check", {
    firmwareVersion: deviceState.firmwareVersion,
    isKnownBoard,
    isRequired,
  });

  deviceState.isBlessingRequired = isRequired;
  deviceState.isConfigBlessed = !isRequired;
  deviceState.blessingFeatures = [];
  deviceState.blessingError = (null as unknown) as string;

  if (!isRequired) {
    return;
  }

  if (
    !isBlessingRequiredForFirmware(deviceState.firmwareVersion) &&
    !isKnownBoard
  ) {
    deviceState.blessingError = BLESSING_ACCESS_CONTACT_MESSAGE;
    return;
  }

  try {
    await sendMessage({
      command: Request.GetSerialNumber,
      handler: (serialNumber: string) => setInfo({ serialNumber }),
    });
    logger.log("Blessing serial number received", deviceState.serialNumber);
  } catch (error) {
    logger.warn("Device does not provide a serial number for blessing", error);
    deviceState.serialNumber = (null as unknown) as string;
    deviceState.blessingError =
      "Device firmware does not provide a serial number for blessing";
    return;
  }

  const blessing = await verifyBlessing(deviceState.serialNumber);
  logger.log("Blessing verification result", blessing);
  deviceState.blessingFeatures = blessing.features;
  deviceState.isConfigBlessed =
    blessing.valid && blessing.features.includes(BLESSING_CONFIG_FEATURE);
  deviceState.blessingError = deviceState.isConfigBlessed
    ? ((null as unknown) as string)
    : blessing.error || BLESSING_ACCESS_CONTACT_MESSAGE;

  if (!deviceState.isConfigBlessed) {
    return;
  }

  if (isBlessingRequiredForFirmware(deviceState.firmwareVersion)) {
    try {
      await unlockFirmwareConfiguration();
    } catch (error) {
      logger.warn("Device rejected configuration unlock", error);
      deviceState.isConfigBlessed = false;
      deviceState.blessingError = "Device rejected configuration unlock";
    }
  }
};

export const setViewSetting = (
  block: Block,
  setting: IViewSettingState,
): void => {
  // Reset page if changing paging options
  if (
    setting.itemsPerPage &&
    setting.itemsPerPage !== deviceState.viewSettings[block].itemsPerPage
  ) {
    deviceState.viewSettings[block].currentPage = 1;
  }
  Object.assign(deviceState.viewSettings[block], setting);
};

const connectionWatcher = async (): Promise<void> => {
  stopDeviceConnectionWatcher();

  try {
    if (deviceState.dfuState !== DfuState.Idle) {
      return;
    }

    if (!deviceState.outputId) {
      return router.push({ name: "home" });
    }

    if (!isWebConfigOutputId(deviceState.outputId)) {
      const output = await midiStore.actions.findOutputById(
        deviceState.outputId,
      );
      if (!output) {
        return router.push({ name: "home" });
      }
    }
  } catch (err) {
    logger.error("Device connection watcher error", err);
    return router.push({ name: "home" });
  }

  connectionWatcherTimer = setTimeout(() => connectionWatcher(), 1000);
};

const stopDeviceHeartbeat = (): void => {
  if (heartbeatTimer) {
    clearTimeout(heartbeatTimer);
    heartbeatTimer = null;
  }

  heartbeatInFlight = false;
};

const shouldRunDeviceHeartbeat = (): boolean =>
  deviceState.connectionState === DeviceConnectionState.Open &&
  deviceState.dfuState === DfuState.Idle &&
  !deviceState.isBootloaderMode &&
  !deviceState.isSystemOperationRunning &&
  !!deviceState.transport;

const navigateHome = async (): Promise<void> => {
  try {
    await router.replace({ name: "home" });
  } catch (error) {
    logger.warn("Failed to navigate home through router", error);
  }
};

const handleHeartbeatFailure = async (error: unknown): Promise<void> => {
  logger.warn("Device heartbeat failed", error);
  disconnectCurrentMidiSession();
  await midiStore.actions.assignInputs();
  await navigateHome();
};

const scheduleDeviceHeartbeat = (): void => {
  if (heartbeatTimer) {
    clearTimeout(heartbeatTimer);
  }

  if (!shouldRunDeviceHeartbeat()) {
    heartbeatTimer = null;
    return;
  }

  heartbeatTimer = setTimeout(() => {
    runDeviceHeartbeat();
  }, heartbeatIntervalMs);
};

const runDeviceHeartbeat = async (): Promise<void> => {
  heartbeatTimer = null;

  if (!shouldRunDeviceHeartbeat()) {
    return;
  }

  if (heartbeatInFlight) {
    scheduleDeviceHeartbeat();
    return;
  }

  heartbeatInFlight = true;

  try {
    await sendMessage({
      command: Request.Handshake,
      handler: () => null,
      timeoutMs: heartbeatTimeoutMs,
    });
    heartbeatInFlight = false;
    scheduleDeviceHeartbeat();
  } catch (error) {
    heartbeatInFlight = false;

    if (shouldRunDeviceHeartbeat()) {
      await handleHeartbeatFailure(error);
    }
  }
};

const startDeviceHeartbeat = (): void => {
  heartbeatInFlight = false;
  scheduleDeviceHeartbeat();
};

const startDeviceConnectionWatcher = (): Promise<void> =>
  // Prevent connection watcher from causing duplicate redirects on reconnect
  delay(5000).then(connectionWatcher);

const stopDeviceConnectionWatcher = (): Promise<void> => {
  if (connectionWatcherTimer) {
    clearTimeout(connectionWatcherTimer);
    connectionWatcherTimer = null;
  }
};

const setDfuState = (
  state: DfuState,
  data: Partial<IDeviceState> = {},
): void => {
  if (state !== DfuState.Idle) {
    stopDeviceHeartbeat();
  }

  Object.assign(deviceState, {
    dfuState: state,
    ...data,
  });
};

const resetDfuState = (): void => {
  setDfuState(DfuState.Idle, {
    dfuTransport: (null as unknown) as DfuTransport,
    dfuProgress: (null as unknown) as number,
    dfuStatusLog: [],
    dfuError: (null as unknown) as string,
    dfuDeviceLabel: (null as unknown) as string,
  });
};

const appendDfuStatus = (
  message: string,
  source: "host" | "device" = "host",
): void => {
  if (!message) {
    return;
  }

  deviceState.dfuStatusLog.push(message);
  if (
    [
      "The selected WebUSB DFU device could not be opened.",
      "No WebUSB DFU device was selected.",
      "Failed to connect to the WebUSB DFU device.",
      "Firmware upload failed.",
      "The DFU device was disconnected.",
      "Device did not leave DFU mode",
      "Firmware uploaded, but the application did not reconnect.",
      "No DFU device was detected after the reboot request.",
      "The device did not reconnect in time.",
      "Timed out while waiting for the device to reboot.",
    ].some((pattern) => message.startsWith(pattern)) ||
    message.startsWith("Upload failed:")
  ) {
    requestLog.actions.addError({ message });
  } else {
    requestLog.actions.addSystem(message, source);
  }
};

const getNavigatorUsb = (): any => {
  if (typeof navigator === "undefined") {
    return null;
  }

  return (navigator as any).usb || null;
};

const disconnectCurrentMidiSession = (): void => {
  resetQueue();
  stopDeviceConnectionWatcher();
  stopDeviceHeartbeat();

  if (deviceState.input) {
    deviceState.input.removeListener("sysex", "all");
    detachMidiEventHandlers(deviceState.input);
  }

  if (deviceState.transport) {
    deviceState.transport.close();
  }

  if (deviceState.networkDfuTransport) {
    deviceState.networkDfuTransport.close();
  }

  deviceState.input = (null as unknown) as Input;
  deviceState.output = (null as unknown) as Output;
  deviceState.transport = defaultState.transport;
  deviceState.networkDfuTransport = defaultState.networkDfuTransport;
  deviceState.transportType = defaultState.transportType;
  deviceState.outputId = (null as unknown) as string;
  deviceState.connectionPromise = (null as unknown) as Promise<any>;
  deviceState.connectionState = DeviceConnectionState.Closed;
  deviceState.isBootloaderMode = false;
};

const hardReloadToRoute = (target: {
  name: string;
  params?: Record<string, any>;
}): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const resolvedTarget = router.resolve(target).href;
  const reloadUrl = new URL(window.location.href);
  const targetHash = resolvedTarget.includes("#")
    ? resolvedTarget.slice(resolvedTarget.indexOf("#") + 1)
    : resolvedTarget.replace(/^\/+/, "");

  reloadUrl.search = `reconnect=${Date.now()}`;
  reloadUrl.hash = targetHash.startsWith("/") ? targetHash : `/${targetHash}`;
  window.location.replace(reloadUrl.toString());
  return true;
};

const finishDfuAndReturnHome = async (
  dfuTransport: DfuTransport,
): Promise<void> => {
  const completionMessage =
    dfuTransport === DfuTransport.Network
      ? "Firmware update is complete. The UI will now return to the home page. Connect to the device again using its IP address or default mDNS name."
      : "Firmware update is complete. The UI will now return to the home page and scan for USB devices again.";

  await alertPrompt("DFU complete", completionMessage, "Return home");

  resetDfuState();

  if (hardReloadToRoute({ name: "home" })) {
    return;
  }

  await navigateHome();
};

const finishBootloaderEntryAndReturnHome = async (): Promise<void> => {
  resetDfuState();
  await navigateHome();
};

const waitForCondition = async (
  condition: () => Promise<boolean>,
  timeoutMs: number,
): Promise<boolean> => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await condition()) {
      return true;
    }

    await delay(devicePollIntervalMs);
  }

  return false;
};

const waitForApplicationReconnect = async (
  outputId: string,
): Promise<boolean> => {
  return waitForCondition(async () => {
    try {
      deviceState.connectionState = DeviceConnectionState.Pending;
      await connectDeviceStoreToInput(outputId);
      return true;
    } catch (error) {
      disconnectCurrentMidiSession();
      return false;
    }
  }, appReconnectTimeoutMs);
};

const waitForApplicationDisconnect = async (): Promise<boolean> =>
  waitForCondition(async () => {
    try {
      // Firmware accepts the reboot command before the transport actually drops.
      // Wait for handshake failure so reconnect does not attach to the old session.
      await sendMessage({
        command: Request.Handshake,
        handler: () => null,
        timeoutMs: rebootHandshakeTimeoutMs,
      });
      return false;
    } catch (error) {
      return true;
    }
  }, appDisconnectTimeoutMs);

const waitForDfuDisconnect = async (): Promise<boolean> =>
  waitForCondition(async () => {
    if (!activeDfuDevice) {
      return true;
    }

    try {
      await activeDfuDevice.transferIn(activeDfuInEndpoint || 0x81, 1);
      return false;
    } catch (error) {
      return true;
    }
  }, webUsbFinalizeTimeoutMs);

const closeDfuDevice = async (): Promise<void> => {
  if (activeDfuDevice && activeDfuDevice.opened) {
    try {
      await activeDfuDevice.close();
    } catch (error) {
      logger.warn("Failed to close DFU device", error);
    }
  }

  activeDfuDevice = null;
  activeDfuOutEndpoint = null;
  activeDfuInEndpoint = null;
  dfuStatusReaderPromise = null;
};

const decodeDfuStatusChunk = (value: DataView | undefined): void => {
  if (!value || !value.byteLength) {
    return;
  }

  const decoder = new TextDecoder();
  const text = decoder.decode(value);

  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => appendDfuStatus(line, "device"));
};

const startDfuStatusReader = async (): Promise<void> => {
  if (!activeDfuDevice || !activeDfuInEndpoint || dfuStatusReaderPromise) {
    return;
  }

  dfuStatusReaderPromise = (async () => {
    while (activeDfuDevice && activeDfuInEndpoint) {
      try {
        const result = await activeDfuDevice.transferIn(
          activeDfuInEndpoint,
          128,
        );
        decodeDfuStatusChunk(result.data);
      } catch (error) {
        if (
          [DfuState.Uploading, DfuState.WaitingForApplication].includes(
            deviceState.dfuState,
          )
        ) {
          appendDfuStatus("DFU device disconnected");
        }
        break;
      }
    }
  })();

  await Promise.resolve();
};

const openWebUsbDfuDevice = async (device: any): Promise<boolean> => {
  try {
    if (!device.opened) {
      await device.open();
    }

    if (!device.configuration) {
      await device.selectConfiguration(1);
    }

    await device.claimInterface(0);

    const alternate = device.configuration.interfaces[0].alternate;
    const outEndpoint = alternate.endpoints.find(
      (endpoint) => endpoint.direction === "out",
    );
    const inEndpoint = alternate.endpoints.find(
      (endpoint) => endpoint.direction === "in",
    );

    if (!outEndpoint) {
      throw new Error("Missing DFU OUT endpoint");
    }

    activeDfuDevice = device;
    activeDfuOutEndpoint = outEndpoint.endpointNumber;
    activeDfuInEndpoint = inEndpoint ? inEndpoint.endpointNumber : null;
    deviceState.isBootloaderMode = true;
    deviceState.outputId = webUsbDfuVirtualOutputId;
    deviceState.boardName =
      device.productName || device.serialNumber || "OpenDeck DFU";
    setDfuState(DfuState.DfuReady, {
      dfuTransport: DfuTransport.WebUsb,
      dfuDeviceLabel:
        device.productName || device.serialNumber || "OpenDeck DFU",
      dfuError: (null as unknown) as string,
    });
    appendDfuStatus("WebUSB DFU device connected");
    startDfuStatusReader();
    return true;
  } catch (error) {
    try {
      if (device.forget) {
        await device.forget();
      }
    } catch (forgetError) {
      logger.warn("Failed to forget stale DFU device", forgetError);
    }

    logger.warn("Failed to open WebUSB DFU device", error);
    return false;
  }
};

export const restoreCachedDfuSession = async (): Promise<boolean> => {
  return false;
};

export const startDfuDiscovery = async (): Promise<void> => {
  if (activeDfuDevice) {
    return;
  }

  if (deviceState.dfuState !== DfuState.Idle) {
    setDfuState(deviceState.dfuState, {
      dfuTransport: DfuTransport.WebUsb,
    });
    return;
  }

  await waitForDfuTarget(DfuTransport.WebUsb);
};

const requestWebUsbDfuDevice = async (): Promise<boolean> => {
  const usb = getNavigatorUsb();
  if (!usb) {
    setDfuState(DfuState.Error, {
      dfuTransport: DfuTransport.WebUsb,
      dfuError: "This browser does not support WebUSB.",
    });
    return false;
  }

  try {
    const device = await usb.requestDevice({
      filters: [
        {
          vendorId: opendeckUsbVendorId,
          productId: opendeckWebUsbDfuProductId,
        },
      ],
    });

    const opened = await openWebUsbDfuDevice(device);
    if (!opened) {
      appendDfuStatus("The selected WebUSB DFU device could not be opened");
      setDfuState(DfuState.Error, {
        dfuTransport: DfuTransport.WebUsb,
        dfuError: "The selected WebUSB DFU device could not be opened.",
      });
    }

    return opened;
  } catch (error) {
    logger.warn("WebUSB DFU device selection canceled", error);
    appendDfuStatus("WebUSB device picker was canceled");
    return false;
  }
};

const waitForDfuTarget = async (
  dfuTransport = (null as unknown) as DfuTransport,
): Promise<void> => {
  setDfuState(DfuState.WaitingForDfuDevice, {
    dfuTransport,
    dfuProgress: (null as unknown) as number,
    dfuError: (null as unknown) as string,
    dfuDeviceLabel: (null as unknown) as string,
    dfuStatusLog: ["Waiting for DFU device"],
  });

  appendDfuStatus("Waiting for DFU device permission or appearance");
};

export const connectDeviceStoreToInput = async (
  outputId: string,
): Promise<any> => {
  if (isNetworkDfuOutputId(outputId)) {
    const address = getNetworkDfuAddressFromOutputId(outputId);
    const transport =
      takeNetworkDfuTransport(outputId) ||
      (await NetworkDfuTransport.connect(address));

    disconnectCurrentMidiSession();
    deviceState.isBootloaderMode = true;
    deviceState.outputId = outputId;
    deviceState.input = (null as unknown) as Input;
    deviceState.output = (null as unknown) as Output;
    deviceState.transport = defaultState.transport;
    deviceState.networkDfuTransport = transport;
    deviceState.transportType = defaultState.transportType;
    deviceState.valueSize = 2;
    deviceState.valuesPerMessageRequest = (null as unknown) as number;
    deviceState.boardId = [];
    deviceState.isKnownBoard = false;
    deviceState.bootLoaderSupport = false;
    deviceState.stagedUpdateSupport = false;
    deviceState.firmwareVersion = (null as unknown) as string;
    deviceState.serialNumber = (null as unknown) as string;
    deviceState.dfuError = (null as unknown) as string;
    resetBlessingState();
    setDfuState(DfuState.DfuReady, {
      dfuTransport: DfuTransport.Network,
      dfuDeviceLabel: address,
    });
    deviceState.boardName = address;
    deviceState.connectionState = DeviceConnectionState.Closed;
    deviceState.connectionPromise = (null as unknown) as Promise<any>;
    return;
  }

  if (isWebConfigOutputId(outputId)) {
    const address = getWebConfigAddressFromOutputId(outputId);
    const transport = await WebConfigSysExTransport.connect(address);

    deviceState.isBootloaderMode = false;
    deviceState.outputId = outputId;
    deviceState.input = (null as unknown) as Input;
    deviceState.output = (null as unknown) as Output;
    deviceState.transport = transport;
    deviceState.transportType = SysExTransportType.WebConfig;
    deviceState.valueSize = 2;
    deviceState.valuesPerMessageRequest = (null as unknown) as number;
    deviceState.boardId = [];
    deviceState.isKnownBoard = false;
    deviceState.bootLoaderSupport = false;
    deviceState.stagedUpdateSupport = false;
    deviceState.firmwareVersion = (null as unknown) as string;
    deviceState.serialNumber = (null as unknown) as string;
    deviceState.dfuError = (null as unknown) as string;
    resetBlessingState();

    transport.onSysEx(handleSysExEvent);
    transport.onOsc(requestLog.actions.addOsc);
    resetDfuState();
    deviceState.lastApplicationOutputName = transport.name;

    await sendMessage({
      command: Request.Handshake,
      handler: () => null,
      timeoutMs: 2500,
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
    const isKnownBoard = await requestBoardInfo();
    await requestAndVerifyBlessing(isKnownBoard);
    deviceState.connectionState = DeviceConnectionState.Open;
    deviceState.connectionPromise = (null as unknown) as Promise<any>;
    startDeviceHeartbeat();

    await loadDeviceInfoDetails();
    return;
  }

  const matched = await midiStore.actions.matchInputOutput(outputId);
  const { input, output, isBootloaderMode, valueSize } = matched;

  deviceState.isBootloaderMode = isBootloaderMode;
  deviceState.outputId = outputId;
  deviceState.input = input as Input;
  deviceState.output = output as Output;
  deviceState.transport = new MidiSysExTransport(
    deviceState.input,
    deviceState.output,
  );
  deviceState.transportType = SysExTransportType.Midi;
  deviceState.valueSize = valueSize;
  deviceState.valuesPerMessageRequest = null;
  deviceState.boardId = [];
  deviceState.isKnownBoard = false;
  deviceState.bootLoaderSupport = false;
  deviceState.stagedUpdateSupport = false;
  deviceState.firmwareVersion = null;
  deviceState.serialNumber = null;
  deviceState.dfuError = (null as unknown) as string;
  resetBlessingState();

  // make sure we don't duplicate listeners
  deviceState.transport.onSysEx(handleSysExEvent);
  detachMidiEventHandlers(deviceState.input);
  attachMidiEventHandlers(deviceState.input);

  // In bootloader mode, we cannot send regular requests
  if (isBootloaderMode) {
    setDfuState(DfuState.DfuReady, {
      dfuTransport: DfuTransport.Midi,
      dfuDeviceLabel: output.name,
    });
    deviceState.boardName = output.name;
    deviceState.connectionState = DeviceConnectionState.Open;
    deviceState.connectionPromise = (null as unknown) as Promise<any>;
    startDeviceConnectionWatcher();
    return;
  }

  resetDfuState();
  deviceState.lastApplicationOutputName = output.name;

  await sendMessage({
    command: Request.GetValuesPerMessage,
    handler: (valuesPerMessageRequest: number) =>
      setInfo({ valuesPerMessageRequest }),
  });
  await sendMessage({
    command: Request.GetFirmwareVersion,
    handler: (firmwareVersion: string) => setInfo({ firmwareVersion }),
  });
  const isKnownBoard = await requestBoardInfo();
  await requestAndVerifyBlessing(isKnownBoard);
  deviceState.connectionState = DeviceConnectionState.Open;
  deviceState.connectionPromise = (null as unknown) as Promise<any>;
  startDeviceConnectionWatcher();
  startDeviceHeartbeat();

  // These requests won't run until connection promise is finished
  await loadDeviceInfoDetails();
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

  try {
    return await deviceState.connectionPromise;
  } catch (error) {
    logger.warn("Failed to connect to OpenDeck MIDI device", error);
    disconnectCurrentMidiSession();
    await midiStore.actions.assignInputs();
    await navigateHome();
    throw error;
  }
};

export const closeConnection = (): Promise<void> => {
  stopDeviceConnectionWatcher();
  stopDeviceHeartbeat();
  closeDfuDevice();
  resetDeviceStore();
};

export const ensureConnection = async (): Promise<void> => {
  if (deviceState.connectionState === DeviceConnectionState.Open) {
    return;
  }

  if (deviceState.connectionPromise) {
    return deviceState.connectionPromise;
  }

  if (deviceState.outputId) {
    return connectDevice(deviceState.outputId);
  }

  throw new Error("CANNOT ENSURE CONNECTION, MISSING outputId");
};

// Firmware updates

const sendRebootRequest = async (
  command: Request,
  targetState: DfuState,
): Promise<void> => {
  const currentOutputId = deviceState.outputId;
  const reconnectRouteName = router.currentRoute.value.name;
  const reconnectRouteParams = {
    ...router.currentRoute.value.params,
  };

  stopDeviceConnectionWatcher();
  stopDeviceHeartbeat();
  setDfuState(targetState, {
    dfuTransport: (null as unknown) as DfuTransport,
    dfuProgress: (null as unknown) as number,
    dfuError: (null as unknown) as string,
    dfuStatusLog: [],
  });
  appendDfuStatus(
    targetState === DfuState.RebootingToBootloader
      ? "Rebooting device to bootloader mode"
      : "Rebooting device",
  );

  await sendMessage({
    command,
    handler: () => null,
  });

  await waitForApplicationDisconnect();
  disconnectCurrentMidiSession();

  if (targetState === DfuState.RebootingToBootloader) {
    await finishBootloaderEntryAndReturnHome();
    return;
  }

  setDfuState(DfuState.WaitingForApplication, {
    dfuTransport: (null as unknown) as DfuTransport,
  });
  appendDfuStatus("Waiting for the application to reconnect");

  const reconnected = await waitForApplicationReconnect(currentOutputId);

  if (!reconnected) {
    setDfuState(DfuState.Error, {
      dfuError: "The device did not reconnect in time.",
    });
    return;
  }

  const reconnectTarget =
    reconnectRouteName && reconnectRouteName !== "device-firmware-update"
      ? {
          name: reconnectRouteName,
          params: {
            ...reconnectRouteParams,
            outputId: currentOutputId,
          },
        }
      : {
          name: "device",
          params: {
            outputId: currentOutputId,
          },
        };

  resetDfuState();

  await router.replace({
    ...reconnectTarget,
  });
};

export const startBootLoaderMode = async (): Promise<void> =>
  deviceState.isConfigBlessed
    ? sendRebootRequest(Request.BootloaderMode, DfuState.RebootingToBootloader)
    : Promise.reject(new Error(deviceState.blessingError));

const startFirmwareUpdate = async (
  file: File,
  allowReconnectRetry = true,
): Promise<void> => {
  if (!deviceState.isConfigBlessed) {
    return Promise.reject(new Error(deviceState.blessingError));
  }

  if (!file.name.endsWith(".bin")) {
    appendDfuStatus("Selected file does not look like a firmware binary");
  }

  if (
    deviceState.networkDfuTransport ||
    deviceState.transportType === SysExTransportType.WebConfig
  ) {
    if (
      !deviceState.networkDfuTransport &&
      deviceState.transportType === SysExTransportType.WebConfig &&
      !deviceState.stagedUpdateSupport
    ) {
      return startBootLoaderMode();
    }

    return startNetworkFirmwareUpdate(file);
  }

  if (!activeDfuDevice || !activeDfuOutEndpoint) {
    const connected = await requestWebUsbDfuDevice();

    if (!connected) {
      setDfuState(DfuState.Error, {
        dfuTransport: DfuTransport.WebUsb,
        dfuError: "Failed to connect to the WebUSB DFU device.",
      });
      return;
    }
  }

  const payload = new Uint8Array(await file.arrayBuffer());

  setDfuState(DfuState.Uploading, {
    dfuTransport: DfuTransport.WebUsb,
    dfuProgress: 1,
    dfuError: (null as unknown) as string,
  });
  appendDfuStatus(`Uploading ${file.name}`);
  appendDfuStatus(`File size: ${payload.length} bytes`);

  try {
    for (let offset = 0; offset < payload.length; offset += dfuChunkSize) {
      const chunk = payload.slice(offset, offset + dfuChunkSize);
      await activeDfuDevice.transferOut(activeDfuOutEndpoint, chunk);
      deviceState.dfuProgress = Math.max(
        1,
        Math.floor(((offset + chunk.length) / payload.length) * 100),
      );
    }

    appendDfuStatus("Upload transfer complete");
    appendDfuStatus("Waiting for device-side finalize messages");
    await delay(500);
    appendDfuStatus("Waiting for device to reboot");

    const disconnectedFromDfu = await waitForDfuDisconnect();

    if (!disconnectedFromDfu) {
      setDfuState(DfuState.Error, {
        dfuTransport: DfuTransport.WebUsb,
        dfuProgress: 100,
        dfuError:
          "Upload finished, but the device remained in DFU mode. Make sure you selected the generated dfu.bin file.",
      });
      appendDfuStatus("Device did not leave DFU mode");
      return;
    }

    setDfuState(DfuState.WaitingForApplication, {
      dfuTransport: DfuTransport.WebUsb,
      dfuProgress: 100,
    });
    await closeDfuDevice();
    await finishDfuAndReturnHome(DfuTransport.WebUsb);
  } catch (error) {
    logger.error("WebUSB firmware upload failed", error);
    appendDfuStatus(
      `Upload failed: ${
        error && error.message ? error.message : String(error)
      }`,
    );

    const errorMessage =
      error && error.message ? String(error.message) : String(error);

    if (errorMessage.includes("The device was disconnected")) {
      await closeDfuDevice();

      if (allowReconnectRetry) {
        appendDfuStatus("Retrying with a fresh DFU connection");
        const reconnected = await requestWebUsbDfuDevice();

        if (reconnected) {
          return startFirmwareUpdate(file, false);
        }
      }

      setDfuState(DfuState.Error, {
        dfuTransport: DfuTransport.WebUsb,
        dfuProgress: (null as unknown) as number,
        dfuError:
          "The DFU device was disconnected. Reconnect it and click Connect DFU device again.",
      });
      return;
    }

    setDfuState(DfuState.Error, {
      dfuTransport: DfuTransport.WebUsb,
      dfuError: "Firmware upload failed.",
    });
  }
};

const startNetworkFirmwareUpdate = async (file: File): Promise<void> => {
  const uploadTransport =
    deviceState.networkDfuTransport ||
    (deviceState.transport && deviceState.transport.uploadFirmware
      ? deviceState.transport
      : null);

  if (!uploadTransport || !uploadTransport.uploadFirmware) {
    setDfuState(DfuState.Error, {
      dfuTransport: DfuTransport.Network,
      dfuError: "Network firmware upload is not available for this connection.",
    });
    return;
  }

  const currentOutputId = deviceState.outputId;
  const isRecoveryDfu = isNetworkDfuOutputId(currentOutputId);
  const payload = new Uint8Array(await file.arrayBuffer());

  stopDeviceConnectionWatcher();
  stopDeviceHeartbeat();

  setDfuState(DfuState.Uploading, {
    dfuTransport: DfuTransport.Network,
    dfuProgress: 1,
    dfuError: (null as unknown) as string,
  });
  appendDfuStatus(`Uploading ${file.name} over network`);
  appendDfuStatus(`File size: ${payload.length} bytes`);

  try {
    await uploadTransport.uploadFirmware(payload, (bytesWritten) => {
      deviceState.dfuProgress = Math.max(
        1,
        Math.min(100, Math.floor((bytesWritten / payload.length) * 100)),
      );
    });

    appendDfuStatus("Network upload staged");
    appendDfuStatus("Waiting for device to reboot and apply update");

    setDfuState(DfuState.WaitingForApplication, {
      dfuTransport: DfuTransport.Network,
      dfuProgress: 100,
    });

    if (!isRecoveryDfu) {
      await waitForApplicationDisconnect();
    }

    disconnectCurrentMidiSession();
    await finishDfuAndReturnHome(DfuTransport.Network);
  } catch (error) {
    logger.error("Network firmware upload failed", error);
    appendDfuStatus(
      `Upload failed: ${
        error && error.message ? error.message : String(error)
      }`,
    );
    setDfuState(DfuState.Error, {
      dfuTransport: DfuTransport.Network,
      dfuError: "Network firmware upload failed.",
    });
  }
};

export const connectDfuDevice = async (): Promise<boolean> => {
  setDfuState(DfuState.WaitingForDfuDevice, {
    dfuTransport: DfuTransport.WebUsb,
    dfuError: (null as unknown) as string,
  });

  const connected = await requestWebUsbDfuDevice();

  if (!connected && !deviceState.dfuError) {
    setDfuState(DfuState.Error, {
      dfuTransport: DfuTransport.WebUsb,
      dfuError: "No WebUSB DFU device was selected.",
    });
  }

  return connected;
};

export const startUpdatesCheck = async (
  firmwareFileName?: string,
): Promise<Array<IOpenDeckRelease>> => {
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
      firmwareFileLink: release.assets.find(
        (asset) => asset.name === firmwareFileName,
      ),
      ...release,
    }));
};

// Backup

const startRestore = async (file: File): Promise<void> => {
  stopDeviceHeartbeat();

  try {
    await sendMessagesFromFileWithDelay(file, Request.RestoreBackup);
  } finally {
    deviceState.isSystemOperationRunning = false;
    deviceState.systemOperationMessage = (null as unknown) as string;
    scheduleDeviceHeartbeat();
  }

  alert(
    "Restoring from backup finished. The board will now reboot and apply the parameters. This can take up to 30 seconds.",
  );
};

const startBackup = async (): Promise<void> => {
  stopDeviceHeartbeat();

  let receivedCount = 0;
  let firstResponse = null;
  const backupData = [];

  const handler = (data) => {
    if (!receivedCount) {
      firstResponse = data;
    }

    // Note: first and ast messages are identical signals
    const isLastMessage = receivedCount && arrayEqual(firstResponse, data);
    const isFirstMessage = receivedCount === 0;

    receivedCount = receivedCount + 1;
    if (!isFirstMessage && !isLastMessage) {
      backupData.push(data.map(convertToHex).join(" "));
    }

    if (isLastMessage) {
      const blob = new Blob([backupData.join(newLineCharacter)], {
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

  deviceState.isSystemOperationRunning = true;
  deviceState.systemOperationMessage = "Creating backup";

  try {
    await sendMessage({
      command: Request.Backup,
      handler,
    });
  } catch (error) {
    logger.error("Failed to read component config", error);
  } finally {
    deviceState.isSystemOperationRunning = false;
    deviceState.systemOperationMessage = (null as unknown) as string;
    scheduleDeviceHeartbeat();
  }
};

// Other hardware

export const startFactoryReset = async (): Promise<void> => {
  await sendRebootRequest(
    Request.FactoryReset,
    DfuState.RebootingToApplication,
  );
};

export const startReboot = async (): Promise<void> => {
  await sendRebootRequest(Request.Reboot, DfuState.RebootingToApplication);
};

const requestBoardInfo = async (): Promise<boolean> => {
  let isKnownBoard = false;

  await sendMessage({
    command: Request.IdentifyBoard,
    handler: (value: number[]) => {
      const board = getBoardDefinition(value);
      isKnownBoard = !!board;
      const boardName = (board && board.name) || "Custom OpenDeck board";
      const firmwareFileName = board && board.firmwareFileName;

      setInfo({ boardId: value, isKnownBoard, boardName, firmwareFileName });
    },
  });

  return isKnownBoard;
};

const loadDeviceInfoDetails = async (): Promise<void> => {
  await sendMessage({
    command: Request.GetNumberOfSupportedComponents,
    handler: (numberOfComponents: array[]) => setInfo({ numberOfComponents }),
  });

  await sendMessage({
    command: Request.GetNumberOfSupportedPresets,
    handler: (supportedPresetsCount: number) =>
      setInfo({ supportedPresetsCount }),
  });

  await sendMessage({
    command: Request.GetBootloaderSupport,
    handler: (bootLoaderSupport: boolean) => setInfo({ bootLoaderSupport }),
  });

  try {
    await sendMessage({
      command: Request.GetStagedUpdateSupport,
      handler: (stagedUpdateSupport: boolean) => {
        logger.log("Staged update support:", stagedUpdateSupport);
        setInfo({ stagedUpdateSupport });
      },
    });
  } catch (error) {
    logger.warn("Failed to read staged update support", error);
    setInfo({ stagedUpdateSupport: false });
  }
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

export const getFilteredSectionsForBlock = (
  block: Block,
  sectionType: SectionType,
): ISectionDefinition[] => {
  if (!BlockMap[block]) {
    throw new Error(`Block definition not found in BlockMap ${block}`);
  }

  const { sections } = BlockMap[block];

  return Object.values(sections)
    .filter((sectionDef) => filterSectionsByType(sectionDef, sectionType))
    .filter(filterOutDisabledSections)
    .filter(filterOutMsbSections);
};

export const getComponentSettings = async (
  block: Block,
  sectionType: SectionType,
  componentIndex?: number,
): Promise<any> => {
  await ensureConnection();
  const settings = {} as any;

  const tasks = getFilteredSectionsForBlock(block, sectionType).map(
    (sectionDef) => {
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
    },
  );

  await Promise.all(tasks);

  return settings;
};

export const getConfigByteString = async (
  block: Block,
  section: number,
  size: number,
): Promise<string> => {
  await ensureConnection();

  const bytes = [];
  await sendMessage({
    command: Request.GetSectionValues,
    handler: (response: number[]) => {
      bytes.push(...response);
      return false;
    },
    config: { block, section, index: 0 },
  });

  const terminator = bytes.indexOf(0);
  const stringBytes = terminator === -1 ? bytes : bytes.slice(0, terminator);

  return String.fromCharCode(...stringBytes.slice(0, size));
};

export const setConfigByteString = async (
  block: Block,
  section: number,
  size: number,
  value: string,
): Promise<void> => {
  await ensureConnection();

  const bytes = Array.from(value, (character) => character.charCodeAt(0));
  if (bytes.length >= size || bytes.some((byte) => byte > 255)) {
    throw new Error("Config string does not fit in byte storage");
  }

  const writes = [...bytes, 0];

  for (let index = 0; index < writes.length; index++) {
    await sendMessage({
      command: Request.SetValue,
      handler: () => null,
      config: {
        block,
        section,
        index,
        value: writes[index],
      },
    });
  }
};

export const setComponentSectionValue = async (
  config: IRequestConfig,
  handler: (val: any) => void,
): Promise<void> => {
  const isActivePresetChange =
    config.block === Block.Global && config.section === 2 && config.index === 0;

  if (isActivePresetChange) {
    deviceState.isSystemOperationRunning = true;
    deviceState.systemOperationMessage = "Changing active preset";
  }

  try {
    return await sendMessage({
      command: Request.SetValue,
      handler,
      config,
    });
  } finally {
    if (isActivePresetChange) {
      deviceState.isSystemOperationRunning = false;
      deviceState.systemOperationMessage = (null as unknown) as string;
    }
  }
};

export const getSectionValues = async (
  block: Block,
): Promise<Record<string, number[]>> => {
  await ensureConnection();
  const settings = {} as any;

  const tasks = getFilteredSectionsForBlock(block, SectionType.Value).map(
    (sectionDef) => {
      const { key, section } = sectionDef;

      const handler = (res: number[]): void => {
        if (!settings[key]) {
          settings[key] = [];
        }
        settings[key].push(...res);
        return false;
      };

      return sendMessage({
        command: Request.GetSectionValues,
        handler,
        config: { block, section },
      }).catch((error) =>
        logger.error("Failed to read component config", error),
      );
    },
  );

  await Promise.all(tasks);

  return settings;
};

// Export

export const deviceStoreActions = {
  setInfo,
  setViewSetting,
  connectDevice,
  closeConnection,
  ensureConnection,
  startUpdatesCheck,
  startBootLoaderMode,
  startDfuDiscovery,
  restoreCachedDfuSession,
  connectDfuDevice,
  startFactoryReset,
  startReboot,
  startDeviceConnectionWatcher,
  stopDeviceConnectionWatcher,
  startFirmwareUpdate,
  isControlDisabled,
  disableControl,
  startBackup,
  startRestore,
  getComponentSettings,
  getConfigByteString,
  setConfigByteString,
  setComponentSectionValue,
  getSectionValues,
  getFilteredSectionsForBlock,
};

export type IDeviceActions = typeof deviceStoreActions;
