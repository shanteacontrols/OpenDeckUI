<template>
  <span class="sysex-payload capitalize"
    >[ {{ valueFormatted }} ] &nbsp;
    <sup v-if="showHexValues">Hex</sup>
    <sup v-else>Dec</sup>
  </span>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from "vue";
import { convertToHexString } from "../../util";
import { requestLogMapped } from "./request-log-store";

export default defineComponent({
  name: "LogDataValue",
  props: {
    value: {
      required: true,
      type: Array as () => Array<number>,
    },
    addSignature: {
      default: false,
      type: Boolean,
    },
  },
  setup(props) {
    const { showHexValues } = requestLogMapped;
    const { value, addSignature } = toRefs(props);

    const valueToFormat = computed(() =>
      addSignature.value ? [240, 0, 83, 67, ...value.value, 247] : value.value,
    );

    const valueFormatted = computed(() => {
      const formatted = showHexValues.value
        ? convertToHexString(valueToFormat.value)
        : valueToFormat.value;

      return Array.isArray(formatted) ? formatted.join(", ") : formatted;
    });

    return {
      valueFormatted,
      showHexValues,
    };
  },
});
</script>
