<template>
  <DeviceGrid
    class="encoders"
    :block="Block.Encoder"
    route-name="device-encoders-form"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "../../interface";

export default defineComponent({
  name: "Encoders",
  setup() {
    return {
      Block,
    };
  },
});
</script>
