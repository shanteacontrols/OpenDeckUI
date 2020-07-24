<template>
  <strong>
    <span v-if="config" class="mr-2">
      {{ Block[config.block] }} #{{ config.index }}
    </span>
    <span class="mr-1">{{ command }}</span>
    <span v-if="config">
      {{ getBlockSectionLabel(config) }}
    </span>
  </strong>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IRequestConfig } from "../../../store/modules/device/state";
import { definitionMap, SysExCommand, Block } from "../../../definitions";

const getBlockSectionLabel = (config: IRequestConfig): string => {
  const blockDefinitions = definitionMap[config.block];
  const definition = Object.values(blockDefinitions).find(
    (definition) => definition.section === config.section
  );

  return definition ? definition.label : "";
};

export default defineComponent({
  name: "DeviceRequestConfig",
  props: {
    command: {
      required: true,
      type: String as () => SysExCommand,
    },
    config: Object as () => IRequestConfig,
  },
  setup() {
    return {
      Block,
      getBlockSectionLabel,
    };
  },
});
</script>
