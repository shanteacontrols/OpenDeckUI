<template>
  <Hero v-if="isConnecting" custom="h-64 relative">
    <SpinnerOverlay />
  </Hero>

  <div v-else-if="isConnected" class="relative">
    <DeviceNav v-if="!isBootloaderMode" />
    <router-view></router-view>

    <ProgressBar
      v-if="
        isSystemOperationRunning && Number.isInteger(systemOperationPercentage)
      "
      :percentage="systemOperationPercentage"
    />
    <SpinnerOverlay v-else-if="isSystemOperationRunning" />
  </div>

  <Hero v-else custom="h-64" title="No WebMidi device found." />

  <RequestLog />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import router from "../../router";
import { logger } from "../../util";
import { deviceStoreMapped } from "../../store";

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
      isConnected,
      isConnecting,
      isSystemOperationRunning,
      systemOperationPercentage,
      isBootloaderMode,
    } = deviceStoreMapped;

    onMounted(async () => {
      try {
        await connectDevice(
          router.currentRoute.value.params.outputId as string,
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
      isConnecting,
      isBootloaderMode,
      isSystemOperationRunning,
      systemOperationPercentage,
    };
  },
});
</script>
