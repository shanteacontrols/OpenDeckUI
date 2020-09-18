<template>
  <div class="activity request-request">
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
      <span class="sysex-payload"
        >[ F0, 0, 54, 43, {{ [...convertToHex(request.payload)].join(", ") }},
        F7 ]
      </span>
      <sup>Hex</sup>
    </div>
    <div v-if="request.responseData">
      <div class="">
        <span class="sysex-label faded">Received</span>
        <span class="sysex-payload"
          >[ F0, 0, 54, 43,
          <template v-if="request.messageStatus !== undefined">
            {{ convertToHex(request.messageStatus) }},
          </template>
          <template v-if="request.messagePart !== undefined">
            {{ convertToHex(request.messagePart) }},
          </template>
          <template v-if="request.specialRequestId !== undefined">
            {{ convertToHex(request.specialRequestId) }},
          </template>
          <span v-for="(val, idx) in request.responseData" :key="idx">
            {{ convertToHex(val) }},
          </span>
          F7 ]</span
        >&nbsp;<sup>Hex</sup>
      </div>
      <div
        v-if="
          request.parsed &&
          (!Array.isArray(request.parsed) || request.parsed.length)
        "
      >
        <span class="sysex-label faded">Parsed</span>
        <span class="sysex-payload"> {{ request.parsed }}</span>
      </div>
    </div>

    <div v-if="request.errorMessage">
      <span class="sysex-label faded">Error message</span>
      <span class="text-red-500">
        {{ request.errorMessage }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IRequestConfig } from "../device/device-store";
import { IQueuedRequest } from "../device/device-store/request-qeueue";
import { RequestState } from "../interface";
import {
  Block,
  SectionType,
  findSectionDefinitionByConfig,
} from "../../definitions";
import { getDifferenceInMs, convertToHex } from "../../util";

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
      const sectionDef = findSectionDefinitionByConfig(config);
      if (!sectionDef) {
        return "";
      }

      const indexString =
        sectionDef.type === SectionType.Setting ? " - " : `# ${config.index}`;

      return `- ${Block[config.block]} ${indexString} ${
        sectionDef && sectionDef.label
      }`;
    };

    return {
      getDefinitionLabel,
      getDifferenceInMs,
      convertToHex,
      RequestState,
      Block,
    };
  },
});
</script>
