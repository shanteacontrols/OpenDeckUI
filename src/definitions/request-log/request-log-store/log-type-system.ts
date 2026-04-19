import { LogType, ILogEntryBase } from "./state";
import { addBuffered } from "./actions";

export interface ILogEntrySystem extends ILogEntryBase {
  type: LogType.System;
  message: string;
  source: "host" | "device";
}

export const addSystem = (
  message: string,
  source: "host" | "device" = "host",
): void => {
  addBuffered({
    type: LogType.System,
    message,
    source,
  });
};
