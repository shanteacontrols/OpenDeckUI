<template>
  <Section title="Hardware settings" class="w-full">
    <div class="w-full pb-8 grid gap-6 md:grid-cols-2 xl:gap-10">
      <div class="form-field">
        <label class="block mb-2 text-sm font-bold text-gray-400">
          Reboot
        </label>
        <button
          class="my-3 py-2 px-3 bg-gray-600 text-gray-300 rounded-full text-xs focus:outline-none focus:shadow-outline"
          @click.prevent="startReboot"
        >
          Reboot the device
        </button>
        <p class="text-sm leading-5 text-gray-500">
          Rebooting the device will make the UI temporarily unavailable.
        </p>
      </div>

      <div class="form-field">
        <label class="block mb-2 text-sm font-bold text-gray-400">
          Factory reset
        </label>
        <button
          class="my-3 py-2 px-3 bg-gray-600 text-gray-300 rounded-full text-xs focus:outline-none focus:shadow-outline"
          @click.prevent="startFactoryReset"
        >
          Reset to factory settings
        </button>
        <p class="text-sm leading-5 text-gray-500">
          Reset your board to it's factory settings.
        </p>
      </div>

      <div v-if="bootLoaderSupport" class="form-field">
        <label class="block mb-2 text-sm font-bold text-gray-400">
          Bootloader
        </label>
        <button
          class="my-3 py-2 px-3 bg-gray-600 text-gray-300 rounded-full text-xs focus:outline-none focus:shadow-outline"
          @click.prevent="startBootLoaderMode"
        >
          Start bootloader mode
        </button>
        <p class="text-sm leading-5 text-gray-500">
          Starting bootloader mode is required for manual firmware updates. The
          UI may become unresponsive in bootloader mode.
        </p>
      </div>

      <div v-if="bootLoaderSupport" class="form-field">
        <label class="block mb-2 text-sm font-bold text-gray-400">
          Firmware update
        </label>
        <router-link
          class="my-3 inline-block py-2 px-3 bg-gray-600 text-gray-300 rounded-full text-xs focus:outline-none focus:shadow-outline"
          :to="{ name: 'device-firmware-update' }"
        >
          Open firmware update page
        </router-link>
        <p class="text-sm leading-5 text-gray-500">
          Check if for newer firmware versions. If updates are available and
          supported you can update the firmware here.
        </p>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { deviceStoreMapped } from "../../store";

export default defineComponent({
  name: "DeviceSectionHardware",
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

    return {
      ...deviceStoreMapped,
      modalVisible,
      modalTitle,
      systemRequestLoading,
      showModal,
      checkForUpdates,
      availableUpdates,
      updateFirmwareToVersion,
    };
  },
});
</script>
