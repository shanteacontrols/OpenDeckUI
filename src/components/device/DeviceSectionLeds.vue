<template>
  <div class="leds">
    <DeviceSettings
      class="w-full"
      :component-block="Block.Led"
      :component-definition="LedSectionDefinitions"
      :default-data="defaultLedSettingsData"
    >
      <template #default="{ form, onSettingChange }">
        <Section title="LEDs" class="border-b border-gray-900">
          <div
            class="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10"
          >
            <FormField
              :value="form.blinkWithMidiClock"
              :field-definition="LedSectionDefinitions.BlinkWithMidiClock"
              @modified="onSettingChange"
            />
            <FormField
              :value="form.fadeSpeed"
              :field-definition="LedSectionDefinitions.FadeSpeed"
              @modified="onSettingChange"
            />
            <FormField
              :value="form.startupAnimation"
              :field-definition="LedSectionDefinitions.StartupAnimation"
              @modified="onSettingChange"
            />
          </div>
        </Section>
      </template>
    </DeviceSettings>

    <DeviceGrid class="w-full" route-name="device-leds-form" :count="count" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Block,
  defaultLedComponentData,
  defaultLedSettingsData,
  LedSectionDefinitions,
} from "../../definitions";
import { deviceStoreMapped } from "../../store";
import DeviceSettings from "./DeviceSettings.vue";
import DeviceGrid from "./DeviceGrid.vue";

export default defineComponent({
  name: "DeviceSectionLeds",
  setup() {
    return {
      count: deviceStoreMapped.LEDs,
      Block,
      defaultLedComponentData,
      defaultLedSettingsData,
      LedSectionDefinitions,
    };
  },
  components: {
    DeviceSettings,
    DeviceGrid,
  },
});
</script>
