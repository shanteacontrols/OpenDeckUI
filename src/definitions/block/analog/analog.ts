import { markRaw } from "vue";
import {
  ISectionDefinition,
  FormInputComponent,
  SectionType,
  IBlockDefinition,
  ISectionDefinition,
  Block,
  AnalogType,
  HideAnalogMidiIdOnTypes,
  HideAnalogMidiChannelOnTypes,
} from "../../interface";

import DeviceForm from "../../device/DeviceForm.vue";
import DeviceGrid from "../../device/DeviceGrid.vue";
import RouteWrapper from "../../../components/RouteWrapper.vue";
import AnalogIcon from "./AnalogIcon.vue";

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
  Enabled: {
    block: Block.Analog,
    key: "enabled",
    sectionGroup: commonSectionGroup,
    type: SectionType.Value,
    section: 0,
    component: FormInputComponent.Toggle,
    label: "Enable",
    helpText: `Enables or disables analog input. Disabled by default to avoid sending erratic values when nothing
    is connected to the input.`,
  },
  Invert: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button && !!formState.enabled,
    key: "invert",
    sectionGroup: commonSectionGroup,
    type: SectionType.Value,
    section: 1,
    component: FormInputComponent.Toggle,
    label: "Invert direction",
    helpText: `Reverses the analog input direction before it is mapped to OSC or MIDI output. Use this when
    the lower physical position should behave as the higher position, or the other way around.`,
    block: Block.Analog,
  },
  Type: {
    showIf: (formState: FormState): boolean => !!formState.enabled,
    key: "type",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 2,
    component: FormInputComponent.Select,
    options: [
      { value: AnalogType.ControlChange7Bit, text: "Control change 7-bit" },
      { value: AnalogType.Note, text: "Note" },
      { value: AnalogType.FSR, text: "FSR" },
      { value: AnalogType.Button, text: "Button" },
      { value: AnalogType.NRPN7bit, text: "NRPN 7-bit" },
      { value: AnalogType.NRPN14bit, text: "NRPN 14-bit" },
      { value: AnalogType.PitchBend, text: "Pitch bend" },
      { value: AnalogType.ControlChange14Bit, text: "Control change 14-bit" },
    ],
    label: "Message type",
    helpText: ``,
    block: Block.Analog,
  },
  MidiIdLSB: {
    showIf: (formState: FormState): boolean =>
      !HideAnalogMidiIdOnTypes.includes(formState.type) && !!formState.enabled,
    key: "midiIdLSB",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 3,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    max2Byte: 16383,
    label: "MIDI ID (LSB)",
    helpText: "",
    block: Block.Analog,
    isLsb: true,
  },
  MidiIdMSB: {
    showIf: (formState: FormState): boolean =>
      !HideAnalogMidiIdOnTypes.includes(formState.type) && !!formState.enabled,
    isMsb: true,
    key: "midiIdMSB",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 4,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "MIDI ID (MSB)",
    helpText: "",
    block: Block.Analog,
  },
  LowerLimitLSB: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button && !!formState.enabled,
    isLsb: true,
    key: "lowerLimitLSB",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 5,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    max2Byte: 16383,
    label: "Lower limit (LSB)",
    helpText: `Specifies the minimum value which is sent by the analog input. Scaling is used
    here, so this value will be sent when the analog input is at its lowest position. Limit is
    type-dependent. For most types, total range is 0-127. For pitch bend, 14-bit NRPN and
    14-bit CC, total range is 0-16383.`,
    block: Block.Analog,
  },
  LowerLimitMSB: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button && !!formState.enabled,
    isMsb: true,
    key: "lowerLimitMSB",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 6,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "Lower limit (MSB)",
    helpText: `Specifies the minimum value which is sent by the analog input. Scaling is used
    here, so this value will be sent when the analog input is at its lowest position. Limit is
    type-dependent. For most types, total range is 0-127. For pitch bend, 14-bit NRPN and
    14-bit CC, total range is 0-16383.`,
    block: Block.Analog,
  },
  UpperLimitLSB: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button && !!formState.enabled,
    isLsb: true,
    key: "upperLimitLSB",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 7,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    max2Byte: 16383,
    label: "Upper limit (LSB)",
    helpText: `Specifies the maximum value which is sent by the analog input. Scaling is used
    here, so this value will be sent when the analog input is at its highest position. Limit is
    type-dependent. For most types, total range is 0-127. For pitch bend, 14-bit NRPN and
    14-bit CC, total range is 0-16383.`,
    block: Block.Analog,
  },
  UpperLimitMSB: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button && !!formState.enabled,
    isMsb: true,
    key: "upperLimitMSB",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    section: 8,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "Upper limit (MSB)",
    helpText: `Specifies the maximum value which is sent by the analog input. Scaling is used
    here, so this value will be sent when the analog input is at its highest position. Limit is
    type-dependent. For most types, total range is 0-127. For pitch bend, 14-bit NRPN and
    14-bit CC, total range is 0-16383.`,
    block: Block.Analog,
  },
  MidiChannel: {
    showIf: (formState: FormState): boolean =>
      !HideAnalogMidiChannelOnTypes.includes(formState.type) &&
      !!formState.enabled,
    key: "midiChannel",
    sectionGroup: midiSectionGroup,
    type: SectionType.Value,
    block: Block.Analog,
    section: 9,
    component: FormInputComponent.Input,
    min: 1,
    max: 17,
    label: "MIDI channel",
    helpText:
      "Setting the channel to value 17 will cause sending of data on each MIDI channel.",
  },
  LowerAdcOffset: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button && !!formState.enabled,
    key: "lowerAdcOffset",
    sectionGroup: commonSectionGroup,
    type: SectionType.Value,
    section: 10,
    component: FormInputComponent.Input,
    min: 0,
    max: 100,
    label: "Lower ADC offset",
    helpText: `Specifies lower offset percentage which is used to calculate minimum ADC value upon which output
    values will be based. Useful for inputs which cannot reach minimum ADC value. If for example, the board has
    nominal ADC range 0-4095, setting this value to 10 will calculate values based on 409-4095 range (assuming
    the upper offset is 0), that is, lower 10% of ADC range will be cut off.`,
    block: Block.Analog,
  },
  UpperAdcOffset: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button && !!formState.enabled,
    key: "upperAdcOffset",
    sectionGroup: commonSectionGroup,
    type: SectionType.Value,
    section: 11,
    component: FormInputComponent.Input,
    min: 0,
    max: 100,
    label: "Upper ADC offset",
    helpText: `Specifies upper offset percentage which is used to calculate maximum ADC value upon which output
    values will be based. Useful for inputs which cannot reach maximum ADC value. If for example, the board has
    nominal ADC range 0-4095, setting this value to 10 will calculate values based on 0-3685 range (assuming
    the lower offset is 0), that is, upper 10% of ADC range will be cut off.`,
    block: Block.Analog,
  },
};

export const AnalogBlock: IBlockDefinition = {
  block: Block.Analog,
  title: "Analog",
  routeName: "device-analogs",
  iconComponent: markRaw(AnalogIcon),
  componentCountResponseIndex: 2,
  sections,
  routes: [
    {
      path: "analogs",
      name: "device-analogs",
      component: RouteWrapper,
      redirect: { name: "device-analogs-list" },
      children: [
        {
          path: "list",
          name: "device-analogs-list",
          component: DeviceGrid,
          props: {
            block: Block.Analog,
            routeName: "device-analogs-form",
          },
        },
        {
          path: "analogs/:index",
          name: "device-analogs-form",
          component: DeviceForm,
          props: {
            block: Block.Analog,
          },
        },
      ],
    },
  ],
};
