<template>
  <DeviceComponentGrid
    class="encoders"
    route-name="device-encoders-form"
    :count="count"
    title="Encoders"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeviceComponentGrid from "./DeviceComponentGrid.vue";
import { deviceStoreMapped } from "../../store";

export default defineComponent({
  name: "DeviceSectionEncoders",
  setup() {
    return {
      count: deviceStoreMapped.encoders,
    };
  },
  components: {
    DeviceComponentGrid,
  },
});
</script>
