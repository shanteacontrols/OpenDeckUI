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
  Button = 1,
  Encoder = 2,
  Analog = 3,
  Led = 4,
  Display = 5,
}

export enum AnalogType {
  ControlChange7Bit = 0,
  Note = 1,
  FSR = 2,
  Button = 3,
  NRPN7 = 4,
  NRPN14 = 5,
  PitchBend = 6,
  ControlChange14Bit = 7,
}

export enum MidiMessageType {
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
}

export enum EncodingMode {
  Controlchange7F = 0,
  Controlchange3F = 1,
  Programchange = 2,
  ControlchangeContinuous7 = 3,
  ControlchangeContinuous14 = 8,
  Changepreset = 4,
  Pitchbend = 5,
  NRPN6 = 6,
  NRPN7 = 7,
}

export const HideVelocityOnTypes = [
  MidiMessageType.ProgramChange,
  MidiMessageType.ProgramChangeDec,
  MidiMessageType.ProgramChangeInc,
  MidiMessageType.MultiValueIncDecCC,
  MidiMessageType.MultiValueIncDecNote,
  MidiMessageType.MultiValueIncResetCC,
  MidiMessageType.MultiValueIncResetNote,
  MidiMessageType.None,
  MidiMessageType.RealTimeClock,
  MidiMessageType.RealTimeStart,
  MidiMessageType.RealTimeContinue,
  MidiMessageType.RealTimeStop,
  MidiMessageType.RealTimeActiveSensing,
  MidiMessageType.RealTimeSystemReset,
  MidiMessageType.MmcStop,
  MidiMessageType.MmcPlay,
  MidiMessageType.MmcRecord,
  MidiMessageType.MmcPause,
];

export const HideMidiIdOnTypes = [
  MidiMessageType.None,
  MidiMessageType.MmcStop,
  MidiMessageType.MmcPlay,
  MidiMessageType.MmcRecord,
  MidiMessageType.MmcPause,
];

export const ShowAccelerationOnTypes = [
  EncodingMode.Pitchbend,
  EncodingMode.ControlchangeContinuous7,
  EncodingMode.ControlchangeContinuous14,
  EncodingMode.NRPN6,
  EncodingMode.NRPN7,
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
  id: number[];
  oldId?: number[];
  firmwareFileLocation?: string;
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
  routeName: string;
  iconComponent: Component;
  sections: Dictionary<ISectionDefinition>;
}

interface ISectionBase {
  block: Block;
  component: FormInputComponent;
  key: string;
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
