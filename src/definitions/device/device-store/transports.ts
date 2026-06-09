import { Input, InputEventBase, Output } from "webmidi";
import {
  buildFirmwareUploadFrame,
  firmwareUploadAck,
  firmwareUploadCommandAbort,
  firmwareUploadCommandBegin,
  firmwareUploadCommandChunk,
  firmwareUploadCommandFinish,
  firmwareUploadStatusOk,
} from "./firmware-upload";

export enum SysExTransportType {
  Midi = "midi",
  WebConfig = "webconfig",
}

export interface ISysExEvent {
  data: Uint8Array;
}

export interface IOscEvent {
  data: Uint8Array;
}

export type FirmwareProgressHandler = (bytesWritten: number) => void;

export interface ISysExTransport {
  id: string;
  name: string;
  type: SysExTransportType;
  onSysEx(handler: (event: ISysExEvent) => void): void;
  onOsc?(handler: (event: IOscEvent) => void): void;
  uploadFirmware?(
    payload: Uint8Array,
    onProgress?: FirmwareProgressHandler,
  ): Promise<void>;
  sendSysex(manufacturerId: number[], payload: number[]): void;
  close(): void;
}

export const webConfigVirtualOutputPrefix = "__webconfig__";
export const networkDfuVirtualOutputPrefix = "__network_dfu__";

export const getWebConfigOutputId = (address: string): string =>
  `${webConfigVirtualOutputPrefix}${encodeURIComponent(address.trim())}`;

export const isWebConfigOutputId = (outputId: string): boolean =>
  outputId && outputId.startsWith(webConfigVirtualOutputPrefix);

export const getWebConfigAddressFromOutputId = (outputId: string): string =>
  decodeURIComponent(outputId.slice(webConfigVirtualOutputPrefix.length));

export const getNetworkDfuOutputId = (address: string): string =>
  `${networkDfuVirtualOutputPrefix}${encodeURIComponent(address.trim())}`;

export const isNetworkDfuOutputId = (outputId: string): boolean =>
  outputId && outputId.startsWith(networkDfuVirtualOutputPrefix);

export const getNetworkDfuAddressFromOutputId = (outputId: string): string =>
  decodeURIComponent(outputId.slice(networkDfuVirtualOutputPrefix.length));

const normalizeWebSocketUrl = (address: string, path: string): string => {
  const trimmed = address.trim();
  const isExplicitWebSocketUrl = /^wss?:\/\//.test(trimmed);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (isExplicitWebSocketUrl) {
    return trimmed.endsWith(normalizedPath)
      ? trimmed
      : `${trimmed.replace(/\/$/, "")}${normalizedPath}`;
  }

  const host = trimmed.includes(":") ? trimmed : `${trimmed}:80`;
  return `ws://${host}${normalizedPath}`;
};

const normalizeWebConfigUrl = (address: string): string =>
  normalizeWebSocketUrl(address, "/config");

const normalizeNetworkDfuUrl = (address: string): string =>
  normalizeWebSocketUrl(address, "/dfu");

export enum OpenDeckNetworkEndpoint {
  Config = "config",
  Dfu = "dfu",
}

const probeWebSocket = (url: string): Promise<boolean> =>
  new Promise((resolve) => {
    const socket = new WebSocket(url);
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;
      socket.close();
      resolve(false);
    }, 2500);

    socket.onopen = () => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      socket.close();
      resolve(true);
    };

    socket.onerror = () => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      resolve(false);
    };

    socket.onclose = () => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      resolve(false);
    };
  });

const webConfigFirmwareChunkSize = 2048;
const webConfigFirmwareAckTimeoutMs = 30000;

const bytesToUint32 = (data: Uint8Array, offset: number): number =>
  new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(
    offset,
    true,
  );

type FirmwareAckHandler = (data: Uint8Array) => void;

