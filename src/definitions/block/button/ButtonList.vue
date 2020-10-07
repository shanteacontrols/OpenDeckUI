<template>
  <DeviceGrid
    class="buttons"
    :block="Block.Button"
    route-name="device-buttons-form"
    :grid-segments="gridSegments"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { Block } from "../../interface";
import { deviceStoreMapped } from "../../../store";
import { GridSegment } from "../../../composables";

export default defineComponent({
  name: "ButtonList",
  setup() {
    const { numberOfComponents } = deviceStoreMapped;

    const touchscreenCount = computed(
      () => numberOfComponents.value[Block.Touchscreen] || 0,
    );
    const analogCount = computed(
      () => numberOfComponents.value[Block.Analog] || 0,
    );
    const buttonCount = computed(
      () => numberOfComponents.value[Block.Button] || 0,
    );
    const buttonEnd = computed(
      () => buttonCount.value - touchscreenCount.value - analogCount.value - 1,
    );
    const analogEnd = computed(() => buttonEnd.value + analogCount.value);

    const gridSegments = computed(() => {
      if (analogCount.value === 0 && touchscreenCount.value === 0) {
        return;
      }
      const segments: GridSegment[] = [
        {
          title: "Buttons",
          startIndex: 0,
          endIndex: buttonEnd.value,
        },
        {
          title: "Analog",
          startIndex: buttonEnd.value + 1,
          endIndex: analogEnd.value,
        },
      ];

      if (touchscreenCount.value === 0) {
        return segments;
      }
      segments.push({
        title: "Touchscreen",
        startIndex: analogEnd.value + 1,
        endIndex: buttonCount.value,
      });

      return segments;
    });

    return {
      Block,
      gridSegments,
    };
  },
});
</script>
