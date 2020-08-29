<template>
  <Section title="Hardware settings">
    <div class="form-grid">
      <div class="form-field">
        <Button @click.prevent="startReboot">
          Reboot
        </Button>
        <p class="help-text">
          Rebooting the device will make the UI temporarily unavailable.
        </p>
      </div>

      <div class="form-field">
        <Button @click.prevent="startFactoryReset">
          Reset to factory settings
        </Button>
        <p class="help-text">
          Reset your board to it's factory settings.
        </p>
      </div>

      <div v-if="valueSize === 2" class="form-field">
        <Button @click.prevent="startBackup">
          Backup
        </Button>
        <p class="help-text">
          Download a backup of your configuration (incl presets).
        </p>
      </div>

      <div v-if="valueSize === 2" class="form-field">
        <div class="dropbox">
          <input
            type="file"
            class="input-file"
            name="selectedBackupFile"
            @change="
              onBackupFileSelected($event.target.name, $event.target.files)
            "
          />
        </div>
        <p class="help-text">
          Select a backup file with to restore your board configuration to.
        </p>
      </div>

      <div v-if="bootLoaderSupport" class="form-field">
        <ButtonLink :to="{ name: 'device-firmware-update' }">
          Firmware update
        </ButtonLink>
        <p class="help-text">
          Check if for newer firmware versions. If updates are available and
          supported you can update the firmware here.
        </p>
      </div>

      <div v-if="bootLoaderSupport" class="form-field">
        <Button @click.prevent="startBootLoaderMode">
          Bootloader mode
        </Button>
        <p class="help-text">
          Starting bootloader mode is required for manual firmware updates. The
          UI may become unresponsive in bootloader mode.
        </p>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { deviceStoreMapped } from "../../../store";

export default defineComponent({
  name: "GlobalHardware",
  setup() {
    const modalVisible = ref(false);
    const modalTitle = ref("");
    const systemRequestLoading = ref(false);
    const availableUpdates = ref([]);
    const showModal = () => (modalVisible.value = true);

    const checkForUpdates = async () => {
      systemRequestLoading.value = true;
      modalTitle.value = "Firmware Update";
      modalVisible.value = true;

      availableUpdates.value = await deviceStoreMapped.startUpdatesCheck();

      systemRequestLoading.value = false;
    };

    const updateFirmwareToVersion = async (tagName: string) => {
      systemRequestLoading.value = true;
      await deviceStoreMapped.startFirmwareUpdate(tagName);
      systemRequestLoading.value = false;
    };

    const onBackupFileSelected = (fieldName, fileList) => {
      if (!fileList.length) return;

      deviceStoreMapped.startRestore(fileList[0]);
    };

    return {
      ...deviceStoreMapped,
      modalVisible,
      modalTitle,
      systemRequestLoading,
      showModal,
      checkForUpdates,
      availableUpdates,
      updateFirmwareToVersion,
      onBackupFileSelected,
    };
  },
});
</script>
