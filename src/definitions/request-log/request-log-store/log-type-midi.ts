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
  noteoff: "Note Off",
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
  parameterNumber?: number;
  velocity?: number;
  dataHex?: string;
  dataDec?: string;
}

export interface MidiEventParams {
  type: MidiEventType;
  channel?: number;
  data?: Uint8Array;
  value?: number;
  controller?: number | { number: number };
}

const cc14ControllerOffset = 32;
const nrpnParameterMSBController = 99;
const nrpnParameterLSBController = 98;
const nrpnDataEntryMSBController = 6;
const nrpnDataEntryLSBController = 38;
// Allow adjacent CC messages to be grouped without delaying normal logging.
const midiSequenceTimeoutMS = 10;

export enum MidiSequenceType {
  CC14 = "cc14",
  Nrpn7Bit = "nrpn7bit",
  Nrpn14Bit = "nrpn14bit",
}

export interface MidiSequenceComponent {
  block: number;
  index: number;
  channel: number;
  controller: number;
  type: MidiSequenceType;
}

interface PendingMidiSequence {
  params: MidiEventParams[];
  candidates: MidiSequenceComponent[];
  // NRPN 7-bit is complete after three messages but is also the prefix of
  // NRPN 14-bit, so keep it until the fourth message or timeout resolves it.
  completed?: MidiSequenceComponent;
  timeout: number;
}

let pendingMidiSequence: PendingMidiSequence;
let midiSequenceComponents: MidiSequenceComponent[] = [];

const getControllerNumber = (params: MidiEventParams): number => {
  if (typeof params.controller === "number") {
    return params.controller;
  }

  if (params.controller) {
    return params.controller.number;
  }

  return params.data && params.data.length > 1 ? params.data[1] : undefined;
};

const getControlChangeValue = (params: MidiEventParams): number =>
  params.data && params.data.length > 2 ? params.data[2] : params.value;

const addMidiEntry = (
  params: MidiEventParams,
  overrides: Partial<ILogEntryMidi> = {},
): void => {
  const { type, channel, data } = params;
  const dataArray = data ? Array.from(data) : [];
  const value =
    params.value && type !== "controlchange" ? params.value : undefined;
  const note = ["noteon", "noteoff"].includes(type) ? data[1] : undefined;
  const controllerNumber = getControllerNumber(params);
  const velocity = data && data.length > 2 ? data[2] : undefined;
  const label =
    type == "noteoff"
      ? data[0] >= 144
        ? MidiEventTypeLabel.noteon
        : MidiEventTypeLabel.noteoff
      : MidiEventTypeLabel[type];

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
    ...overrides,
  } as ILogEntryMidi;

  addBuffered(logEntry);
};

const combineRawData = (params: MidiEventParams[]): Uint8Array =>
  new Uint8Array(
    params.reduce(
      (data, current) => [
        ...data,
        ...(current.data ? Array.from(current.data) : []),
      ],
      [] as number[],
    ),
  );

const sequenceControllers = (component: MidiSequenceComponent): number[] => {
  switch (component.type) {
    case MidiSequenceType.CC14:
      return [
        component.controller,
        component.controller + cc14ControllerOffset,
      ];

    case MidiSequenceType.Nrpn7Bit:
      return [
        nrpnParameterMSBController,
        nrpnParameterLSBController,
        nrpnDataEntryMSBController,
      ];

    case MidiSequenceType.Nrpn14Bit:
      return [
        nrpnParameterMSBController,
        nrpnParameterLSBController,
        nrpnDataEntryMSBController,
        nrpnDataEntryLSBController,
      ];
  }
};

const addSequenceEntry = (
  params: MidiEventParams[],
  component: MidiSequenceComponent,
): void => {
  const isCC14 = component.type === MidiSequenceType.CC14;
  const isNrpn14 = component.type === MidiSequenceType.Nrpn14Bit;
  const value = isCC14
    ? (getControlChangeValue(params[0]) << 7) | getControlChangeValue(params[1])
    : isNrpn14
    ? (getControlChangeValue(params[2]) << 7) | getControlChangeValue(params[3])
    : getControlChangeValue(params[2]);
  const last = params[params.length - 1];
  const label = isCC14
    ? "Control Change 14-bit"
    : isNrpn14
    ? "NRPN 14-bit"
    : "NRPN 7-bit";

  addMidiEntry(
    {
      ...last,
      data: combineRawData(params),
    },
    {
      label,
      value,
      controllerNumber: isCC14 ? component.controller : undefined,
      parameterNumber: isCC14 ? undefined : component.controller,
      velocity: undefined,
    },
  );
};

