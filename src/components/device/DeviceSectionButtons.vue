<template>
  <DeviceComponentGrid
    class="buttons"
    route-name="device-buttons-form"
    :count="count"
    title="Buttons"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { deviceStoreMapped } from "../../store";
import DeviceComponentGrid from "./DeviceComponentGrid.vue";

export default defineComponent({
  name: "DeviceSectionButtons",
  setup() {
    return {
      count: deviceStoreMapped.buttons,
    };
  },
  components: {
    DeviceComponentGrid,
  },
});
</script>
