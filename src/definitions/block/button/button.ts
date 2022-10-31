import { markRaw } from "vue";
import {
  IBlockDefinition,
  ISectionDefinition,
  SectionType,
  FormInputComponent,
  HideButtonVelocityOnTypes,
  HideButtonMidiIdOnTypes,
  HideButtonMidiChannelOnTypes,
  Block,
  ButtonMessageType,
} from "../../interface";

import RouteWrapper from "../../../components/RouteWrapper.vue";
import DeviceForm from "../../device/DeviceForm.vue";
import DeviceGrid from "../../device/DeviceGrid.vue";
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
    key: "messageType",
    type: SectionType.Value,
    section: 1,
    component: FormInputComponent.Select,
    options: [
      { value: ButtonMessageType.Note, text: "Note" },
      { value: ButtonMessageType.ProgramChange, text: "Program Change" },
      { value: ButtonMessageType.ProgramChangeInc, text: "Program Change Inc" },
      { value: ButtonMessageType.ProgramChangeDec, text: "Program Change Dec" },
      {
        value: ButtonMessageType.ProgramChangeOffsetInc,
        text: "Program Change Offset Increment",
      },
      {
        value: ButtonMessageType.ProgramChangeOffsetDec,
        text: "Program Change Offset Decrement",
      },
      { value: ButtonMessageType.ControlChange, text: "CC" },
      { value: ButtonMessageType.ControlChangeOff, text: "CC/0 Off" },
      { value: ButtonMessageType.MmcStop, text: "MMC Stop" },
      { value: ButtonMessageType.MmcPlay, text: "MMC Play" },
      { value: ButtonMessageType.MmcRecord, text: "MMC Record" },
      { value: ButtonMessageType.MmcPause, text: "MMC Pause" },
      { value: ButtonMessageType.RealTimeClock, text: "Real Time Clock" },
      { value: ButtonMessageType.RealTimeStart, text: "Real Time Start" },
      { value: ButtonMessageType.RealTimeContinue, text: "Real Time Continue" },
      { value: ButtonMessageType.RealTimeStop, text: "Real Time Stop" },
      {
        value: ButtonMessageType.RealTimeActiveSensing,
        text: "Real Time Active Sensing",
      },
      {
        value: ButtonMessageType.RealTimeSystemReset,
        text: "Real Time System Reset",
      },
      { value: ButtonMessageType.None, text: "None" },
      { value: ButtonMessageType.PresetChange, text: "Preset Change" },
      {
        value: ButtonMessageType.MultiValueIncResetNote,
        text: "Multi Value IncReset Note",
      },
      {
        value: ButtonMessageType.MultiValueIncDecNote,
        text: "Multi Value IncDec Note",
      },
      {
        value: ButtonMessageType.MultiValueIncResetCC,
        text: "Multi Value IncReset CC",
      },
      {
        value: ButtonMessageType.MultiValueIncDecCC,
        text: "Multi Value IncDec CC",
      },
      { value: ButtonMessageType.NoteOffOnly, text: "Note Off Only" },
      { value: ButtonMessageType.ControlChange0Only, text: "CC/0 only" },
      { value: ButtonMessageType.BpmInc, text: "BPM Inc" },
      { value: ButtonMessageType.BpmDec, text: "BPM Dec" },
    ],
    label: "Message type",
    helpText: ``,
    block: Block.Button,
  },
  MidiChannel: {
    showIf: (formState: FormState): boolean =>
      !HideButtonMidiChannelOnTypes.includes(formState.messageType),
    key: "midiChannel",
    type: SectionType.Value,
    block: Block.Button,
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
      !HideButtonMidiIdOnTypes.includes(formState.messageType),
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
  Value: {
    showIf: (formState: FormState): boolean =>
      !HideButtonVelocityOnTypes.includes(formState.messageType),
    key: "value",
    type: SectionType.Value,
    section: 3,
    component: FormInputComponent.Input,
    min: 1,
    max: 127,
    label: "Value",
    helpText:
      "Velocity for notes, control value for CC, increment/decrement value for Multi Value message types or offset for Program Change.",
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
          component: DeviceGrid,
          props: {
            block: Block.Button,
            routeName: "device-buttons-form",
            segmentGrid: true,
          },
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
