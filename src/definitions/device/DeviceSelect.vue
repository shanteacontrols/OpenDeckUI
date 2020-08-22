<template>
  <Hero
    v-if="!outputs.length"
    custom="h-64"
    title="No OpenDeck board found. Please connect the board in order to use the
      interface."
  />
  <Hero
    v-else-if="outputs.length > 1"
    custom="h-64"
    title="Multiple OpenDeck boards detected. Please connect one board at the time in
      order to use configurator."
  />
  <Hero v-else custom="py-24">
    <div class="surface-neutral border px-8 pt-6 rounded">
      <router-link
        v-for="(output, idx) in outputs"
        :key="output.id"
        :to="{ name: 'device', params: { outputId: output.id } }"
        class="block mb-6 cursor-pointer"
        :class="{
          'rounded-t': idx === 0,
          'rounded-b': idx === outputs.length - 1,
          'border-gray-400 border-b': idx < outputs.length - 1,
        }"
      >
        <span>{{ output.manufacturer || "unknown manufacturer" }}</span>
        <br />
        <strong>{{ output.name }}</strong>
      </router-link>
    </div>
  </Hero>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { midiStoreMapped } from "../../store";

export default defineComponent({
  name: "DeviceSelect",
  setup() {
    onMounted(() => {
      midiStoreMapped.assignInputs();
      midiStoreMapped.startMidiConnectionWatcher();
    });

    return {
      outputs: midiStoreMapped.outputs,
    };
  },
});
</script>
