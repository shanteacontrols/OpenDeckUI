import { reactive } from "vue";
import { Input, Output } from "webmidi";

export enum MidiConnectionState {
  Closed = "closed",
  Pending = "pending",
  Open = "open",
}

export interface IMidiState {
  connectionState: MidiConnectionState;
  inputs: Array<Input>;
  outputs: Array<Output>;
  log: boolean;
}

// State

export const defaultState: IMidiState = {
  connectionState: MidiConnectionState.Closed,
  inputs: [] as Array<Input>,
  outputs: [] as Array<Output>,
  log: true,
};

export const state = reactive(defaultState);
