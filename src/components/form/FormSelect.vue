<template>
  <select
    class="form-select mt-1 py-1 text-sm block w-full max-w-sm"
    :value="value"
    @change="emit('changed', $event.target.value)"
  >
    <option v-for="(opt, idx) in options" :key="idx" :value="opt.value">{{
      opt.text
    }}</option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IFormSelectOption } from "../../definitions";

export default defineComponent({
  name: "FormSelect",
  props: {
    value: [String, Number],
    options: {
      required: true,
      type: Array as () => Array<IFormSelectOption>,
    },
  },
  setup(_, { emit }) {
    return {
      emit,
    };
  },
});
</script>
