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
  gridSegmentTitle: Ref<string>,
): Computed<GridSegment[]> => {
  const touchscreenCount = computed(
    () => numberOfComponents.value[Block.Touchscreen] || 0,
  );
  const analogCount = computed(
    () => numberOfComponents.value[Block.Analog] || 0,
  );
  const sectionCount = computed(
    () => numberOfComponents.value[block.value] || 0,
  );
  const sectionEnd = computed(
    () => sectionCount.value - touchscreenCount.value - analogCount.value - 1,
  );
  const analogEnd = computed(() => sectionEnd.value + analogCount.value);

  return computed(() => {
    if (analogCount.value === 0 && touchscreenCount.value === 0) {
      return;
    }

    const segments: GridSegment[] =
      sectionEnd.value > 0
        ? [
            {
              title: gridSegmentTitle.value,
              startIndex: 0,
              endIndex: sectionEnd.value,
            },
          ]
        : [];

    segments.push({
      title: "Analog",
      startIndex: sectionEnd.value + 1,
      endIndex: analogEnd.value,
    });

    if (touchscreenCount.value === 0) {
      return segments;
    }

    segments.push({
      title: "Touchscreen",
      startIndex: analogEnd.value + 1,
      endIndex: sectionCount.value - 1,
    });

    return segments.map(addGridSegmentIndexArray);
  });
};
