import { markRaw } from "vue";
import {
  ISectionDefinition,
  FormInputComponent,
  SectionType,
  Block,
  EncodingMode,
  ShowAccelerationOnTypes,
} from "../../interface";

import RouteWrapper from "../../../components/RouteWrapper.vue";
import EncodersList from "./EncodersList.vue";
import EncoderForm from "./EncoderForm.vue";
import EncoderIcon from "./EncoderIcon.vue";

const sections: Dictionary<ISectionDefinition> = {
  Enabled: {
    block: Block.Encoder,
    key: "enabled",
    type: SectionType.Value,
    section: 0,
    component: FormInputComponent.Toggle,
    label: "Enabled",
    helpText: `Enabling the encoder disables two digital inputs (buttons).`,
  },
  InvertState: {
    block: Block.Encoder,
    key: "invertState",
    type: SectionType.Value,
    section: 1,
    component: FormInputComponent.Toggle,
    label: "Invert",
    helpText: ``,
  },
  EncodingMode: {
    block: Block.Encoder,
    key: "encodingMode",
    type: SectionType.Value,
    section: 2,
    component: FormInputComponent.Select,
    options: [
      { value: EncodingMode.Controlchange7F, text: "Control change - 7Fh01h" },
      { value: EncodingMode.Controlchange3F, text: "Control change - 3Fh41h" },
      { value: EncodingMode.Programchange, text: "Program change" },
      {
        value: EncodingMode.ControlchangeContinuous7,
        text: "Control change -Continuous 7-bit",
      },
      {
        value: EncodingMode.ControlchangeContinuous14,
        text: "Control change - Continuous 14-bit",
      },
      { value: EncodingMode.Changepreset, text: "Change preset" },
      { value: EncodingMode.Pitchbend, text: "Pitch bend" },
      { value: EncodingMode.NRPN6, text: "NRPN/7-bit" },
      { value: EncodingMode.NRPN7, text: "NRPN/14-bit" },
    ],
    label: "Encoding mode",
    helpText: ``,
  },
  MidiIdLSB: {
    isLsb: true,
    block: Block.Encoder,
    key: "midiIdLSB",
    type: SectionType.Value,
    section: 3,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    max2Byte: 16383,
    label: "MIDI ID (LSB)",
    helpText: "",
  },
  MidiChannel: {
    block: Block.Encoder,
    key: "midiChannel",
    type: SectionType.Value,
    section: 4,
    component: FormInputComponent.Input,
    min: 1,
    max: 16,
    label: "MIDI channel",
    helpText: "",
  },
  PulsesPerStep: {
    block: Block.Encoder,
    key: "pulsesPerStep",
    type: SectionType.Value,
    section: 5,
    component: FormInputComponent.Select,
    options: [
      { value: 2, text: "2" },
      { value: 3, text: "3" },
      { value: 4, text: "4" },
    ],
    label: "Pulses per step",
    helpText: `Amount of pulses encoder must generate in order for firmware to register it as single step.`,
  },
  Acceleration: {
    showIf: (formState: FormState): boolean =>
      ShowAccelerationOnTypes.includes(formState.encodingMode),
    block: Block.Encoder,
    key: "acceleration",
    type: SectionType.Value,
    section: 6,
    component: FormInputComponent.Select,
    options: [
      { value: 0, text: "Disabled" },
      { value: 1, text: "Slow" },
      { value: 2, text: "Medium" },
      { value: 3, text: "Fast" },
    ],
    label: "Acceleration",
    helpText: ``,
  },
  MidiIdMSB: {
    isMsb: true,
    block: Block.Encoder,
    key: "midiIdMSB",
    type: SectionType.Value,
    section: 7,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "MIDI ID (MSB)",
    helpText: "",
  },
  RemoteSync: {
    block: Block.Encoder,
    key: "remoteSync",
    type: SectionType.Value,
    section: 8,
    component: FormInputComponent.Toggle,
    label: "Remote sync",
    helpText: `Used only in continuous CC mode or pitch bend mode.
    If enabled, CC/pitch bend value received via MIDI IN will be applied to the encoder with same MIDI ID and MIDI channel,
    so that next encoder turn increments or decrements received value instead of the last value it sent.`,
  },
};

export const EncoderBlock: IBlockDefinition = {
  block: Block.Encoder,
  title: "Encoder",
  routeName: "device-encoders",
  iconComponent: markRaw(EncoderIcon),
  componentCountResponseIndex: 1,
  sections,
  routes: [
    {
      path: "encoders",
      name: "device-encoders",
      component: RouteWrapper,
      redirect: { name: "device-encoders-list" },
      children: [
        {
          path: "list",
          name: "device-encoders-list",
          component: EncodersList,
        },
        {
          path: "encoders/:index",
          name: "device-encoders-form",
          component: EncoderForm,
        },
      ],
    },
  ],
};
