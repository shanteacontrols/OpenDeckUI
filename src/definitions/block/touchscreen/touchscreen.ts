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
    key: "enabled",
    type: SectionType.Value,
    section: 0,
    component: FormInputComponent.Toggle,
    label: "Enabled",
    helpText: ``,
  },
};

export const TouchscreenBlock: IBlockDefinition = {
  block: Block.Touchscreen,
  title: "Touchscreen",
  routeName: "device-touchscreens",
  iconComponent: markRaw(TouchscreenIcon),
  componentCountResponseIndex: 1,
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
            settingsTitle: "Touchscreen Global",
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
