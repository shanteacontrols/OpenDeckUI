import "./themes/dark/index.css";
import { createApp } from "vue";
import router from "./router";
import App from "./components/App.vue";

import Icon from "./components/elements/Icon.vue";
import Chevron from "./components/icons/Chevron.vue";
import Hero from "./components/elements/Hero.vue";
import Button from "./components/elements/Button.vue";
import ButtonLink from "./components/elements/ButtonLink.vue";
import Section from "./components/elements/Section.vue";
import Spinner from "./components/elements/Spinner.vue";
import Siblinks from "./components/elements/Siblinks.vue";
import SpinnerOverlay from "./components/elements/SpinnerOverlay.vue";
import FormField from "./components/form/FormField.vue";
import FormToggle from "./components/form/FormToggle.vue";

const app = createApp(App);

app.component("Icon", Icon);
app.component("Hero", Hero);
app.component("Section", Section);
app.component("FormField", FormField);
app.component("Spinner", Spinner);
app.component("Siblinks", Siblinks);
app.component("Chevron", Chevron);
app.component("SpinnerOverlay", SpinnerOverlay);
app.component("Button", Button);
app.component("ButtonLink", ButtonLink);
app.component("FormToggle", FormToggle);

app.use(router);
app.mount("#app");
