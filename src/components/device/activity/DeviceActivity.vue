<template>
  <Section class="border-t border-gray-800">
    <template #title>
      <Heading preset="section-title">
        Activity
      </Heading>
    </template>

    <div class="clearfix">
      <button
        class="mr-4 py-1 px-2 float-left rounded-full text-xs focus:outline-none focus:shadow-outline"
        :class="{
          'bg-gray-700 text-gray-300 hover:bg-gray-600 ': filteredLog.length,
          'bg-gray-800 text-gray-500 ': !filteredLog.length,
        }"
        @click="clear"
      >
        Clear
      </button>
      <div class="clearfix pt-4 md:pt-0 md:clear-none md:float-right">
        <FormToggle
          v-for="(type, idx) in LogType"
          :key="idx"
          class="inline-block float-left md:float-right mr-2 mb-2 z-0"
          :value="logTypeFilter.includes(type)"
          @changed="() => toggleFilterType(type)"
        >
          {{ type }}
        </FormToggle>
      </div>

      <table v-if="filteredLog.length" class="w-full mb-2" colspan="2">
        <thead class="flex text-sm text-left w-full border-b border-gray-900">
          <tr class="flex w-full">
            <th class="p-2 w-1/12 text-right">h:m:s</th>
            <th class="p-2 w-1/12">ms</th>
            <th class="p-2 w-2/12">Event</th>
            <th class="p-2 w-8/12">Body</th>
          </tr>
        </thead>
        <tbody
          class="flex flex-col overflow-y-scroll w-full"
          style="height: 50vh;"
        >
          <tr
            v-for="(logEntry, idx) in filteredLog"
            :key="idx"
            class="flex w-full text-sm border-b border-gray-900 last:border-b-0 odd:bg-gray-900"
            :class="{ 'text-red-500': logEntry.type === LogType.Error }"
          >
            <td class="p-2 w-1/12 text-right">
              {{ formatDate(logEntry.time) }}
            </td>
            <td class="p-2 w-1/12">
              {{ logEntry.time.getMilliseconds() }}
            </td>
            <td class="p-2 w-2/12">
              <template
                v-if="logEntry.type === LogType.Request || logEntry.requestId"
              >
                <span> Request {{ logEntry.requestId }} </span>
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
            <td class="w-8/12">
              <DeviceActivityError
                v-if="logEntry.type === LogType.Error"
                :log-entry="logEntry"
              />
              <DeviceActivityRequest
                v-if="logEntry.requestId && logEntry.type === LogType.Request"
                :request="requestStack[logEntry.requestId]"
              />
              <DeviceActivityInfo
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
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  purgeFinishedRequests,
  requestStack,
} from "../../../store/modules/device/device-promise-qeueue";
import {
  activityLog,
  LogType,
  ILogEntry,
} from "../../../store/modules/activity-log";
import { Block } from "../../../definitions";
import { formatDate } from "../../../util";

import DeviceActivityError from "./DeviceActivityError.vue";
import DeviceActivityInfo from "./DeviceActivityInfo.vue";
import DeviceActivityMidi from "./DeviceActivityMidi.vue";
import DeviceActivityRequest from "./DeviceActivityRequest.vue";
import FormToggle from "../../form/FormToggle.vue";

export default defineComponent({
  name: "DeviceActivity",
  components: {
    DeviceActivityError,
    DeviceActivityInfo,
    DeviceActivityMidi,
    DeviceActivityRequest,
    FormToggle,
  },
  setup() {
    const toggleFilterType = (type: LogType) => {
      const pos = activityLog.state.logTypeFilter.indexOf(type);
      if (pos !== -1) {
        activityLog.state.logTypeFilter.splice(pos, 1);
      } else {
        activityLog.state.logTypeFilter.push(type);
      }
    };

    const filteredLog = computed(() => {
      const filter = activityLog.state.logTypeFilter;
      return activityLog.state.stack
        .filter((log: ILogEntry) => filter && filter.includes(log.type))
        .reverse();
    });
    const prunedCount = computed(() => activityLog.state.prunedCount);

    const clear = () => {
      activityLog.actions.clear();
      purgeFinishedRequests();
    };

    return {
      clear,
      requestStack,
      filteredLog,
      activityLog,
      logTypeFilter: activityLog.state.logTypeFilter,
      prunedCount,
      Block,
      formatDate,
      LogType,
      toggleFilterType,
    };
  },
});
</script>
