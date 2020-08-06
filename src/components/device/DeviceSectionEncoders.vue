<template>
  <DeviceGrid
    class="encoders"
    :block="Block.Encoder"
    route-name="device-encoders-form"
    :count="count"
    title="Encoders"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeviceGrid from "./DeviceGrid.vue";
import { deviceStoreMapped } from "../../store";
import { Block } from "../../definitions";

export default defineComponent({
  name: "DeviceSectionEncoders",
  components: {
    DeviceGrid,
  },
  setup() {
    return {
      Block,
      count: deviceStoreMapped.encoders,
    };
  },
});
</script>
