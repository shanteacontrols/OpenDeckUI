<template>
  <DeviceGrid
    class="buttons"
    :block="Block.Button"
    route-name="device-buttons-form"
    :count="count"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { deviceStoreMapped } from "../../store";
import DeviceGrid from "./DeviceGrid.vue";
import { Block } from "../../definitions";

export default defineComponent({
  name: "DeviceSectionButtons",
  components: {
    DeviceGrid,
  },
  setup() {
    return {
      Block,
      count: deviceStoreMapped.buttons,
    };
  },
});
</script>
