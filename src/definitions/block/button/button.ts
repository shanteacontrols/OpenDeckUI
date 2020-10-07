import { markRaw } from "vue";
import {
  IBlockDefinition,
  ISectionDefinition,
  SectionType,
  FormInputComponent,
  HideVelocityOnTypes,
  HideMidiIdOnTypes,
  Block,
  MidiMessageType,
} from "../../interface";

import RouteWrapper from "../../../components/RouteWrapper.vue";
import DeviceForm from "../../device/DeviceForm.vue";
import ButtonList from "./ButtonList.vue";
import ButtonIcon from "./ButtonIcon.vue";

const sections: Dictionary<ISectionDefinition> = {
  Type: {
    block: Block.Button,
    key: "type",
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
      Button type can be momentary, which means that configured MIDI message is sent as soon as
      button is released, or latching, which means that MIDI message is sent on
      second button press. All buttons are configured as momentary by
      default. Depending on message type this setting can be ignored.`,
  },
  MidiMessage: {
    key: "midiMessage",
    type: SectionType.Value,
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
  MidiChannel: {
    key: "midiChannel",
    type: SectionType.Value,
    section: 4,
    min: 1,
    max: 16,
    component: FormInputComponent.Input,
    label: "MIDI channel",
    helpText: "",
    block: Block.Button,
  },
  MidiId: {
    showIf: (formState: FormState): boolean =>
      !HideMidiIdOnTypes.includes(formState.midiMessage),
    key: "midiId",
    type: SectionType.Value,
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
    type: SectionType.Value,
    section: 3,
    component: FormInputComponent.Input,
    min: 1,
    max: 127,
    label: "On velocity",
    helpText: "Velocity button sends when it's pressed.",
    block: Block.Button,
  },
};

export const ButtonBlock: IBlockDefinition = {
  block: Block.Button,
  title: "Button",
  routeName: "device-buttons",
  iconComponent: markRaw(ButtonIcon),
  componentCountResponseIndex: 0,
  sections,
  routes: [
    {
      path: "buttons",
      name: "device-buttons",
      component: RouteWrapper,
      redirect: { name: "device-buttons-list" },
      children: [
        {
          path: "list",
          name: "device-buttons-list",
          component: ButtonList,
        },
        {
          path: "buttons/:index",
          name: "device-buttons-form",
          component: DeviceForm,
          props: {
            block: Block.Button,
          },
        },
      ],
    },
  ],
};
