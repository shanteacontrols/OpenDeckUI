<template>
  <span
    :class="{
      'text-red-700': state === DeviceConnectionState.Closed,
      'text-blue-700': state === DeviceConnectionState.Pending,
      'text-green-700': state === DeviceConnectionState.Open,
    }"
    >{{ state }}</span
  >
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DeviceConnectionState } from "../../store/modules/device/state";

export default defineComponent({
  name: "ConnectionState",
  props: {
    state: {
      type: String as () => DeviceConnectionState,
      required: true,
    },
  },
  setup() {
    return {
      DeviceConnectionState,
    };
  },
});
</script>
