import { reactive } from "vue";
import { Input, Output } from "webmidi";
import { IMidiState, MidiConnectionState } from "./interface";

export const defaultState: IMidiState = {
  connectionState: MidiConnectionState.Closed,
  inputs: [] as Array<Input>,
  outputs: [] as Array<Output>,
  log: true,
  isWebMidiSupported: false,
};

export const midiState = reactive(defaultState);
