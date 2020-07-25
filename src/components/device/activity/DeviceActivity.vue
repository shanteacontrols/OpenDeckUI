D<template>
  <Section class="border-t border-gray-800">
    <template #title>
      <Heading preset="section-title">
        Activity
        <span class="ml-2 text-sm">
          {{ filteredLog.length }}
        </span>
        <button
          class="ml-6 text-sm py-1 px-2 rounded-full focus:outline-none focus:shadow-outline"
          :class="{
            'bg-gray-700 text-gray-300 hover:bg-gray-600 ': filteredLog.length,
            'bg-gray-800 text-gray-500 ': !filteredLog.length,
          }"
          @click="clear"
        >
          Clear
        </button>

        <button
          v-for="(type, idx) in LogType"
          :key="idx"
          class="float-right ml-2 text-sm py-1 px-2 rounded-full focus:outline-none focus:shadow-outline"
          :class="{
            'bg-gray-600 text-gray-300 hover:bg-gray-800 hover:text-gray-600': logTypeFilter.includes(
              type
            ),
            'bg-gray-800 text-gray-600 hover:bg-gray-600 hover:text-gray-300': !logTypeFilter.includes(
              type
            ),
          }"
          @click="() => toggleFilterType(type)"
        >
          {{ type }}
        </button>
      </Heading>
    </template>

    <table v-if="filteredLog.length" class="w-full mb-2" colspan="2">
      <thead class="text-sm text-left border-b border-gray-900">
        <tr>
          <th class="p-2 text-right">h:m:s</th>
          <th class="p-2">ms</th>
          <th class="p-2">Event</th>
          <th class="p-2">Body</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(logEntry, idx) in filteredLog"
          :key="idx"
          class="px-2 py-1 text-sm border-b border-gray-900 last:border-b-0 odd:bg-gray-900"
          :class="{ 'text-red-500': logEntry.type === LogType.Error }"
        >
          <td class="pr-2 text-right">
            {{ formatDate(logEntry.time) }}
          </td>
          <td>
            {{ logEntry.time.getMilliseconds() }}
          </td>
          <td>
            <template
              v-if="logEntry.type === LogType.Request || logEntry.requestId"
            >
              <span> Request {{ logEntry.id || logEntry.requestId }} </span>
              <br />
            </template>
            <span v-if="logEntry.type === LogType.Error">
              Error {{ logEntry.errorCode }}
            </span>
            <span v-else-if="logEntry.type === LogType.Info">
              Component info
            </span>
            <span v-else-if="logEntry.type === LogType.Midi">
              MIDI
            </span>
          </td>
          <td>
            <DeviceActivityError
              v-if="logEntry.type === LogType.Error"
              :log-entry="logEntry"
            />
            <DeviceActivityRequest
              v-if="logEntry.type === LogType.Request"
              :request="requestStack[logEntry.id]"
            />
            <DeviceActivityInfoMessage
              v-if="logEntry.type === LogType.Info"
              :log-entry="logEntry"
            />
            <DeviceActivityMidi
              v-if="logEntry.type === LogType.Midi"
              :log-entry="logEntry"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import {
  purgeFinishedRequests,
  requestStack,
} from "../../../store/modules/device/device-promise-qeueue";
import {
  activityLogMapped,
  LogType,
  ILogEntry,
} from "../../../store/modules/activity-log";
import { Block } from "../../../definitions";
import { formatDate } from "../../../util";

import DeviceActivityError from "./DeviceActivityError.vue";
import DeviceActivityInfoMessage from "./DeviceActivityInfoMessage.vue";
import DeviceActivityMidi from "./DeviceActivityMidi.vue";
import DeviceActivityRequest from "./DeviceActivityRequest.vue";

export default defineComponent({
  name: "DeviceActivity",
  setup() {
    const logTypeFilter = reactive<Array<LogType>>([
      LogType.Midi,
      LogType.Request,
      LogType.Error,
      LogType.Info,
    ]);

    const toggleFilterType = (type: LogType) => {
      const pos = logTypeFilter.indexOf(type);
      if (pos !== -1) {
        logTypeFilter.splice(pos, 1);
      } else {
        logTypeFilter.push(type);
      }
    };

    const filteredLog = computed(() =>
      activityLogMapped.stack.value.filter((log: ILogEntry) =>
        logTypeFilter.includes(log.type)
      )
    );

    const clear = () => {
      activityLogMapped.clear();
      purgeFinishedRequests();
    };

    return {
      clear,
      requestStack,
      filteredLog,
      activityLog: activityLogMapped,
      Block,
      formatDate,
      LogType,
      logTypeFilter,
      toggleFilterType,
    };
  },
  components: {
    DeviceActivityError,
    DeviceActivityInfoMessage,
    DeviceActivityMidi,
    DeviceActivityRequest,
  },
});
</script>
