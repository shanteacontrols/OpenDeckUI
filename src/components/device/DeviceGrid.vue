<template>
  <Section :title="title">
    <div
      class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 -ml-4 text-center"
    >
      <router-link
        v-for="componentIndex in (count || 0)"
        :key="componentIndex"
        class="px-1 py-1 mb-4 ml-4 select-none cursor-pointer border border-gray-700 text-gray-600 bg-gray-900 hover:bg-yellow-400 hover:text-gray-800 rounded-full transition-colors duration-500 ease-in-out"
        :class="{
          'bg-yellow-500': highlights[block].includes(componentIndex - 1),
        }"
        :to="{
          name: routeName,
          params: {
            inputId,
            componentIndex: componentIndex - 1,
          },
        }"
      >
        <span class="text-xl font-bold">{{ componentIndex - 1 }}</span>
      </router-link>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { defaultTheme, Block } from "./../../definitions";
import { deviceStoreMapped, activityLogMapped, LogType } from "../../store";

export default defineComponent({
  name: "DeviceGrid",
  props: {
    title: {
      default: "",
      type: String,
    },
    count: {
      default: 0,
      type: Number,
    },
    block: {
      required: true,
      type: Number as () => Block,
    },
    routeName: {
      required: true,
      type: String,
    },
  },
  setup() {
    return {
      LogType,
      defaultTheme,
      ...deviceStoreMapped,
      ...activityLogMapped,
    };
  },
});
</script>
