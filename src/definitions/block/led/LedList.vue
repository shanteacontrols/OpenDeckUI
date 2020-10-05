<template>
  <div class="leds">
    <DeviceSettings class="w-full" :block="Block.Led" title="Global" />
    <DeviceGrid
      class="w-full"
      route-name="device-leds-form"
      :block="Block.Led"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "../../interface";
import { LedBlock } from "./led";

export default defineComponent({
  name: "LedList",
  setup() {
    const { sections } = LedBlock;

    return {
      Block,
      sections,
    };
  },
});
</script>
