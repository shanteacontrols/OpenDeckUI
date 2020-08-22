import { Boards } from "./boards";
import { arrayEqual } from "../../util";

export const getBoardDefinition = (value: number[]): IBoardDefinition => {
  const board = Boards.find(
    (b: any) =>
      arrayEqual(b.id, value) || (b.oldId && arrayEqual(b.oldId, value)),
  );

  return board;
};

export * from "./boards";
