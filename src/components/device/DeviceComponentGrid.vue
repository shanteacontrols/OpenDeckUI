<template>
  <Section :title="title">
    <div
      class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 -ml-4 text-center"
    >
      <router-link
        v-for="componentIndex in (count || 0)"
        :key="componentIndex"
        class="px-1 py-1 mb-4 ml-4 select-none cursor-pointer border border-gray-700 text-gray-600 bg-gray-900 hover:bg-yellow-400 hover:text-gray-800 rounded-full"
        :to="{
          name: routeName,
          params: {
            inputId,
            componentIndex,
          },
        }"
      >
        <span class="text-xl font-bold">{{ componentIndex }}</span>
      </router-link>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { defaultTheme } from "./../../definitions";
import { deviceStoreMapped } from "../../store";

export default defineComponent({
  name: "DeviceComponentGrid",
  props: {
    count: Number,
    title: String,
    routeName: {
      required: true,
      type: String,
    },
  },
  setup() {
    return {
      defaultTheme,
      ...deviceStoreMapped,
    };
  },
});
</script>
