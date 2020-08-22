<template>
  <ButtonLink
    :to="{
      name: routeName,
      params: {
        outputId,
        index: index,
      },
    }"
    :class="{
      'btn-highlight': isHighlighted,
    }"
  >
    <slot name="default"></slot>
  </ButtonLink>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { Block } from "./../../definitions";
import { useHighlightAnimation } from "./../../composables/use-highlight-animation";

export default defineComponent({
  name: "DeviceGrid",
  props: {
    index: {
      required: true,
      type: Number,
    },
    outputId: {
      required: true,
      type: String,
    },
    routeName: {
      required: true,
      type: String,
    },
    block: {
      required: true,
      type: String as () => Block,
    },
    highlight: {
      default: null,
      type: Number, // abs time in ms
    },
  },
  setup(props) {
    const { highlight } = toRefs(props);

    return {
      ...useHighlightAnimation(highlight),
    };
  },
});
</script>
