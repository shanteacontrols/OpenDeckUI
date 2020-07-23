import { IBlockDefinition, FormInputComponent, DefinitionType } from ".";

export const defaultDisplayData: Dictionary<number> = {
  enableDisplay: (null as unknown) as number,
  displayController: (null as unknown) as number,
  displayResolution: (null as unknown) as number,
  i2CAddress: (null as unknown) as number,
  welcomeMessage: (null as unknown) as number,
  showVersionsOnStartup: (null as unknown) as number,
  alternateMidiNoteDisplay: (null as unknown) as number,
  midiEventRetentionTime: (null as unknown) as number,
  octaveNormalizationValue: (null as unknown) as number,
};

export const DisplayDefinitions: Dictionary<IBlockDefinition> = {
  // Features
  EnableDisplay: {
    key: "enableDisplay",
    type: DefinitionType.Setting,
    section: 0,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Enable display",
    helpText: `Enables or disables display.`,
  },
  DisplayController: {
    key: "displayController",
    type: DefinitionType.Setting,
    section: 1,
    settingIndex: 0,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Invalid",
      },
      {
        value: 1,
        text: "SSD1306",
      },
    ],
    label: "Display controller",
    helpText: ``,
  },
  DisplayResolution: {
    key: "displayResolution",
    type: DefinitionType.Setting,
    section: 1,
    settingIndex: 1,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Invalid",
      },
      {
        value: 1,
        text: "128x64",
      },
      {
        value: 2,
        text: "128x32",
      },
    ],
    label: "Display resolution",
    helpText: ``,
  },
  I2CAddress: {
    key: "i2CAddress",
    type: DefinitionType.Setting,
    section: 1,
    settingIndex: 4,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "0",
      },
      {
        value: 1,
        text: "0X78",
      },
      {
        value: 2,
        text: "0X7A",
      },
    ],
    label: "I2C address.",
    helpText: ``,
  },
  WelcomeMessage: {
    key: "welcomeMessage",
    type: DefinitionType.Setting,
    section: 0,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Welcome Message",
    helpText: `Enable or disable welcome message on display when the board is powered on.`,
  },
  ShowVersionsOnStartup: {
    key: "showVersionsOnStartup",
    type: DefinitionType.Setting,
    section: 0,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "Version info on startup",
    helpText: `Enable or disable version info on display when the board is powered on. This info is shown after welcome message.`,
  },
  AlternateMidiNoteDisplay: {
    key: "alternateMidiNoteDisplay",
    type: DefinitionType.Setting,
    section: 0,
    settingIndex: 3,
    component: FormInputComponent.Toggle,
    label: "Alternate MIDI note Display",
    helpText: `If enabled, MIDI note data will be displayed like C#4, where the number represents octave. If disabled, MIDI note number will be displayed instead.`,
  },
  MidiEventRetentionTime: {
    key: "midiEventRetentionTime",
    type: DefinitionType.Setting,
    section: 1,
    settingIndex: 2,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "0",
      },
      {
        value: 1,
        text: "1",
      },
      {
        value: 2,
        text: "2",
      },
      {
        value: 3,
        text: "3",
      },
      {
        value: 4,
        text: "4",
      },
      {
        value: 5,
        text: "5",
      },
    ],
    label: "MIDI event time",
    helpText: `Timeout after which any message on display will be cleared (if data retention option is disabled).`,
  },
  OctaveNormalizationValue: {
    key: "octaveNormalizationValue",
    type: DefinitionType.Setting,
    section: 1,
    settingIndex: 3,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "Octave normalization value",
    helpText: ``,
  },
};
