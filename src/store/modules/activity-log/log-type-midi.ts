import { LogType, ILogEntryBase, state } from "./state";
import { logger } from "../../../util";

export type MidiEventType =
  | "noteon"
  | "noteoff"
  | "controlchange"
  | "programchange"
  | "pitchbend"
  | "clock"
  | "start"
  | "continue"
  | "stop"
  | "activesensing"
  | "reset";

export interface ILogEntryMidi extends ILogEntryBase {
  type: LogType.Midi;
  eventType: MidiEventType;
  channel?: number;
  data?: number[];
  value?: number;
  controller?: {
    number?: number;
    name?: string;
  };
}

export interface MidiEventParams {
  type: MidiEventType;
  channel?: number;
  data?: Uint8Array;
  value?: number;
  controller?: {
    number?: number;
    name?: string;
  };
}

export const addMidi = (params: MidiEventParams): void => {
  const { type, channel, data, value, controller } = params;
  const dataArray = data ? Array.from(data) : [];

  logger.log("Adding midi", params);

  state.stack.push({
    type: LogType.Midi,
    time: new Date(),
    eventType: type,
    channel,
    data: dataArray,
    value,
    controller,
  } as ILogEntryMidi);
};
