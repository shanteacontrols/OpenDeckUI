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
      <LogDataValue :value="request.payload" :add-signature="true" />
    </div>
    <div v-if="request.responseData">
      <div class="">
        <span class="sysex-label faded">Received</span>
        <LogDataValue :value="receivedValue" :add-signature="true" />
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
import { defineComponent, computed, toRefs } from "vue";
import { IRequestConfig } from "../device/device-store";
import { IQueuedRequest } from "../device/device-store/request-qeueue";
import { RequestState } from "../interface";
import {
  Block,
  SectionType,
  findSectionDefinitionByConfig,
} from "../../definitions";
import { getDifferenceInMs, convertToHexString } from "../../util";
import LogDataValue from "./LogDataValue.vue";

export default defineComponent({
  name: "ActivityRequest",
  components: {
    LogDataValue,
  },
  props: {
    request: {
      required: true,
      type: Object as () => IQueuedRequest,
    },
  },
  setup(props) {
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

    const { request } = toRefs(props);

    const receivedValue = computed(() => {
      const data = [];
      const fieldsToAdd = [
        request.value.messageStatus,
        request.value.messagePart,
        request.value.specialRequestId,
      ];
      fieldsToAdd.forEach((field: number) => {
        if (field !== undefined) {
          data.push(field);
        }
      });
      if (Array.isArray(request.value.responseData)) {
        data.push(...request.value.responseData);
      }
      return data;
    });

    return {
      getDefinitionLabel,
      getDifferenceInMs,
      convertToHexString,
      RequestState,
      Block,
      receivedValue,
    };
  },
});
</script>
