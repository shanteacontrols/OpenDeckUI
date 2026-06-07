const esptoolJsUrl = "https://unpkg.com/esptool-js@0.6.0/bundle.js";
const baudRate = 115200;
const mergedBinaryOffset = 0;
const watchdogResetDelayMs = 500;
const rtcWdtKey = 0x50d83aa1;
const rtcWdtEnable = (1 << 31) | (5 << 28) | (1 << 8) | 2;

type ProgressHandler = (progress: number, message?: string) => void;

type EsptoolModule = {
  ESPLoader: new (options: {
    transport: any;
    baudrate: number;
    terminal: {
      clean: () => void;
      writeLine: (data: string) => void;
      write: (data: string) => void;
    };
  }) => any;
  Transport: new (port: any, tracing?: boolean) => any;
};

export type Esp32SerialSession = {
  port: any;
  transport: any;
  loader: any;
  chip: string;
};

let esptoolModule: Promise<EsptoolModule> | null = null;

const watchdogResetRegisters: {
  [chipName: string]: {
    config0: number;
    config1: number;
    writeProtect: number;
  };
} = {
  "ESP32-S3": {
    config0: 0x60008098,
    config1: 0x6000809c,
    writeProtect: 0x600080b0,
  },
};

const getNavigatorSerial = (): any => {
  if (typeof navigator === "undefined") {
    return null;
  }

  return (navigator as any).serial || null;
};

const loadEsptool = async (): Promise<EsptoolModule> => {
  if (!esptoolModule) {
    const dynamicImport = new Function("url", "return import(url)") as (
      url: string,
    ) => Promise<EsptoolModule>;

    esptoolModule = dynamicImport(esptoolJsUrl);
  }

  return esptoolModule;
};

const delay = (durationMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

const resetEsp32AfterFlash = async (
  session: Esp32SerialSession,
): Promise<void> => {
  if (session.loader.chip && session.loader.chip.watchdogReset) {
    await session.loader.chip.watchdogReset(session.loader);
    return;
  }

  const registers = watchdogResetRegisters[session.loader.chip.CHIP_NAME];

  if (registers) {
    await session.loader.writeReg(registers.writeProtect, rtcWdtKey);
    await session.loader.writeReg(registers.config1, 2000);
    await session.loader.writeReg(registers.config0, rtcWdtEnable);
    await session.loader.writeReg(registers.writeProtect, 0);
    await delay(watchdogResetDelayMs);
    return;
  }

  await session.loader.after("hard_reset");
};

export const openEsp32SerialDevice = async (
  onStatus: (message: string) => void,
): Promise<Esp32SerialSession> => {
  const serial = getNavigatorSerial();

  if (!serial) {
    throw new Error("Web Serial is not available in this browser.");
  }

  const { ESPLoader, Transport } = await loadEsptool();
  const port = await serial.requestPort({});
  const transport = new Transport(port, true);
  const loader = new ESPLoader({
    transport,
    baudrate: baudRate,
    terminal: {
      clean: () => undefined,
      writeLine: (data: string) => onStatus(data),
      write: (data: string) => onStatus(data),
    },
  });

  const chip = await loader.main();

  return {
    port,
    transport,
    loader,
    chip,
  };
};

export const closeEsp32SerialDevice = async (
  session: Esp32SerialSession | null,
): Promise<void> => {
  if (!session) {
    return;
  }

  try {
    await session.transport.disconnect();
  } catch (error) {
    // The port may already be closed after reset or a failed flash attempt.
  }
};

export const flashEsp32MergedBinary = async (
  session: Esp32SerialSession,
  payload: Uint8Array,
  onProgress: ProgressHandler,
): Promise<void> => {
  onProgress(1, "Writing firmware");

  await session.loader.writeFlash({
    fileArray: [
      {
        data: payload,
        address: mergedBinaryOffset,
      },
    ],
    eraseAll: false,
    compress: true,
    flashMode: "keep",
    flashFreq: "keep",
    flashSize: "keep",
    reportProgress: (_fileIndex: number, written: number, total: number) => {
      onProgress(Math.max(1, Math.floor((written / total) * 100)));
    },
  });

  onProgress(100, "Flashing complete, resetting board");
  await resetEsp32AfterFlash(session);
};
