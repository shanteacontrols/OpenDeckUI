<template>
  <div class="request-log section">
    <div class="section-heading clearfix">
      <h3 class="section-heading-inner">
        <span class="mr-6">Activity</span>
        <FormToggle class="mr-8" :value="showRequestLog" @changed="toggleLog" />
        <button
          v-if="showRequestLog && stack.length"
          class="btn btn-xs mr-6"
          @click="clear"
        >
          clear
        </button>
        <span v-if="showRequestLog" class="float-right mt-1 clearfix">
          <span
            v-for="(type, idx) in LogFilter"
            :key="idx"
            class="inline-block ml-2"
          >
            <FormToggle
              :value="logFilter[type]"
              class="toggle-sm labeled"
              @changed="() => toggleLogFilter(type)"
            >
              {{ type }}
            </FormToggle>
          </span>
        </span>
      </h3>
    </div>

    <div class="request-log-main">
      <RequestLogTable v-if="showRequestLog" class="w-full" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { purgeFinishedRequests } from "../device/device-store/request-qeueue";
import { requestLogMapped, LogType, LogFilter } from "./request-log-store";

import RequestLogTable from "./RequestLogTable.vue";

export default defineComponent({
  name: "RequestLog",
  components: {
    RequestLogTable,
  },
  setup() {
    const clear = () => {
      requestLogMapped.clearRequestLog();
      purgeFinishedRequests();
    };

    return {
      clear,
      LogType,
      LogFilter,
      ...requestLogMapped,
    };
  },
});
</script>
