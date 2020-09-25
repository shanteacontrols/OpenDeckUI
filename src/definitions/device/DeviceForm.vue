<template>
  <form class="relative section" novalidate @submit.prevent="">
    <h1 class="w-full section-heading">
      <div class="section-heading-inner flex">
        <router-link class="mr-6" :to="{ name: blockDefinition.routeName }">
          <h2>{{ blockDefinition.title }}s</h2>
        </router-link>
        <span class="mr-6">&rsaquo;</span>
        <div class="mr-6 text-gray-400">
          {{ blockDefinition.title }}
          <strong>
            {{ index }}
          </strong>
        </div>
        <div class="hidden md:block md:flex-grow text-right">
          <Siblinks
            param-key="index"
            :current="index"
            :total="numberOfComponents[block]"
            :params="{ outputId }"
          />
        </div>
      </div>
    </h1>

    <SpinnerOverlay v-if="loading" />

    <div class="section-content">
      <slot
        :form="formData"
        :showField="showField"
        :onValueChange="onValueChange"
      ></slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { SectionType, BlockMap, Block } from "../../definitions";
import { deviceStoreMapped } from "../../store";
import { useDeviceForm } from "../../composables";

export default defineComponent({
  name: "DeviceForm",
  props: {
    block: {
      required: true,
      type: Number as () => Block,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { index } = toRefs(props);
    const { numberOfComponents, outputId } = deviceStoreMapped;
    const blockDefinition = BlockMap[props.block];

    return {
      blockDefinition,
      outputId,
      numberOfComponents,
      ...useDeviceForm(props.block, SectionType.Value, index),
    };
  },
});
</script>
