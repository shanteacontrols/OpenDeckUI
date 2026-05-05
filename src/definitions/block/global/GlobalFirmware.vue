<template>
  <Section title="Firmware update" class="w-full">
    <div class="form-grid firmware-form-grid">
      <div v-if="showNormalControls" class="form-field">
        <Button :disabled="loading" @click.prevent="checkForUpdates">
          Check for updates
        </Button>
        <p class="help-text">
          Check for newer firmware versions.
        </p>
      </div>

      <div
        v-if="showNormalControls && isFirmwareUpdateSupported"
        class="form-field"
      >
        <Button :disabled="loading" @click.prevent="onBootLoaderModeClicked">
          Bootloader mode
        </Button>
        <p class="help-text">
          Reboots the board into WebUSB firmware update mode. The configurator
          will wait for the WebUSB DFU device to appear.
        </p>
      </div>

      <div v-if="showWebUsbConnectButton" class="form-field">
        <Button :disabled="isWebUsbBusy" @click.prevent="onConnectDfuDevice">
          Connect DFU device
        </Button>
        <p class="help-text">
          Waiting for the WebUSB DFU device. Previously paired DFU devices are
          connected automatically. Use this button only when the browser needs
          a first-time WebUSB pairing.
        </p>
      </div>

      <div v-if="showWebUsbInterface" class="form-field">
        <FormFileInput
          name="webusb-firmware-file"
          label="Update Firmware"
          :disabled="isWebUsbBusy"
          @change="onFirmwareFileSelected"
        />
        <p class="help-text">
          <template v-if="dfuDeviceLabel">
            Connected DFU device: {{ dfuDeviceLabel }}.
          </template>
          <template v-else>
            WebUSB DFU device connected.
          </template>
          Select a `dfu.bin` firmware file to start the update.
        </p>
      </div>

      <div
        v-if="Number.isInteger(dfuProgress)"
        class="form-field firmware-progress lg:col-span-3 md:col-span-2"
      >
        <label class="text-sm leading-5 text-foreground">Upload progress</label>
        <div class="inline-progress mt-2">
          <div
            class="inline-progress-bar"
            :style="{ width: `${dfuProgress}%` }"
          >
            {{ dfuProgress }}%
          </div>
        </div>
      </div>
    </div>

  </Section>

  <div v-if="loading" class="lg:text-center relative" style="min-height: 50vh;">
    <SpinnerOverlay />
  </div>

  <Section v-else-if="updatesChecked" title="Updates" class="w-full">
    <div class="form-grid firmware-form-grid">
      <div class="form-field lg:col-span-3 md:col-span-2">
        <p
          v-if="!availableUpdates.length"
          class="text-sm leading-5 text-foreground"
        >
          Your firmware is up to date.
        </p>
        <div v-else class="text-sm pb-6">
          <div
            v-for="update in availableUpdates"
            :key="update.name"
            class="release-description text-foreground"
          >
            <a
              :href="`https://github.com/paradajz/OpenDeck/releases/tag/${update.tag_name}`"
              >{{ update.tag_name }}</a
            >
            <a
              v-if="update.firmwareFileLink"
              class="my-3 ml-4 py-1 px-2 bg-gray-600 text-foreground rounded-full text-xs focus:outline-none focus:shadow-outline"
              target="_blank"
              :href="update.firmwareFileLink.browser_download_url"
            >
              Download FW file ({{ firmwareFileName }})
            </a>
            <div v-html="update.html_description"></div>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { deviceStoreMapped } from "../../../store";
import { IOpenDeckRelease } from "../../interface";
import { DfuState, DfuTransport } from "../../device";

export default defineComponent({
  name: "GlobalFirmware",
  setup() {
    const {
      firmwareFileName,
      isBootloaderMode,
      startUpdatesCheck,
      isFirmwareUpdateSupported,
      startBootLoaderMode,
      startFirmwareUpdate,
      connectDfuDevice,
      dfuState,
      dfuTransport,
      dfuProgress,
      dfuError,
      dfuDeviceLabel,
    } = deviceStoreMapped;

    const loading = ref(false);
    const updatesChecked = ref(false);
    const availableUpdates = ref<Array<IOpenDeckRelease>>([]);

    const showNormalControls = computed(
      () => dfuState.value === DfuState.Idle && !isBootloaderMode.value,
    );
    const showWebUsbConnectButton = computed(
      () =>
        [DfuState.WaitingForDfuDevice, DfuState.Error].includes(dfuState.value),
    );
    const showWebUsbInterface = computed(
      () =>
        dfuTransport.value === DfuTransport.WebUsb &&
        [
          DfuState.DfuReady,
          DfuState.Uploading,
          DfuState.WaitingForApplication,
        ].includes(dfuState.value),
    );
    const isWebUsbBusy = computed(() =>
      [
        DfuState.RebootingToBootloader,
        DfuState.Uploading,
        DfuState.WaitingForApplication,
      ].includes(dfuState.value),
    );
    const checkForUpdates = async () => {
      loading.value = true;
      availableUpdates.value = await startUpdatesCheck(firmwareFileName.value);
      loading.value = false;
      updatesChecked.value = true;
    };

    const onBootLoaderModeClicked = async () => {
      loading.value = true;
      try {
        await startBootLoaderMode();
      } finally {
        loading.value = false;
      }
    };

    const onConnectDfuDevice = async () => {
      await connectDfuDevice();
    };

    const onFirmwareFileSelected = async (fileList) => {
      if (!fileList.length) return;

      await startFirmwareUpdate(fileList[0]);
    };

    return {
      DfuState,
      firmwareFileName,
      loading,
      isBootloaderMode,
      isFirmwareUpdateSupported,
      updatesChecked,
      availableUpdates,
      dfuState,
      dfuProgress,
      dfuError,
      dfuDeviceLabel,
      showNormalControls,
      showWebUsbConnectButton,
      showWebUsbInterface,
      isWebUsbBusy,
      checkForUpdates,
      onBootLoaderModeClicked,
      onConnectDfuDevice,
      onFirmwareFileSelected,
    };
  },
});
</script>

<style>
.release-description {
  margin-bottom: 1em;
}
.release-description h1,
.release-description h2,
.release-description h3 {
  font-weight: bold;
}
.release-description ul {
  margin-left: 2em;
  list-style: circle;
}
.firmware-form-grid {
  align-items: start;
}
.firmware-progress {
  align-self: start;
}
.inline-progress {
  width: 100%;
  overflow: hidden;
  border-radius: 0.375rem;
  background: rgba(75, 85, 99, 0.8);
}
.inline-progress-bar {
  min-height: 1.5rem;
  background: theme("colors.accent");
  color: theme("colors.on-accent");
  text-align: center;
  font-size: 0.75rem;
  line-height: 1.5rem;
  white-space: nowrap;
}
</style>
