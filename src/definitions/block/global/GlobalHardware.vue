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
          Reset your board to it's factory settings.
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
import { useConfirmPrompt } from "../../../composables";

export default defineComponent({
  name: "GlobalHardware",
  setup() {
    const {
      valueSize,
      bootLoaderSupport,
      startFactoryReset,
      startReboot,
    } = deviceStoreMapped;

    const modalVisible = ref(false);
    const modalTitle = ref("");
    const availableUpdates = ref([]);

    const onFactoryResetClicked = useConfirmPrompt(
      "This will reset all parameters on the board to their factory settings. Continue?",
      startFactoryReset,
    );

    return {
      modalVisible,
      modalTitle,
      availableUpdates,
      onFactoryResetClicked,
      valueSize,
      bootLoaderSupport,
      startReboot,
    };
  },
});
</script>
