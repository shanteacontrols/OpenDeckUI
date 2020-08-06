import { computed, ComputedRef } from "vue";
import { state } from "./state";
import { Block } from "../../../definitions";

// Interface

export interface IActivityLogComputed {
  highlights: Dictionary<ComputedRef<number[]>>;
}

// Composable

const isButtonType = (log: any): boolean =>
  !!log.block && log.block === Block.Button;

const isEncoderType = (log: any): boolean =>
  !!log.block && log.block === Block.Encoder;

const isAnalogType = (log: any): boolean =>
  !!log.block && log.block === Block.Analog;

const mapToTimeIndex = (log: any) => log.index;

const buttonHighlights = computed(() => {
  return state.stack.filter(isButtonType).map(mapToTimeIndex) as number[];
});

const encoderHighlights = computed(() => {
  return state.stack.filter(isEncoderType).map(mapToTimeIndex) as number[];
});

const analogHighlights = computed(() => {
  return state.stack.filter(isAnalogType).map(mapToTimeIndex) as number[];
});

export const activityLogComputed: IActivityLogComputed = {
  highlights: {
    [Block.Button]: buttonHighlights,
    [Block.Encoder]: encoderHighlights,
    [Block.Analog]: analogHighlights,
  },
};
