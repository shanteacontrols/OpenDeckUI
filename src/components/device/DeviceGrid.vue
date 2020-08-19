<template>
  <Section :title="title">
    <div
      class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 -ml-4 text-center"
    >
      <DeviceGridButton
        v-for="componentIndex in (count || 0)"
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
import { defaultTheme, Block } from "./../../definitions";
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
    count: {
      default: 0,
      type: Number,
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
    return {
      defaultTheme,
      ...deviceStoreMapped,
      ...activityLogMapped,
    };
  },
});
</script>
