<template>
  <DeviceGrid
    class="buttons"
    route-name="device-buttons-form"
    :count="count"
    title="Buttons"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { deviceStoreMapped } from "../../store";
import DeviceGrid from "./DeviceGrid.vue";

export default defineComponent({
  name: "DeviceSectionButtons",
  setup() {
    return {
      count: deviceStoreMapped.buttons,
    };
  },
  components: {
    DeviceGrid,
  },
});
</script>
