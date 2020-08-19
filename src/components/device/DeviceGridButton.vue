<template>
  <ButtonLink
    :class="{
      'btn-yellow': isHighlighted,
    }"
    :to="{
      name: routeName,
      params: {
        outputId,
        componentIndex: index,
      },
    }"
  >
    <slot name="default"></slot>
  </ButtonLink>
</template>

<script lang="ts">
import { defineComponent, computed, ref, toRefs } from "vue";
import { Theme, Block } from "./../../definitions";
import { delay } from "./../../util";

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
    const refreshDelay = 10;
    const retainHighlightMs = 250;
    const { highlight } = toRefs(props);
    const now = ref(null);
    const update = () => (now.value = new Date().getTime());

    const isHighlighted = computed(() => {
      const val =
        highlight.value && now.value - highlight.value < retainHighlightMs;
      if (val) {
        delay(refreshDelay).then(update);
      }
      return val;
    });

    return {
      isHighlighted,
      Theme,
    };
  },
});
</script>
