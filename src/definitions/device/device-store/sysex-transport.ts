import { Input, InputEventBase, Output } from "webmidi";

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

export const getWebConfigOutputId = (address: string): string =>
  `${webConfigVirtualOutputPrefix}${encodeURIComponent(address.trim())}`;

export const isWebConfigOutputId = (outputId: string): boolean =>
  outputId && outputId.startsWith(webConfigVirtualOutputPrefix);

export const getWebConfigAddressFromOutputId = (outputId: string): string =>
  decodeURIComponent(outputId.slice(webConfigVirtualOutputPrefix.length));

const normalizeWebConfigUrl = (address: string): string => {
  const trimmed = address.trim();
  const isExplicitWebSocketUrl = /^wss?:\/\//.test(trimmed);

  if (isExplicitWebSocketUrl) {
    return trimmed.endsWith("/config")
      ? trimmed
      : `${trimmed.replace(/\/$/, "")}/config`;
  }

  const host = trimmed.includes(":") ? trimmed : `${trimmed}:80`;
  return `ws://${host}/config`;
};

const webConfigFirmwareChunkSize = 2048;
const webConfigNativeResponseFirmwareAck = 0x81;
const webConfigFirmwareCommandBegin = 0x01;
const webConfigFirmwareCommandChunk = 0x02;
const webConfigFirmwareCommandFinish = 0x03;
const webConfigFirmwareCommandAbort = 0x04;
const webConfigFirmwareStatusOk = 0x00;
const webConfigFirmwareAckTimeoutMs = 30000;

const uint32ToBytes = (value: number): number[] => {
  const data = new Uint8Array(4);
  const view = new DataView(data.buffer);
  view.setUint32(0, value, true);
  return Array.from(data);
};

const bytesToUint32 = (data: Uint8Array, offset: number): number =>
  new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(
    offset,
    true,
  );

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

      if (data[0] === webConfigNativeResponseFirmwareAck) {
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

    try {
      await this.sendFirmwareCommand(
        webConfigFirmwareCommandBegin,
        new Uint8Array(uint32ToBytes(payload.length)),
        onProgress,
      );

      for (
        let offset = 0;
        offset < payload.length;
        offset += webConfigFirmwareChunkSize
      ) {
        await this.sendFirmwareCommand(
          webConfigFirmwareCommandChunk,
          payload.subarray(offset, offset + webConfigFirmwareChunkSize),
          onProgress,
        );
      }

      await this.sendFirmwareCommand(
        webConfigFirmwareCommandFinish,
        new Uint8Array(),
        onProgress,
      );
    } catch (error) {
      try {
        await this.sendFirmwareCommand(
          webConfigFirmwareCommandAbort,
          new Uint8Array(),
        );
      } catch {
        // Ignore abort errors so the original upload failure is preserved.
      }

      throw error;
    }
  }

  public close(): void {
    this.socket.close();
  }

  private sendFirmwareCommand(
    command: number,
    payload: Uint8Array,
    onProgress?: FirmwareProgressHandler,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const previousHandler = this.nativeHandler;
      const timeout = setTimeout(() => {
        this.nativeHandler = previousHandler;
        reject(new Error("Timed out waiting for WebConfig firmware ACK"));
      }, webConfigFirmwareAckTimeoutMs);

      this.nativeHandler = (response: Uint8Array) => {
        if (
          response.length < 7 ||
          response[0] !== webConfigNativeResponseFirmwareAck ||
          response[1] !== command
        ) {
          return;
        }

        clearTimeout(timeout);
        this.nativeHandler = previousHandler;

        const status = response[2];
        const bytesWritten = bytesToUint32(response, 3);

        if (status !== webConfigFirmwareStatusOk) {
          reject(
            new Error(
              `WebConfig firmware command 0x${command.toString(
                16,
              )} failed with status ${status}`,
            ),
          );
          return;
        }

        if (onProgress) {
          onProgress(bytesWritten);
        }

        resolve();
      };

      const frame = new Uint8Array(1 + payload.length);
      frame[0] = command;
      frame.set(payload, 1);
      this.socket.send(frame);
    });
  }
}
