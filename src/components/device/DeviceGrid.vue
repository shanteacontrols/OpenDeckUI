<template>
  <Section :title="title">
    <div class="device-grid">
      <DeviceGridButton
        v-for="componentIndex in (numberOfComponents[block] || 0)"
        :key="componentIndex"
        :output-id="outputId"
        :route-name="routeName"
        :index="componentIndex - 1"
        :block="String(block)"
        :highlight="highlights[block][componentIndex - 1]"
      >
        <span class="text-xl font-bold">{{ componentIndex - 1 }}</span>
      </DeviceGridButton>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "./../../definitions";
import { deviceStoreMapped, activityLogMapped } from "../../store";
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
    const { highlights } = activityLogMapped;

    return {
      outputId,
      numberOfComponents,
      highlights,
    };
  },
});
</script>
