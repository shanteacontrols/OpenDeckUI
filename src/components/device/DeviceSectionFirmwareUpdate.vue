<template>
  <Section title="Firmware update" class="w-full">
    <p v-if="!bootLoaderSupport" class="mb-6 text-sm leading-5 text-gray-500">
      Your device does not have bootloader support. <br />
      To perform a manual firmware update please consult the
      <a href="https://github.com/paradajz/OpenDeck/wiki/Firmware-update"
        >wiki firmware update page</a
      >.
    </p>
    <div v-else>
      <div class="form-field">
        <p class="text-sm leading-5 text-gray-500">
          Check for newer firmware versions. If updates are available and
          supported you can update the firmware here.
        </p>
        <Button :disabled="loading" @click.prevent="checkForUpdates">
          Check for available updates
        </Button>
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
import { deviceStoreMapped } from "../../store";

export default defineComponent({
  name: "DeviceSectionFirmwareUpdate",
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
      await deviceStoreMapped.startFirmwareUpdate(tagName);
      loading.value = false;
    };

    return {
      ...deviceStoreMapped,
      loading,
      updatesChecked,
      checkForUpdates,
      availableUpdates,
      updateFirmwareToVersion,
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
