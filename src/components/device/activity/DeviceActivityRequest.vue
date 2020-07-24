<template>
  <p class="p-2 border-b border-gray-800 last:border-b-0">
    <span class="ml-2 float-right">{{ request.id }}.</span>
    <span class=""> {{ printRequestTimes(request) }} </span>
    <br />
    <DeviceRequestConfig :command="request.command" :config="request.config" />
    <em class="mx-2">{{ request.state }}</em>
    <template v-if="request.errorMessage">
      <br />
      <span class="text-red-500">
        {{ request.errorMessage }}
      </span>
    </template>
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IRequestInProcess } from "../../../store/modules/device/device-promise-qeueue";
import { getDifferenceInMs, formatDate } from "../../../util";
import DeviceRequestConfig from "./DeviceRequestConfig.vue";

const printRequestTimes = (request: IRequestInProcess): string => {
  const { created, started, finished } = request.time;

  const createdString = formatDate(created);
  const startedString = started
    ? `+${getDifferenceInMs(started, created)}ms wait`
    : ``;
  const finishedString = finished
    ? `+${getDifferenceInMs(finished, started)}ms run`
    : ``;

  return `${createdString} ${startedString} ${finishedString}`;
};

export default defineComponent({
  name: "DeviceActivityRequest",
  props: {
    request: {
      required: true,
      type: Object as () => IRequestInProcess,
    },
  },
  setup() {
    return {
      printRequestTimes,
    };
  },
  components: {
    DeviceRequestConfig,
  },
});
</script>
