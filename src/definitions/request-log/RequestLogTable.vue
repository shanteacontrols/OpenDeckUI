<template>
  <table v-if="stack.length" class="table-auto mb-0 request-table">
    <thead class="table-head">
      <tr class="text-left">
        <th class="w-1/12 text-right">Time</th>
        <th class="w-8/12">Event</th>
      </tr>
    </thead>
    <tbody class="table-body">
      <RequestLogTableRow
        v-for="logEntry in stack"
        :key="logEntry.id"
        :log-entry="logEntry"
      />
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { requestLogMapped } from "./request-log-store";
import RequestLogTableRow from "./RequestLogTableRow.vue";

export default defineComponent({
  name: "RequestLogTable",
  components: {
    RequestLogTableRow,
  },
  setup() {
    return {
      stack: requestLogMapped.stack,
    };
  },
});
</script>