const copyMidiEvent = (params: MidiEventParams): MidiEventParams => ({
  ...params,
  data: params.data ? new Uint8Array(params.data) : undefined,
});

// Channel 17 is OpenDeck's omni channel.
const matchesComponentChannel = (
  component: MidiSequenceComponent,
  channel: number,
): boolean => component.channel === 17 || component.channel === channel;

const matchesSequenceEvent = (
  component: MidiSequenceComponent,
  params: MidiEventParams,
  position: number,
  previous: MidiEventParams[],
): boolean => {
  if (
    getControlChangeValue(params) === undefined ||
    sequenceControllers(component)[position] !== getControllerNumber(params)
  ) {
    return false;
  }

  if (position === 0) {
    return matchesComponentChannel(component, params.channel);
  }

  if (params.channel !== previous[0].channel) {
    // Omni accepts any starting channel, but one sequence cannot cross channels.
    return false;
  }

  if (position === 1 && component.type !== MidiSequenceType.CC14) {
    const parameter =
      (getControlChangeValue(previous[0]) << 7) | getControlChangeValue(params);
    return parameter === component.controller;
  }

  return true;
};

const clearPendingSequence = (): void => {
  if (!pendingMidiSequence) {
    return;
  }

  clearTimeout(pendingMidiSequence.timeout);
  pendingMidiSequence = undefined;
};

const flushPendingSequence = (): void => {
  if (!pendingMidiSequence) {
    return;
  }

  const { completed, params } = pendingMidiSequence;
  clearPendingSequence();

  if (completed) {
    addSequenceEntry(params, completed);
  } else {
    // Preserve interrupted or incomplete sequences as ordinary CC messages.
    params.forEach((param) => addMidiEntry(param));
  }
};

const setSequenceTimeout = (): void => {
  const current = pendingMidiSequence;
  clearTimeout(current.timeout);
  current.timeout = window.setTimeout(() => {
    if (pendingMidiSequence === current) {
      flushPendingSequence();
    }
  }, midiSequenceTimeoutMS);
};

const queueSequence = (
  params: MidiEventParams,
  candidates: MidiSequenceComponent[],
): void => {
  pendingMidiSequence = {
    params: [copyMidiEvent(params)],
    candidates,
    timeout: undefined,
  };
  setSequenceTimeout();
};

const consumePendingSequence = (params: MidiEventParams): boolean => {
  const position = pendingMidiSequence.params.length;
  const matches = pendingMidiSequence.candidates.filter((component) =>
    matchesSequenceEvent(
      component,
      params,
      position,
      pendingMidiSequence.params,
    ),
  );
  if (!matches.length) {
    return false;
  }

  pendingMidiSequence.params.push(copyMidiEvent(params));
  const completed = matches.find(
    (component) => sequenceControllers(component).length === position + 1,
  );
  const incomplete = matches.filter(
    (component) => sequenceControllers(component).length > position + 1,
  );

  if (!incomplete.length) {
    const sequence = pendingMidiSequence.params;
    clearPendingSequence();
    addSequenceEntry(sequence, completed);
    return true;
  }

  // Keep only longer sequences that still match. A completed shorter sequence
  // remains available as the timeout fallback.
  pendingMidiSequence.candidates = incomplete;
  pendingMidiSequence.completed = completed;
  setSequenceTimeout();
  return true;
};

const addControlChange = (params: MidiEventParams): void => {
  if (pendingMidiSequence) {
    if (consumePendingSequence(params)) {
      return;
    }

    flushPendingSequence();
    // The current CC may start a new sequence after interrupting the old one.
  }

  const candidates = midiSequenceComponents.filter((component) =>
    matchesSequenceEvent(component, params, 0, []),
  );
  if (candidates.length) {
    queueSequence(params, candidates);
    return;
  }

  addMidiEntry(params);
};

export const clearPendingMidi = (): void => clearPendingSequence();

export const setMidiSequenceComponents = (
  components: MidiSequenceComponent[],
): void => {
  // Do not finish a sequence against configuration that has just changed.
  clearPendingMidi();
  midiSequenceComponents = components;
};

export const addMidi = (params: MidiEventParams): void => {
  if (state.suspendMidiLogs) {
    clearPendingMidi();
    return;
  }

  if (params.type !== "controlchange") {
    flushPendingSequence();
    addMidiEntry(params);
    return;
  }

  addControlChange(params);
};