const uploadFirmwareOverSocket = async (
  socket: WebSocket,
  setAckHandler: (handler: FirmwareAckHandler) => void,
  payload: Uint8Array,
  errorPrefix: string,
  onProgress?: FirmwareProgressHandler,
): Promise<void> => {
  const sendFirmwareCommand = (
    command: number,
    commandPayload: Uint8Array,
    progressHandler?: FirmwareProgressHandler,
  ): Promise<void> =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        setAckHandler(null);
        reject(new Error(`Timed out waiting for ${errorPrefix} firmware ACK`));
      }, webConfigFirmwareAckTimeoutMs);

      setAckHandler((response: Uint8Array) => {
        if (
          response.length < 7 ||
          response[0] !== firmwareUploadAck ||
          response[1] !== command
        ) {
          return;
        }

        clearTimeout(timeout);
        setAckHandler(null);

        const status = response[2];
        const bytesWritten = bytesToUint32(response, 3);

        if (status !== firmwareUploadStatusOk) {
          reject(
            new Error(
              `${errorPrefix} firmware command 0x${command.toString(
                16,
              )} failed with status ${status}`,
            ),
          );
          return;
        }

        if (progressHandler) {
          progressHandler(bytesWritten);
        }

        resolve();
      });

      socket.send(buildFirmwareUploadFrame(command, commandPayload));
    });

  try {
    await sendFirmwareCommand(
      firmwareUploadCommandBegin,
      new Uint8Array(),
      onProgress,
    );

    for (
      let offset = 0;
      offset < payload.length;
      offset += webConfigFirmwareChunkSize
    ) {
      await sendFirmwareCommand(
        firmwareUploadCommandChunk,
        payload.subarray(offset, offset + webConfigFirmwareChunkSize),
        onProgress,
      );
    }

    await sendFirmwareCommand(
      firmwareUploadCommandFinish,
      new Uint8Array(),
      onProgress,
    );
  } catch (error) {
    try {
      await sendFirmwareCommand(firmwareUploadCommandAbort, new Uint8Array());
    } catch {
      // Preserve the original upload failure.
    }

    throw error;
  }
};

export class MidiSysExTransport implements ISysExTransport {
  public readonly id: string;
  public readonly name: string;
  public readonly type = SysExTransportType.Midi;

  private readonly input: Input;
  private readonly output: Output;

  constructor(input: Input, output: Output) {
    this.input = input;
    this.output = output;
    this.id = output.id;
    this.name = output.name;
  }

  public onSysEx(handler: (event: ISysExEvent) => void): void {
    this.input.removeListener("sysex", "all");
    this.input.addListener("sysex", "all", (event: InputEventBase<"sysex">) =>
      handler({ data: event.data }),
    );
  }

  public sendSysex(manufacturerId: number[], payload: number[]): void {
    this.output.sendSysex(manufacturerId, payload);
  }

  public close(): void {
    this.input.removeListener("sysex", "all");
  }
}

export class WebConfigSysExTransport implements ISysExTransport {
  public readonly id: string;
  public readonly name: string;
  public readonly type = SysExTransportType.WebConfig;

  private readonly socket: WebSocket;
  private oscHandler: (event: IOscEvent) => void = null;
  private nativeHandler: (data: Uint8Array) => void = null;

  private constructor(address: string, socket: WebSocket) {
    this.id = getWebConfigOutputId(address);
    this.name = `WebConfig ${address}`;
    this.socket = socket;
  }

  public static connect(address: string): Promise<WebConfigSysExTransport> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(normalizeWebConfigUrl(address));
      const transport = new WebConfigSysExTransport(address, socket);
      let opened = false;

