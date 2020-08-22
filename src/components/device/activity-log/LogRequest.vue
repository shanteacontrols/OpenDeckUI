<template>
  <div class="activity activity-request">
    <strong class="activity-command">{{ request.command }}</strong>
    <strong v-if="request.config" class="activity-command">
      {{ getDefinitionLabel(request.config) }}
    </strong>

    <strong
      v-if="request.config && request.config.value"
      class="activity-config"
    >
      - {{ request.config.value }}
    </strong>

    <span class="activity-status" :class="request.state">
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
      <span class="sysex-payload">
        {{ [240, 0, 84, 67, ...request.payload, 247] }}
      </span>
    </div>
    <div v-if="request.responseData">
      <div class="">
        <span class="sysex-label faded">Received</span>
        <span class="sysex-payload"
          >[ 240, 0, 84, 67,
          <template v-if="request.messageStatus !== undefined">
            {{ request.messageStatus }},
          </template>
          <template v-if="request.messagePart !== undefined">
            {{ request.messagePart }},
          </template>
          <template v-if="request.specialRequestId !== undefined">
            {{ request.specialRequestId }},
          </template>
          <span v-for="(val, idx) in request.responseData" :key="idx">
            {{ val }},
          </span>
          247 ]</span
        >
      </div>
      <div v-if="request.parsed">
        <span class="sysex-label faded">Parsed</span>
        <span class="sysex-payload">
          {{ request.parsed }}
        </span>
      </div>
    </div>

    <div v-if="request.errorMessage">
      <span class="sysex-label faded">Error</span>
      <span class="text-red-500">
        {{ request.errorMessage }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IQueuedRequest,
  RequestState,
} from "../../../store/modules/device/device-promise-qeueue";
import { Block, DefinitionType } from "../../../definitions";
import { findDefinitionByRequestConfig } from "../../../definitions";
import { getDifferenceInMs } from "../../../util";
import { IRequestConfig } from "../../../store/modules/device/state";

export default defineComponent({
  name: "ActivityRequest",
  props: {
    request: {
      required: true,
      type: Object as () => IQueuedRequest,
    },
  },
  setup() {
    const getDefinitionLabel = (config: IRequestConfig): string => {
      const definition = findDefinitionByRequestConfig(config);
      if (!definition) {
        return "";
      }

      const indexString =
        definition.type === DefinitionType.Setting
          ? " - "
          : `# ${config.index}`;

      return `- ${Block[config.block]} ${indexString} ${
        definition && definition.label
      }`;
    };

    return {
      getDefinitionLabel,
      getDifferenceInMs,
      RequestState,
      Block,
    };
  },
});
</script>
