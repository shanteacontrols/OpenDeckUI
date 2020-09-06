<template>
  <Section title="Firmware update" class="w-full">
    <p
      v-if="!bootLoaderSupport && !isBootloaderMode"
      class="mb-6 text-sm leading-5 text-gray-500"
    >
      Your device does not have bootloader support. <br />
      To perform a manual firmware update please consult the
      <a href="https://github.com/paradajz/OpenDeck/wiki/Firmware-update"
        >wiki firmware update page</a
      >.
    </p>
    <div v-else class="form-grid">
      <div class="form-field">
        <Button :disabled="loading" @click.prevent="checkForUpdates">
          Check for available updates
        </Button>
        <p class="help-text">
          Check for newer firmware versions. If updates are available and
          supported you can update the firmware here.
        </p>
      </div>

      <div v-if="!isBootloaderMode && bootLoaderSupport" class="form-field">
        <Button @click.prevent="startBootLoaderMode">
          Bootloader mode
        </Button>
        <p class="help-text">
          Starting bootloader mode is required for manual firmware updates. The
          UI will be restricted in bootloader mode.
        </p>
      </div>

      <div class="form-field">
        <FormFileInput
          name="backup-file"
          label="Update firmware using custom file"
          :disabled="!isBootloaderMode"
          @change="onFirmwareFileSelected"
        />
        <p v-if="isBootloaderMode" class="help-text">
          Select a firmware file to update your board firmware.
        </p>
        <p class="help-text">
          Start bootloader mode to use a custom firmware file.
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
    <p v-if="!availableUpdates.length" class="text-sm leading-5 text-gray-500">
      Your firmware is up to date.
    </p>
    <div v-else class="text-sm">
      <div
        v-for="update in availableUpdates"
        :key="update.name"
        class="release-description text-gray-500"
      >
        <a
          :href="`https://github.com/paradajz/OpenDeck/releases/tag/${update.tag_name}`"
          >{{ update.tag_name }}</a
        >
        <button
          class="my-3 ml-4 py-1 px-2 bg-gray-600 text-gray-300 rounded-full text-xs focus:outline-none focus:shadow-outline"
          @click.prevent="() => updateFirmwareToVersion(update.tag_name)"
        >
          update to this version
        </button>
        <br />
        <div v-html="update.html_description"></div>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { deviceStoreMapped } from "../../../store";

export default defineComponent({
  name: "GlobalFirmware",
  setup() {
    const loading = ref(false);
    const updatesChecked = ref(false);
    const availableUpdates = ref([]);

    const checkForUpdates = async () => {
      loading.value = true;
      availableUpdates.value = await deviceStoreMapped.startUpdatesCheck();
      loading.value = false;
      updatesChecked.value = true;
    };

    const updateFirmwareToVersion = async (tagName: string) => {
      loading.value = true;
      await deviceStoreMapped.startFirmwareUpdateRemote(tagName);
      loading.value = false;
    };

    const onFirmwareFileSelected = (fileList) => {
      if (!fileList.length) return;

      deviceStoreMapped.startFirmwareUdate(fileList[0]);
    };

    return {
      ...deviceStoreMapped,
      loading,
      updatesChecked,
      checkForUpdates,
      availableUpdates,
      updateFirmwareToVersion,
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
