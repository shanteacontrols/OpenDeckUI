import { Input } from "webmidi";
import { activityLog } from "../activity-log";

const midiEventNames = [
  "noteon",
  "noteoff",
  "controlchange",
  "programchange",
  "pitchbend",
  "clock",
  "start",
  "continue",
  "stop",
  "activesensing",
  "reset",
];

export const attachMidiEventHandlers = (input: Input): void => {
  midiEventNames.forEach((eventName) =>
    input.addListener(eventName, "all", activityLog.actions.addMidi),
  );
};

export const detachMidiEventHandlers = (input: Input): void => {
  midiEventNames.forEach((eventName) => input.removeListener(eventName, "all"));
};
