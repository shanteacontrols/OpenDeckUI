import { markRaw } from "vue";
import {
  ISectionDefinition,
  FormInputComponent,
  SectionType,
  Block,
} from "../../interface";

import RouteWrapper from "../../../components/RouteWrapper.vue";
import DeviceGridWithSettings from "../../device/DeviceGridWithSettings.vue";
import DeviceForm from "../../device/DeviceForm.vue";
import TouchscreenIcon from "./TouchscreenIcon.vue";

const sections: Dictionary<ISectionDefinition> = {
  Enabled: {
    block: Block.Touchscreen,
    key: "enableTouchscreen",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Enable",
    helpText: `Enables or disables the usage of touchscreen.`,
  },
  DisplayManufacturer: {
    showIf: (formState: FormState): boolean => formState.enableTouchscreen,
    block: Block.Touchscreen,
    key: "touchscreenManufacturer",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 1,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "Nextion",
      },
      {
        value: 1,
        text: "Viewtech/Stone HMI",
      },
    ],
    label: "Touchscreen manufacturer",
    helpText: ``,
  },
  XPosition: {
    block: Block.Touchscreen,
    key: "xPosition",
    type: SectionType.Value,
    section: 1,
    min: 0,
    max: 1023,
    component: FormInputComponent.Input,
    label: "X position of this icon",
    helpText: `Specifies X coordinate on touchscreen where this icon is located. Touchscreen resolution
    needs to be taken into account here.`,
  },
  YPosition: {
    block: Block.Touchscreen,
    key: "yPosition",
    type: SectionType.Value,
    section: 2,
    min: 0,
    max: 639,
    component: FormInputComponent.Input,
    label: "Y position of this icon",
    helpText: `Specifies Y coordinate on touchscreen where this icon is located. Touchscreen resolution
    needs to be taken into account here.`,
  },
  Width: {
    block: Block.Touchscreen,
    key: "width",
    type: SectionType.Value,
    section: 3,
    min: 0,
    max: 1023,
    component: FormInputComponent.Input,
    label: "Width of this icon",
    helpText: `Specifies width of this icon. Touchscreen resolution
    needs to be taken into account here.`,
  },
  Height: {
    block: Block.Touchscreen,
    key: "height",
    type: SectionType.Value,
    section: 4,
    min: 0,
    max: 639,
    component: FormInputComponent.Input,
    label: "Height of this icon",
    helpText: `Specifies height of this icon. Touchscreen resolution
    needs to be taken into account here.`,
  },
  ScreenOn: {
    block: Block.Touchscreen,
    key: "screenOn",
    type: SectionType.Value,
    section: 5,
    min: 0,
    max: 15,
    component: FormInputComponent.Input,
    label: "Screen index of this icon in on state",
    helpText: `Specifies screen on which this icon in on state is located.`,
  },
  ScreenOff: {
    block: Block.Touchscreen,
    key: "screenOff",
    type: SectionType.Value,
    section: 6,
    min: 0,
    max: 15,
    component: FormInputComponent.Input,
    label: "Screen index of this icon in off state",
    helpText: `Specifies screen on which this icon in off state is located.`,
  },
  ButtonChangesScreen: {
    block: Block.Touchscreen,
    key: "buttonChangesScreen",
    type: SectionType.Value,
    section: 7,
    component: FormInputComponent.Toggle,
    label: "Button changes screen",
    helpText: `Specifies whether this button is used to switch to another screen.`,
  },
  ScreenToSwitchTo: {
    showIf: (formState: FormState): boolean => !!formState.buttonChangesScreen,
    block: Block.Touchscreen,
    key: "screenToSwitchTo",
    type: SectionType.Value,
    section: 8,
    min: 0,
    max: 15,
    component: FormInputComponent.Input,
    label: "Screen to switch to",
    helpText: `Screen to which this button switches to.`,
  },
};

export const TouchscreenBlock: IBlockDefinition = {
  block: Block.Touchscreen,
  title: "Touchscreen",
  routeName: "device-touchscreens",
  iconComponent: markRaw(TouchscreenIcon),
  componentCountResponseIndex: 4,
  sections,
  routes: [
    {
      path: "touchscreens",
      name: "device-touchscreens",
      component: RouteWrapper,
      redirect: { name: "device-touchscreens-list" },
      children: [
        {
          path: "list",
          name: "device-touchscreens-list",
          component: DeviceGridWithSettings,
          props: {
            block: Block.Touchscreen,
            routeName: "device-touchscreens-form",
            settingsTitle: "",
          },
        },
        {
          path: "touchscreens/:index",
          name: "device-touchscreens-form",
          component: DeviceForm,
          props: {
            block: Block.Touchscreen,
            gridCols: 4, // Use a 4 column grid on large screens
          },
        },
      ],
    },
  ],
};
