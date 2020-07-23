<template>
  <component :is="element">
    <slot name="default"></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface IPreset {
  element: string;
  className: string;
}

const presets: Dictionary<IPreset> = {
  "section-title": {
    element: "h3",
    className: "",
  },
};

export default defineComponent({
  name: "Heading",
  props: {
    preset: {
      type: String,
      default: "section-title",
      validator: (val: string) => Object.keys(presets).includes(val),
    },
  },
  setup(props) {
    const preset = presets[props.preset];
    const { element, className } = preset;

    return {
      className,
      element,
    };
  },
});
</script>
