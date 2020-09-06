import { logger, delay, hexToDec } from "../../../util";
import { Request } from "../../request";
import { sendMessage } from "./request-qeueue";

const bytesPerSecondLimit = 300;

export const newLineCharacter = "\n";

const getAbsoluteSeconds = () => {
  const now = new Date();
  const nowMs = now.getTime();
  return Math.floor(nowMs / 1000);
};

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

export const sendMessagesFromFileWithRateLimiter = async (
  file: File,
  command: Request,
): Promise<void> => {
  const messages = await convertFileToMessageArray(file);

  const timeLimiter = {};

  // Limit to 10 mesages per second
  const sendMessageWithLimiter = async (payload) => {
    const bytes = payload.length;
    const absSeconds = getAbsoluteSeconds();
    if (timeLimiter[absSeconds] > bytesPerSecondLimit) {
      logger.log("DELAYED");
      return delay(250).then(() => sendMessageWithLimiter(payload));
    }

    if (!timeLimiter[absSeconds]) {
      timeLimiter[absSeconds] = bytes;
    } else {
      timeLimiter[absSeconds] = timeLimiter[absSeconds] + bytes;
    }

    return sendMessage({
      command,
      payload,
      handler: () => null,
    });
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

  return !hadErrors;
};
