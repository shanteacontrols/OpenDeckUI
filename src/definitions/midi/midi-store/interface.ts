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
