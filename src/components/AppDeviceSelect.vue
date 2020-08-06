<template>
  <Section class="" title="Please select a device">
    <!-- Aviailable devices -->
    <div class="mx-auto max-w-sm mt-24 mb-24 md:mb-64 text-left">
      <h3 v-if="!inputs.length" class="p-4 text-xl text-center">
        No devices found
      </h3>
      <div
        v-else
        class="text-gray-700 bg-gray-800 rounded text-left capitalize font-medium shadow-lg"
      >
        <router-link
          v-for="(input, idx) in inputs"
          :key="input.id"
          :to="{ name: 'device', params: { inputId: input.id } }"
          class="block p-4 hover:bg-yellow-500 hover:text-gray-800 cursor-pointer"
          :class="{
            'rounded-t': idx === 0,
            'rounded-b': idx === inputs.length - 1,
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
  components: {
    ConnectionState,
  },
  setup() {
    return {
      inputs: midiStoreMapped.inputs,
    };
  },
});
</script>
