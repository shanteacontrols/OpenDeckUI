<template>
  <p class="">
    <span v-if="logEntry.block" class="mr-2"> block {{ logEntry.block }} </span>
    <span v-if="logEntry.index" class="mr-2"> # {{ logEntry.index }} </span>
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ILogEntryInfo } from "./request-log-store";
import { Block } from "../../definitions";

export default defineComponent({
  name: "ActivityInfo",
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntryInfo,
    },
  },
  setup() {
    return {
      Block,
    };
  },
});
</script>
