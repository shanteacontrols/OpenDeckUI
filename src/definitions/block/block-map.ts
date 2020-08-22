import {
  Block,
  SectionType,
  IBlockDefinition,
  SectionType,
} from "../interface";
import {
  GlobalBlock,
  AnalogBlock,
  ButtonBlock,
  EncoderBlock,
  LedBlock,
  DisplayBlock,
} from "./index";

export const BlockMap: Dictionary<IBlockDefinition> = {
  [Block.Global]: GlobalBlock,
  [Block.Analog]: AnalogBlock,
  [Block.Button]: ButtonBlock,
  [Block.Encoder]: EncoderBlock,
  [Block.Led]: LedBlock,
  [Block.Display]: DisplayBlock,
};

// Combine routes for each block into a single array

const combineBlockRoutes = (accumulator, currentBlock) => {
  accumulator.push(...currentBlock.routes);
  return accumulator;
};

export const getDefaultDataForBlock = (
  block: Block,
  sectionType?: SectionType,
): Record<string, number> => {
  return Object.values(BlockMap[block].sections).reduce(
    (formData: Record<string, number>, section: ISectionDefinition) => {
      if (!sectionType || section.type === sectionType) {
        formData[section.key] = null;
      }
      return formData;
    },
    {},
  );
};

export const BlockRoutes = Object.values(BlockMap).reduce(
  combineBlockRoutes,
  [],
);
