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
