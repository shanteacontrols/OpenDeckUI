import { computed, Ref } from "vue";
import { Block } from "../definitions";
import { deviceState } from "../definitions/device/device-store/state";
import { logger } from "../util";
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
            segments.push(
              {
                title: "Buttons",
                startIndex: 0,
                endIndex:
                  buttonCount.value -
                  analogCount.value -
                  touchScreenCount.value -
                  1,
              },
              {
                title: "Analog",
                startIndex:
                  buttonCount.value -
                  analogCount.value -
                  touchScreenCount.value,
                endIndex:
                  buttonCount.value -
                  analogCount.value -
                  touchScreenCount.value +
                  analogCount.value,
              },
            );

            if (touchScreenCount.value > 0) {
              segments.push({
                title: "Touchscreen",
                startIndex:
                  buttonCount.value -
                  analogCount.value +
                  analogCount.value -
                  touchScreenCount.value,
                endIndex:
                  buttonCount.value - analogCount.value + analogCount.value - 1,
              });
            }
          } else {
            segments.push(
              {
                title: "Buttons",
                startIndex: 0,
                endIndex: buttonCount.value - analogCount.value - 1,
              },
              {
                title: "Analog",
                startIndex: buttonCount.value - analogCount.value,
                endIndex:
                  buttonCount.value -
                  analogCount.value +
                  analogCount.value -
                  touchScreenCount.value -
                  1,
              },
            );

            if (touchScreenCount.value > 0) {
              segments.push({
                title: "Touchscreen",
                startIndex:
                  buttonCount.value -
                  analogCount.value +
                  analogCount.value -
                  touchScreenCount.value,
                endIndex:
                  buttonCount.value - analogCount.value + analogCount.value - 1,
              });
            }
          }
        }
        break;

      case Block.Analog:
        {
          if (
            semverLt(semverClean(deviceState.firmwareVersion), "5.4.0") ||
            semverGt(semverClean(deviceState.firmwareVersion), "6.5.0")
          ) {
            segments.push({
              title: "Analog",
              startIndex: 0,
              endIndex: analogCount.value - 1,
            });
          } else {
            segments.push(
              {
                title: "Analog",
                startIndex: 0,
                endIndex: analogCount.value - touchScreenCount.value - 1,
              },
              {
                title: "Touchscreen",
                startIndex: analogCount.value - touchScreenCount.value,
                endIndex: analogCount.value - 1,
              },
            );
          }
        }
        break;

      case Block.Led:
        {
          //segmentation to leds and touchscreen
          segments.push(
            {
              title: "LED",
              startIndex: 0,
              endIndex: ledCount.value - touchScreenCount.value - 1,
            },
            {
              title: "Touchscreen",
              startIndex: ledCount.value - touchScreenCount.value,
              endIndex: ledCount.value - 1,
            },
          );
        }
        break;

      default:
        break;
    }

    return segments.map(addGridSegmentIndexArray);
  });
};
