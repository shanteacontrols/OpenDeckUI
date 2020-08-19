<template>
  <Section>
    <!-- Aviailable devices -->
    <div class="mx-auto max-w-sm my-24 md:my-48 text-left">
      <h3 v-if="!outputs.length" class="p-4 text-xl text-center">
        No OpenDeck board found. Please connect the board in order to use the
        interface.
      </h3>
      <h3 v-else-if="outputs.length > 1" class="p-4 text-xl text-center">
        Multiple OpenDeck boards detected. Please connect one board at the time
        in order to use configurator.
      </h3>
      <div
        v-else
        class="text-gray-700 bg-gray-800 rounded text-left capitalize font-medium shadow-lg"
      >
        <router-link
          v-for="(output, idx) in outputs"
          :key="output.id"
          :to="{ name: 'device', params: { outputId: output.id } }"
          class="block p-4 hover:bg-yellow-500 hover:text-gray-800 cursor-pointer"
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
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { midiStoreMapped } from "../store";

export default defineComponent({
  name: "AppDeviceSelect",
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
