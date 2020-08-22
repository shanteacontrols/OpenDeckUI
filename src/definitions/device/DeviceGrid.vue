<template>
  <Section :title="title">
    <div class="device-grid">
      <DeviceGridButton
        v-for="index in (numberOfComponents[block] || 0)"
        :key="index"
        :output-id="outputId"
        :route-name="routeName"
        :index="index - 1"
        :block="String(block)"
        :highlight="highlights[block][index - 1]"
      >
        <span class="text-xl font-bold">{{ index - 1 }}</span>
      </DeviceGridButton>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "./../../definitions";
import { deviceStoreMapped, requestLogMapped } from "../../store";
import DeviceGridButton from "./DeviceGridButton.vue";

export default defineComponent({
  name: "DeviceGrid",
  components: {
    DeviceGridButton,
  },
  props: {
    title: {
      default: "",
      type: String,
    },
    block: {
      required: true,
      type: Number as () => Block,
    },
    routeName: {
      required: true,
      type: String,
    },
  },
  setup() {
    const { numberOfComponents, outputId } = deviceStoreMapped;
    const { highlights } = requestLogMapped;

    return {
      outputId,
      numberOfComponents,
      highlights,
    };
  },
});
</script>