      socket.binaryType = "arraybuffer";
      socket.onopen = () => {
        opened = true;
        resolve(transport);
      };
      socket.onerror = () => {
        if (!opened) {
          reject(
            new Error(`Failed to open WebConfig connection to ${address}`),
          );
        }
      };
      socket.onclose = () => {
        if (!opened) {
          reject(new Error(`WebConfig connection to ${address} closed`));
        }
      };
    });
  }

  public onSysEx(handler: (event: ISysExEvent) => void): void {
    this.socket.onmessage = (event: MessageEvent<ArrayBuffer>) => {
      const data = new Uint8Array(event.data);

      if (data[0] === 0xf0) {
        handler({ data });
        return;
      }

      if (data[0] === firmwareUploadAck) {
        if (this.nativeHandler) {
          this.nativeHandler(data);
        }
        return;
      }

      if (this.oscHandler) {
        this.oscHandler({ data });
      }
    };
  }

  public onOsc(handler: (event: IOscEvent) => void): void {
    this.oscHandler = handler;
  }

  public sendSysex(manufacturerId: number[], payload: number[]): void {
    if (this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebConfig connection is not open");
    }

    this.socket.send(
      new Uint8Array([0xf0, ...manufacturerId, ...payload, 0xf7]),
    );
  }

  public async uploadFirmware(
    payload: Uint8Array,
    onProgress?: FirmwareProgressHandler,
  ): Promise<void> {
    if (this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebConfig connection is not open");
    }

    await uploadFirmwareOverSocket(
      this.socket,
      (handler) => (this.nativeHandler = handler),
      payload,
      "WebConfig",
      onProgress,
    );
  }

  public close(): void {
    this.socket.close();
  }
}

export class NetworkDfuTransport {
  public readonly id: string;
  public readonly name: string;

  private readonly socket: WebSocket;
  private ackHandler: FirmwareAckHandler = null;

  private constructor(address: string, socket: WebSocket) {
    this.id = getNetworkDfuOutputId(address);
    this.name = `Network DFU ${address}`;
    this.socket = socket;
    this.socket.onmessage = (event: MessageEvent<ArrayBuffer>) => {
      if (this.ackHandler) {
        this.ackHandler(new Uint8Array(event.data));
      }
    };
  }

  public static connect(address: string): Promise<NetworkDfuTransport> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(normalizeNetworkDfuUrl(address));
      let opened = false;

      socket.binaryType = "arraybuffer";
      socket.onopen = () => {
        opened = true;
        resolve(new NetworkDfuTransport(address, socket));
      };
      socket.onerror = () => {
        if (!opened) {
          reject(
            new Error(`Failed to open Network DFU connection to ${address}`),
          );
        }
      };
      socket.onclose = () => {
        if (!opened) {
          reject(new Error(`Network DFU connection to ${address} closed`));
        }
      };
    });
  }

  public async uploadFirmware(
    payload: Uint8Array,
    onProgress?: FirmwareProgressHandler,
  ): Promise<void> {
    if (this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("Network DFU connection is not open");
    }

    await uploadFirmwareOverSocket(
      this.socket,
      (handler) => (this.ackHandler = handler),
      payload,
      "Network DFU",
      onProgress,
    );
  }

  public close(): void {
    this.socket.close();
  }
}

const pendingNetworkDfuTransports = new Map<string, NetworkDfuTransport>();

export const takeNetworkDfuTransport = (
  outputId: string,
): NetworkDfuTransport => {
  const transport = pendingNetworkDfuTransports.get(outputId);
  pendingNetworkDfuTransports.delete(outputId);
  return transport;
};

export const connectOpenDeckNetworkEndpoint = async (
  address: string,
): Promise<{ endpoint: OpenDeckNetworkEndpoint; outputId: string }> => {
  if (await probeWebSocket(normalizeWebConfigUrl(address))) {
    return {
      endpoint: OpenDeckNetworkEndpoint.Config,
      outputId: getWebConfigOutputId(address),
    };
  }

  try {
    const transport = await NetworkDfuTransport.connect(address);
    const outputId = transport.id;
    const previousTransport = pendingNetworkDfuTransports.get(outputId);

    if (previousTransport) {
      previousTransport.close();
    }

    pendingNetworkDfuTransports.set(outputId, transport);

    return {
      endpoint: OpenDeckNetworkEndpoint.Dfu,
      outputId,
    };
  } catch {
    return null;
  }
};
