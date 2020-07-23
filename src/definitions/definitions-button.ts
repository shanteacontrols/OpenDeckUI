import { IBlockDefinition, FormInputComponent, DefinitionType } from ".";

export const defaultButtonData: Dictionary<number> = {
  midiType: (null as unknown) as number,
  midiMessage: (null as unknown) as number,
  midiChannel: (null as unknown) as number,
  midiId: (null as unknown) as number,
  onVelocity: (null as unknown) as number,
};

export const ButtonSectionDefinitions: Dictionary<IBlockDefinition> = {
  MidiType: {
    key: "midiType",
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
      default.`,
  },
  MidiMessage: {
    key: "midiMessage",
    type: DefinitionType.ComponentValue,
    section: 1,
    component: FormInputComponent.Select,
    options: [
      { value: 0, text: "Note" },
      { value: 1, text: "Program Change" },
      { value: 14, text: "Program Change Inc" },
      { value: 15, text: "Program Change Dec" },
      { value: 2, text: "CC" },
      { value: 3, text: "CC/0 Off" },
      { value: 4, text: "MMC Stop" },
      { value: 5, text: "MMC Play" },
      { value: 6, text: "MMC Record" },
      { value: 7, text: "MMC Pause" },
      { value: 8, text: "Real Time Clock" },
      { value: 9, text: "Real Time Start" },
      { value: 10, text: "Real Time Continue" },
      { value: 11, text: "Real Time Stop" },
      { value: 12, text: "Real Time Active Sensing" },
      { value: 13, text: "Real Time System Reset" },
      { value: 16, text: "None" },
      { value: 17, text: "Preset Change" },
      { value: 18, text: "Multi Value IncReset Note" },
      { value: 19, text: "Multi Value IncDec Note" },
      { value: 20, text: "Multi Value IncReset CC" },
      { value: 21, text: "Multi Value IncDec CC" },
    ],
    label: "MIDI message",
    helpText: `Specifies which MIDI message the buttons send. Default option
      is Note. If Program Change message is selected, button will send
      program change event on successive presses (momentary/latching modes
      are ignored`,
  },
  // @TODO: remove this field?
  MidiId: {
    key: "midiId",
    type: DefinitionType.ComponentValue,
    section: 2,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "MIDI ID",
    helpText: "Denotes note/program change MIDI number",
  },
  OnVelocity: {
    key: "onVelocity",
    type: DefinitionType.ComponentValue,
    section: 3,
    component: FormInputComponent.Input,
    min: 1,
    max: 127,
    label: "On velocity",
    helpText: "Velocity button sends when it's pressed.",
  },
  MidiChannel: {
    key: "midiChannel",
    type: DefinitionType.ComponentValue,
    section: 4,
    min: 1,
    max: 16,
    component: FormInputComponent.Input,
    label: "MIDI channel",
    helpText: "MIDI channel for current component.",
  },
};
