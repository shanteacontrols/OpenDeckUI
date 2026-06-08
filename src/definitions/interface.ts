import { Component } from "vue";

type genericMethod = (value?: number) => void;

export interface IFormSelectOption {
  value: number;
  text: string;
}

export enum FormInputComponent {
  Select = "FormSelect",
  Toggle = "FormToggle",
  Input = "FormInput",
}

export const openDeckManufacturerId = [0, 83, 67]; // Hex [00 53 43]

export const ComponentInfoRequestID = 73;

export const GitHubTagsUrl =
  "https://api.github.com/repos/paradajz/OpenDeck/tags";
export const GitHubContentsUrl =
  "https://api.github.com/repos/paradajz/OpenDeck/contents";
export const GitHubReleasesUrl =
  "https://api.github.com/repos/paradajz/OpenDeck/releases";

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
  Switch = 1,
  Encoder = 2,
  Analog = 3,
  Output = 4,
  Display = 5,
  Touchscreen = 6, // New
}

export enum AnalogType {
  ControlChange7Bit = 0,
  Note = 1,
  FSR = 2,
  Switch = 3,
  NRPN7bit = 4,
  NRPN14bit = 5,
  PitchBend = 6,
  ControlChange14Bit = 7,
}

export enum SwitchMessageType {
  Note = 0,
  ProgramChange = 1,
  ProgramChangeInc = 14,
  ProgramChangeDec = 15,
  ControlChange = 2,
  ControlChangeOff = 3,
  MmcStop = 4,
  MmcPlay = 5,
  MmcRecord = 6,
  MmcPause = 7,
  RealTimeClock = 8,
  RealTimeStart = 9,
  RealTimeContinue = 10,
  RealTimeStop = 11,
  RealTimeActiveSensing = 12,
  RealTimeSystemReset = 13,
  None = 16,
  PresetChange = 17,
  MultiValueIncResetNote = 18,
  MultiValueIncDecNote = 19,
  MultiValueIncResetCC = 20,
  MultiValueIncDecCC = 21,
  NoteOffOnly = 22,
  ControlChange0Only = 23,
  ProgramChangeOffsetInc = 25,
  ProgramChangeOffsetDec = 26,
  BpmInc = 27,
  BpmDec = 28,
  MmcPlayStop = 29,
}

export enum EncodingMode {
  Controlchange7F = 0,
  Controlchange3F = 1,
  Controlchange41 = 9,
  ProgramChange = 2,
  CC7bit = 3,
  PresetChange = 4,
  PitchBend = 5,
  NRPN7bit = 6,
  NRPN14bit = 7,
  CC14bit = 8,
  Bpm = 10,
  SingleNoteWithVariableValue = 11,
  SingleNoteWithFixedValueBothDirections = 12,
  SingleNoteWithFixedValueOneDirection0OtherDirection = 13,
  TwoNoteWithFixedValueBothDirections = 14,
}

export enum OutputControlMode {
  MidiInNoteSingleValue = 0,
  LocalNoteSingleValue = 1,
  MidiInCcSingleValue = 2,
  LocalCcSingleValue = 3,
  ProgramChange = 4,
  PresetChange = 5,
  MidiInNoteMultiValue = 6,
  LocalNoteMultiValue = 7,
  MidiInCcMultiValue = 8,
  LocalCcMultiValue = 9,
  Static = 10,
}

export const HideSwitchVelocityOnTypes = [
  SwitchMessageType.None,
  SwitchMessageType.ProgramChange,
  SwitchMessageType.ProgramChangeDec,
  SwitchMessageType.ProgramChangeInc,
  SwitchMessageType.RealTimeClock,
  SwitchMessageType.RealTimeStart,
  SwitchMessageType.RealTimeContinue,
  SwitchMessageType.RealTimeStop,
  SwitchMessageType.RealTimeActiveSensing,
  SwitchMessageType.RealTimeSystemReset,
  SwitchMessageType.MmcStop,
  SwitchMessageType.MmcPlay,
  SwitchMessageType.MmcRecord,
  SwitchMessageType.MmcPause,
  SwitchMessageType.PresetChange,
  SwitchMessageType.NoteOffOnly,
  SwitchMessageType.ControlChange0Only,
  SwitchMessageType.BpmInc,
  SwitchMessageType.BpmDec,
];

export const HideSwitchMidiIdOnTypes = [
  SwitchMessageType.None,
  SwitchMessageType.RealTimeClock,
  SwitchMessageType.RealTimeStart,
  SwitchMessageType.RealTimeContinue,
  SwitchMessageType.RealTimeStop,
  SwitchMessageType.RealTimeActiveSensing,
  SwitchMessageType.RealTimeSystemReset,
  SwitchMessageType.ProgramChangeOffsetInc,
  SwitchMessageType.ProgramChangeOffsetDec,
  SwitchMessageType.BpmInc,
  SwitchMessageType.BpmDec,
  SwitchMessageType.PresetChange,
];

