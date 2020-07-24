import { GlobalDefinitions } from "./definitions-global";
import { ButtonSectionDefinitions } from "./definitions-button";
import { EncoderSectionDefinitions } from "./definitions-encoder";
import { AnalogSectionDefinitions } from "./definitions-analog";
import { LedSectionDefinitions } from "./definitions-led";
import { DisplayDefinitions } from "./definitions-display";
import { Block } from "./definitions-device";

export const definitionMap = {
  [Block.Global as number]: GlobalDefinitions,
  [Block.Button as number]: ButtonSectionDefinitions,
  [Block.Encoder as number]: EncoderSectionDefinitions,
  [Block.Analog as number]: AnalogSectionDefinitions,
  [Block.Led as number]: LedSectionDefinitions,
  [Block.Display as number]: DisplayDefinitions,
};
