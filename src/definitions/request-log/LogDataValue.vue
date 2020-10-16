<template>
  <span class="sysex-payload capitalize">
    <template v-if="showHexValues">[ {{ hex }} ] &nbsp;<sup>Hex</sup></template>
    <template v-else>[ {{ dec }} ] &nbsp;<sup>Dec</sup> </template>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { requestLogMapped } from "./request-log-store";

export default defineComponent({
  name: "LogDataValue",
  props: {
    hex: {
      required: true,
      type: String,
    },
    dec: {
      required: true,
      type: String,
    },
  },
  setup() {
    const { showHexValues } = requestLogMapped;

    return {
      showHexValues,
    };
  },
});
</script>
