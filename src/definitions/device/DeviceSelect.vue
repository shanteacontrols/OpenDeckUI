<template>
  <Hero
    v-if="!outputs.length"
    custom="py-12 flex-col"
  >
    <h3 class="mb-8">No OpenDeck USB MIDI device found.</h3>
    <div class="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
      <div class="surface-neutral border px-8 py-6 rounded text-center">
        <h2 class="font-bold mb-4">Connect via network</h2>
        <p class="mb-4 text-sm leading-6">
          Use this for configuration or DFU.
        </p>
        <form
          class="flex flex-col items-center"
          @submit.prevent="connectNetwork"
        >
          <label class="block text-center mb-4">
            <span class="block text-sm mb-2">Network address</span>
            <input
              v-model="networkAddress"
              class="form-input py-1 text-sm block w-48 text-center"
              placeholder="Device IP address"
            />
          </label>
          <button class="btn" type="submit" :disabled="networkConnecting">
            {{ networkConnecting ? "Connecting" : "Connect" }}
          </button>
        </form>
      </div>
      <div class="surface-neutral border px-8 py-6 rounded text-center">
        <h2 class="font-bold mb-4">USB firmware update</h2>
        <p class="mb-4 text-sm leading-6">
          Use this when the board is already in USB DFU mode.
        </p>
        <router-link
          :to="{ name: 'device-firmware-update', params: { outputId: webUsbDfuVirtualOutputId } }"
          class="btn"
        >
          Open USB Firmware Update
        </router-link>
      </div>
    </div>
  </Hero>
  <Hero
    v-else-if="outputs.length > 1"
    custom="h-64"
    title="Multiple OpenDeck boards detected. Please connect one board at the time in
      order to use configurator, or enter a network address."
  >
    <div class="surface-neutral border px-8 py-6 rounded inline-block">
      <form class="flex items-end gap-3" @submit.prevent="connectNetwork">
        <label class="block text-left">
          <span class="block text-sm mb-2">Network address</span>
            <input
              v-model="networkAddress"
              class="form-input py-1 text-sm block w-48 text-center"
              placeholder="Device IP address"
            />
        </label>
        <button class="btn" type="submit" :disabled="networkConnecting">
          {{ networkConnecting ? "Connecting" : "Connect" }}
        </button>
      </form>
    </div>
  </Hero>
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
      <form
        class="border-gray-400 border-t pt-6 pb-6 flex items-end gap-3"
        @submit.prevent="connectNetwork"
      >
        <label class="block">
          <span class="block text-sm mb-2">Network address</span>
            <input
              v-model="networkAddress"
              class="form-input py-1 text-sm block w-48 text-center"
              placeholder="Device IP address"
            />
        </label>
        <button class="btn" type="submit" :disabled="networkConnecting">
          {{ networkConnecting ? "Connecting" : "Connect" }}
        </button>
      </form>
    </div>
  </Hero>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import router from "../../router";
import { midiStoreMapped, deviceStoreMapped } from "../../store";
import {
  connectOpenDeckNetworkEndpoint,
  OpenDeckNetworkEndpoint,
  webUsbDfuVirtualOutputId,
} from "./device-store";

const webConfigAddressStorageKey = "opendeck-webconfig-address";

export default defineComponent({
  name: "DeviceSelect",
  setup() {
    const networkAddress = ref(
      (typeof localStorage !== "undefined" &&
        localStorage.getItem(webConfigAddressStorageKey)) ||
        "",
    );
    const networkConnecting = ref(false);

    onMounted(async () => {
      await midiStoreMapped.assignInputs();
      midiStoreMapped.startMidiConnectionWatcher();

      // Note: this should be in Device.vue onUnmounted, but it is unreliable for some reason
      await deviceStoreMapped.closeConnection();
    });

    onUnmounted(() => {
      midiStoreMapped.stopMidiConnectionWatcher();
    });

    const connectNetwork = async () => {
      const address = networkAddress.value.trim();
      if (!address || networkConnecting.value) {
        return;
      }

      networkConnecting.value = true;
      try {
        const connection = await connectOpenDeckNetworkEndpoint(address);

        if (!connection) {
          return;
        }

        if (typeof localStorage !== "undefined") {
          localStorage.setItem(webConfigAddressStorageKey, address);
        }

        router.push({
          name:
            connection.endpoint === OpenDeckNetworkEndpoint.Dfu
              ? "device-firmware-update"
              : "device",
          params: {
            outputId: connection.outputId,
          },
        });
      } finally {
        networkConnecting.value = false;
      }
    };

    return {
      outputs: midiStoreMapped.outputs,
      networkAddress,
      networkConnecting,
      connectNetwork,
      webUsbDfuVirtualOutputId,
    };
  },
});
</script>
