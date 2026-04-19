import { deviceState } from "./state";
import { DeviceConnectionState, DfuState } from "./interface";
import { computed, ComputedRef } from "vue";

// Interface

export interface IDeviceComputed {
  name: ComputedRef<string>;
  manufacturer: ComputedRef<string>;
  isConnected: ComputedRef<boolean>;
  isConnecting: ComputedRef<boolean>;
  hasVisibleSession: ComputedRef<boolean>;
  isDfuActive: ComputedRef<boolean>;
  showMsbControls: ComputedRef<boolean>;
}

// Composable

const name = computed(() => deviceState.input && deviceState.input.name);
const manufacturer = computed(
  () => deviceState.input && deviceState.input.manufacturer,
);
const isConnecting = computed(
  () => deviceState.connectionState === DeviceConnectionState.Pending,
);
const isConnected = computed(
  () => deviceState.connectionState === DeviceConnectionState.Open,
);
const isDfuActive = computed(() => deviceState.dfuState !== DfuState.Idle);
const hasVisibleSession = computed(
  () => isConnected.value || isDfuActive.value,
);
const showMsbControls = computed(() => deviceState.valueSize === 1);

export const deviceStoreComputed: IDeviceComputed = {
  name,
  manufacturer,
  isConnecting,
  isConnected,
  hasVisibleSession,
  isDfuActive,
  showMsbControls,
};
