import { createRouter, createWebHashHistory } from "vue-router";
import { DeviceRoutes } from "./definitions/device";

const history = createWebHashHistory();
export const router = createRouter({
  history,
  routes: [...DeviceRoutes],
});

export default router;
