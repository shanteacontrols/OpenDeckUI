import { state, DeviceConnectionState } from "./state";
import { computed, ComputedRef } from "vue";

// Interface

export interface IDeviceComputed {
  name: ComputedRef<string>;
  manufacturer: ComputedRef<string>;
  isConnected: ComputedRef<boolean>;
  isConnecting: ComputedRef<boolean>;
  showMsbControls: ComputedRef<boolean>;
}

// Composable

const name = computed(() => state.input && state.input.name);
const manufacturer = computed(() => state.input && state.input.manufacturer);
const isConnecting = computed(
  () => state.connectionState === DeviceConnectionState.Pending
);
const isConnected = computed(
  () => state.connectionState === DeviceConnectionState.Open
);
const showMsbControls = computed(() => state.valueSize === 1);

export const deviceStoreComputed: IDeviceComputed = {
  name,
  manufacturer,
  isConnecting,
  isConnected,
  showMsbControls,
};
