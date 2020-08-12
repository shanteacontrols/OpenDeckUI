<template>
  <div class="p-2 border-b border-gray-800 last:border-b-0">
    <strong class="mr-1 text-gray-400">{{ request.command }}</strong>
    <strong v-if="request.config" class="mr-1 text-gray-400">
      {{ getDefinitionLabel(request.config) }}
    </strong>
    <strong
      v-if="request.config && request.config.value"
      class="mr-2 text-gray-500"
    >
      - {{ request.config.value }}
    </strong>

    <small class="float-right">
      {{ request.state }}
      <span v-if="request.time.finished">
        in
        <strong
          >{{
            getDifferenceInMs(request.time.finished, request.time.started)
          }}ms</strong
        >
      </span>
      <span v-if="request.time.started">
        waited
        <strong
          >{{
            getDifferenceInMs(request.time.started, request.time.created)
          }}ms</strong
        >
      </span>
    </small>
    <template v-if="request.payload">
      <br />
      <span class="">Sent {{ request.payload }} </span>
    </template>
    <template v-if="request.responseData">
      <br />
      <span class="">Received {{ request.responseData }} </span>
    </template>
    <template v-if="request.errorMessage">
      <br />
      <span class="text-red-500">
        {{ request.errorMessage }}
      </span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IRequestInProcess,
  RequestState,
} from "../../../store/modules/device/device-promise-qeueue";
import { Block, DefinitionType } from "../../../definitions";
import { findDefinitionByRequestConfig } from "../../../definitions/definition-map";
import { getDifferenceInMs } from "../../../util";
import { IRequestConfig } from "../../../store/modules/device/state";

export default defineComponent({
  name: "DeviceActivityRequest",
  props: {
    request: {
      required: true,
      type: Object as () => IRequestInProcess,
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
