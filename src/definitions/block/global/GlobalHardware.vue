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
        <Button @click.prevent="onFactoryResetClicked">
          Reset to factory settings
        </Button>
        <p class="help-text">
          Resets the device to its factory settings.
        </p>
      </div>

      <div v-if="bootLoaderSupport" class="form-field">
        <ButtonLink :to="{ name: 'device-firmware-update' }">
          Firmware section
        </ButtonLink>
        <p class="help-text">
          Section used to reboot the device into bootloader mode and update the firmware.
        </p>
      </div>
    </div>
  </Section>
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
          Select a backup file to restore your device configuration.
        </p>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { deviceStoreMapped } from "../../../store";
import { useConfirmPrompt } from "../../../composables";

export default defineComponent({
  name: "GlobalHardware",
  setup() {
    const {
      valueSize,
      bootLoaderSupport,
      startFactoryReset,
      startReboot,
      startBackup,
    } = deviceStoreMapped;

    const modalVisible = ref(false);
    const modalTitle = ref("");
    const availableUpdates = ref([]);

    const onFactoryResetClicked = useConfirmPrompt(
      "This will reset all parameters on the board to their factory settings. Continue?",
      startFactoryReset,
    );

    const onBackupFileSelected = (fileList) => {
      if (!fileList.length) return;

      deviceStoreMapped.startRestore(fileList[0]);
    };

    const onBackupClicked = useConfirmPrompt(
      "This will initiate a full backup of all parameters stored on the board. Depending on your board this can take up to 2 minutes. Proceed?",
      startBackup,
    );

    return {
      modalVisible,
      modalTitle,
      availableUpdates,
      onFactoryResetClicked,
      valueSize,
      bootLoaderSupport,
      startReboot,
      onBackupClicked,
      onBackupFileSelected,
    };
  },
});
</script>
