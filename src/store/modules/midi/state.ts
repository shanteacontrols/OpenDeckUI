import { reactive } from "vue";
import { Input, Output } from "webmidi";
import { Block } from "../../../definitions";

export enum MidiConnectionState {
  Closed = "closed",
  Pending = "pending",
  Open = "open",
}

export enum ControlDisableType {
  NotSupported = "not_supported",
  MissingIndex = "missing_index",
}

export interface IControlDisable {
  block: Block;
  key: string;
  type: ControlDisableType;
}

export interface IMidiState {
  connectionState: MidiConnectionState;
  inputs: Array<Input>;
  outputs: Array<Output>;
  log: boolean;
  disableUiControls: Array<IControlDisable>;
}

// State

export const defaultState: IMidiState = {
  connectionState: MidiConnectionState.Closed,
  inputs: [] as Array<Input>,
  outputs: [] as Array<Output>,
  log: true,
  disableUiControls: [],
};

export const state = reactive(defaultState);
