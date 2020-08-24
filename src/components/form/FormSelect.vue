<template>
  <select
    class="form-select mt-1 py-1 text-sm block w-full max-w-sm"
    :value="value"
    @change="emit('changed', $event.target.value)"
  >
    <option v-for="(opt, idx) in optionsArray" :key="idx" :value="opt.value">{{
      opt.text
    }}</option>
  </select>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { IFormSelectOption } from "../../definitions";

export default defineComponent({
  name: "FormSelect",
  props: {
    value: {
      default: "",
      type: [String, Number],
    },
    options: {
      required: true,
      type: [Array as () => Array<IFormSelectOption>, Function],
    },
  },
  setup(props, { emit }) {
    const optionsArray =
      props.options && typeof props.options === "function"
        ? computed(() => props.options())
        : props.options;

    return {
      emit,
      optionsArray,
    };
  },
});
</script>
