import "./main.css";
import { createApp } from "vue";
import router from "./router";
import App from "./components/App.vue";

import Icon from "./components/elements/Icon.vue";
import Heading from "./components/elements/Heading.vue";
import Section from "./components/elements/Section.vue";
import Spinner from "./components/icons/Spinner.vue";
import FormField from "./components/form/FormField.vue";

const app = createApp(App);

app.component("Icon", Icon);
app.component("Heading", Heading);
app.component("Section", Section);
app.component("FormField", FormField);
app.component("Spinner", Spinner);

app.use(router);
app.mount("#app");
