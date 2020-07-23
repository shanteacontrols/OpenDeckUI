<template>
  <component :is="icons[icon]"></component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconAnalog from "./icons/IconAnalog.vue";
import IconButton from "./icons/IconButton.vue";
import IconEncoder from "./icons/IconEncoder.vue";
import IconLed from "./icons/IconLed.vue";
import IconDisplay from "./icons/IconDisplay.vue";
import IconGlobal from "./icons/IconGlobal.vue";

enum icons {
  analog = "IconAnalog",
  button = "IconButton",
  encoder = "IconEncoder",
  led = "IconLed",
  display = "IconDisplay",
  global = "IconGlobal",
}

// enum icons {
//   analog = "/icons/documents.svg",
//   button = "/icons/dial-pad.svg",
//   encoder = "/icons/sound-mix.svg",
//   led = "/icons/light-up.svg",
//   display = "/icons/documents.svg",
//   global = "/icons/shareable.svg",
// }

export default defineComponent({
  name: "Icon",
  props: {
    icon: {
      type: String,
      required: true,
      validator: (val: string) => Object.keys(icons).includes(val),
    },
  },
  setup() {
    return {
      icons,
    };
  },
  components: {
    IconAnalog,
    IconButton,
    IconEncoder,
    IconLed,
    IconDisplay,
    IconGlobal,
  },
});
</script>
