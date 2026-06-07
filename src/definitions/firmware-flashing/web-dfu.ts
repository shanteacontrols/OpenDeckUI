const stm32DfuVendorId = 0x0483;
const stm32DfuProductId = 0xdf11;
const defaultTransferSize = 2048;

const requestDnload = 1;
const requestGetStatus = 3;
const requestClearStatus = 4;
const requestGetState = 5;
const requestAbort = 6;

const statusOk = 0;
const stateDfuIdle = 2;
const stateDfuDnBusy = 4;
const stateDfuDnloadIdle = 5;
const stateDfuManifest = 7;
const stateDfuError = 10;

const dfuseSetAddress = 0x21;
const dfuseEraseSector = 0x41;

type ProgressHandler = (progress: number, message?: string) => void;

type MemorySegment = {
  start: number;
  end: number;
  sectorSize: number;
  readable: boolean;
  erasable: boolean;
  writable: boolean;
};

type MemoryInfo = {
  name: string;
  segments: MemorySegment[];
};

type DfuStatus = {
  status: number;
  pollTimeout: number;
  state: number;
};

type DfuSettings = {
  configurationValue: number;
  interfaceNumber: number;
  alternateSetting: number;
  name: string;
};

export type Stm32DfuSeSession = {
  device: any;
  settings: DfuSettings;
  memoryInfo: MemoryInfo;
  startAddress: number;
  transferSize: number;
};

