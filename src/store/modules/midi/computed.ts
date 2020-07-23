import { state, MidiConnectionState } from "./state";
import { computed, ComputedRef } from "vue";

// Interface

export interface IMidiComputed {
  isConnected: ComputedRef<boolean>;
  isConnecting: ComputedRef<boolean>;
}

// Computed

export const isConnecting = (): boolean =>
  state.connectionState === MidiConnectionState.Pending;
export const isConnected = (): boolean =>
  state.connectionState === MidiConnectionState.Open;

// Composable

export const midiStoreComputed: IMidiComputed = {
  isConnecting: computed(() => isConnecting()),
  isConnected: computed(() => isConnected()),
};
