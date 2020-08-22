<template>
  <router-link
    v-if="total && current > 0"
    class="ml-6"
    :class="{
      'cursor-pointer': current > 0,
      'yellow-700': current === 0,
    }"
    :to="{ params: { ...params, [paramKey]: current - 1 } }"
  >
    <Chevron type="left" class="inline fill-current h-6 w-6" />
    <small>previous</small>
  </router-link>

  <router-link
    v-if="total && current < total - 1"
    class="ml-6"
    :class="{
      'cursor-pointer': current < total,
      'yellow-700': current === total - 1,
    }"
    :to="{ params: { ...params, [paramKey]: current + 1 } }"
  >
    <small>next</small>
    <Chevron type="right" class="inline fill-current h-6 w-6" />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Siblinks",
  props: {
    current: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    paramKey: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      default: undefined,
    },
  },
});
</script>
