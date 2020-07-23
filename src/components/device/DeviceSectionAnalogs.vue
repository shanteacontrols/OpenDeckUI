<template>
  <DeviceComponentGrid
    class="analogs"
    route-name="device-analogs-form"
    :count="count"
    title="Analogs"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeviceComponentGrid from "./DeviceComponentGrid.vue";
import { deviceStoreMapped } from "../../store";

export default defineComponent({
  name: "DeviceSectionAnalogs",
  setup() {
    return {
      count: deviceStoreMapped.analogInputs,
    };
  },
  components: {
    DeviceComponentGrid,
  },
});
</script>
