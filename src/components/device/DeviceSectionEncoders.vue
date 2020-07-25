<template>
  <DeviceGrid
    class="encoders"
    route-name="device-encoders-form"
    :count="count"
    title="Encoders"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeviceGrid from "./DeviceGrid.vue";
import { deviceStoreMapped } from "../../store";

export default defineComponent({
  name: "DeviceSectionEncoders",
  setup() {
    return {
      count: deviceStoreMapped.encoders,
    };
  },
  components: {
    DeviceGrid,
  },
});
</script>
