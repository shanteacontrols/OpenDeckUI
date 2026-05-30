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
  EnableApds9960Proximity: {
    block: Block.Display,
    key: "enableApds9960Proximity",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Proximity",
    helpText: `Enables or disables APDS9960 proximity OSC output.`,
  },
  EnableApds9960AmbientLight: {
    block: Block.Display,
    key: "enableApds9960AmbientLight",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Ambient light",
    helpText: `Enables or disables APDS9960 ambient light OSC output.`,
  },
  EnableApds9960Rgb: {
    block: Block.Display,
    key: "enableApds9960Rgb",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "RGB",
    helpText: `Enables or disables APDS9960 RGB OSC output.`,
  },
  EnableApds9960Gesture: {
    block: Block.Display,
    key: "enableApds9960Gesture",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 3,
    component: FormInputComponent.Toggle,
    label: "Gesture",
    helpText: `Enables or disables APDS9960 gesture OSC output.`,
  },
  Apds9960ProximityGain: {
    showIf: (formState: FormState): boolean =>
      formState.enableApds9960Proximity || formState.enableApds9960Gesture,
    block: Block.Display,
    key: "apds9960ProximityGain",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 4,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "1x",
      },
      {
        value: 1,
        text: "2x",
      },
      {
        value: 2,
        text: "4x",
      },
      {
        value: 3,
        text: "8x",
      },
    ],
    label: "Proximity gain",
    helpText: `Affects proximity OSC values and gesture start detection; higher gain keeps proximity values higher farther out.`,
  },
  Apds9960AlsGain: {
    showIf: (formState: FormState): boolean =>
      formState.enableApds9960AmbientLight || formState.enableApds9960Rgb,
    block: Block.Display,
    key: "apds9960AlsGain",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 5,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "1x",
      },
      {
        value: 1,
        text: "4x",
      },
      {
        value: 2,
        text: "16x",
      },
      {
        value: 3,
        text: "64x",
      },
    ],
    label: "Ambient/RGB gain",
    helpText: `Higher gain makes ambient light and RGB values larger; lower gain keeps bright readings from maxing out.`,
  },
  EnableVl53l4cxDistance: {
    block: Block.Display,
    key: "enableVl53l4cxDistance",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Distance",
    helpText: `Enables or disables VL53L4CX distance output.`,
  },
  Vl53l4cxTrackingArea: {
    showIf: (formState: FormState): boolean => formState.enableVl53l4cxDistance,
    block: Block.Display,
    key: "vl53l4cxTrackingArea",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 1,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Narrow",
      },
      {
        value: 1,
        text: "Medium",
      },
      {
        value: 2,
        text: "Wide",
      },
      {
        value: 3,
        text: "Full",
      },
    ],
    label: "Tracking area",
    helpText: `Smaller areas focus on the center; larger areas watch more of the sensor view.`,
  },
  Vl53l4cxResponse: {
    showIf: (formState: FormState): boolean => formState.enableVl53l4cxDistance,
    block: Block.Display,
    key: "vl53l4cxResponse",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 2,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Fast",
      },
      {
        value: 1,
        text: "Balanced",
      },
      {
        value: 2,
        text: "Stable",
      },
    ],
    label: "Response",
    helpText: `Fast updates more often; Stable spends longer measuring before each distance value.`,
  },
  Vl53l4cxDistanceMode: {
    showIf: (formState: FormState): boolean => formState.enableVl53l4cxDistance,
    block: Block.Display,
    key: "vl53l4cxDistanceMode",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 3,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Medium",
      },
      {
        value: 1,
        text: "Long",
      },
    ],
    label: "Distance mode",
    helpText: `Medium is the normal range mode; Long is tuned for farther targets.`,
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
