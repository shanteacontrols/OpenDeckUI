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
  InvertApds9960GestureX: {
    showIf: (formState: FormState): boolean =>
      formState.apds9960ProximityGestureMode === 2,
    block: Block.Display,
    key: "invertApds9960GestureX",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Invert left/right gestures",
    helpText: `Swaps APDS9960 left and right gesture OSC output.`,
  },
  InvertApds9960GestureY: {
    showIf: (formState: FormState): boolean =>
      formState.apds9960ProximityGestureMode === 2,
    block: Block.Display,
    key: "invertApds9960GestureY",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "Invert up/down gestures",
    helpText: `Swaps APDS9960 up and down gesture OSC output.`,
  },
  EnableApds9960AmbientLight: {
    block: Block.Display,
    key: "enableApds9960AmbientLight",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 3,
    component: FormInputComponent.Toggle,
    label: "Ambient light",
    helpText: `Enables or disables APDS9960 ambient light OSC output.`,
  },
  EnableApds9960Rgb: {
    block: Block.Display,
    key: "enableApds9960Rgb",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 4,
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
    settingIndex: 5,
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
    settingIndex: 6,
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
    settingIndex: 7,
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
    settingIndex: 8,
    component: FormInputComponent.Input,
    min: 0,
    max: 255,
    label: "Upper proximity value",
    helpText: `Raw APDS9960 proximity value that maps to OSC value 255.`,
  },
  EnableBno085Quaternion: {
    block: Block.Display,
    key: "enableBno085Quaternion",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Quaternion",
    helpText: `Enables or disables BNO085 quaternion OSC output.`,
  },
  EnableBno085Euler: {
    block: Block.Display,
    key: "enableBno085Euler",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Euler",
    helpText: `Enables or disables BNO085 Euler angle OSC output.`,
  },
  EnableBno085Gyroscope: {
    block: Block.Display,
    key: "enableBno085Gyroscope",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "Gyroscope",
    helpText: `Enables or disables BNO085 gyroscope OSC output.`,
  },
  EnableBno085LinearAcceleration: {
    block: Block.Display,
    key: "enableBno085LinearAcceleration",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 3,
    component: FormInputComponent.Toggle,
    label: "Linear acceleration",
    helpText: `Enables or disables BNO085 linear acceleration OSC output.`,
  },
  EnableBno085Gravity: {
    block: Block.Display,
    key: "enableBno085Gravity",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 4,
    component: FormInputComponent.Toggle,
    label: "Gravity",
    helpText: `Enables or disables BNO085 gravity OSC output.`,
  },
  Bno085Smoothing: {
    showIf: (formState: FormState): boolean =>
      formState.enableBno085Quaternion ||
      formState.enableBno085Euler ||
      formState.enableBno085Gyroscope ||
      formState.enableBno085LinearAcceleration ||
      formState.enableBno085Gravity,
    block: Block.Display,
    key: "bno085Smoothing",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 5,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Off",
      },
      {
        value: 1,
        text: "Light",
      },
      {
        value: 2,
        text: "Medium",
      },
      {
        value: 3,
        text: "Heavy",
      },
    ],
    label: "Smoothing",
    helpText: `Applies IMU output smoothing before OSC values are published.`,
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
  EnableVl53l4cxDistanceMm: {
    block: Block.Display,
    key: "enableVl53l4cxDistanceMm",
    type: SectionType.Setting,
    section: 4,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Distance mm",
    helpText: `Publishes raw VL53L4CX distance readings in millimeters.`,
  },
  EnableVl53l4cxDistanceNorm: {
    block: Block.Display,
    key: "enableVl53l4cxDistanceNorm",
    type: SectionType.Setting,
    section: 4,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Distance normalized",
    helpText: `Publishes calibrated VL53L4CX distance readings as normalized OSC values.`,
  },
  Vl53l4cxTrackingArea: {
    showIf: (formState: FormState): boolean =>
      formState.enableVl53l4cxDistanceMm ||
      formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxTrackingArea",
    type: SectionType.Setting,
    section: 4,
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
      formState.enableVl53l4cxDistanceMm ||
      formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxResponse",
    type: SectionType.Setting,
    section: 4,
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
      formState.enableVl53l4cxDistanceMm ||
      formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxDistanceMode",
    type: SectionType.Setting,
    section: 4,
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
    showIf: (formState: FormState): boolean =>
      formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxDistanceLowerValue",
    type: SectionType.Setting,
    section: 4,
    settingIndex: 5,
    component: FormInputComponent.Input,
    min: 0,
    max: 6000,
    label: "Distance normalized input min",
    helpText: `VL53L4CX reading in millimeters that maps to normalized OSC value 0.`,
  },
  Vl53l4cxDistanceUpperValue: {
    showIf: (formState: FormState): boolean =>
      formState.enableVl53l4cxDistanceNorm,
    block: Block.Display,
    key: "vl53l4cxDistanceUpperValue",
    type: SectionType.Setting,
    section: 4,
    settingIndex: 6,
    component: FormInputComponent.Input,
    min: 0,
    max: 6000,
    label: "Distance normalized input max",
    helpText: `VL53L4CX reading in millimeters that maps to normalized OSC value 1.`,
  },
  Vl53l5cxResolution: {
    block: Block.Display,
    key: "vl53l5cxResolution",
    type: SectionType.Setting,
    section: 5,
    settingIndex: 0,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "8x8",
      },
      {
        value: 1,
        text: "4x4",
      },
    ],
    label: "Resolution",
    helpText: `8x8 publishes a full 64-zone grid. 4x4 publishes fewer zones and can track faster motion.`,
  },
  Vl53l5cxSmoothing: {
    block: Block.Display,
    key: "vl53l5cxSmoothing",
    type: SectionType.Setting,
    section: 5,
    settingIndex: 1,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Off",
      },
      {
        value: 1,
        text: "Light",
      },
      {
        value: 2,
        text: "Medium",
      },
      {
        value: 3,
        text: "Heavy",
      },
    ],
    label: "Smoothing",
    helpText: `Applies per-zone distance smoothing and briefly holds invalid zones to reduce flicker.`,
  },
  Vl53l5cxOutputMode: {
    block: Block.Display,
    key: "vl53l5cxOutputMode",
    type: SectionType.Setting,
    section: 5,
    settingIndex: 2,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Disabled",
      },
      {
        value: 1,
        text: "Grid",
      },
      {
        value: 2,
        text: "Nearest",
      },
      {
        value: 3,
        text: "Centroid",
      },
      {
        value: 4,
        text: "Presence",
      },
    ],
    label: "Output mode",
    helpText: `Selects the OSC data shape published by the VL53L5CX sensor.`,
  },
  Vl53l5cxDistanceLowerValue: {
    block: Block.Display,
    key: "vl53l5cxDistanceLowerValue",
    type: SectionType.Setting,
    section: 5,
    settingIndex: 3,
    component: FormInputComponent.Input,
    min: 0,
    max: 4000,
    label: "Distance input min",
    helpText: `Readings below this distance in millimeters are ignored.`,
  },
  Vl53l5cxDistanceUpperValue: {
    block: Block.Display,
    key: "vl53l5cxDistanceUpperValue",
    type: SectionType.Setting,
    section: 5,
    settingIndex: 4,
    component: FormInputComponent.Input,
    min: 0,
    max: 4000,
    label: "Distance input max",
    helpText: `Readings above this distance in millimeters are ignored. Set to 0 to use the sensor maximum.`,
  },
  Vl53l5cxInvertX: {
    block: Block.Display,
    key: "vl53l5cxInvertX",
    type: SectionType.Setting,
    section: 5,
    settingIndex: 5,
    component: FormInputComponent.Toggle,
    label: "Invert X",
    helpText: `Mirrors VL53L5CX OSC output horizontally.`,
  },
  Vl53l5cxInvertY: {
    block: Block.Display,
    key: "vl53l5cxInvertY",
    type: SectionType.Setting,
    section: 5,
    settingIndex: 6,
    component: FormInputComponent.Toggle,
    label: "Invert Y",
    helpText: `Mirrors VL53L5CX OSC output vertically.`,
  },
  Vl53l5cxRotation: {
    block: Block.Display,
    key: "vl53l5cxRotation",
    type: SectionType.Setting,
    section: 5,
    settingIndex: 7,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "0 degrees",
      },
      {
        value: 1,
        text: "90 degrees",
      },
      {
        value: 2,
        text: "180 degrees",
      },
      {
        value: 3,
        text: "270 degrees",
      },
    ],
    label: "Rotation",
    helpText: `Rotates the VL53L5CX OSC output grid clockwise.`,
  },
  Vl53l5cxOutputRate: {
    block: Block.Display,
    key: "vl53l5cxOutputRate",
    type: SectionType.Setting,
    section: 5,
    settingIndex: 8,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Low",
      },
      {
        value: 1,
        text: "Normal",
      },
      {
        value: 2,
        text: "High",
      },
    ],
    label: "Output rate",
    helpText: `Limits how often VL53L5CX OSC packets are published.`,
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
