<template>
  <router-link
    :to="{ name: itemRef.name, params }"
    :class="{
      active: itemRef.active,
      [itemRef.name]: true,
      'btn-highlight': isHighlighted,
    }"
  >
    <span class="icon-wrapper">
      <Icon class="icon" :icon="itemRef.icon" />
      <span v-if="numberOfComponents[itemRef.block]" class="icon-label">{{
        numberOfComponents[itemRef.block]
      }}</span>
    </span>
    <span class="lg:inline-block text-sm label">
      {{ itemRef.title }}
    </span>
    <br />
  </router-link>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from "vue";
import { deviceStoreMapped, activityLogMapped } from "../../store";
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
    item: {
      type: Object,
      required: true,
    },
    params: {
      type: Object, // link params
      default: undefined,
    },
  },
  setup(props) {
    const { item } = toRefs(props);
    const { highlights } = activityLogMapped;

    const highlight = computed(() =>
      getLatestTimeInArray(highlights.value[props.item.block]),
    );

    return {
      ...useHighlightAnimation(highlight),
      ...deviceStoreMapped,
      itemRef: item,
      highlights,
    };
  },
});
</script>
