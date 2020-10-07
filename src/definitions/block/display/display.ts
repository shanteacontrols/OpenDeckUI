import { markRaw } from "vue";
import {
  ISectionDefinition,
  FormInputComponent,
  SectionType,
  Block,
} from "../../interface";

import DeviceSettings from "../../device/DeviceSettings.vue";
import DisplayIcon from "./DisplayIcon.vue";

export const sections: Dictionary<ISectionDefinition> = {
  // Features
  EnableDisplay: {
    block: Block.Display,
    key: "enableDisplay",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Enable",
    helpText: `Enables or disables the usage of small OLED/LCD displays.`,
  },
  WelcomeMessage: {
    showIf: (formState: FormState): boolean => formState.enableDisplay,
    block: Block.Display,
    key: "welcomeMessage",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Welcome Message",
    helpText: `Enable or disable welcome message on display when the device is powered on.`,
  },
  ShowVersionsOnStartup: {
    showIf: (formState: FormState): boolean => formState.enableDisplay,
    block: Block.Display,
    key: "showVersionsOnStartup",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "Version info on startup",
    helpText: `Enable or disable version info on display when the device is powered on. This info is shown after welcome message.`,
  },
  I2CAddress: {
    showIf: (formState: FormState): boolean => formState.enableDisplay,
    block: Block.Display,
    key: "i2CAddress",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 4,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Not specified",
      },
      {
        value: 120,
        text: "0x78 (120)",
      },
      {
        value: 122,
        text: "0x7A (122)",
      },
    ],
    label: "I2C address",
    helpText: ``,
  },
  DisplayController: {
    showIf: (formState: FormState): boolean => formState.enableDisplay,
    block: Block.Display,
    key: "displayController",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 0,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "None",
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
    showIf: (formState: FormState): boolean => formState.enableDisplay,
    block: Block.Display,
    key: "displayResolution",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 1,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "None",
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
  MidiEventRetentionTime: {
    showIf: (formState: FormState): boolean => formState.enableDisplay,
    block: Block.Display,
    key: "midiEventRetentionTime",
    type: SectionType.Setting,
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
    helpText: `Timeout after which any message on display will be cleared. If set to 0, message stays on display until new event occurs.`,
  },
  AlternateMidiNoteDisplay: {
    showIf: (formState: FormState): boolean => formState.enableDisplay,
    block: Block.Display,
    key: "alternateMidiNoteDisplay",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 3,
    component: FormInputComponent.Toggle,
    label: "Alternate MIDI note Display",
    helpText: `If enabled, MIDI note data will be displayed in note-key format (ie. C#4). If disabled, MIDI note number will be displayed instead.`,
  },
};

export const DisplayBlock: IBlockDefinition = {
  block: Block.Display,
  title: "Display",
  routeName: "device-displays",
  iconComponent: markRaw(DisplayIcon),
  sections,
  routes: [
    {
      name: "device-displays",
      path: "displays",
      component: DeviceSettings,
      props: {
        block: Block.Display,
        title: "",
      },
    },
  ],
};
