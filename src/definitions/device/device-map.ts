import { BlockRoutes } from "../block";
import BoardFlashDetails from "../firmware-flashing/BoardFlashDetails.vue";
import BoardFlashSelect from "../firmware-flashing/BoardFlashSelect.vue";
import Device from "./Device.vue";
import DeviceSelect from "./DeviceSelect.vue";

export const DeviceRoutes = [
  {
    name: "home",
    path: "/",
    component: DeviceSelect,
  },
  {
    name: "device-flashing",
    path: "/flash",
    component: BoardFlashSelect,
  },
  {
    name: "device-flashing-board",
    path: "/flash/:target",
    component: BoardFlashDetails,
  },
  {
    path: "/device/:outputId",
    name: "device",
    component: Device,
    redirect: { name: "device-global" },
    children: BlockRoutes,
  },
];
