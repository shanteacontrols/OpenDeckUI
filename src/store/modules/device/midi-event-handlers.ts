import { Input } from "webmidi";
import { activityLog } from "../activity-log";

export const attachMidiEventHandlers = (input: Input): void => {
  input.addListener("noteon", "all", activityLog.actions.addMidi);
  input.addListener("noteoff", "all", activityLog.actions.addMidi);
  input.addListener("controlchange", "all", activityLog.actions.addMidi);
  input.addListener("programchange", "all", activityLog.actions.addMidi);
  input.addListener("pitchbend", "all", activityLog.actions.addMidi);
  input.addListener("clock", "all", activityLog.actions.addMidi);
  input.addListener("start", "all", activityLog.actions.addMidi);
  input.addListener("continue", "all", activityLog.actions.addMidi);
  input.addListener("stop", "all", activityLog.actions.addMidi);
  input.addListener("activesensing", "all", activityLog.actions.addMidi);
  input.addListener("reset", "all", activityLog.actions.addMidi);
  // @TODO: check which WebMidi version removed nrpn and why?
  // input.addListener("nrpn", "all", handleNrpn);
};
