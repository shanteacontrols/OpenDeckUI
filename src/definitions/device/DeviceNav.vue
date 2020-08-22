<template>
  <div v-if="isConnected" class="device-nav">
    <DeviceNavItem
      v-for="blockDef in Object.values(BlockMap)"
      :key="`block-${blockDef.block}`"
      class="item clearfix"
      :block="blockDef.block"
      :params="{ outputId }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { deviceStoreMapped } from "../../store";
import { BlockMap } from "../../definitions";

import DeviceNavItem from "./DeviceNavItem.vue";

export default defineComponent({
  name: "DeviceNav",
  components: {
    DeviceNavItem,
  },
  setup() {
    const { outputId, isConnected } = deviceStoreMapped;

    return {
      BlockMap,
      isConnected,
      outputId,
    };
  },
});
</script>
