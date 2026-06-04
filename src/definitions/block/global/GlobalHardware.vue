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
        <Button :disabled="!isConfigBlessed" @click.prevent="onFactoryResetClicked">
          Reset to factory settings
        </Button>
        <p class="help-text">
          Resets the device to its factory settings.
        </p>
      </div>

      <div v-if="showFirmwareSection" class="form-field">
        <ButtonLink
          v-if="isConfigBlessed"
          :to="{ name: 'device-firmware-update' }"
        >
          Firmware section
        </ButtonLink>
        <Button v-else disabled>
          Firmware section
        </Button>
        <p class="help-text">
          Section used to update the device firmware.
        </p>
      </div>
    </div>
  </Section>
  <Section v-if="valueSize === 2" title="Backup & Restore" class="w-full">
    <div class="form-grid">
      <div class="form-field">
        <Button :disabled="!isConfigBlessed" @click.prevent="onBackupClicked">
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
          :disabled="!isConfigBlessed"
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
import { computed, defineComponent, ref, watchEffect } from "vue";
import { deviceStoreMapped } from "../../../store";
import { useConfirmPrompt } from "../../../composables";
import { logger } from "../../../util";

export default defineComponent({
  name: "GlobalHardware",
  setup() {
    const {
      valueSize,
      isFirmwareUpdateSupported,
      bootLoaderSupport,
      stagedUpdateSupport,
      transportType,
      startFactoryReset,
      startReboot,
      startBackup,
      isConfigBlessed,
    } = deviceStoreMapped;

    const modalVisible = ref(false);
    const modalTitle = ref("");
    const availableUpdates = ref([]);
    const showFirmwareSection = computed(
      () =>
        isFirmwareUpdateSupported.value &&
        bootLoaderSupport.value === true,
    );

    watchEffect(() => {
      logger.log("Firmware section visibility:", {
        isFirmwareUpdateSupported: isFirmwareUpdateSupported.value,
        bootLoaderSupport: bootLoaderSupport.value,
        stagedUpdateSupport: stagedUpdateSupport.value,
        transportType: transportType.value,
        showFirmwareSection: showFirmwareSection.value,
      });
    });

    const onFactoryResetClicked = useConfirmPrompt(
      "This will reset all the parameters on the board to their factory settings. All analog inputs will be disabled as well. Depending on the board, this can take up to 30 seconds. Proceed?",
      () => isConfigBlessed.value && startFactoryReset(),
    );

    const onBackupFileSelected = (fileList) => {
      if (!isConfigBlessed.value) return;
      if (!fileList.length) return;

      deviceStoreMapped.startRestore(fileList[0]);
    };

    const onBackupClicked = useConfirmPrompt(
      "This will initiate a full backup of all parameters stored on the board. Proceed?",
      () => isConfigBlessed.value && startBackup(),
    );

    return {
      modalVisible,
      modalTitle,
      availableUpdates,
      showFirmwareSection,
      onFactoryResetClicked,
      valueSize,
      isFirmwareUpdateSupported,
      isConfigBlessed,
      startReboot,
      onBackupClicked,
      onBackupFileSelected,
    };
  },
});
</script>
