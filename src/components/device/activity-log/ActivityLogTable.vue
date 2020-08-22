<template>
  <table
    v-if="filteredLog.length"
    class="table-auto activity-table"
    colspan="2"
  >
    <thead class="table-head">
      <tr class="text-left">
        <th class="w-1/12 text-center">Time</th>
        <th class="w-1/12">ms</th>
        <th class="w-2/12">Type</th>
        <th class="w-8/12">Body</th>
      </tr>
    </thead>
    <tbody class="table-body">
      <tr
        v-for="(logEntry, idx) in filteredLog"
        :key="idx"
        class="table-row"
        :class="{ 'text-red-500': logEntry.type === LogType.Error }"
      >
        <td class="w-1/12 text-right">
          {{ formatDate(logEntry.time) }}
        </td>
        <td class="w-1/12">
          {{ logEntry.time.getMilliseconds() }}
        </td>
        <td class="w-2/12 font-bold">
          <span v-if="logEntry.type === LogType.Request || logEntry.requestId">
            REQ {{ logEntry.requestId }}
          </span>
          <span v-if="logEntry.type === LogType.Error" class="text-red">
            ERR {{ logEntry.errorCode }}
          </span>
          <span v-else-if="logEntry.type === LogType.Info">
            INF
          </span>
          <span v-else-if="logEntry.type === LogType.Midi">
            MID
          </span>
        </td>
        <td class="w-8/12">
          <LogError
            v-if="logEntry.type === LogType.Error"
            :log-entry="logEntry"
          />
          <LogRequest
            v-if="logEntry.requestId && logEntry.type === LogType.Request"
            :request="requestStack[logEntry.requestId]"
          />
          <LogInfo
            v-if="logEntry.type === LogType.Info"
            :log-entry="logEntry"
          />
          <LogMidi
            v-if="logEntry.type === LogType.Midi"
            :log-entry="logEntry"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { activityLogMapped, LogType } from "../../../store";
import { formatDate } from "../../../util";
import { requestStack } from "../../../store/modules/device/device-promise-qeueue";

import LogError from "./LogError.vue";
import LogInfo from "./LogInfo.vue";
import LogMidi from "./LogMidi.vue";
import LogRequest from "./LogRequest.vue";

export default defineComponent({
  name: "ActivityLogTable",
  components: {
    LogError,
    LogInfo,
    LogMidi,
    LogRequest,
  },
  setup() {
    const filteredLog = computed(() => {
      const filter = activityLogMapped.logFilter.value;
      return activityLogMapped.stack.value
        .filter((log: ILogEntry) => filter && filter[log.type])
        .reverse();
    });

    return {
      formatDate,
      filteredLog,
      LogType,
      requestStack,
      ...activityLogMapped,
    };
  },
});
</script>
