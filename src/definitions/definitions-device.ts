export enum MessageStatus {
  Request = 0,
  Response = 1,
}

export enum Wish {
  Get = 0,
  Set = 1,
  Backup = 2,
}

export enum Amount {
  Single = 0,
  All = 1,
}

export enum Block {
  Global = 0,
  Button = 1,
  Encoder = 2,
  Analog = 3,
  Led = 4,
  Display = 5,
}

export enum DefinitionType {
  Setting = "setting",
  ComponentValue = "component-value",
}

export enum FormInputComponent {
  Select = "FormSelect",
  Toggle = "FormToggle",
  Input = "FormInput",
}

export interface ISelectOption {
  value: number;
  text: string;
}

type genericMethod = (value?: number) => void;

interface IBlockDefinitionBase {
  block: Block;
  component: FormInputComponent;
  key: string;
  section: number;
  label: string;
  helpText: string;
  options?: Array<ISelectOption> | genericMethod;
  showIf: (formState: Dictionary<number>) => boolean;
  onLoad?: genericMethod;
  min?: number;
  max?: number;
  isLsb?: boolean;
  isMsb?: boolean;
}

export interface IBlockComponentDefinition extends IBlockDefinitionBase {
  type: DefinitionType.ComponentValue;
}

export interface IBlockSettingDefinition extends IBlockDefinitionBase {
  type: DefinitionType.Setting;
  settingIndex: number;
}

export type IBlockDefinition =
  | IBlockSettingDefinition
  | IBlockComponentDefinition;

export const convertDefinitionsToArray = (
  definitions: Dictionary<IBlockDefinition>,
): Array<IBlockDefinition> => {
  return Object.keys(definitions).map((key: string) => definitions[key]);
};

export interface IFormSelectOption {
  value: number;
  text: string;
}
