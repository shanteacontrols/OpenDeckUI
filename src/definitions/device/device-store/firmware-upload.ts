export const firmwareUploadAck = 0x81;
export const firmwareUploadCommandBegin = 0x01;
export const firmwareUploadCommandChunk = 0x02;
export const firmwareUploadCommandFinish = 0x03;
export const firmwareUploadCommandAbort = 0x04;
export const firmwareUploadStatusOk = 0x00;
export const firmwareUploadChunkLengthSize = 2;
export const firmwareUploadChunkFrameOverhead =
  1 + firmwareUploadChunkLengthSize;

export const buildFirmwareUploadFrame = (
  command: number,
  payload: Uint8Array = new Uint8Array(),
): Uint8Array => {
  if (command === firmwareUploadCommandChunk) {
    const frame = new Uint8Array(
      firmwareUploadChunkFrameOverhead + payload.length,
    );
    frame[0] = command;
    frame[1] = payload.length & 0xff;
    frame[2] = (payload.length >> 8) & 0xff;
    frame.set(payload, firmwareUploadChunkFrameOverhead);
    return frame;
  }

  if (payload.length !== 0) {
    throw new Error("Only chunk firmware upload commands may carry a payload");
  }

  return new Uint8Array([command]);
};
