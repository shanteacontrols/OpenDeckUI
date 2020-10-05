import { markRaw } from "vue";
import {
  ISectionDefinition,
  FormInputComponent,
  SectionType,
  IBlockDefinition,
  ISectionDefinition,
  Block,
  AnalogType,
} from "../../interface";

import DeviceForm from "../../device/DeviceForm.vue";
import DeviceGrid from "../../device/DeviceGrid.vue";
import RouteWrapper from "../../../components/RouteWrapper.vue";
import AnalogIcon from "./AnalogIcon.vue";

const sections: Dictionary<ISectionDefinition> = {
  Enabled: {
    block: Block.Analog,
    key: "enabled",
    type: SectionType.Value,
    section: 0,
    component: FormInputComponent.Toggle,
    label: "Enabled",
    helpText: ``,
  },
  Invert: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button,
    key: "invert",
    type: SectionType.Value,
    section: 1,
    component: FormInputComponent.Toggle,
    label: "Invert direction",
    helpText: ``,
    block: Block.Analog,
  },
  Type: {
    key: "type",
    type: SectionType.Value,
    section: 2,
    component: FormInputComponent.Select,
    options: [
      { value: AnalogType.ControlChange7Bit, text: "Control change 7-bit" },
      { value: AnalogType.Note, text: "Note" },
      { value: AnalogType.FSR, text: "FSR" },
      { value: AnalogType.Button, text: "Button" },
      { value: AnalogType.NRPN7, text: "NRPN 7-bit" },
      { value: AnalogType.NRPN14, text: "NRPN 14-bit" },
      { value: AnalogType.PitchBend, text: "Pitch bend" },
      { value: AnalogType.ControlChange14Bit, text: "Control change 14-bit" },
    ],
    label: "Type",
    helpText: ``,
    block: Block.Analog,
  },
  MidiIdLSB: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button,
    key: "midiIdLSB",
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
      formState.type !== AnalogType.Button,
    isMsb: true,
    key: "midiIdMSB",
    type: SectionType.Value,
    section: 4,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "MIDI ID (MSB)",
    helpText: "",
    block: Block.Analog,
  },
  LowerCCLimitLSB: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button,
    isLsb: true,
    key: "lowerCCLimitLSB",
    type: SectionType.Value,
    section: 5,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    max2Byte: 16383,
    label: "Lower CC limit (LSB)",
    helpText: "",
    block: Block.Analog,
  },
  LowerCCLimitMSB: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button,
    isMsb: true,
    key: "lowerCCLimitMSB",
    type: SectionType.Value,
    section: 6,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "Lower CC limit (MSB)",
    helpText: "",
    block: Block.Analog,
  },
  UpperCCLimitLSB: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button,
    isLsb: true,
    key: "upperCCLimitLSB",
    type: SectionType.Value,
    section: 7,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    max2Byte: 16383,
    label: "Upper CC limit (LSB)",
    helpText: "",
    block: Block.Analog,
  },
  UpperCCLimitMSB: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button,
    isMsb: true,
    key: "upperCCLimitMSB",
    type: SectionType.Value,
    section: 8,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "Upper CC limit (MSB)",
    helpText: "",
    block: Block.Analog,
  },
  MidiChannel: {
    showIf: (formState: FormState): boolean =>
      formState.type !== AnalogType.Button,
    key: "midiChannel",
    type: SectionType.Value,
    section: 9,
    component: FormInputComponent.Input,
    min: 0,
    max: 16,
    label: "MIDI channel",
    helpText: "",
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
