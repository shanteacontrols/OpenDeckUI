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
  <template v-else>
    <Section title="Backup & Restore" class="w-full">
      <div class="form-grid">
        <div class="form-field">
          <Button @click.prevent="onBackupClicked">
            Backup
          </Button>
          <p class="help-text">
            Download a backup of your configuration (incl presets).
          </p>
        </div>
        <div class="form-field">
          <FormFileInput
            label="Restore"
            name="backup-file"
            @change="onBackupFileSelected"
          />
          <p class="help-text">
            Select a backup file to restore your board configuration.
          </p>
        </div>
      </div>
    </Section>

    <Section title="Firmware update" class="w-full">
      <div class="form-grid">
        <div class="form-field">
          <Button :disabled="loading" @click.prevent="checkForUpdates">
            Check for Updates
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
            Starting bootloader mode is required for manual firmware updates.
            The UI will be restricted in bootloader mode.
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
            Select a firmware file to start board firmware update. UI might
            become unresponsive while updating.
          </p>
        </div>
      </div>
    </Section>
  </template>

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
import { IOpenDeckRelease } from "../../interface";
import { useConfirmPrompt } from "../../../composables";

export default defineComponent({
  name: "GlobalFirmware",
  setup() {
    const {
      isBootloaderMode,
      startUpdatesCheck,
      bootLoaderSupport,
      startBootLoaderMode,
      startFirmwareUdate,
      startFirmwareUpdateRemote,
      startBackup,
    } = deviceStoreMapped;

    const loading = ref(false);
    const updatesChecked = ref(false);
    const availableUpdates = ref<Array<IOpenDeckRelease>>([]);

    const checkForUpdates = async () => {
      loading.value = true;
      availableUpdates.value = await startUpdatesCheck();
      loading.value = false;
      updatesChecked.value = true;
    };

    const updateFirmwareToVersion = async (tagName: string) => {
      loading.value = true;
      await startFirmwareUpdateRemote(tagName);
      loading.value = false;
    };

    const onFirmwareFileSelected = async (fileList) => {
      if (!fileList.length) return;

      startFirmwareUdate(fileList[0]);
    };

    const onBackupFileSelected = (fileList) => {
      if (!fileList.length) return;

      deviceStoreMapped.startRestore(fileList[0]);
    };

    const onBackupClicked = useConfirmPrompt(
      "This will initiate a full backup of all parameters stored on the board. Depending on your board this can take up to 2 minutes. Proceed?",
      startBackup,
    );

    return {
      loading,
      isBootloaderMode,
      bootLoaderSupport,
      startBootLoaderMode,
      updatesChecked,
      checkForUpdates,
      availableUpdates,
      updateFirmwareToVersion,
      onFirmwareFileSelected,
      onBackupClicked,
      onBackupFileSelected,
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
