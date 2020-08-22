<template>
  <div class="activity-log section">
    <div class="section-heading clearfix">
      <h3 class="section-heading-inner">
        <span class="mr-6">Activity</span>
        <FormToggle
          class="mr-8"
          :value="showActivityLog"
          @changed="toggleLog"
        />
        <button
          v-if="showActivityLog && stack.length"
          class="btn btn-xs mr-6"
          @click="clear"
        >
          clear
          <small class="btn-icon">{{ stack.length }}</small>
        </button>
        <span v-if="showActivityLog" class="float-right mt-1 clearfix">
          <span
            v-for="(type, idx) in LogType"
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

    <div class="activity-log-main">
      <ActivityLogTable v-if="showActivityLog" class="w-full" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { purgeFinishedRequests } from "../../../store/modules/device/device-promise-qeueue";
import {
  activityLogMapped,
  LogType,
} from "../../../store/modules/activity-log";

import ActivityLogTable from "./ActivityLogTable.vue";

export default defineComponent({
  name: "ActivityLog",
  components: {
    ActivityLogTable,
  },
  setup() {
    const clear = () => {
      activityLogMapped.clear();
      purgeFinishedRequests();
    };

    return {
      clear,
      LogType,
      ...activityLogMapped,
    };
  },
});
</script>
