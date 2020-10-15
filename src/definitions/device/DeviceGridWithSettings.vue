<template>
  <DeviceSettings
    :key="`settings-${block}`"
    class="w-full"
    :block="block"
    :title="settingsTitle"
  />
  <DeviceGrid
    :key="`grid-${block}`"
    class="w-full"
    :route-name="routeName"
    :block="block"
    :segment-grid="segmentGrid"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DeviceGridWithSettings",
  props: {
    block: {
      required: true,
      type: Number,
    },
    routeName: {
      required: true,
      type: String,
    },
    settingsTitle: {
      default: "Global",
      type: String,
    },
    segmentGrid: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
