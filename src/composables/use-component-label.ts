import { Block } from "../definitions/interface";
import { deviceStore } from "../store";
import { getBoardDefinition } from "../definitions/board";

export const getComponentLabel = (block: Block, index: number): string => {
  const board = getBoardDefinition(deviceStore.state.boardId);
  if (!board?.componentLabels) {
    return String(index);
  }

  let labels: string[] | undefined;
  switch (block) {
    case Block.Switch:
      labels = board.componentLabels.switches;
      break;
    case Block.Encoder:
      labels = board.componentLabels.encoders;
      break;
    case Block.Analog:
      labels = board.componentLabels.analogs;
      break;
    case Block.Output:
      labels = board.componentLabels.outputs;
      break;
    case Block.Display:
      labels = board.componentLabels.i2c;
      break;
    case Block.Touchscreen:
      labels = board.componentLabels.touchscreen;
      break;
  }

  return labels?.[index] ?? String(index);
};
