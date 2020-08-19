<template>
  <router-link :to="to" class="btn">
    <slot name="default"></slot>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ButtonLink",
  props: {
    to: {
      required: true,
      type: [Object, Boolean],
    },
  },
});
</script>
