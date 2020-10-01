<template>
  <table v-if="stack.length" class="table-auto mb-0 request-table" colspan="2">
    <thead class="table-head">
      <tr class="text-left">
        <th class="w-1/12 text-right">Time</th>
        <th class="w-8/12">Event</th>
      </tr>
    </thead>
    <tbody class="table-body">
      <tr
        v-for="(logEntry, idx) in stack"
        :key="idx"
        class="table-row"
        :class="{ 'text-red-500': logEntry.type === LogType.Error }"
      >
        <td class="w-2/12 text-right">
          {{ formatDate(logEntry.time) }}
        </td>
        <td class="w-8/12">
          <LogError
            v-if="logEntry.type === LogType.Error"
            :log-entry="logEntry"
          />
          <LogRequest
            v-else-if="logEntry.requestId && logEntry.type === LogType.Request"
            :request="requestStack[logEntry.requestId]"
          />
          <LogInfo
            v-else-if="logEntry.type === LogType.Info"
            :log-entry="logEntry"
          />
          <LogMidi
            v-else-if="logEntry.type === LogType.Midi"
            :log-entry="logEntry"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { requestLogMapped, LogType } from "./request-log-store";
import { formatDate } from "../../util";
import { requestStack } from "../device/device-store/request-qeueue";

import LogError from "./LogError.vue";
import LogInfo from "./LogInfo.vue";
import LogMidi from "./LogMidi.vue";
import LogRequest from "./LogRequest.vue";

export default defineComponent({
  name: "RequestLogTable",
  components: {
    LogError,
    LogInfo,
    LogMidi,
    LogRequest,
  },
  setup() {
    const stack = { requestLogMapped };

    return {
      formatDate,
      stack,
      LogType,
      requestStack,
      ...requestLogMapped,
    };
  },
});
</script>
