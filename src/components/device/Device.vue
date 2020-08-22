<template>
  <Hero v-if="isConnecting" custom="h-64 relative">
    <SpinnerOverlay />
  </Hero>

  <template v-else-if="isConnected">
    <DeviceNav />
    <router-view></router-view>
  </template>

  <Hero v-else custom="h-64" title="No WebMidi device found." />

  <Activity />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import router from "../../router";
import { logger } from "../../util";
import { deviceStoreMapped } from "../../store";

import Activity from "./activity/Activity.vue";
import DeviceNav from "./DeviceNav.vue";

export default defineComponent({
  name: "Device",
  components: {
    Activity,
    DeviceNav,
  },
  setup() {
    const {
      connectDevice,
      closeConnection,
      isConnected,
      isConnecting,
    } = deviceStoreMapped;

    onMounted(async () => {
      try {
        await connectDevice(
          router.currentRoute.value.params.outputId as string,
        );
      } catch (err) {
        logger.error(err);
      }
    });

    onUnmounted(closeConnection);

    return {
      isConnected,
      isConnecting,
    };
  },
});
</script>
