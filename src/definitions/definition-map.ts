import { GlobalDefinitions } from "./definitions-global";
import { ButtonSectionDefinitions } from "./definitions-button";
import { EncoderSectionDefinitions } from "./definitions-encoder";
import { AnalogSectionDefinitions } from "./definitions-analog";
import { LedSectionDefinitions } from "./definitions-led";
import { DisplayDefinitions } from "./definitions-display";

import {
  Block,
  DefinitionType,
  IBlockDefinition,
  IBlockSettingDefinition,
} from "./definitions-device";
import { IRequestConfig } from "../store/modules/device/state";

const DefinitionMap = {
  [Block.Global as number]: GlobalDefinitions,
  [Block.Button as number]: ButtonSectionDefinitions,
  [Block.Encoder as number]: EncoderSectionDefinitions,
  [Block.Analog as number]: AnalogSectionDefinitions,
  [Block.Led as number]: LedSectionDefinitions,
  [Block.Display as number]: DisplayDefinitions,
};

export const findDefinitionByRequestConfig = (
  config: IRequestConfig
): IBlockDefinition | undefined => {
  const definitions = DefinitionMap[config.block];
  if (!definitions) {
    return;
  }

  const matchSection = (def: IBlockDefinition) =>
    def.section === config.section;
  const isSettingType = (def: IBlockDefinition) =>
    def.type === DefinitionType.Setting;
  const matchesSettingIndex = (def: IBlockSettingDefinition) =>
    def.settingIndex === config.index;
  return Object.values(definitions).find(
    (def) =>
      matchSection(def) &&
      (!isSettingType(def) ||
        matchesSettingIndex(def as IBlockSettingDefinition))
  );
};
