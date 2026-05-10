import { computed, Ref } from "vue";
import { Block } from "../definitions";
import { deviceState } from "../definitions/device/device-store/state";
import semverLt from "semver/functions/lt";
import semverGt from "semver/functions/gt";
import semverClean from "semver/functions/clean";

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

const addSegment = (
  segments: GridSegment[],
  title: string,
  startIndex: number,
  endIndex: number,
): void => {
  const start = Math.max(0, startIndex);
  const end = Math.max(start - 1, endIndex);

  if (end < start) {
    return;
  }

  segments.push({
    title,
    startIndex: start,
    endIndex: end,
  });
};

export const useGridSegments = (
  numberOfComponents: Ref<Array<number>>,
  block: Ref<number>,
): Computed<GridSegment[]> => {
  const buttonCount = computed(
    () => numberOfComponents.value[Block.Button] || 0,
  );

  const analogCount = computed(
    () => numberOfComponents.value[Block.Analog] || 0,
  );

  const ledCount = computed(() => numberOfComponents.value[Block.Led] || 0);

  const touchScreenCount = computed(
    () => numberOfComponents.value[Block.Touchscreen] || 0,
  );

  return computed(() => {
    const segments: GridSegment[] = [];

    switch (block.value) {
      case Block.Button:
        {
          //segmentation to buttons, analog and touchscreen
          if (
            semverLt(semverClean(deviceState.firmwareVersion), "5.4.0") ||
            semverGt(semverClean(deviceState.firmwareVersion), "6.5.0")
          ) {
            addSegment(
              segments,
              "Digital inputs",
              0,
              buttonCount.value -
                analogCount.value -
                touchScreenCount.value -
                1,
            );

            if (analogCount.value > 0) {
              addSegment(
                segments,
                "Analog inputs",
                buttonCount.value - analogCount.value - touchScreenCount.value,
                buttonCount.value - touchScreenCount.value - 1,
              );
            }

            if (touchScreenCount.value > 0) {
              addSegment(
                segments,
                "Touchscreen",
                buttonCount.value - touchScreenCount.value,
                buttonCount.value - 1,
              );
            }
          } else {
            addSegment(
              segments,
              "Digital inputs",
              0,
              buttonCount.value - analogCount.value - 1,
            );
            addSegment(
              segments,
              "Analog inputs",
              buttonCount.value - analogCount.value,
              buttonCount.value - touchScreenCount.value - 1,
            );

            if (touchScreenCount.value > 0) {
              addSegment(
                segments,
                "Touchscreen",
                buttonCount.value - touchScreenCount.value,
                buttonCount.value - 1,
              );
            }
          }
        }
        break;

      case Block.Led:
        {
          //segmentation to leds and touchscreen
          addSegment(
            segments,
            "Digital outputs",
            0,
            ledCount.value - touchScreenCount.value - 1,
          );
          addSegment(
            segments,
            "Touchscreen components",
            ledCount.value - touchScreenCount.value,
            ledCount.value - 1,
          );
        }
        break;

      default:
        break;
    }

    return segments.map(addGridSegmentIndexArray);
  });
};
