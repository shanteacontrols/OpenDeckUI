<template>
  <DeviceGrid
    class="analogs"
    :block="Block.Analog"
    route-name="device-analogs-form"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "../../interface";

export default defineComponent({
  name: "AnalogList",
  setup() {
    return {
      Block,
    };
  },
});
</script>
