import { markRaw } from "vue";
import {
  IBlockDefinition,
  ISectionDefinition,
  SectionType,
  FormInputComponent,
  HideSwitchVelocityOnTypes,
  HideSwitchMidiIdOnTypes,
  HideSwitchMidiChannelOnTypes,
  Block,
  SwitchMessageType,
} from "../../interface";

import RouteWrapper from "../../../components/RouteWrapper.vue";
import DeviceForm from "../../device/DeviceForm.vue";
import DeviceGrid from "../../device/DeviceGrid.vue";
import SwitchIcon from "./SwitchIcon.vue";

const commonSectionGroup = {
  key: "common",
  title: "Common",
  helpText: "Applies to both OSC and MIDI.",
};

const midiSectionGroup = {
  key: "midi",
  title: "MIDI",
  helpText: "Applies only to MIDI messages.",
};

const sections: Dictionary<ISectionDefinition> = {
  Type: {
    block: Block.Switch,
    key: "type",
    sectionGroup: commonSectionGroup,
    type: SectionType.Value,
    section: 0,
    component: FormInputComponent.Select,
    colspan: 2,
    options: [
      { value: 0, text: "Momentary" },
      { value: 1, text: "Latching" },
    ],
    label: "Type",
    helpText: `
      Switch type can be momentary, which means that configured action is sent as soon as
      the switch is released, or latching, which means that configured action is sent on
      second activation. All switches are configured as momentary by
      default. This setting is always respected by OSC messages. Some MIDI message types may override it.`,
  },
  MidiMessage: {
    key: "messageType",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 1,
    component: FormInputComponent.Select,
    options: [
      { value: SwitchMessageType.Note, text: "Note" },
      { value: SwitchMessageType.ProgramChange, text: "Program Change" },
      { value: SwitchMessageType.ProgramChangeInc, text: "Program Change Inc" },
      { value: SwitchMessageType.ProgramChangeDec, text: "Program Change Dec" },
      {
        value: SwitchMessageType.ProgramChangeOffsetInc,
        text: "Program Change Offset Increment",
      },
      {
        value: SwitchMessageType.ProgramChangeOffsetDec,
        text: "Program Change Offset Decrement",
      },
      { value: SwitchMessageType.ControlChange, text: "CC" },
      { value: SwitchMessageType.ControlChangeOff, text: "CC/0 Off" },
      { value: SwitchMessageType.MmcStop, text: "MMC Stop" },
      { value: SwitchMessageType.MmcPlay, text: "MMC Play" },
      { value: SwitchMessageType.MmcPlayStop, text: "MMC Play/Stop" },
      { value: SwitchMessageType.MmcRecord, text: "MMC Record" },
      { value: SwitchMessageType.MmcPause, text: "MMC Pause" },
      { value: SwitchMessageType.RealTimeClock, text: "Real Time Clock" },
      { value: SwitchMessageType.RealTimeStart, text: "Real Time Start" },
      { value: SwitchMessageType.RealTimeContinue, text: "Real Time Continue" },
      { value: SwitchMessageType.RealTimeStop, text: "Real Time Stop" },
      {
        value: SwitchMessageType.RealTimeActiveSensing,
        text: "Real Time Active Sensing",
      },
      {
        value: SwitchMessageType.RealTimeSystemReset,
        text: "Real Time System Reset",
      },
      { value: SwitchMessageType.None, text: "None" },
      { value: SwitchMessageType.PresetChange, text: "Preset Change" },
      {
        value: SwitchMessageType.MultiValueIncResetNote,
        text: "Multi Value IncReset Note",
      },
      {
        value: SwitchMessageType.MultiValueIncDecNote,
        text: "Multi Value IncDec Note",
      },
      {
        value: SwitchMessageType.MultiValueIncResetCC,
        text: "Multi Value IncReset CC",
      },
      {
        value: SwitchMessageType.MultiValueIncDecCC,
        text: "Multi Value IncDec CC",
      },
      { value: SwitchMessageType.NoteOffOnly, text: "Note Off Only" },
      { value: SwitchMessageType.ControlChange0Only, text: "CC/0 only" },
      { value: SwitchMessageType.BpmInc, text: "BPM Inc" },
      { value: SwitchMessageType.BpmDec, text: "BPM Dec" },
    ],
    label: "MIDI message type",
    helpText: ``,
    block: Block.Switch,
  },
  MidiChannel: {
    showIf: (formState: FormState): boolean =>
      !HideSwitchMidiChannelOnTypes.includes(formState.messageType),
    key: "midiChannel",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    block: Block.Switch,
    section: 4,
    component: FormInputComponent.Input,
    min: 1,
    max: 17,
    label: "MIDI channel",
    helpText:
      "Setting the channel to value 17 will cause sending of data on each MIDI channel.",
  },
  MidiId: {
    showIf: (formState: FormState): boolean =>
      !HideSwitchMidiIdOnTypes.includes(formState.messageType),
    key: "midiId",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 2,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "MIDI ID",
    helpText: "",
    block: Block.Switch,
  },
  Preset: {
    showIf: (formState: FormState): boolean =>
      formState.messageType == SwitchMessageType.PresetChange,
    key: "preset",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 2,
    component: FormInputComponent.Input,
    min: 0,
    max: 9,
    label: "Preset",
    helpText:
      "Preset to switch to once the switch is activated. Numbering starts from 0, so value 0 will load preset 1.",
    block: Block.Switch,
  },
  Value: {
    showIf: (formState: FormState): boolean =>
      !HideSwitchVelocityOnTypes.includes(formState.messageType),
    key: "value",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 3,
    component: FormInputComponent.Input,
    min: 1,
    max: 127,
    label: "MIDI value",
    helpText:
      "Velocity for notes, control value for CC, increment/decrement value for Multi Value message types or offset for Program Change.",
    block: Block.Switch,
  },
};

export const SwitchBlock: IBlockDefinition = {
  block: Block.Switch,
  title: "Switch",
  pluralTitle: "Switches",
  routeName: "device-switches",
  iconComponent: markRaw(SwitchIcon),
  componentCountResponseIndex: 0,
  sections,
  routes: [
    {
      path: "switches",
      name: "device-switches",
      component: RouteWrapper,
      redirect: { name: "device-switches-list" },
      children: [
        {
          path: "list",
          name: "device-switches-list",
          component: DeviceGrid,
          props: {
            block: Block.Switch,
            routeName: "device-switches-form",
            segmentGrid: true,
          },
        },
        {
          path: "switches/:index",
          name: "device-switches-form",
          component: DeviceForm,
          props: {
            block: Block.Switch,
          },
        },
      ],
    },
  ],
};
