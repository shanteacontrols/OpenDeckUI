import { LogType, ILogEntryBase } from "./state";
import { addBuffered } from "./actions";

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
  | "mmcstop"
  | "mmcplay"
  | "mmcsrecordstart"
  | "mmcsrecordstop"
  | "mmcspause"
  | "reset";

export const MidiEventTypeLabel = {
  noteon: "Note On",
  noteoff: "Note On",
  controlchange: "Control Change",
  programchange: "Program Change",
  pitchbend: "Pitch Bend",
  clock: "Clock",
  start: "Start",
  continue: "Continue",
  stop: "Stop",
  activesensing: "Active Sensing",
  reset: "Reset",
  mmcstop: "MMC Stop",
  mmcplay: "MMC Play",
  mmcrecordstart: "MMC Record Start",
  mmcrecordstop: "MMC Record Stop",
  mmcpause: "MMC Pause",
};

export const MidiEventTypeMMC = {
  1: "mmcstop",
  2: "mmcplay",
  6: "mmcrecordstart",
  7: "mmcrecordstop",
  9: "mmcpause",
};

export const MidiRealtimeEvent = [
  "clock",
  "start",
  "continue",
  "stop",
  "activesensing",
  "reset",
];

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

  const logEntry = {
    type: LogType.Midi,
    time: new Date(),
    eventType: type,
    channel,
    data: dataArray,
    value,
    controller,
  } as ILogEntryMidi;

  addBuffered(logEntry);
};
