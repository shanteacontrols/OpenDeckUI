<template>
  <div class="leds">
    <DeviceComponentSettings
      class="w-full"
      :component-block="Block.Led"
      :component-definition="LedSectionDefinitions"
      :default-data="defaultLedSettingsData"
    >
      <template #default="{ form, onValueChange }">
        <Section title="LEDs" class="border-b border-gray-900">
          <div
            class="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xl:gap-10"
          >
            <FormField
              :value="form.blinkWithMidiClock"
              :field-definition="LedSectionDefinitions.BlinkWithMidiClock"
              @modified="onValueChange"
            />
            <FormField
              :value="form.fadeSpeed"
              :field-definition="LedSectionDefinitions.FadeSpeed"
              @modified="onValueChange"
            />
            <FormField
              :value="form.startupAnimation"
              :field-definition="LedSectionDefinitions.StartupAnimation"
              @modified="onValueChange"
            />
          </div>
        </Section>
      </template>
    </DeviceComponentSettings>

    <DeviceComponentGrid
      class="w-full"
      route-name="device-leds-form"
      :count="count"
    />
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
import DeviceComponentSettings from "./DeviceComponentSettings.vue";
import DeviceComponentGrid from "./DeviceComponentGrid.vue";

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
    DeviceComponentSettings,
    DeviceComponentGrid,
  },
});
</script>
