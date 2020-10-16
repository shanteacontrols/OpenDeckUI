<template>
  <div class="activity request-request">
    <span :class="{ 'text-red-500': !!request.errorMessage }">
      <strong class="request-command">{{ request.id }}</strong
      >.&nbsp;

      <strong class="request-command">{{ request.command }}</strong>
      <strong v-if="request.config" class="request-command">
        {{ getDefinitionLabel(request.config) }}
      </strong>

      <strong
        v-if="request.config && typeof request.config.value === 'number'"
        class="request-config"
      >
        {{ request.config.value }}
      </strong>
    </span>
    <span class="request-status" :class="request.state">
      <span class="status">{{ request.state }}</span>
      <span v-if="request.time.finished" class="timing">
        <span class="status-label faded">in</span>
        <strong
          >{{
            getDifferenceInMs(request.time.finished, request.time.started)
          }}ms</strong
        >
      </span>
      <span
        v-if="getDifferenceInMs(request.time.started, request.time.created)"
        class="timing"
      >
        <span class="status-label faded">waited</span>
        <strong
          >{{
            getDifferenceInMs(request.time.started, request.time.created)
          }}ms</strong
        >
      </span>
    </span>

    <div v-if="request.payload">
      <span class="sysex-label faded">Sent</span>
      <LogDataValue :dec="logEntry.payloadDec" :hex="logEntry.payloadHex" />
    </div>
    <div v-if="request.responseData">
      <div class="">
        <span class="sysex-label faded">Received</span>
        <LogDataValue :hex="logEntry.dataHex" :dec="logEntry.dataDec" />
      </div>
      <div v-if="request.parsed">
        <span class="sysex-label faded">Parsed</span>
        <span>{{ request.parsed }}</span>
      </div>
    </div>

    <div v-if="request.errorMessage">
      <span class="sysex-label text-red-700">Error</span>
      <span class="text-red-500">
        {{ request.errorMessage }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { IRequestConfig } from "../device/device-store";
import { RequestState } from "../interface";
import { ILogEntryRequest } from "./request-log-store";
import {
  Block,
  SectionType,
  findSectionDefinitionByConfig,
} from "../../definitions";
import { requestStack } from "../device/device-store/request-qeueue";
import { getDifferenceInMs, convertToHexString } from "../../util";
import LogDataValue from "./LogDataValue.vue";

export default defineComponent({
  name: "LogRequest",
  components: {
    LogDataValue,
  },
  props: {
    logEntry: {
      required: true,
      type: Object as () => ILogEntryRequest,
    },
    requestId: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const request = ref(requestStack.value[props.requestId]);

    const getDefinitionLabel = (config: IRequestConfig): string => {
      const sectionDef = findSectionDefinitionByConfig(config);
      if (!sectionDef) {
        return "";
      }

      const indexString =
        sectionDef.type === SectionType.Value && config.index
          ? `# ${config.index}`
          : " - ";

      return `- ${Block[config.block]} ${indexString} ${
        sectionDef && sectionDef.label
      }`;
    };

    return {
      request,
      getDefinitionLabel,
      getDifferenceInMs,
      convertToHexString,
      RequestState,
      Block,
    };
  },
});
</script>
