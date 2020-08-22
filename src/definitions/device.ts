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

interface ISectionBase {
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

export interface ISectionComponent extends ISectionBase {
  type: DefinitionType.ComponentValue;
}

export interface ISectionSetting extends ISectionBase {
  type: DefinitionType.Setting;
  settingIndex: number;
}

export type ISectionDefinition = ISectionSetting | ISectionComponent;

export interface IFormSelectOption {
  value: number;
  text: string;
}
