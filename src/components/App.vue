<template>
  <div class="app">
    <nav class="app-header">
      <router-link :to="{ name: 'home' }" class="app-brand">
        <img
          class="app-brand-logo"
          src="/images/logo_notext.svg"
          alt="OpenDeck"
        />
      </router-link>

      <span v-if="!isHomePage && boardName" class="app-board-info">
        <template v-if="isBootloaderMode || isDfuActive">OpenDeck DFU mode</template>
        <template v-else>
          <span class="app-board-info-item">
            <small>Board</small>
            <strong>{{ boardName }}</strong>
          </span>

          <span v-if="firmwareVersion !== null" class="app-board-info-item">
            <small>Firmware</small>
            <strong>{{ firmwareVersionDisplay }}</strong>
          </span>

          <span v-if="supportedPresetsCount > 1" class="app-board-info-item">
            <small>Preset</small>
            <strong>{{ activePreset + 1 }}</strong>
          </span>
        </template>
      </span>
    </nav>

    <div class="app-main">
      <div class="content">
        <Section v-if="!isWebMidiSupported" class="h-screen">
          <div class="max-w-screen-sm mx-auto px-4 pt-24 sm:px-6 lg:px-8">
            <p class="">
              This browser does not support WebMIDI.<br />Please use a Chrome
              based browser:
            </p>
            <p class="mt-4">
              <a href="https://www.google.com/chrome/index.html"
                >Google Chrome</a
              ><br />
              <a href="https://brave.com/">Brave</a><br />
              <a href="https://vivaldi.com/">Vivaldi</a><br />
              <a href="https://www.microsoft.com/en-us/edge">Microsoft Edge</a
              ><br />
            </p>
          </div>
        </Section>

        <Section
          v-else-if="isConnecting"
          class="h-screen"
          title="Establishing connection"
        >
          <div
            class="lg:text-center max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <p>WebMidi connecting</p>
          </div>
          <div class="absolute flex inset-0 opacity-75 bg-surface">
            <Spinner class="self-center" />
          </div>
        </Section>

        <Section
          v-else-if="!isConnected && !isDfuActive"
          class="h-screen"
          :title="isDeviceRoute ? 'Reloading' : 'Problem connecting'"
        >
          <div
            class="lg:text-center max-w-screen-xl mx-auto px-4 pt-24 sm:px-6 lg:px-8"
          >
            <p>
              {{ isDeviceRoute ? "Re-establishing device connection" : "WebMidi failed to conect" }}
            </p>
          </div>
        </Section>

        <router-view v-else />
      </div>
    </div>

    <footer class="site-footer" id="footer">
      <div class="footer-container">
        <div class="footer-info">
          <div class="footer-logo">
            <img src="/images/logo.svg" width="700" alt="OpenDeck" />
          </div>

          <div class="social-icons">
            <ul class="icons">
              <li>
                <a
                  href="https://github.com/shanteacontrols/OpenDeck"
                  target="_blank"
                  rel="noopener"
                  aria-label="GitHub"
                >
                  <svg class="social-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.5 0 12.28c0 5.43 3.44 10.03 8.21 11.65.6.11.82-.27.82-.59v-2.1c-3.34.74-4.04-1.65-4.04-1.65-.55-1.42-1.33-1.8-1.33-1.8-1.09-.76.08-.74.08-.74 1.2.09 1.84 1.27 1.84 1.27 1.07 1.87 2.81 1.33 3.5 1.02.11-.79.42-1.33.76-1.64-2.67-.31-5.47-1.36-5.47-6.07 0-1.34.47-2.44 1.24-3.3-.12-.31-.54-1.56.12-3.25 0 0 1.01-.33 3.3 1.26A11.24 11.24 0 0 1 12 5.93c1.02.01 2.04.14 3 .41 2.29-1.59 3.3-1.26 3.3-1.26.66 1.69.24 2.94.12 3.25.77.86 1.24 1.96 1.24 3.3 0 4.72-2.81 5.75-5.48 6.06.43.38.81 1.12.81 2.26v3.39c0 .32.22.7.82.58C20.56 22.3 24 17.7 24 12.28 24 5.5 18.63 0 12 0z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/shanteacontrolsmidi"
                  target="_blank"
                  rel="noopener"
                  aria-label="Facebook"
                >
                  <svg class="social-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-copyright">
          <div class="footer-text">
            <p>Shantea Controls &copy; 2026</p>
            <p>Zagreb, Croatia</p>
          </div>
        </div>
      </div>
    </footer>
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
    const isDeviceRoute = computed(
      () => router.currentRoute.value.name !== "home",
    );
    const firmwareVersionDisplay = computed(() =>
      firmwareVersion.value ? firmwareVersion.value.replace(/^v/i, "") : "",
    );

    const { isConnected, isConnecting, isWebMidiSupported } = midiStoreMapped;
    const { supportedPresetsCount, isBootloaderMode, isDfuActive } =
      deviceStoreMapped;

    onMounted(() => {
      midiStoreMapped.loadMidi();
    });

    onUnmounted(() => {
      midiStoreMapped.stopMidiConnectionWatcher();
    });

    return {
      isHomePage,
      isDeviceRoute,
      outputId,
      isWebMidiSupported,
      isConnected,
      isConnecting,
      boardName,
      firmwareVersion,
      firmwareVersionDisplay,
      activePreset,
      supportedPresetsCount,
      isBootloaderMode,
      isDfuActive,
    };
  },
});
</script>
