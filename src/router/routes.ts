import AppDeviceSelect from "../components/AppDeviceSelect.vue";
import Device from "../components/device/Device.vue";
import DeviceSectionGlobal from "../components/device/DeviceSectionGlobal.vue";
import DeviceSectionButtons from "../components/device/DeviceSectionButtons.vue";
import DeviceSectionButtonsForm from "../components/device/DeviceSectionButtonsForm.vue";
import DeviceSectionAnalogs from "../components/device/DeviceSectionAnalogs.vue";
import DeviceSectionAnalogsForm from "../components/device/DeviceSectionAnalogsForm.vue";
import DeviceSectionEncoders from "../components/device/DeviceSectionEncoders.vue";
import DeviceSectionEncodersForm from "../components/device/DeviceSectionEncodersForm.vue";
import DeviceSectionLeds from "../components/device/DeviceSectionLeds.vue";
import DeviceSectionLedsForm from "../components/device/DeviceSectionLedsForm.vue";
import DeviceSectionDisplays from "../components/device/DeviceSectionDisplays.vue";
import EmptyComponent from "../components/EmptyComponent.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: AppDeviceSelect,
  },
  {
    path: "/device/:inputId",
    name: "device",
    component: Device,
    redirect: { name: "device-global" },
    children: [
      {
        path: "",
        name: "device-global",
        component: DeviceSectionGlobal,
      },
      {
        path: "buttons",
        name: "device-buttons",
        component: EmptyComponent,
        redirect: { name: "device-buttons-list" },
        children: [
          {
            path: "list",
            name: "device-buttons-list",
            component: DeviceSectionButtons,
          },
          {
            path: "buttons/:componentIndex",
            name: "device-buttons-form",
            component: DeviceSectionButtonsForm,
          },
        ],
      },
      {
        path: "analogs",
        name: "device-analogs",
        component: EmptyComponent,
        redirect: { name: "device-analogs-list" },
        children: [
          {
            path: "list",
            name: "device-analogs-list",
            component: DeviceSectionAnalogs,
          },
          {
            path: "analogs/:componentIndex",
            name: "device-analogs-form",
            component: DeviceSectionAnalogsForm,
          },
        ],
      },
      {
        path: "encoders",
        name: "device-encoders",
        component: EmptyComponent,
        redirect: { name: "device-encoders-list" },
        children: [
          {
            path: "list",
            name: "device-encoders-list",
            component: DeviceSectionEncoders,
          },
          {
            path: "encoders/:componentIndex",
            name: "device-encoders-form",
            component: DeviceSectionEncodersForm,
          },
        ],
      },
      {
        path: "leds",
        name: "device-leds",
        component: EmptyComponent,
        redirect: { name: "device-leds-list" },
        children: [
          {
            path: "list",
            name: "device-leds-list",
            component: DeviceSectionLeds,
          },
          {
            path: "leds/:componentIndex",
            name: "device-leds-form",
            component: DeviceSectionLedsForm,
          },
        ],
      },
      {
        name: "device-displays",
        path: "displays",
        component: DeviceSectionDisplays,
      },
    ],
  },
];

export default routes;
