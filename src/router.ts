import { createRouter, createWebHistory } from "vue-router";
import { DeviceRoutes } from "./definitions/device";

const history = createWebHistory();
export const router = createRouter({
  history,
  routes: [...DeviceRoutes],
});

export default router;
