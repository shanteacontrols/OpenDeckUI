<template>
  <div class="app">
    <nav class="app-header">
      <router-link :to="{ name: 'home' }" class="app-brand">
        OpenDeck Configurator
      </router-link>

      <span v-if="!isHomePage && boardName" class="app-board-info">
        <template v-if="isBootloaderMode">OpenDeck DFU mode</template>
        <template v-else>
          <small>Board</small>
          <strong>{{ boardName }}</strong>

          <template v-if="firmwareVersion !== null">
            <small>Firmware</small>
            <strong>{{ firmwareVersion }}</strong>
          </template>

          <template v-if="supportedPresetsCount > 1">
            <small>Preset</small>
            <strong>{{ activePreset + 1 }}</strong>
          </template>
        </template>
      </span>
    </nav>

    <div class="app-main">
      <div class="content">
        <Section
          v-if="isConnecting"
          class="h-screen"
          title="Establishing connection"
        >
          <div
            class="lg:text-center max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <p>WebMidi connecting</p>
          </div>
          <div class="absolute flex inset-0 opacity-75 bg-gray-900">
            <Spinner class="self-center" />
          </div>
        </Section>

        <Section
          v-else-if="!isConnected"
          class="h-screen"
          title="Problem connecting"
        >
          <div
            class="lg:text-center max-w-screen-xl mx-auto px-4 pt-24 sm:px-6 lg:px-8"
          >
            <p>WebMidi failed to conect</p>
          </div>
        </Section>

        <router-view v-else />
      </div>
    </div>

    <div class="app-footer">
      <div class="app-footer-wrap">
        <nav class="app-about">
          <h3 class="heading">About</h3>
          <p class="text-sm">
            OpenDeck Configurator is a WebMIDI based configuration tool for all
            MIDI devices running OpenDeck firmware. OpenDeck is a platform
            suited both for prototyping and developing custom MIDI controllers.
          </p>
        </nav>
        <nav class="app-resources">
          <h3 class="heading">Resources</h3>
          <ul class="list">
            <li>
              <a href="https://github.com/paradajz/OpenDeck"
                >OpenDeck GitHub repository</a
              >
            </li>
            <li>
              <a href="https://shanteacontrols.com/"
                >Shantea Controls official Web</a
              >
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted } from "vue";
import { midiStoreMapped, deviceStoreMapped } from "../store";
import router from "../router";

export default defineComponent({
  name: "App",
  setup() {
    const {
      outputId,
      boardName,
      firmwareVersion,
      activePreset,
    } = deviceStoreMapped;
    const isHomePage = computed(
      () => router.currentRoute.value.name === "home",
    );

    const { isConnected, isConnecting } = midiStoreMapped;
    const { supportedPresetsCount, isBootloaderMode } = deviceStoreMapped;

    onMounted(() => {
      midiStoreMapped.loadMidi();
    });

    onUnmounted(() => {
      midiStoreMapped.stopMidiConnectionWatcher();
    });

    return {
      isHomePage,
      outputId,
      isConnected,
      isConnecting,
      boardName,
      firmwareVersion,
      activePreset,
      supportedPresetsCount,
      isBootloaderMode,
    };
  },
});
</script>
