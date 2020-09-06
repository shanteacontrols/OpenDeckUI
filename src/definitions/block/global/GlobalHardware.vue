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
        <FormFileInput
          name="backup-file"
          label="Restore from Backup file"
          @change="onBackupFileSelected"
        />
        <p class="help-text">
          Select a backup file to restore your board configuration.
        </p>
      </div>

      <div v-if="bootLoaderSupport" class="form-field">
        <ButtonLink :to="{ name: 'device-firmware-update' }">
          Firmware section
        </ButtonLink>
        <p class="help-text">
          Open the Firmware updates section
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
    const availableUpdates = ref([]);

    const onBackupFileSelected = (fileList) => {
      if (!fileList.length) return;

      deviceStoreMapped.startRestore(fileList[0]);
    };

    return {
      ...deviceStoreMapped,
      modalVisible,
      modalTitle,
      availableUpdates,
      onBackupFileSelected,
    };
  },
});
</script>
