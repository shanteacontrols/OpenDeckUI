<template>
  <div v-if="isConnecting" class="lg:text-center">
    <p>Connecting to WebMidi device</p>
  </div>

  <router-view v-else-if="isConnected"></router-view>

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

import SvgIcon from "../elements/SvgIcon.vue";
import DeviceHeader from "./DeviceHeader.vue";
import DeviceNav from "./DeviceNav.vue";

export default defineComponent({
  name: "Device",
  setup() {
    onMounted(async () => {
      await deviceStoreMapped.connectDevice(
        router.currentRoute.value.params.inputId as string
      );
    });

    return {
      ...deviceStoreMapped,
    };
  },
  components: {
    SvgIcon,
    DeviceHeader,
    DeviceNav,
  },
});
</script>
