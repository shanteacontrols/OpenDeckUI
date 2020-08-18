import {
  IBlockDefinition,
  FormInputComponent,
  DefinitionType,
} from "../device";
import { Block } from "../constants";

export const defaultButtonData: Dictionary<number> = {
  Type: (null as unknown) as number,
  midiMessage: (null as unknown) as number,
  midiChannel: (null as unknown) as number,
  midiId: (null as unknown) as number,
  onVelocity: (null as unknown) as number,
};

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

type FormState = typeof defaultButtonData;

export const ButtonSectionDefinitions: Dictionary<IBlockDefinition> = {
  Type: {
    block: Block.Button,
    key: "Type",
    type: DefinitionType.ComponentValue,
    section: 0,
    component: FormInputComponent.Select,
    options: [
      { value: 0, text: "Momentary" },
      { value: 1, text: "Latching" },
    ],
    label: "Type",
    helpText: `Denotes button type.
      Type can be momentary, which means that note off is sent as soon as
      button is released, or latching, which means that note off is sent on
      second button press. All buttons are configured as momentary by
      default. Depending on message type this setting can be ignored.`,
  },
  MidiMessage: {
    key: "midiMessage",
    type: DefinitionType.ComponentValue,
    section: 1,
    component: FormInputComponent.Select,
    options: [
      { value: MidiMessageType.Note, text: "Note" },
      { value: MidiMessageType.ProgramChange, text: "Program Change" },
      { value: MidiMessageType.ProgramChangeInc, text: "Program Change Inc" },
      { value: MidiMessageType.ProgramChangeDec, text: "Program Change Dec" },
      { value: MidiMessageType.ControlChange, text: "CC" },
      { value: MidiMessageType.ControlChangeOff, text: "CC/0 Off" },
      { value: MidiMessageType.MmcStop, text: "MMC Stop" },
      { value: MidiMessageType.MmcPlay, text: "MMC Play" },
      { value: MidiMessageType.MmcRecord, text: "MMC Record" },
      { value: MidiMessageType.MmcPause, text: "MMC Pause" },
      { value: MidiMessageType.RealTimeClock, text: "Real Time Clock" },
      { value: MidiMessageType.RealTimeStart, text: "Real Time Start" },
      { value: MidiMessageType.RealTimeContinue, text: "Real Time Continue" },
      { value: MidiMessageType.RealTimeStop, text: "Real Time Stop" },
      {
        value: MidiMessageType.RealTimeActiveSensing,
        text: "Real Time Active Sensing",
      },
      {
        value: MidiMessageType.RealTimeSystemReset,
        text: "Real Time System Reset",
      },
      { value: MidiMessageType.None, text: "None" },
      { value: MidiMessageType.PresetChange, text: "Preset Change" },
      {
        value: MidiMessageType.MultiValueIncResetNote,
        text: "Multi Value IncReset Note",
      },
      {
        value: MidiMessageType.MultiValueIncDecNote,
        text: "Multi Value IncDec Note",
      },
      {
        value: MidiMessageType.MultiValueIncResetCC,
        text: "Multi Value IncReset CC",
      },
      {
        value: MidiMessageType.MultiValueIncDecCC,
        text: "Multi Value IncDec CC",
      },
    ],
    label: "MIDI message",
    helpText: ``,
    block: Block.Button,
  },
  MidiId: {
    showIf: (formState: FormState): boolean =>
      !HideMidiIdOnTypes.includes(formState.midiMessage),
    key: "midiId",
    type: DefinitionType.ComponentValue,
    section: 2,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "MIDI ID",
    helpText: "",
    block: Block.Button,
  },
  OnVelocity: {
    showIf: (formState: FormState): boolean =>
      !HideVelocityOnTypes.includes(formState.midiMessage),
    key: "onVelocity",
    type: DefinitionType.ComponentValue,
    section: 3,
    component: FormInputComponent.Input,
    min: 1,
    max: 127,
    label: "On velocity",
    helpText: "Velocity button sends when it's pressed.",
    block: Block.Button,
  },
  MidiChannel: {
    key: "midiChannel",
    type: DefinitionType.ComponentValue,
    section: 4,
    min: 1,
    max: 16,
    component: FormInputComponent.Input,
    label: "MIDI channel",
    helpText: "",
    block: Block.Button,
  },
};
