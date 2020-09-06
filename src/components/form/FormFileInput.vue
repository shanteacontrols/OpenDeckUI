<template>
  <label class="btn items-center" :class="{ disabled }">
    <span class="">{{ label }}</span>
    <input
      class="hidden"
      type="file"
      :name="name"
      :disabled="disabled"
      @change="emit('change', $event.target.files)"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFileInput",
  props: {
    name: {
      default: "",
      type: String,
    },
    label: {
      default: "",
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  emits: ["change"],
  setup(_, { emit }) {
    return {
      emit,
    };
  },
});
</script>
