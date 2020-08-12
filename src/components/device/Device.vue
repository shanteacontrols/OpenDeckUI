<template>
  <div
    v-if="isConnecting"
    class="lg:text-center relative"
    style="min-height: 50vh;"
  >
    <div class="absolute flex inset-0 opacity-75 bg-gray-900">
      <Spinner class="self-center" />
    </div>
  </div>

  <div v-else-if="isConnected">
    <router-view></router-view>
  </div>

  <div v-else class="lg:text-center">
    <p>No WebMidi device found</p>
    <br />
    <button @click="connectDevice">
      Connect
    </button>
  </div>

  <DeviceActivity />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import router from "../../router";
import { deviceStoreMapped } from "../../store";
import DeviceActivity from "./activity/DeviceActivity.vue";

export default defineComponent({
  name: "Device",
  components: {
    DeviceActivity,
  },
  setup() {
    onMounted(async () => {
      try {
        await deviceStoreMapped.connectDevice(
          router.currentRoute.value.params.outputId as string,
        );
      } catch (err) {
        router.push({ name: "home" });
      }
    });

    onUnmounted(() => {
      deviceStoreMapped.closeConnection();
    });

    return {
      ...deviceStoreMapped,
    };
  },
});
</script>
