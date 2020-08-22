import { Input } from "webmidi";
import { requestLog } from "../../request-log/request-log-store";

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
    input.addListener(eventName, "all", requestLog.actions.addMidi),
  );
};

export const detachMidiEventHandlers = (input: Input): void => {
  midiEventNames.forEach((eventName) => input.removeListener(eventName, "all"));
};
