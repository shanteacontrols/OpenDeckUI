<template>
  <div class="leds">
    <DeviceSettings
      class="w-full"
      :component-block="Block.Led"
      :component-definition="LedSectionDefinitions"
      :default-data="defaultLedSettingsData"
    >
      <template #default="{ form, showField, onSettingChange }">
        <Section title="Global">
          <div class="form-grid">
            <FormField
              v-if="showField(LedSectionDefinitions.BlinkWithMidiClock)"
              :value="form.blinkWithMidiClock"
              :field-definition="LedSectionDefinitions.BlinkWithMidiClock"
              @modified="onSettingChange"
            />
            <FormField
              v-if="showField(LedSectionDefinitions.FadeSpeed)"
              :value="form.fadeSpeed"
              :field-definition="LedSectionDefinitions.FadeSpeed"
              @modified="onSettingChange"
            />
            <FormField
              v-if="showField(LedSectionDefinitions.StartupAnimation)"
              :value="form.startupAnimation"
              :field-definition="LedSectionDefinitions.StartupAnimation"
              @modified="onSettingChange"
            />
          </div>
        </Section>
      </template>
    </DeviceSettings>

    <DeviceGrid
      class="w-full"
      route-name="device-leds-form"
      :block="Block.Led"
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
import DeviceSettings from "./DeviceSettings.vue";
import DeviceGrid from "./DeviceGrid.vue";

export default defineComponent({
  name: "DeviceSectionLeds",
  components: {
    DeviceSettings,
    DeviceGrid,
  },
  setup() {
    return {
      Block,
      defaultLedComponentData,
      defaultLedSettingsData,
      LedSectionDefinitions,
    };
  },
});
</script>
