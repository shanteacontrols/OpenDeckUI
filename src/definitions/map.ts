import {
  GlobalDefinitions,
  ButtonSectionDefinitions,
  EncoderSectionDefinitions,
  AnalogSectionDefinitions,
  LedSectionDefinitions,
  DisplayDefinitions,
} from "./sections";
import { DefinitionType, ISectionDefinition, ISectionSetting } from "./device";
import { Block } from "./constants";
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
  config: IRequestConfig,
): ISectionDefinition | undefined => {
  const definitions = DefinitionMap[config.block];
  if (!definitions) {
    return;
  }

  const matchSection = (def: ISectionDefinition) =>
    def.section === config.section;
  const isSettingType = (def: ISectionDefinition) =>
    def.type === DefinitionType.Setting;
  const matchesSettingIndex = (def: ISectionSetting) =>
    def.settingIndex === config.index;
  return Object.values(definitions).find(
    (def) =>
      matchSection(def) &&
      (!isSettingType(def) || matchesSettingIndex(def as ISectionSetting)),
  );
};
