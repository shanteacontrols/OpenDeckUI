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
  DeviceInfoOnStartup: {
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
    block: Block.Display,
    key: "alternateMidiNoteDisplay",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 4,
    component: FormInputComponent.Toggle,
    label: "Alternate MIDI note Display",
    helpText: `If enabled, MIDI note data will be displayed in note-key format (ie. C#4). If disabled, MIDI note number will be displayed instead.`,
  },
  Apds9960ProximityGestureMode: {
    block: Block.Display,
    key: "apds9960ProximityGestureMode",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 0,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Disabled",
      },
      {
        value: 1,
        text: "Proximity",
      },
      {
        value: 2,
        text: "Gesture",
      },
    ],
    label: "Proximity/gesture mode",
    helpText: `Selects the APDS9960 proximity or gesture OSC output mode. These modes cannot be active at the same time.`,
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
  Apds9960ProximityGain: {
    showIf: (formState: FormState): boolean =>
      formState.apds9960ProximityGestureMode !== 0,
    block: Block.Display,
    key: "apds9960ProximityGain",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 3,
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
    settingIndex: 4,
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
  Apds9960ProximityLowerValue: {
    showIf: (formState: FormState): boolean =>
      formState.apds9960ProximityGestureMode !== 0,
    block: Block.Display,
    key: "apds9960ProximityLowerValue",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 5,
    component: FormInputComponent.Input,
    min: 0,
    max: 255,
    label: "Lower proximity value",
    helpText: `Raw APDS9960 proximity value that maps to OSC value 0.`,
  },
  Apds9960ProximityUpperValue: {
    showIf: (formState: FormState): boolean =>
      formState.apds9960ProximityGestureMode !== 0,
    block: Block.Display,
    key: "apds9960ProximityUpperValue",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 6,
    component: FormInputComponent.Input,
    min: 0,
    max: 255,
    label: "Upper proximity value",
    helpText: `Raw APDS9960 proximity value that maps to OSC value 255.`,
  },
  EnableVl53l4cxDistanceMm: {
    block: Block.Display,
    key: "enableVl53l4cxDistanceMm",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Distance mm",
    helpText: `Publishes raw VL53L4CX distance readings in millimeters.`,
  },
  EnableVl53l4cxDistanceNorm: {
    block: Block.Display,
    key: "enableVl53l4cxDistanceNorm",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Distance normalized",
    helpText: `Publishes calibrated VL53L4CX distance readings as normalized OSC values.`,
  },
  Vl53l4cxTrackingArea: {
    showIf: (formState: FormState): boolean =>
      formState.enableVl53l4cxDistanceMm || formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxTrackingArea",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 2,
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
    showIf: (formState: FormState): boolean =>
      formState.enableVl53l4cxDistanceMm || formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxResponse",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 3,
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
    showIf: (formState: FormState): boolean =>
      formState.enableVl53l4cxDistanceMm || formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxDistanceMode",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 4,
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
  Vl53l4cxDistanceLowerValue: {
    showIf: (formState: FormState): boolean => formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxDistanceLowerValue",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 5,
    component: FormInputComponent.Input,
    min: 0,
    max: 6000,
    label: "Distance normalized input min",
    helpText: `VL53L4CX reading in millimeters that maps to normalized OSC value 0.`,
  },
  Vl53l4cxDistanceUpperValue: {
    showIf: (formState: FormState): boolean => formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxDistanceUpperValue",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 6,
    component: FormInputComponent.Input,
    min: 0,
    max: 6000,
    label: "Distance normalized input max",
    helpText: `VL53L4CX reading in millimeters that maps to normalized OSC value 1.`,
  },
  Cap1188Sensitivity: {
    block: Block.Display,
    key: "cap1188Sensitivity",
    type: SectionType.Setting,
    section: 3,
    settingIndex: 0,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Low",
      },
      {
        value: 1,
        text: "Medium",
      },
      {
        value: 2,
        text: "High",
      },
    ],
    label: "Sensitivity",
    helpText: `Higher sensitivity detects lighter touches but can react more easily to noise.`,
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
