<template>
  <div class="p-2 border-b border-gray-800 last:border-b-0">
    <strong v-if="request.config" class="mr-2 text-gray-400">
      {{ getDefinitionLabel(request.config) }}
    </strong>
    <strong class="mr-1 text-gray-400">{{ request.command }}</strong>

    <small class="float-right"
      >{{ request.state }}
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
    <template v-if="request.responseData">
      <br />
      <span class=""> Sent {{ request.payload }} </span>
    </template>
    <template v-if="request.responseData">
      <br />
      <span class="">Received {{ request.responseData }} </span>
    </template>
    <template v-if="request.parsed">
      <br />
      <span class="">Parsed {{ request.parsed }} </span>
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
import {
  Block,
  GlobalDefinitions,
  ButtonSectionDefinitions,
  EncoderSectionDefinitions,
  AnalogSectionDefinitions,
  LedSectionDefinitions,
  DisplayDefinitions,
} from "../../../definitions";
import { getDifferenceInMs } from "../../../util";
import { IRequestConfig } from "../../../store/modules/device/state";

const definitionMap = {
  [Block.Global as number]: GlobalDefinitions,
  [Block.Button as number]: ButtonSectionDefinitions,
  [Block.Encoder as number]: EncoderSectionDefinitions,
  [Block.Analog as number]: AnalogSectionDefinitions,
  [Block.Led as number]: LedSectionDefinitions,
  [Block.Display as number]: DisplayDefinitions,
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
    const getDefinitionLabel = (config: IRequestConfig): string => {
      const definition = definitionMap[config.block];
      const section = Object.values(definition).find(
        (def) => def.section === config.section
      );

      return `${Block[config.block]} ${config.index} ${
        section && section.label
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
