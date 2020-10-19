import { LogType, ILogEntryBase, state } from "./state";
import { addBuffered } from "./actions";
import { convertToHexString, ensureString } from "../../../util";

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
  clock: "RealTime: Clock",
  start: "RealTime: Start",
  continue: "RealTime: Continue",
  stop: "RealTime: Stop",
  activesensing: "RealTime: Active Sensing",
  reset: "RealTime: Reset",
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
  label: string;
  type: LogType.Midi;
  eventType: MidiEventType;
  channel?: number;
  data?: number[];
  value?: number;
  note?: number;
  controllerNumber?: number;
  velocity?: number;
  dataHex?: string;
  dataDec?: string;
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
  if (state.suspendMidiLogs) {
    return;
  }

  const { type, channel, data, controller } = params;
  const dataArray = data ? Array.from(data) : [];
  const value =
    params.value && type !== "controlchange" ? params.value : undefined;
  const note = ["noteon", "noteoff"].includes(type) ? data[1] : undefined;
  const controllerNumber = controller && controller.number;
  const velocity = data && data.length > 2 ? data[2] : 0;
  const label = MidiEventTypeLabel[type];

  const dataDec = data && ensureString(dataArray);
  const dataHex = data && ensureString(convertToHexString(dataArray));

  const logEntry = {
    label,
    type: LogType.Midi,
    eventType: type,
    channel,
    dataHex,
    dataDec,
    value,
    controllerNumber,
    note,
    velocity,
  } as ILogEntryMidi;

  addBuffered(logEntry);
};
