<template>
  <p class="p-2 border-b border-gray-800 last:border-b-0">
    <span class="ml-2 float-right">{{ idx }}.</span>
    <span class="mr-2"> {{ formatDate(message.received) }} </span>
    <strong>
      <span class="mr-2">
        {{ Block[message.block] }} #{{ message.index }}
      </span>
    </strong>
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IInfoMessage } from "../../../store/modules/device/device-promise-qeueue";
import { formatDate } from "../../../util";
import DeviceRequestConfig from "./DeviceRequestConfig.vue";
import { Block } from "../../../definitions";

export default defineComponent({
  name: "DeviceActivityInfoMessage",
  props: {
    idx: Number,
    message: {
      required: true,
      type: Object as () => IInfoMessage,
    },
  },
  setup() {
    return {
      Block,
      formatDate,
    };
  },
  components: {
    DeviceRequestConfig,
  },
});
</script>
