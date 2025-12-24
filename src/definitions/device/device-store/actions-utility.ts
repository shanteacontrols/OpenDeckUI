import { delay, hexToDec } from "../../../util";
import { Request } from "../../request";
import { sendMessage } from "./request-qeueue";
import { deviceState } from "./state";

const defaultInterPacketDelayMs = 20;

export const newLineCharacter = "\n";

const convertFileToMessageArray = async (
  file: File,
): Promise<Array<Array<number>>> => {
  const fileContent = await file.text();
  const decodeHexMessageRow = (row: string) => row.split(" ").map(hexToDec);
  const trimKnownBytes = (msg: number[]) => msg.slice(4, -1); // webmidi.js adds these

  return fileContent
    .split(newLineCharacter)
    .map(decodeHexMessageRow)
    .map(trimKnownBytes);
};

export const sendMessagesFromFileWithDelay = async (
  file: File,
  command: Request,
  interPacketDelayMs: number = defaultInterPacketDelayMs,
): Promise<void> => {
  let sentMessageCount = 0;
  deviceState.systemOperationPercentage = 1;

  const messages = await convertFileToMessageArray(file);

  const sendMessageWithLimiter = async (payload) => {
    sentMessageCount += 1;

    const percentage = Math.floor((sentMessageCount / messages.length) * 100); // eslint-disable-line

    // Make sure we show the overlay by keeping % at 1 at least
    deviceState.systemOperationPercentage = percentage > 0 ? percentage : 1;

    return sendMessage({
      command,
      payload,
      handler: () => null,
    }).then(() => delay(interPacketDelayMs));
  };

  let hadErrors = false;

  const promiseChain = messages.reduce((promise, message) => {
    return promise
      .then(() => sendMessageWithLimiter(message))
      .catch(() => {
        hadErrors = true;
        sendMessageWithLimiter(message);
      });
  }, Promise.resolve());

  await promiseChain;

  deviceState.systemOperationPercentage = null;

  return !hadErrors;
};
