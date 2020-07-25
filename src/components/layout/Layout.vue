<template>
  <div class="w-full flex flex-wrap items-stretch content-start">
    <div class="w-full flex flex-wrap">
      <nav
        class="w-full md:max-w-xs border-gray-800 border-b"
        :class="{
          [box]: true,
          'bg-gray-900 ': !hideSidebar,
        }"
      >
        <slot name="primary-header"></slot>
      </nav>
      <nav
        class="bg-gray-900 xl:bg-black md:text-right xl:text-left flex-1 border-gray-800 border-b"
        :class="`${box}`"
      >
        <slot name="secondary-header"></slot>
      </nav>
    </div>

    <div class="w-full xl:flex">
      <div
        v-if="!hideSidebar"
        class="bg-gray-900 w-full xl:max-w-xs"
        :class="`${box}`"
      >
        <div class="xl:sticky xl:top-0">
          <slot name="sidebar"></slot>
        </div>
      </div>

      <div class="w-full border-gray-800 border-b">
        <slot name="default"></slot>
      </div>
    </div>

    <div class="w-full bg-gray-900 md:flex self-end">
      <nav
        class="w-full md:w-1/3 flex-grow lg:max-w-xs order-2 md:order-1 pb-4"
      >
        <div :class="`${box}`">
          <slot name="primary-footer"></slot>
        </div>
      </nav>
      <nav
        class="w-full md:w-2/3 flex-grow flex-1 order-1 md:order-2 pb-4"
        :class="{
          'xl:bg-black ': !hideSidebar,
        }"
      >
        <div :class="`${box}`">
          <slot name="secondary-footer"></slot>
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { defaultTheme } from "./../../definitions";

export default defineComponent({
  name: "Layout",
  props: {
    hideSidebar: Boolean,
  },
  setup() {
    return {
      ...defaultTheme,
    };
  },
});
</script>
