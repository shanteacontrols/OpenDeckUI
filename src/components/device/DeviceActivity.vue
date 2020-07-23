<template>
  <Section title="Activity" class="w-full border-t border-gray-800">
    <p>Activity</p>
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      @click="refresh"
    >
      Refresh
    </button>
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      @click="purge"
    >
      Purge finished
    </button>
    <div>
      <div v-for="request in requests" :key="request.id">
        <!-- {{ request }} -->
        <span>
          <strong>{{ request.command }}</strong>
        </span>
        <span>
          STATE: <strong>{{ request.state }}</strong>
        </span>
        <br />
        <span>
          {{ request.payload }}
        </span>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { deviceStoreMapped } from "../../store";
import {
  requestProcessor,
  IRequestInProcess,
  purgeFinishedRequests,
} from "../../store/modules/device/device-promise-qeueue";

export default defineComponent({
  name: "DeviceActivity",
  setup() {
    const requests = ref<Array<IRequestInProcess>>([]);

    watch([requestProcessor.activeRequestId], () => refresh());

    const refresh = () => {
      requests.value = Array.from(requestProcessor.requestMap.values());
    };

    const purge = () => {
      purgeFinishedRequests();
      refresh();
    };

    return {
      refresh,
      purge,
      requests,
      ...deviceStoreMapped,
    };
  },
  components: {},
});
</script>
