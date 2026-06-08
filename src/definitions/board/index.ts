import { Boards } from "./boards";
import { arrayEqual } from "../../util";
import { IBoardDefinition } from "../interface";

export const getBoardDefinition = (value: number[]): IBoardDefinition => {
  const board = Boards.find((b: any) =>
    b.ids.some((id: number[]) => arrayEqual(id, value)),
  );

  return board;
};

export * from "./boards";
