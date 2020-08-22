<template>
  <DeviceGrid
    class="analogs"
    :block="Block.Analog"
    route-name="device-analogs-form"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeviceGrid from "./DeviceGrid.vue";
import { Block } from "../../definitions";

export default defineComponent({
  name: "DeviceSectionAnalogs",
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
