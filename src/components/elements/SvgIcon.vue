<template>
  <svg :stroke="stroke" :fill="fill" :viewBox="`0 0 ${size} ${size}`">
    <path
      :stroke-linecap="strokeLineJoin"
      :stroke-linejoin="strokeLineCap"
      :stroke-width="strokeWidth"
      :d="path"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SvgIcon",
  props: {
    size: {
      type: Number,
      default: 20,
    },
    stroke: {
      type: String,
      default: "currentColor",
    },
    strokeWidth: {
      type: Number,
      default: 1,
    },
    strokeLineCap: {
      type: String,
      default: "round",
    },
    strokeLineJoin: {
      type: String,
      default: "round",
    },
    fill: {
      type: String,
      default: "none",
    },
    path: {
      type: String,
      default:
        "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    },
  },
  setup() {
    return {};
  },
});
</script>
