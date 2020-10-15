import { computed, Ref } from "vue";
import { Block } from "../definitions";

export interface GridSegment {
  title: string;
  startIndex: number;
  endIndex: number;
  indexArray?: number[]; // Calculated here in a computed
}

const addGridSegmentIndexArray = (seg: GridSegment): GridSegment => {
  const indexArray: Array<number> = [];
  for (let i = seg.startIndex; i <= seg.endIndex; i++) {
    indexArray.push(i);
  }
  return {
    ...seg,
    indexArray,
  };
};

// Note: calculated for Buttons and Leds
export const useGridSegments = (
  numberOfComponents: Ref<Array<number>>,
  block: Ref<number>,
): Computed<GridSegment[]> => {
  const touchscreenCount = computed(
    () => numberOfComponents.value[Block.Touchscreen] || 0,
  );
  const sectionCount = computed(
    () => numberOfComponents.value[block.value] || 0,
  );

  // LEDs
  if (block.value === Block.Led) {
    const sectionEnd = computed(
      () => sectionCount.value - touchscreenCount.value - 1,
    );

    if (touchscreenCount.value === 0) {
      return; // Don't segment if only LEDS to be displayed
    }

    // If all LEDS are taken for touchscreens
    if (sectionCount.value === 0 || sectionEnd.value === -1) {
      return [
        {
          title: "Touchscreen",
          startIndex: 0,
          endIndex: touchscreenCount.value - 1,
        },
      ].map(addGridSegmentIndexArray);
    }

    return computed(() =>
      [
        {
          title: "LED",
          startIndex: 0,
          endIndex: sectionEnd.value,
        },
        {
          title: "Touchscreen",
          startIndex: sectionEnd.value,
          endIndex: sectionCount.value - 1,
        },
      ].map(addGridSegmentIndexArray),
    );
  }

  // Buttons
  const sectionEnd = computed(
    () => sectionCount.value - touchscreenCount.value - analogCount.value - 1,
  );
  const analogCount = computed(
    () => numberOfComponents.value[Block.Analog] || 0,
  );
  const analogEnd = computed(() => sectionEnd.value + analogCount.value);

  return computed(() => {
    if (analogCount.value === 0 && touchscreenCount.value === 0) {
      return; // Don't segment if only Buttons to be displayed
    }

    const segments: GridSegment[] = [
      {
        title: "Button",
        startIndex: 0,
        endIndex: sectionEnd.value,
      },
      {
        title: "Analog",
        startIndex: sectionEnd.value + 1,
        endIndex: analogEnd.value,
      },
    ];

    if (touchscreenCount.value > 0) {
      segments.push({
        title: "Touchscreen",
        startIndex: analogEnd.value + 1,
        endIndex: sectionCount.value - 1,
      });
    }

    return segments.map(addGridSegmentIndexArray);
  });
};
