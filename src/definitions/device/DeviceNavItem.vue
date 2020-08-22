<template>
  <router-link
    :to="{ name: routeName, params }"
    :class="{
      active,
      [routeName]: true,
      'btn-highlight': isHighlighted,
    }"
  >
    <span class="icon-wrapper">
      <component :is="iconComponent"></component>
      <span v-if="numberOfComponents[block]" class="icon-label">{{
        numberOfComponents[block]
      }}</span>
    </span>
    <span class="lg:inline-block text-sm label">
      {{ title }}
    </span>
    <br />
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { deviceStoreMapped, requestLogMapped } from "../../store";
import router from "../../router";
import { BlockMap } from "../../definitions";
import { useHighlightAnimation } from "./../../composables/use-highlight-animation";

const getLatestTimeInArray = (values: number[]): number => {
  let latest = null;
  Object.keys(values).forEach((index) => {
    latest = values[index] > latest ? values[index] : latest;
  });

  return latest;
};

export default defineComponent({
  name: "DeviceNavItem",
  props: {
    block: {
      type: Number,
      required: true,
    },
    params: {
      type: Object, // link params
      default: undefined,
    },
  },
  setup(props) {
    const { title, iconComponent, routeName } = BlockMap[props.block];
    const { numberOfComponents } = deviceStoreMapped;
    const { highlights } = requestLogMapped;

    const highlight = computed(() =>
      getLatestTimeInArray(highlights.value[props.block]),
    );
    const active = computed(() => {
      return router.currentRoute.value.matched.some(
        (r) => r.name === routeName,
      );
    });

    return {
      ...useHighlightAnimation(highlight),
      numberOfComponents,
      active,
      title,
      iconComponent,
      routeName,
    };
  },
});
</script>
