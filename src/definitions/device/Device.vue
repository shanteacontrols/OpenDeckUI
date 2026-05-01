<template>
  <Hero v-if="isConnecting" custom="h-64 relative">
    <SpinnerOverlay />
  </Hero>

  <div v-else-if="hasVisibleSession" class="relative">
    <DeviceNav v-if="isConnected && !isBootloaderMode" />
    <router-view></router-view>

    <SpinnerOverlay
      v-if="showTransitionOverlay"
      fixed
      :message="transitionMessage"
    />

    <ProgressBar
      v-if="
        isSystemOperationRunning && Number.isInteger(systemOperationPercentage)
      "
      :percentage="systemOperationPercentage"
    />
    <SpinnerOverlay
      v-else-if="isSystemOperationRunning"
      fixed
      :message="systemOperationMessage || 'Processing device operation'"
    />
  </div>

  <Hero
    v-else
    custom="h-64"
    :title="isReloadingFallback ? 'Reloading' : 'No WebMidi device found.'"
  >
    <p v-if="isReloadingFallback">Re-establishing device connection</p>
  </Hero>

  <RequestLog />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import router from "../../router";
import { logger } from "../../util";
import { deviceStoreMapped } from "../../store";
import { DfuState, webUsbDfuVirtualOutputId } from "./device-store";

import RequestLog from "../request-log/RequestLog.vue";
import DeviceNav from "./DeviceNav.vue";

export default defineComponent({
  name: "Device",
  components: {
    RequestLog,
    DeviceNav,
  },
  setup() {
    const {
      connectDevice,
      startDfuDiscovery,
      isConnected,
      hasVisibleSession,
      isConnecting,
      isSystemOperationRunning,
      systemOperationMessage,
      systemOperationPercentage,
      isBootloaderMode,
      dfuState,
    } = deviceStoreMapped;

    const showTransitionOverlay = computed(
      () =>
        router.currentRoute.value.name !== "device-firmware-update" &&
        [
          DfuState.RebootingToApplication,
          DfuState.RebootingToBootloader,
          DfuState.WaitingForApplication,
        ].includes(dfuState.value),
    );

    const isReloadingFallback = computed(
      () => router.currentRoute.value.name !== "home",
    );

    const transitionMessage = computed(() => {
      switch (dfuState.value) {
        case DfuState.RebootingToBootloader:
          return "Rebooting device into DFU mode";
        case DfuState.WaitingForApplication:
          return "Waiting for the device to reconnect";
        default:
          return "Rebooting device";
      }
    });

    onMounted(async () => {
      try {
        const outputId = router.currentRoute.value.params.outputId as string;

        if (outputId === webUsbDfuVirtualOutputId) {
          if (dfuState.value === DfuState.Idle) {
            await startDfuDiscovery();
          }

          return;
        }

        await connectDevice(
          outputId,
        );
        if (isBootloaderMode.value) {
          return router.push({ name: "device-firmware-update" });
        }
      } catch (err) {
        logger.error(err);
      }
    });

    return {
      isConnected,
      hasVisibleSession,
      isConnecting,
      isBootloaderMode,
      isReloadingFallback,
      showTransitionOverlay,
      transitionMessage,
      isSystemOperationRunning,
      systemOperationMessage,
      systemOperationPercentage,
    };
  },
});
</script>
