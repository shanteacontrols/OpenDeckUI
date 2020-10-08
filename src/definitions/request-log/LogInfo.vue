<template>
  <div class="">
    <strong class="mr-2 text-gray-400">Component info</strong>
    <strong v-if="logEntry.block">{{ BlockMap[logEntry.block].title }} </strong>
    <strong v-if="Number.isInteger(logEntry.index)">
      #{{ logEntry.index }}
    </strong>
    <div v-if="logEntry.payload && logEntry.payload.length">
      <span class="sysex-label faded">Raw data</span>
      <LogDataValue :value="logEntry.payload" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ILogEntryInfo } from "./request-log-store";
import { Block, BlockMap } from "../../definitions";
import { convertToHexString } from "../../util";
import LogDataValue from "./LogDataValue.vue";

export default defineComponent({
  name: "ActivityInfo",
  components: {
    LogDataValue,
  },
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntryInfo,
    },
  },
  setup() {
    return {
      Block,
      BlockMap,
      convertToHexString,
    };
  },
});
</script>