const delay = (durationMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

const getNavigatorUsb = (): any => {
  if (typeof navigator === "undefined") {
    return null;
  }

  return (navigator as any).usb || null;
};

const readStringDescriptor = async (
  device: any,
  index: number,
  langId = 0,
): Promise<string | number[]> => {
  const resultHead = await device.controlTransferIn(
    {
      requestType: "standard",
      recipient: "device",
      request: 0x06,
      value: (0x03 << 8) | index,
      index: langId,
    },
    1,
  );

  if (resultHead.status !== "ok") {
    throw new Error(`Failed to read string descriptor ${index}.`);
  }

  const length = resultHead.data.getUint8(0);
  const result = await device.controlTransferIn(
    {
      requestType: "standard",
      recipient: "device",
      request: 0x06,
      value: (0x03 << 8) | index,
      index: langId,
    },
    length,
  );

  if (result.status !== "ok") {
    throw new Error(`Failed to read string descriptor ${index}.`);
  }

  const words: number[] = [];
  for (let offset = 2; offset < length; offset += 2) {
    words.push(result.data.getUint16(offset, true));
  }

  if (langId === 0) {
    return words;
  }

  return String.fromCharCode.apply(String, words);
};

const parseInterfaceDescriptor = (data: DataView) => ({
  bDescriptorType: data.getUint8(1),
  bInterfaceNumber: data.getUint8(2),
  bAlternateSetting: data.getUint8(3),
  iInterface: data.getUint8(8),
});

const readConfigurationDescriptor = async (
  device: any,
  index: number,
): Promise<DataView> => {
  const resultHead = await device.controlTransferIn(
    {
      requestType: "standard",
      recipient: "device",
      request: 0x06,
      value: 0x0200 | index,
      index: 0,
    },
    4,
  );

  if (resultHead.status !== "ok") {
    throw new Error(`Failed to read configuration descriptor ${index}.`);
  }

  const length = resultHead.data.getUint16(2, true);
  const result = await device.controlTransferIn(
    {
      requestType: "standard",
      recipient: "device",
      request: 0x06,
      value: 0x0200 | index,
      index: 0,
    },
    length,
  );

  if (result.status !== "ok") {
    throw new Error(`Failed to read configuration descriptor ${index}.`);
  }

  return result.data;
};

const fixInterfaceNames = async (
  device: any,
  interfaces: DfuSettings[],
): Promise<void> => {
  if (!interfaces.some((settings) => !settings.name)) {
    return;
  }

  if (!device.opened) {
    await device.open();
  }

  if (!device.configuration) {
    await device.selectConfiguration(1);
  }

  const stringIndexes: Array<{
    configurationValue: number;
    interfaceNumber: number;
    alternateSetting: number;
    stringIndex: number;
  }> = [];

  for (let configIndex = 0; configIndex < device.configurations.length; configIndex++) {
    const rawConfig = await readConfigurationDescriptor(device, configIndex);
    const configurationValue = rawConfig.getUint8(5);
    let offset = 9;

    while (offset + 2 < rawConfig.byteLength) {
      const length = rawConfig.getUint8(offset);
      const type = rawConfig.getUint8(offset + 1);

      if (!length) {
        break;
      }

      if (type === 4 && length >= 9) {
        const descriptor = parseInterfaceDescriptor(
          new DataView(rawConfig.buffer.slice(offset, offset + length)),
        );

        if (descriptor.iInterface > 0) {
          stringIndexes.push({
            configurationValue,
            interfaceNumber: descriptor.bInterfaceNumber,
            alternateSetting: descriptor.bAlternateSetting,
            stringIndex: descriptor.iInterface,
          });
        }
      }

      offset += length;
    }
  }

  for (const item of stringIndexes) {
    const settings = interfaces.find(
      (candidate) =>
        candidate.configurationValue === item.configurationValue &&
        candidate.interfaceNumber === item.interfaceNumber &&
        candidate.alternateSetting === item.alternateSetting,
    );

    if (settings && !settings.name) {
      try {
        settings.name = (await readStringDescriptor(
          device,
          item.stringIndex,
          0x0409,
        )) as string;
      } catch (error) {
        settings.name = "";
      }
    }
  }
};

const findDfuSettings = (device: any): DfuSettings[] => {
  const interfaces: DfuSettings[] = [];

  for (const configuration of device.configurations || []) {
    for (const usbInterface of configuration.interfaces || []) {
      for (const alternate of usbInterface.alternates || []) {
        if (
          alternate.interfaceClass === 0xfe &&
          alternate.interfaceSubclass === 0x01 &&
          [0x01, 0x02].includes(alternate.interfaceProtocol)
        ) {
          interfaces.push({
            configurationValue: configuration.configurationValue,
            interfaceNumber: usbInterface.interfaceNumber,
            alternateSetting: alternate.alternateSetting,
            name: alternate.interfaceName || "",
          });
        }
      }
    }
  }

  return interfaces;
};

const selectDfuSettings = async (device: any): Promise<DfuSettings> => {
  const interfaces = findDfuSettings(device);

  if (!interfaces.length) {
    throw new Error("No USB DFU interface was found.");
  }

  await fixInterfaceNames(device, interfaces);

  return (
    interfaces.find((settings) =>
      (settings.name || "").toLowerCase().includes("@internal flash"),
    ) || interfaces[0]
  );
};

const parseMemoryDescriptor = (descriptor: string): MemoryInfo => {
  const nameEndIndex = descriptor.indexOf("/");
  if (!descriptor.startsWith("@") || nameEndIndex === -1) {
    throw new Error(`Invalid DfuSe memory descriptor: ${descriptor}`);
  }

  const name = descriptor.substring(1, nameEndIndex).trim();
  const segmentString = descriptor.substring(nameEndIndex);
  const segments: MemorySegment[] = [];
  const sectorMultipliers = {
    " ": 1,
    B: 1,
    K: 1024,
    M: 1048576,
  };

  const contiguousSegmentRegex = /\/\s*(0x[0-9a-fA-F]{1,8})\s*\/(\s*[0-9]+\s*\*\s*[0-9]+\s?[ BKM]\s*[abcdefg]\s*,?\s*)+/g;
  let contiguousSegmentMatch: RegExpExecArray | null;

  while ((contiguousSegmentMatch = contiguousSegmentRegex.exec(segmentString))) {
    const segmentRegex = /([0-9]+)\s*\*\s*([0-9]+)\s?([ BKM])\s*([abcdefg])\s*,?\s*/g;
    let startAddress = parseInt(contiguousSegmentMatch[1], 16);
    let segmentMatch: RegExpExecArray | null;

    while ((segmentMatch = segmentRegex.exec(contiguousSegmentMatch[0]))) {
      const sectorCount = parseInt(segmentMatch[1], 10);
      const sectorSize =
        parseInt(segmentMatch[2], 10) *
        sectorMultipliers[segmentMatch[3] as keyof typeof sectorMultipliers];
      const properties =
        segmentMatch[4].charCodeAt(0) - "a".charCodeAt(0) + 1;

      segments.push({
        start: startAddress,
        sectorSize,
        end: startAddress + sectorSize * sectorCount,
        readable: (properties & 0x1) !== 0,
        erasable: (properties & 0x2) !== 0,
        writable: (properties & 0x4) !== 0,
      });

      startAddress += sectorSize * sectorCount;
    }
  }

  return {
    name,
    segments,
  };
};

const getSegment = (memoryInfo: MemoryInfo, address: number): MemorySegment => {
  const segment = memoryInfo.segments.find(
    (candidate) => candidate.start <= address && address < candidate.end,
  );

  if (!segment) {
    throw new Error(`Address 0x${address.toString(16)} outside memory map.`);
  }

  return segment;
};

const getSectorStart = (segment: MemorySegment, address: number): number => {
  const sectorIndex = Math.floor((address - segment.start) / segment.sectorSize);
  return segment.start + sectorIndex * segment.sectorSize;
};

const getSectorEnd = (segment: MemorySegment, address: number): number => {
  const sectorIndex = Math.floor((address - segment.start) / segment.sectorSize);
  return segment.start + (sectorIndex + 1) * segment.sectorSize;
};

const getFirstWritableSegment = (memoryInfo: MemoryInfo): MemorySegment => {
  const segment = memoryInfo.segments.find((candidate) => candidate.writable);

  if (!segment) {
    throw new Error("No writable DfuSe memory segment was found.");
  }

  return segment;
};

const requestOut = (
  device: any,
  interfaceNumber: number,
  request: number,
  data?: BufferSource,
  value = 0,
): Promise<number> =>
  device
    .controlTransferOut(
      {
        requestType: "class",
        recipient: "interface",
        request,
        value,
        index: interfaceNumber,
      },
      data,
    )
    .then((result) => {
      if (result.status !== "ok") {
        return Promise.reject(result.status);
      }

      return result.bytesWritten;
    });

const requestIn = (
  device: any,
  interfaceNumber: number,
  request: number,
  length: number,
  value = 0,
): Promise<DataView> =>
  device
    .controlTransferIn(
      {
        requestType: "class",
        recipient: "interface",
        request,
        value,
        index: interfaceNumber,
      },
      length,
    )
    .then((result) => {
      if (result.status !== "ok") {
        return Promise.reject(result.status);
      }

      return result.data;
    });

const getStatus = async (
  device: any,
  interfaceNumber: number,
): Promise<DfuStatus> => {
  const data = await requestIn(device, interfaceNumber, requestGetStatus, 6);

  return {
    status: data.getUint8(0),
    pollTimeout: data.getUint32(1, true) & 0xffffff,
    state: data.getUint8(4),
  };
};

const getState = async (
  device: any,
  interfaceNumber: number,
): Promise<number> => {
  const data = await requestIn(device, interfaceNumber, requestGetState, 1);
  return data.getUint8(0);
};

const abortToIdle = async (
  device: any,
  interfaceNumber: number,
): Promise<void> => {
  await requestOut(device, interfaceNumber, requestAbort);

  let state = await getState(device, interfaceNumber);
  if (state === stateDfuError) {
    await requestOut(device, interfaceNumber, requestClearStatus);
    state = await getState(device, interfaceNumber);
  }

  if (state !== stateDfuIdle) {
    throw new Error(`Failed to enter DFU idle state (${state}).`);
  }
};

const pollUntil = async (
  device: any,
  interfaceNumber: number,
  predicate: (state: number) => boolean,
): Promise<DfuStatus> => {
  let status = await getStatus(device, interfaceNumber);

  while (!predicate(status.state) && status.state !== stateDfuError) {
    await delay(status.pollTimeout);
    status = await getStatus(device, interfaceNumber);
  }

  return status;
};

const dfuseCommand = async (
  device: any,
  interfaceNumber: number,
  command: number,
  parameter: number,
): Promise<void> => {
  const payload = new ArrayBuffer(5);
  const view = new DataView(payload);
  view.setUint8(0, command);
  view.setUint32(1, parameter, true);

  await requestOut(device, interfaceNumber, requestDnload, payload, 0);

  const status = await pollUntil(
    device,
    interfaceNumber,
    (state) => state !== stateDfuDnBusy,
  );

  if (status.status !== statusOk) {
    throw new Error(`DfuSe command failed (${status.status}).`);
  }
};

const eraseMemory = async (
  session: Stm32DfuSeSession,
  length: number,
  onProgress: ProgressHandler,
): Promise<void> => {
  const { device, settings, memoryInfo, startAddress } = session;
  let segment = getSegment(memoryInfo, startAddress);
  const endAddress = getSectorEnd(
    getSegment(memoryInfo, startAddress + length - 1),
    startAddress + length - 1,
  );
  let address = getSectorStart(segment, startAddress);
  const bytesToErase = endAddress - address;
  let bytesErased = 0;

  while (address < endAddress) {
    if (segment.end <= address) {
      segment = getSegment(memoryInfo, address);
    }

    if (!segment.erasable) {
      const skipped = Math.min(segment.end, endAddress) - address;
      bytesErased += skipped;
      address += skipped;
      onProgress(Math.max(1, Math.floor((bytesErased / bytesToErase) * 100)));
      continue;
    }

    const sectorStart = getSectorStart(segment, address);
    await dfuseCommand(
      device,
      settings.interfaceNumber,
      dfuseEraseSector,
      sectorStart,
    );
    address = sectorStart + segment.sectorSize;
    bytesErased += segment.sectorSize;
    onProgress(Math.max(1, Math.floor((bytesErased / bytesToErase) * 100)));
  }
};

const readTransferSize = async (
  device: any,
  settings: DfuSettings,
): Promise<number> => {
  try {
    const descriptorHead = await device.controlTransferIn(
      {
        requestType: "standard",
        recipient: "device",
        request: 0x06,
        value: 0x0200,
        index: 0,
      },
      4,
    );

    if (descriptorHead.status !== "ok") {
      return defaultTransferSize;
    }

    const descriptorLength = descriptorHead.data.getUint16(2, true);
    const descriptor = await device.controlTransferIn(
      {
        requestType: "standard",
        recipient: "device",
        request: 0x06,
        value: 0x0200,
        index: 0,
      },
      descriptorLength,
    );

    if (descriptor.status !== "ok") {
      return defaultTransferSize;
    }

    let offset = 9;
    let inSelectedInterface = false;
    while (offset + 2 < descriptor.data.byteLength) {
      const length = descriptor.data.getUint8(offset);
      const type = descriptor.data.getUint8(offset + 1);

      if (!length) {
        break;
      }

      if (type === 4) {
        inSelectedInterface =
          descriptor.data.getUint8(offset + 2) === settings.interfaceNumber;
      } else if (inSelectedInterface && type === 0x21 && length >= 9) {
        return descriptor.data.getUint16(offset + 5, true);
      }

      offset += length;
    }
  } catch (error) {
    return defaultTransferSize;
  }

  return defaultTransferSize;
};

export const openStm32DfuSeDevice = async (): Promise<Stm32DfuSeSession> => {
  const usb = getNavigatorUsb();
  if (!usb) {
    throw new Error("This browser does not support WebUSB.");
  }

  const device = await usb.requestDevice({
    filters: [
      {
        vendorId: stm32DfuVendorId,
        productId: stm32DfuProductId,
      },
    ],
  });

  const settings = await selectDfuSettings(device);

  try {
    if (!device.opened) {
      await device.open();
    }

    if (
      !device.configuration ||
      device.configuration.configurationValue !== settings.configurationValue
    ) {
      await device.selectConfiguration(settings.configurationValue);
    }

    await device.claimInterface(settings.interfaceNumber);

    if (settings.alternateSetting) {
      await device.selectAlternateInterface(
        settings.interfaceNumber,
        settings.alternateSetting,
      );
    }

    const memoryInfo = parseMemoryDescriptor(settings.name);
    const startAddress = getFirstWritableSegment(memoryInfo).start;
    const transferSize = await readTransferSize(device, settings);

    await abortToIdle(device, settings.interfaceNumber);

    return {
      device,
      settings,
      memoryInfo,
      startAddress,
      transferSize,
    };
  } catch (error) {
    if (device.opened) {
      try {
        await device.close();
      } catch (closeError) {
        // Ignore close errors from a device that is already gone.
      }
    }

    throw error;
  }
};

export const closeStm32DfuSeDevice = async (
  session: Stm32DfuSeSession | null,
): Promise<void> => {
  if (!session || !session.device.opened) {
    return;
  }

  try {
    await session.device.close();
  } catch (error) {
    // Device may already be gone after manifestation.
  }
};

export const flashStm32DfuSe = async (
  session: Stm32DfuSeSession,
  payload: Uint8Array,
  onProgress: ProgressHandler,
): Promise<void> => {
  const { device, settings, startAddress, transferSize } = session;

  onProgress(1, "Erasing device flash");
  await eraseMemory(session, payload.byteLength, onProgress);

  onProgress(1, "Writing firmware");
  let bytesWritten = 0;
  let address = startAddress;

  while (bytesWritten < payload.byteLength) {
    const chunk = payload.slice(bytesWritten, bytesWritten + transferSize);

    await dfuseCommand(
      device,
      settings.interfaceNumber,
      dfuseSetAddress,
      address,
    );
    await requestOut(
      device,
      settings.interfaceNumber,
      requestDnload,
      chunk,
      2,
    );

    const status = await pollUntil(
      device,
      settings.interfaceNumber,
      (state) => state === stateDfuDnloadIdle,
    );

    if (status.status !== statusOk) {
      throw new Error(`DFU download failed (${status.status}).`);
    }

    bytesWritten += chunk.byteLength;
    address += chunk.byteLength;
    onProgress(Math.floor((bytesWritten / payload.byteLength) * 100));
  }

  onProgress(100, "Starting firmware");
  await dfuseCommand(
    device,
    settings.interfaceNumber,
    dfuseSetAddress,
    startAddress,
  );
  await requestOut(
    device,
    settings.interfaceNumber,
    requestDnload,
    new ArrayBuffer(0),
    0,
  );

  try {
    await pollUntil(
      device,
      settings.interfaceNumber,
      (state) => state === stateDfuManifest,
    );
  } catch (error) {
    // STM32 ROM DFU commonly disconnects while manifesting the image.
  }
};
