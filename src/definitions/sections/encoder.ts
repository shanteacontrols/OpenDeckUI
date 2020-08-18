import {
  IBlockDefinition,
  FormInputComponent,
  DefinitionType,
} from "../device";
import { Block } from "../constants";

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

export const ShowAccelerationOnTypes = [
  EncodingMode.Pitchbend,
  EncodingMode.ControlchangeContinuous7,
  EncodingMode.ControlchangeContinuous14,
  EncodingMode.NRPN6,
  EncodingMode.NRPN7,
];

export const defaultEncoderData: Dictionary<number> = {
  enabled: (null as unknown) as number,
  invertState: (null as unknown) as number,
  encodingMode: (null as unknown) as number,
  midiIdLSB: (null as unknown) as number,
  midiChannel: (null as unknown) as number,
  pulsesPerStep: (null as unknown) as number,
  acceleration: (null as unknown) as number,
  midiIdMSB: (null as unknown) as number,
  remoteSync: (null as unknown) as number,
};

type FormState = typeof defaultEncoderData;

export const EncoderSectionDefinitions: Dictionary<IBlockDefinition> = {
  Enabled: {
    block: Block.Encoder,
    key: "enabled",
    type: DefinitionType.ComponentValue,
    section: 0,
    component: FormInputComponent.Toggle,
    label: "Enabled",
    helpText: `Enabling the encoder disables two digital inputs (buttons).`,
  },
  InvertState: {
    block: Block.Encoder,
    key: "invertState",
    type: DefinitionType.ComponentValue,
    section: 1,
    component: FormInputComponent.Toggle,
    label: "Invert",
    helpText: ``,
  },
  EncodingMode: {
    block: Block.Encoder,
    key: "encodingMode",
    type: DefinitionType.ComponentValue,
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
    type: DefinitionType.ComponentValue,
    section: 3,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "MIDI ID (LSB)",
    helpText: "",
  },
  MidiChannel: {
    block: Block.Encoder,
    key: "midiChannel",
    type: DefinitionType.ComponentValue,
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
    type: DefinitionType.ComponentValue,
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
    type: DefinitionType.ComponentValue,
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
    type: DefinitionType.ComponentValue,
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
    type: DefinitionType.ComponentValue,
    section: 8,
    component: FormInputComponent.Toggle,
    label: "Remote sync",
    helpText: `Used only in continuous CC mode or pitch bend mode.
    If enabled, CC/pitch bend value received via MIDI IN will be applied to the encoder with same MIDI ID and MIDI channel,
    so that next encoder turn increments or decrements received value instead of the last value it sent.`,
  },
};
