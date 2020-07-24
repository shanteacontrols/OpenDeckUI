import { Input } from "webmidi";
import { activityLog } from "./activity-log";

export const attachMidiEventHandlers = (input: Input): void => {
  input.addListener("noteon", "all", activityLog.addMidi);
  input.addListener("noteoff", "all", activityLog.addMidi);
  input.addListener("controlchange", "all", activityLog.addMidi);
  input.addListener("programchange", "all", activityLog.addMidi);
  input.addListener("pitchbend", "all", activityLog.addMidi);
  input.addListener("clock", "all", activityLog.addMidi);
  input.addListener("start", "all", activityLog.addMidi);
  input.addListener("continue", "all", activityLog.addMidi);
  input.addListener("stop", "all", activityLog.addMidi);
  input.addListener("activesensing", "all", activityLog.addMidi);
  input.addListener("reset", "all", activityLog.addMidi);
  // @TODO: check which WebMidi version removed nrpn and why?
  // input.addListener("nrpn", "all", handleNrpn);
};
