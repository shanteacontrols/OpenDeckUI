<template>
  <div v-if="isConnecting" class="lg:text-center">
    <p>Connecting to WebMidi device</p>
  </div>

  <div v-else-if="isConnected">
    <router-view></router-view>
    <DeviceActivity />
  </div>

  <div v-else class="lg:text-center">
    <p>No WebMidi device found</p>
    <br />
    <button @click="connectDevice">
      Connect
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
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
      await deviceStoreMapped.connectDevice(
        router.currentRoute.value.params.inputId as string,
      );
    });

    return {
      ...deviceStoreMapped,
    };
  },
});
</script>
