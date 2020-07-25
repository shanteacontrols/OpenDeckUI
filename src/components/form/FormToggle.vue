<template>
  <div>
    <label
      class="relative inline-block w-auto align-middle select-none transition duration-200 ease-in"
    >
      <input
        type="checkbox"
        :checked="isChecked"
        class="toggle-checkbox absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer"
        :class="{
          'right-0 border-green-400 bg-white': isChecked,
          'border-gray-700 bg-gray-300': !isChecked,
        }"
        @change="toggle"
      />
      <span
        class="toggle-label block overflow-hidden h-6 p-1 px-2 text-xs font-bold leading-4 rounded-full cursor-pointer"
        :class="{
          'bg-green-400 text-green-100 hover:text-white pr-8': isChecked,
          'bg-gray-700 text-gray-500 hover:text-gray-300 pl-8': !isChecked,
        }"
      >
        <slot></slot>
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "FormToggle",
  props: {
    value: [Boolean, Number],
  },
  setup(props, { emit }) {
    const isChecked = computed(() => !!props.value);

    // Note: we are working with 0 and 1 not Bool
    const toggle = () => emit("changed", isChecked.value ? 0 : 1);

    return {
      toggle,
      isChecked,
    };
  },
});
</script>
