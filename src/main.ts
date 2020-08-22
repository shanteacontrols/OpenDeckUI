import "./themes/dark/index.css";
import { createApp } from "vue";
import router from "./router";
import appComponents from "./components/app-components";
import deviceComponents from "./definitions/device/device-components";
import App from "./components/App.vue";

type IComponentMap = Record<string, any>;

const registerComponentMap = (componentMap: IComponentMap) =>
  Object.keys(componentMap).forEach((key) => {
    app.component(key, componentMap[key]);
  });

const app = createApp(App);

registerComponentMap(appComponents);
registerComponentMap(deviceComponents);

app.use(router);
app.mount("#app");
