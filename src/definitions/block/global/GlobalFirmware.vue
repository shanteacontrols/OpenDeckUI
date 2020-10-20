<template>
  <Section
    v-if="!bootLoaderSupport && !isBootloaderMode"
    title="No bootloader support"
    class="w-full"
  >
    <p class="mb-6 text-sm leading-5 text-gray-500">
      Your device does not have bootloader support. <br />
      To perform a manual firmware update please consult the
      <a href="https://github.com/paradajz/OpenDeck/wiki/Firmware-update"
        >wiki firmware update page</a
      >.
    </p>
  </Section>
  <Section v-else title="Firmware update" class="w-full">
    <div class="form-grid">
      <div v-if="!isBootloaderMode" class="form-field">
        <Button :disabled="loading" @click.prevent="checkForUpdates">
          Check for updates
        </Button>
        <p class="help-text">
          Check for newer firmware versions.
        </p>
      </div>

      <div v-if="!isBootloaderMode && bootLoaderSupport" class="form-field">
        <Button @click.prevent="startBootLoaderMode">
          Bootloader mode
        </Button>
        <p class="help-text">
          Starting bootloader mode is required for firmware updates. Once in
          bootloader mode the device can be updated using the SysEx file
          downloaded via "Check for updates" button.
        </p>
      </div>

      <div v-if="isBootloaderMode" class="form-field">
        <FormFileInput
          name="backup-file"
          label="Update Firmware"
          :disabled="!isBootloaderMode"
          @change="onFirmwareFileSelected"
        />
        <p class="help-text">
          Select a firmware file to start board firmware update. UI might become
          unresponsive while updating. To exit from bootloader mode reboot the
          device manually.
        </p>
      </div>
    </div>
  </Section>

  <div v-if="loading" class="lg:text-center relative" style="min-height: 50vh;">
    <div class="absolute flex inset-0 opacity-75 bg-gray-900">
      <Spinner class="self-center" />
    </div>
  </div>

  <Section v-else-if="updatesChecked" title="Updates" class="w-full">
    <p v-if="!availableUpdates.length" class="text-sm leading-5 text-gray-200">
      Your firmware is up to date.
    </p>
    <div v-else class="text-sm pb-6">
      <div
        v-for="update in availableUpdates"
        :key="update.name"
        class="release-description text-gray-200"
      >
        <a
          :href="`https://github.com/paradajz/OpenDeck/releases/tag/${update.tag_name}`"
          >{{ update.tag_name }}</a
        >
        <a
          v-if="update.firmwareFileLink"
          class="my-3 ml-4 py-1 px-2 bg-gray-600 text-gray-300 rounded-full text-xs focus:outline-none focus:shadow-outline"
          target="_blank"
          :href="update.firmwareFileLink.browser_download_url"
        >
          Download FW file ({{ firmwareFileName }})
        </a>
        <div v-html="update.html_description"></div>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { deviceStoreMapped } from "../../../store";
import { IOpenDeckRelease } from "../../interface";

export default defineComponent({
  name: "GlobalFirmware",
  setup() {
    const {
      firmwareFileName,
      isBootloaderMode,
      startUpdatesCheck,
      bootLoaderSupport,
      startBootLoaderMode,
      startFirmwareUdate,
    } = deviceStoreMapped;

    const loading = ref(false);
    const updatesChecked = ref(false);
    const availableUpdates = ref<Array<IOpenDeckRelease>>([]);

    const checkForUpdates = async () => {
      loading.value = true;
      availableUpdates.value = await startUpdatesCheck(firmwareFileName.value);
      loading.value = false;
      updatesChecked.value = true;
    };

    const onFirmwareFileSelected = async (fileList) => {
      if (!fileList.length) return;

      await startFirmwareUdate(fileList[0]);
    };

    return {
      firmwareFileName,
      loading,
      isBootloaderMode,
      bootLoaderSupport,
      startBootLoaderMode,
      updatesChecked,
      checkForUpdates,
      availableUpdates,
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
</style>
