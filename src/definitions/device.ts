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
  max2Byte?: number;
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
