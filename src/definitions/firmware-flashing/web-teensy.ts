type TeensyFirmwareBlock = {
  address: number;
  data: Uint8Array;
};

export type TeensyHidSession = {
  device: any;
  productId: number;
  productName: string;
};

const teensyVendorId = 0x16c0;
const teensy4ProductId = 0x0478;
const teensy41ProductId = 0x0479;
const teensy4FlashBase = 0x60000000;
const pageSize = 1024;
const reportSize = pageSize + 64;

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const navigatorHid = (): any => (navigator as any).hid;

const parseHexByte = (text: string, offset: number): number =>
  Number.parseInt(text.slice(offset, offset + 2), 16);

const isBlankBlock = (block: TeensyFirmwareBlock, index: number): boolean =>
  index !== 0 && block.data.every((byte) => byte === 0xff);

const finalizeBlocks = (blocks: Map<number, Uint8Array>): TeensyFirmwareBlock[] =>
  Array.from(blocks.entries())
    .map(([blockNumber, data]) => ({
      address: teensy4FlashBase + blockNumber * pageSize,
      data,
    }))
    .sort((left, right) => left.address - right.address);

const ensureBlock = (
  blocks: Map<number, Uint8Array>,
  blockNumber: number,
): Uint8Array => {
  if (!blocks.has(blockNumber)) {
    const block = new Uint8Array(pageSize);
    block.fill(0xff);
    blocks.set(blockNumber, block);
  }

  return blocks.get(blockNumber) as Uint8Array;
};

const parseIntelHex = (payload: Uint8Array): TeensyFirmwareBlock[] => {
  const lines = new TextDecoder().decode(payload).split(/\r?\n/);
  const blocks = new Map<number, Uint8Array>();
  let baseAddress = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();
    if (!line) {
      continue;
    }

    if (!line.startsWith(":")) {
      throw new Error(`Invalid HEX line ${lineIndex + 1}`);
    }

    const record = line.slice(1);
    const length = parseHexByte(record, 0);
    const address = Number.parseInt(record.slice(2, 6), 16);
    const recordType = parseHexByte(record, 6);

    if (record.length !== 10 + length * 2) {
      throw new Error(`Invalid HEX line length at line ${lineIndex + 1}`);
    }

    let checksumTotal =
      length + ((address >> 8) & 0xff) + (address & 0xff) + recordType;
    const bytes = new Uint8Array(length);

    for (let index = 0; index < length; index++) {
      const byte = parseHexByte(record, 8 + index * 2);
      bytes[index] = byte;
      checksumTotal += byte;
    }

    const checksum = parseHexByte(record, 8 + length * 2);
    if (((checksumTotal + checksum) & 0xff) !== 0) {
      throw new Error(`HEX checksum mismatch at line ${lineIndex + 1}`);
    }

    if (recordType === 0x00) {
      let offsetAddress = baseAddress + address - teensy4FlashBase;
      if (offsetAddress < 0) {
        continue;
      }

      let dataOffset = 0;
      while (dataOffset < bytes.length) {
        const blockNumber = Math.floor(offsetAddress / pageSize);
        const blockOffset = offsetAddress % pageSize;
        const block = ensureBlock(blocks, blockNumber);
        const bytesToCopy = Math.min(pageSize - blockOffset, bytes.length - dataOffset);

        block.set(bytes.subarray(dataOffset, dataOffset + bytesToCopy), blockOffset);

        offsetAddress += bytesToCopy;
        dataOffset += bytesToCopy;
      }
    } else if (recordType === 0x01) {
      break;
    } else if (recordType === 0x02) {
      baseAddress = Number.parseInt(record.slice(8, 12), 16) << 4;
    } else if (recordType === 0x04) {
      baseAddress = Number.parseInt(record.slice(8, 12), 16) << 16;
    }
  }

  return finalizeBlocks(blocks);
};

const parseRawBinary = (payload: Uint8Array): TeensyFirmwareBlock[] => {
  const blocks: TeensyFirmwareBlock[] = [];

  for (let offset = 0; offset < payload.length; offset += pageSize) {
    const block = new Uint8Array(pageSize);
    block.fill(0xff);
    block.set(payload.subarray(offset, offset + pageSize));
    blocks.push({
      address: teensy4FlashBase + offset,
      data: block,
    });
  }

  return blocks;
};

const buildFirmwareBlocks = (
  payload: Uint8Array,
  fileName: string,
): TeensyFirmwareBlock[] =>
  fileName.toLowerCase().endsWith(".hex")
    ? parseIntelHex(payload)
    : parseRawBinary(payload);

const sendReportWithRetries = async (
  device: any,
  report: Uint8Array,
): Promise<void> => {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await device.sendReport(0, report);
      return;
    } catch (error) {
      await sleep(100);
    }
  }

  throw new Error("Unable to send Teensy HID report.");
};

export const openTeensyHidDevice = async (): Promise<TeensyHidSession> => {
  const hid = navigatorHid();
  if (!hid) {
    throw new Error("WebHID is not available in this browser.");
  }

  const devices = await hid.requestDevice({
    filters: [
      { vendorId: teensyVendorId, productId: teensy4ProductId },
      { vendorId: teensyVendorId, productId: teensy41ProductId },
    ],
  });

  if (!devices.length) {
    throw new Error("No device selected");
  }

  const device = devices[0];
  await device.open();

  return {
    device,
    productId: device.productId,
    productName: device.productName || "Teensy",
  };
};

export const closeTeensyHidDevice = async (
  session: TeensyHidSession | null,
): Promise<void> => {
  if (session && session.device && session.device.opened) {
    await session.device.close().catch(() => undefined);
  }
};

export const flashTeensyFirmware = async (
  session: TeensyHidSession,
  payload: Uint8Array,
  fileName: string,
  onProgress: (progress: number, message?: string) => void,
): Promise<void> => {
  const blocks = buildFirmwareBlocks(payload, fileName);
  const neededBlocks = blocks.filter((block, index) => !isBlankBlock(block, index));

  if (!neededBlocks.length) {
    throw new Error("Firmware file does not contain flashable data.");
  }

  if (!session.device.opened) {
    await session.device.open();
  }

  const report = new Uint8Array(reportSize);
  let sentBlocks = 0;

  for (const block of neededBlocks) {
    report.fill(0);
    report[0] = block.address & 0xff;
    report[1] = (block.address >> 8) & 0xff;
    report[2] = (block.address >> 16) & 0xff;
    report.set(block.data, 64);

    await sendReportWithRetries(session.device, report);

    sentBlocks++;
    onProgress(
      Math.max(1, Math.round((sentBlocks / neededBlocks.length) * 99)),
      "Writing firmware",
    );
    await sleep(sentBlocks === 1 ? 1500 : 5);
  }

  report.fill(0);
  report[0] = 0xff;
  report[1] = 0xff;
  report[2] = 0xff;
  await sendReportWithRetries(session.device, report);
  await sleep(100);
};
