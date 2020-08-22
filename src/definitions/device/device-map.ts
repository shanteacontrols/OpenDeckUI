import { BlockRoutes } from "../block";
import Device from "./Device.vue";
import DeviceSelect from "./DeviceSelect.vue";

export const DeviceRoutes = [
  {
    name: "home",
    path: "/",
    component: DeviceSelect,
  },
  {
    path: "/device/:outputId",
    name: "device",
    component: Device,
    redirect: { name: "device-global" },
    children: BlockRoutes,
  },
];
