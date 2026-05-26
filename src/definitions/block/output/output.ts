import { markRaw } from "vue";
import {
  ISectionDefinition,
  FormInputComponent,
  SectionType,
  Block,
  OutputControlMode,
  HideOutputActivationValueOnControlTypes,
  HideOutputActivationIdOnControlTypes,
  HideOutputMidiChannelOnControlTypes,
} from "../../interface";

import DeviceForm from "../../device/DeviceForm.vue";
import DeviceGridWithSettings from "../../device/DeviceGridWithSettings.vue";
import RouteWrapper from "../../../components/RouteWrapper.vue";
import OutputIcon from "./OutputIcon.vue";

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
  // Settings definitions
  PulseWithMidiClock: {
    block: Block.Output,
    key: "pulseWithMidiClock",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Pulse with MIDI clock",
    helpText: `Enables or disables output pulsing via MIDI clock. When enabled, MIDI clock is used to toggle output state. Otherwise, internal timer is used.`,
  },
  StartupAnimation: {
    key: "startupAnimation",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "Start-up animation",
    helpText: `Enables or disables output animation when the device is powered on.`,
    block: Block.Output,
  },
  UseMidiProgramChangeOffset: {
    key: "useMidiProgramChangeOffset",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 3,
    component: FormInputComponent.Toggle,
    label: "Use MIDI Program Change Offset",
    helpText: `When enabled, current internal Program Change Offset will be appended to configured activation ID, if the output is configured to react to Program Change.`,
    block: Block.Output,
  },
  // Component definitions
  OutputState: {
    key: "outputState",
    sectionGroup: commonSectionGroup,
    type: SectionType.Value,
    section: 0,
    component: FormInputComponent.Toggle,
    label: "Output state",
    helpText: `Turns the output on or off.`,
    block: Block.Output,
  },
  ActivationId: {
    showIf: (formState: FormState): boolean =>
      !HideOutputActivationIdOnControlTypes.includes(formState.controlType),
    key: "activationId",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 3,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "MIDI activation ID",
    helpText: ``,
    block: Block.Output,
  },
  ControlType: {
    key: "controlType",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 5,
    component: FormInputComponent.Select,
    options: [
      {
        value: OutputControlMode.MidiInNoteMultiValue,
        text: "MIDI in / Note (Multi value)",
      },
      {
        value: OutputControlMode.MidiInCcMultiValue,
        text: "MIDI in / CC (Multi value)",
      },
      {
        value: OutputControlMode.MidiInNoteSingleValue,
        text: "MIDI in / Note (Single value)",
      },
      {
        value: OutputControlMode.MidiInCcSingleValue,
        text: "MIDI in / CC (Single value)",
      },
      {
        value: OutputControlMode.LocalNoteMultiValue,
        text: "Local / Note (Multi value)",
      },
      {
        value: OutputControlMode.LocalCcMultiValue,
        text: "Local / CC (Multi value)",
      },
      {
        value: OutputControlMode.LocalNoteSingleValue,
        text: "Local / Note (Single value)",
      },
      {
        value: OutputControlMode.LocalCcSingleValue,
        text: "Local / CC (Single value)",
      },
      {
        value: OutputControlMode.ProgramChange,
        text: "Program change",
      },
      {
        value: OutputControlMode.PresetChange,
        text: "Preset",
      },
      {
        value: OutputControlMode.Static,
        text: "Static / constantly on",
      },
    ],
    label: "MIDI control type",
    helpText: ``,
    block: Block.Output,
  },
  ActivationValue: {
    showIf: (formState: FormState): boolean =>
      !HideOutputActivationValueOnControlTypes.includes(formState.controlType),
    key: "activationValue",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 6,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "MIDI activation value",
    helpText: "",
    block: Block.Output,
  },
  MidiChannel: {
    showIf: (formState: FormState): boolean =>
      !HideOutputMidiChannelOnControlTypes.includes(formState.controlType),
    key: "midiChannel",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    block: Block.Output,
    section: 7,
    component: FormInputComponent.Input,
    min: 1,
    max: 17,
    label: "MIDI channel",
    helpText:
      "Setting the channel to value 17 will ignore the specified MIDI channel.",
  },
};

export const OutputBlock: IBlockDefinition = {
  block: Block.Output,
  title: "Output",
  pluralTitle: "Outputs",
  routeName: "device-outputs",
  iconComponent: markRaw(OutputIcon),
  componentCountResponseIndex: 3,
  sections,
  routes: [
    {
      path: "outputs",
      name: "device-outputs",
      component: RouteWrapper,
      redirect: { name: "device-outputs-list" },
      children: [
        {
          path: "list",
          name: "device-outputs-list",
          component: DeviceGridWithSettings,
          props: {
            block: Block.Output,
            routeName: "device-outputs-form",
            segmentGrid: true,
          },
        },
        {
          path: "outputs/:index",
          name: "device-outputs-form",
          component: DeviceForm,
          props: {
            block: Block.Output,
          },
        },
      ],
    },
  ],
};
