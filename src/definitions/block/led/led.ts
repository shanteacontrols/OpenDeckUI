import { markRaw } from "vue";
import {
  ISectionDefinition,
  FormInputComponent,
  SectionType,
  Block,
} from "../../interface";

import DeviceForm from "../../device/DeviceForm.vue";
import DeviceGridWithSettings from "../../device/DeviceGridWithSettings.vue";
import RouteWrapper from "../../../components/RouteWrapper.vue";
import LedIcon from "./LedIcon.vue";

export const sections: Dictionary<ISectionDefinition> = {
  // Settings definitions
  BlinkWithMidiClock: {
    block: Block.Led,
    key: "blinkWithMidiClock",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Blink with MIDI clock",
    helpText: `Enables or disables LED blinking via MIDI clock. When enabled, MIDI clock is used to toggle LED state. Otherwise, internal timer is used.`,
  },
  FadeSpeed: {
    key: "fadeSpeed",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 1,
    component: FormInputComponent.Select,
    options: [
      { value: 0, text: "Off" },
      { value: 1, text: "On - speed 1" },
      { value: 2, text: "On - speed 2" },
      { value: 3, text: "On - speed 3" },
      { value: 4, text: "On - speed 4" },
      { value: 5, text: "On - speed 5" },
      { value: 6, text: "On - speed 6" },
      { value: 7, text: "On - speed 7" },
      { value: 8, text: "On - speed 8" },
      { value: 9, text: "On - speed 9" },
      { value: 10, text: "On - speed 10" },
    ],
    label: "Fade speed",
    helpText: `Speed at which LEDs transition between on and off state. Default value is 0, which means fading is disabled.`,
    block: Block.Led,
  },
  StartupAnimation: {
    key: "startupAnimation",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "Start-up animation",
    helpText: `Enables or disables LED animation when the device is powered on.`,
    block: Block.Led,
  },
  // Component definitions
  LedColorTesting: {
    key: "ledColorTesting",
    type: SectionType.Value,
    section: 0,
    component: FormInputComponent.Select,
    options: [
      { value: 0, text: "Off (no color)" },
      { value: 1, text: "Red" },
      { value: 2, text: "Green" },
      { value: 3, text: "Yellow" },
      { value: 4, text: "Blue" },
      { value: 5, text: "Magenta" },
      { value: 6, text: "Cyan" },
      { value: 7, text: "White" },
    ],
    label: "LED color testing",
    helpText: ``,
    block: Block.Led,
  },
  ActivationNote: {
    key: "activationNote",
    type: SectionType.Value,
    section: 3,
    component: FormInputComponent.Input,
    min: 0,
    max: 127,
    label: "Activation Note",
    helpText: ``,
    block: Block.Led,
  },
  RGBEnable: {
    key: "rgbEnable",
    type: SectionType.Value,
    section: 4,
    component: FormInputComponent.Toggle,
    label: "RGB Enable",
    helpText: ``,
    block: Block.Led,
  },
  ControlType: {
    key: "controlType",
    type: SectionType.Value,
    section: 5,
    component: FormInputComponent.Select,
    options: [
      { value: 0, text: "MIDI in / Note for LED state, CC for LED blinking" },
      { value: 1, text: "Local / Note for LED state, no blinking" },
      { value: 2, text: "MIDI in / CC for LED state, Note for LED blinking" },
      { value: 3, text: "Local / CC for LED state, no blinking" },
      { value: 4, text: "MIDI in / Program change for LED state, no blinking" },
      { value: 5, text: "Local / Program change for LED state, no blinking" },
      { value: 6, text: "MIDI in / Note for LED state and LED blinking" },
      { value: 7, text: "Local / Note for LED state and LED blinking" },
      { value: 8, text: "MIDI in / CC for LED state and LED blinking" },
      { value: 9, text: "Local / CC for LED state and LED blinking" },
    ],
    label: "Control type",
    helpText: ``,
    block: Block.Led,
  },
  ActivationVelocity: {
    key: "activationVelocity",
    type: SectionType.Value,
    section: 6,
    component: FormInputComponent.Input,
    min: 1,
    max: 127,
    label: "Activation Velocity",
    helpText: "",
    block: Block.Led,
  },
  MidiChannel: {
    key: "midiChannel",
    type: SectionType.Value,
    section: 7,
    component: FormInputComponent.Input,
    min: 1,
    max: 16,
    label: "MIDI channel",
    helpText: "",
    block: Block.Led,
  },
};

export const LedBlock: IBlockDefinition = {
  block: Block.Led,
  title: "LED",
  routeName: "device-leds",
  iconComponent: markRaw(LedIcon),
  componentCountResponseIndex: 3,
  sections,
  routes: [
    {
      path: "leds",
      name: "device-leds",
      component: RouteWrapper,
      redirect: { name: "device-leds-list" },
      children: [
        {
          path: "list",
          name: "device-leds-list",
          component: DeviceGridWithSettings,
          props: {
            block: Block.Led,
            routeName: "device-leds-form",
          },
        },
        {
          path: "leds/:index",
          name: "device-leds-form",
          component: DeviceForm,
          props: {
            block: Block.Led,
          },
        },
      ],
    },
  ],
};
