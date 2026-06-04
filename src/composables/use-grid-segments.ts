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
  // Legacy protocol parsing can temporarily leave firmwareVersion unset or
  // malformed; semver comparison helpers throw unless the value is valid.
  const firmwareVersion = computed(() =>
    typeof deviceState.firmwareVersion === "string"
      ? semverClean(deviceState.firmwareVersion)
      : null,
  );

  const switchCount = computed(
    () => numberOfComponents.value[Block.Switch] || 0,
  );

  const analogCount = computed(
    () => numberOfComponents.value[Block.Analog] || 0,
  );

  const outputCount = computed(
    () => numberOfComponents.value[Block.Output] || 0,
  );

  const touchScreenCount = computed(
    () => numberOfComponents.value[Block.Touchscreen] || 0,
  );

  return computed(() => {
    const segments: GridSegment[] = [];

    switch (block.value) {
      case Block.Switch:
        {
          // Segmentation to digital switches, analog inputs and touchscreen.
          if (
            firmwareVersion.value &&
            (semverLt(firmwareVersion.value, "5.4.0") ||
              semverGt(firmwareVersion.value, "6.5.0"))
          ) {
            addSegment(
              segments,
              "Digital switches",
              0,
              switchCount.value -
                analogCount.value -
                touchScreenCount.value -
                1,
            );

            if (analogCount.value > 0) {
              addSegment(
                segments,
                "Analog inputs",
                switchCount.value - analogCount.value - touchScreenCount.value,
                switchCount.value - touchScreenCount.value - 1,
              );
            }

            if (touchScreenCount.value > 0) {
              addSegment(
                segments,
                "Touchscreen",
                switchCount.value - touchScreenCount.value,
                switchCount.value - 1,
              );
            }
          } else {
            addSegment(
              segments,
              "Digital switches",
              0,
              switchCount.value - analogCount.value - 1,
            );
            addSegment(
              segments,
              "Analog inputs",
              switchCount.value - analogCount.value,
              switchCount.value - touchScreenCount.value - 1,
            );

            if (touchScreenCount.value > 0) {
              addSegment(
                segments,
                "Touchscreen",
                switchCount.value - touchScreenCount.value,
                switchCount.value - 1,
              );
            }
          }
        }
        break;

      case Block.Output:
        {
          // Segmentation to physical outputs and touchscreen.
          addSegment(
            segments,
            "Digital outputs",
            0,
            outputCount.value - touchScreenCount.value - 1,
          );
          addSegment(
            segments,
            "Touchscreen components",
            outputCount.value - touchScreenCount.value,
            outputCount.value - 1,
          );
        }
        break;

      default:
        break;
    }

    return segments.map(addGridSegmentIndexArray);
  });
};
