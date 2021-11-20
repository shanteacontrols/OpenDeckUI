import { markRaw } from "vue";
import {
  ISectionDefinition,
  FormInputComponent,
  SectionType,
  Block,
} from "../../interface";

import I2CForm from "./I2CForm.vue";
import I2CIcon from "./I2CIcon.vue";

export const sections: Dictionary<ISectionDefinition> = {
  // Features
  EnableDisplay: {
    block: Block.Display,
    key: "enableDisplay",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 6,
    component: FormInputComponent.Toggle,
    label: "Enable",
    helpText: `Enables or disables the usage of small OLED/LCD displays.`,
  },
  DeviceInfoOnStartup: {
    showIf: (formState: FormState): boolean => formState.enableDisplay,
    block: Block.Display,
    key: "deviceInfoStartup",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Show device info on startup",
    helpText: `Enable or disable device info message on startup (firmware version and board name).`,
  },
  DisplayController: {
    showIf: (formState: FormState): boolean => formState.enableDisplay,
    block: Block.Display,
    key: "displayController",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 1,
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
    section: 0,
    settingIndex: 2,
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
    section: 0,
    settingIndex: 3,
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
    settingIndex: 4,
    component: FormInputComponent.Toggle,
    label: "Alternate MIDI note Display",
    helpText: `If enabled, MIDI note data will be displayed in note-key format (ie. C#4). If disabled, MIDI note number will be displayed instead.`,
  },
};

export const DisplayBlock: IBlockDefinition = {
  block: Block.Display,
  title: "I2C",
  routeName: "device-i2c",
  iconComponent: markRaw(I2CIcon),
  sections,
  routes: [
    {
      path: "i2c:",
      name: "device-i2c",
      component: I2CForm,
    },
  ],
};
