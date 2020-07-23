<template>
  <Section class="h-screen" title="Please select a device">
    <!-- Aviailable devices -->
    <div class="mx-auto max-w-sm pt-24 text-left">
      <h3 v-if="!inputs.length" class="p-4 text-xl text-center">
        No devices found
      </h3>
      <div
        v-else
        class="text-gray-700 bg-gray-300 rounded-lg text-left capitalize font-medium shadow-lg"
      >
        <router-link
          v-for="(input, idx) in inputs"
          :key="input.id"
          :to="{ name: 'device', params: { inputId: input.id } }"
          class="block p-4 hover:bg-white hover:text-gray-800 cursor-pointer"
          :class="{
            'rounded-t-lg': idx === 0,
            'rounded-b-lg': idx === inputs.length - 1,
            'border-gray-400 border-b': idx < inputs.length - 1,
          }"
        >
          <span>{{ input.manufacturer || "unknown manufacturer" }}</span>
          <br />
          <strong>{{ input.name }}</strong>
          <ConnectionState class="float-right ml-2" :state="input.state" />
        </router-link>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { midiStoreMapped } from "../store";
import ConnectionState from "./elements/ConnectionState.vue";

export default defineComponent({
  name: "AppDeviceSelect",
  setup() {
    return {
      inputs: midiStoreMapped.inputs,
    };
  },
  components: {
    ConnectionState,
  },
});
</script>
