<template>
  <DeviceGrid
    class="encoders"
    :block="Block.Encoder"
    route-name="device-encoders-form"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeviceGrid from "./DeviceGrid.vue";
import { Block } from "../../definitions";

export default defineComponent({
  name: "DeviceSectionEncoders",
  components: {
    DeviceGrid,
  },
  setup() {
    return {
      Block,
    };
  },
});
</script>
