import { computed, ComputedRef } from "vue";
import { ILogEntry, LogType, state } from "./state";
import { ILogEntryInfo } from "./log-type-info";
import { Block } from "../../../definitions";

// Interface

type Highlight = Record<Block, number[]>;

export interface IActivityLogComputed {
  highlights: Dictionary<ComputedRef<number[]>>;
}

// Composable

const filterRecentInfoLogs = (log: ILogEntry): boolean => {
  if (log.type !== LogType.Info) {
    return false;
  }
  const delayMs = 1000;
  const limit = new Date().valueOf() - delayMs;
  return log.time.valueOf() < limit;
};

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
