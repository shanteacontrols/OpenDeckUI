<template>
  <DeviceGrid
    class="buttons"
    :block="Block.Button"
    route-name="device-buttons-form"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "../../interface";

export default defineComponent({
  name: "ButtonList",
  setup() {
    return {
      Block,
    };
  },
});
</script>
