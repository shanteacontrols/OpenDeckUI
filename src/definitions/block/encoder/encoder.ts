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
import DeviceGrid from "../../device/DeviceGrid.vue";
import DeviceForm from "../../device/DeviceForm.vue";
import EncoderIcon from "./EncoderIcon.vue";

const sections: Dictionary<ISectionDefinition> = {
  Enabled: {
    block: Block.Encoder,
    key: "enabled",
    type: SectionType.Value,
    section: 0,
    component: FormInputComponent.Toggle,
    label: "Enable",
    helpText: `Encoder needs to be enabled in order to use it.
    Note that enabling the encoder disables two digital inputs (buttons).`,
  },
  InvertState: {
    showIf: (formState: FormState): boolean => formState.enabled,
    block: Block.Encoder,
    key: "invertState",
    type: SectionType.Value,
    section: 1,
    component: FormInputComponent.Toggle,
    label: "Invert",
    helpText: `Inverts the direction of the encoder. For example, if 7Fh01h encoding mode is used, MIDI value 127 will
    be sent in backward direction, and 1 in forward direction. If inversion is enabled, value 1 will be sent when going backwards,
    and 127 when going forward. Same logic applies to any other specified encoding mode.`,
  },
  EncodingMode: {
    showIf: (formState: FormState): boolean => formState.enabled,
    block: Block.Encoder,
    key: "encodingMode",
    type: SectionType.Value,
    section: 2,
    colspan: 2,
    component: FormInputComponent.Select,
    options: [
      { value: EncodingMode.Controlchange7F, text: "Control change - 7Fh01h" },
      { value: EncodingMode.Controlchange3F, text: "Control change - 3Fh41h" },
      {
        value: EncodingMode.ControlchangeContinuous7,
        text: "Control change - Continuous 7-bit",
      },
      {
        value: EncodingMode.ControlchangeContinuous14,
        text: "Control change - Continuous 14-bit",
      },
      { value: EncodingMode.Programchange, text: "Program change" },
      { value: EncodingMode.Pitchbend, text: "Pitch bend" },
      { value: EncodingMode.NRPN6, text: "NRPN/7-bit" },
      { value: EncodingMode.NRPN7, text: "NRPN/14-bit" },
      { value: EncodingMode.Changepreset, text: "Change preset" },
    ],
    label: "MIDI message",
    helpText: `Specifies the MIDI message which will be sent by the encoder. If Change Preset type is used,
    encoder will be used only to switch between the presets on the device and no MIDI message will be sent. Moving the encoder
    backward will decrement the preset by 1 and moving it forward will increment it, unless Invert option is used. In that case
    inverted logic applies. Note that in order for this option to work accross all presets, Change Preset type should be set in each preset.`,
  },
  MidiChannel: {
    showIf: (formState: FormState): boolean => formState.enabled,
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
  MidiIdLSB: {
    showIf: (formState: FormState): boolean => formState.enabled,
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
  MidiIdMSB: {
    showIf: (formState: FormState): boolean => formState.enabled,
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
  PulsesPerStep: {
    showIf: (formState: FormState): boolean => formState.enabled,
    block: Block.Encoder,
    key: "pulsesPerStep",
    type: SectionType.Value,
    section: 5,
    colspan: 2,
    component: FormInputComponent.Select,
    options: [
      { value: 2, text: "2" },
      { value: 3, text: "3" },
      { value: 4, text: "4" },
    ],
    label: "Pulses per step",
    helpText: `Amount of pulses encoder must generate in order for firmware to register it as single step. Usually 4.`,
  },
  Acceleration: {
    showIf: (formState: FormState): boolean =>
      ShowAccelerationOnTypes.includes(formState.encodingMode) &&
      formState.enabled,
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
  RemoteSync: {
    showIf: (formState: FormState): boolean =>
      ShowAccelerationOnTypes.includes(formState.encodingMode) &&
      formState.enabled,
    block: Block.Encoder,
    key: "remoteSync",
    type: SectionType.Value,
    section: 8,
    colspan: 2,
    component: FormInputComponent.Toggle,
    label: "Remote sync",
    helpText: `Used only when continuous CC (7-bit and 14-bit) or pitch bend MIDI messages are used.
    If enabled, CC/pitch bend value received via MIDI IN will be applied internally to the encoder with same MIDI ID and MIDI channel,
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
          component: DeviceGrid,
          props: {
            block: Block.Encoder,
            routeName: "device-encoders-form",
          },
        },
        {
          path: "encoders/:index",
          name: "device-encoders-form",
          component: DeviceForm,
          props: {
            block: Block.Encoder,
            gridCols: 4, // Use a 4 column grid on large screens
          },
        },
      ],
    },
  ],
};
