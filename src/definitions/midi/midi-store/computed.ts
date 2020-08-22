import { midiState } from "./state";
import { MidiConnectionState } from "./interface";
import { computed, ComputedRef } from "vue";

// Interface

export interface IMidiComputed {
  isConnected: ComputedRef<boolean>;
  isConnecting: ComputedRef<boolean>;
}

// Computed

export const isConnecting = (): boolean =>
  midiState.connectionState === MidiConnectionState.Pending;
export const isConnected = (): boolean =>
  midiState.connectionState === MidiConnectionState.Open;

// Composable

export const midiStoreComputed: IMidiComputed = {
  isConnecting: computed(() => isConnecting()),
  isConnected: computed(() => isConnected()),
};
