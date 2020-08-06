<template>
  <input
    :value="value"
    class="form-input mt-1 py-1 text-sm block w-24"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    @change="emit('changed', $event.target.value)"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormInput",
  props: {
    value: {
      default: "",
      type: [String, Number],
    },
    name: {
      default: "",
      type: String,
    },
    placeholder: {
      default: "",
      type: String,
    },
    type: {
      default: "number",
      type: String as () => "number" | "text",
    },
  },
  setup(_, { emit }) {
    return {
      emit,
    };
  },
});
</script>