export const HideSwitchMidiChannelOnTypes = [
  SwitchMessageType.None,
  SwitchMessageType.MmcStop,
  SwitchMessageType.MmcPlay,
  SwitchMessageType.MmcRecord,
  SwitchMessageType.MmcPause,
  SwitchMessageType.RealTimeClock,
  SwitchMessageType.RealTimeStart,
  SwitchMessageType.RealTimeContinue,
  SwitchMessageType.RealTimeStop,
  SwitchMessageType.RealTimeActiveSensing,
  SwitchMessageType.RealTimeSystemReset,
  SwitchMessageType.PresetChange,
  SwitchMessageType.ProgramChangeOffsetInc,
  SwitchMessageType.ProgramChangeOffsetDec,
  SwitchMessageType.BpmInc,
  SwitchMessageType.BpmDec,
];

export const HideAnalogMidiIdOnTypes = [AnalogType.Switch];
export const HideAnalogMidiChannelOnTypes = [AnalogType.Switch];

export const HideEncoderMidiIdOnTypes = [];

export const HideEncoderMidiChannelOnTypes = [EncodingMode.PresetChange];

export const ShowEncoderAccelerationOnTypes = [
  EncodingMode.PitchBend,
  EncodingMode.CC7bit,
  EncodingMode.CC14bit,
  EncodingMode.NRPN7bit,
  EncodingMode.NRPN14bit,
  EncodingMode.SingleNoteWithVariableValue,
];

export const ShowEncoderRemoteSyncOnTypes = [
  EncodingMode.PitchBend,
  EncodingMode.CC7bit,
  EncodingMode.CC14bit,
  EncodingMode.NRPN7bit,
  EncodingMode.NRPN14bit,
];

export const ShowEncoderLimitsOnTypes = [
  EncodingMode.PitchBend,
  EncodingMode.CC7bit,
  EncodingMode.CC14bit,
  EncodingMode.NRPN7bit,
  EncodingMode.NRPN14bit,
  EncodingMode.SingleNoteWithVariableValue,
];

export const ShowEncoderRepeatedValueOnTypes = [
  EncodingMode.SingleNoteWithFixedValueBothDirections,
  EncodingMode.SingleNoteWithFixedValueOneDirection0OtherDirection,
  EncodingMode.TwoNoteWithFixedValueBothDirections,
];

export const ShowEncoder2ndIdOnTypes = [
  EncodingMode.TwoNoteWithFixedValueBothDirections,
];

export const HideOutputActivationValueOnControlTypes = [
  OutputControlMode.PresetChange,
  OutputControlMode.ProgramChange,
  OutputControlMode.Static,
];

export const HideOutputActivationIdOnControlTypes = [OutputControlMode.Static];

export const HideOutputMidiChannelOnControlTypes = [
  OutputControlMode.PresetChange,
  OutputControlMode.Static,
];

export enum SectionType {
  Setting = "setting",
  Value = "value",
}

export enum RequestType {
  Predefined = "predefined",
  Custom = "custom",
  Configuration = "configuration",
}

export interface IRequestDefinition {
  type: RequestType;
  key: Request;
  specialRequestId?: number;
  // Flag for priority messages needed for preparing data communication
  isConnectionInfoRequest?: boolean;
  isSystemOperation?: boolean;
  expectsNoResponse?: boolean;
  getPayload?: (config?: any) => number[];
  responseHandler?: (response: number[], valueSize?: number) => any;
  decodeDoubleByte?: boolean;
  responseEmbedsRequest?: boolean;
  parser?: (response: number[]) => any;
}

export interface IBoardDefinition {
  name: string;
  ids: number[][];
  firmwareFileName?: string;
}

export enum RequestState {
  Pending = "pending",
  Sent = "sent",
  Error = "error",
  Done = "done",
}

export interface IBlockDefinition {
  block: Block;
  title: string;
  pluralTitle?: string;
  routeName: string;
  iconComponent: Component;
  sections: Dictionary<ISectionDefinition>;
  // Marks position of component count in GetNumberOfSupportedComponents req
  componentCountResponseIndex?: number;
}

interface ISectionBase {
  block: Block;
  component: FormInputComponent;
  key: string;
  sectionGroup?: {
    key: string;
    title: string;
    helpText?: string;
  };
  section: number;
  label: string;
  helpText: string;
  options?: Array<IFormSelectOption> | genericMethod;
  showIf: (formState: Dictionary<number>) => boolean;
  onLoad?: genericMethod;
  min?: number;
  max?: number;
  max2Byte?: number;
  isLsb?: boolean;
  isMsb?: boolean;
  colspan?: number; // ie Display as 2 cols in form grid
}

export interface ISectionComponent extends ISectionBase {
  type: SectionType.Value;
}

export interface ISectionSetting extends ISectionBase {
  type: SectionType.Setting;
  settingIndex: number;
}

export type ISectionDefinition = ISectionSetting | ISectionComponent;

export interface IOpenDeckRelease {
  url: string;
  id: string;
  node_id: string;
  name: string;
  tag_name: string;
  created_at: string;
  published_at: string;
  zipball_url: string;
  tarball_url: string;
  body: string;
  assets: Array<any>;
  html_description: string;
  firmwareFileLink?: {
    id: string;
    url: string;
    browser_download_url: string;
  };
}

interface IOpenDeckTag {
  name: string;
  zipball_url: string;
  tarball_url: string;
  commit: {
    sha: string;
    url: string;
  };
  node_id: string;
}
