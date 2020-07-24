<template>
  <Section title="Activity">
    <div class="pb-8 grid gap-6 grid-cols-1 md:grid-cols-2 md:gap-10">
      <div class="">
        <div class="mb-2">
          <strong>Requests</strong>
          <button
            class="ml-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1 px-2 rounded-full focus:outline-none focus:shadow-outline"
            @click="purgeFinishedRequests"
          >
            X
          </button>
        </div>
        <div class="mb-4 text-sm max-h-screen overflow-y-auto">
          <template v-for="(request, idx) in requestStack">
            <DeviceActivityRequest :key="idx" :request="request" />
          </template>
        </div>
      </div>
      <div class="">
        <div class="mb-2">
          <strong>Info messages</strong>
          <button
            class="ml-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1 px-2 rounded-full focus:outline-none focus:shadow-outline"
            @click="purgeInfoMessages"
          >
            x
          </button>
        </div>
        <div class="mb-4 text-sm max-h-screen overflow-y-auto">
          <DeviceActivityInfoMessage
            v-for="(message, idx) in activityStack"
            :key="idx"
            :idx="idx"
            :message="message"
          />
        </div>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  purgeFinishedRequests,
  purgeInfoMessages,
  requestStack,
  activityStack,
} from "../../../store/modules/device/device-promise-qeueue";
import DeviceActivityRequest from "./DeviceActivityRequest.vue";
import DeviceActivityInfoMessage from "./DeviceActivityInfoMessage.vue";

export default defineComponent({
  name: "DeviceActivity",
  setup() {
    return {
      purgeFinishedRequests,
      purgeInfoMessages,
      requestStack,
      activityStack,
    };
  },
  components: {
    DeviceActivityRequest,
    DeviceActivityInfoMessage,
  },
});
</script>
