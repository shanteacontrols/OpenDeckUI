<template>
  <tr
    class="table-row"
    :class="{ 'text-red-500': logEntry.type === LogType.Error }"
  >
    <td class="w-2/12 text-right">
      {{ logEntry.timeString }}
    </td>
    <td class="w-8/12">
      <LogError v-if="logEntry.type === LogType.Error" :log-entry="logEntry" />
      <LogRequest
        v-else-if="logEntry.requestId && logEntry.type === LogType.Request"
        :log-entry="logEntry"
        :request-id="logEntry.requestId"
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LogType, ILogEntry } from "./request-log-store";
import LogMidi from "./LogMidi.vue";
import LogRequest from "./LogRequest.vue";
import LogInfo from "./LogInfo.vue";
import LogError from "./LogError.vue";

export default defineComponent({
  name: "RequestLogTableRow",
  components: {
    LogMidi,
    LogRequest,
    LogInfo,
    LogError,
  },
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntry,
    },
  },
  setup() {
    return {
      LogType,
    };
  },
});
</script>
