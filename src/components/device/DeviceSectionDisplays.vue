<template>
  <DeviceSettings
    class="displays flex flex-wrap flex-grow"
    :component-block="Block.Display"
    :component-definition="DisplayDefinitions"
    :default-data="defaultDisplayData"
  >
    <template #default="{ form, onSettingChange }">
      <Section title="Display Features" class="w-full">
        <div class="w-full pb-8 grid gap-6 grid-col-1 md:grid-cols-2">
          <FormField
            :value="form.enableDisplay"
            :field-definition="DisplayDefinitions.EnableDisplay"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.welcomeMessage"
            :field-definition="DisplayDefinitions.WelcomeMessage"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.showVersionsOnStartup"
            :field-definition="DisplayDefinitions.ShowVersionsOnStartup"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.alternateMidiNoteDisplay"
            :field-definition="DisplayDefinitions.AlternateMidiNoteDisplay"
            @modified="onSettingChange"
          />
        </div>
      </Section>
      <Section title="Display Settings" class="w-full">
        <div
          class="w-full pb-8 grid gap-6 md:grid-cols-2 xl:gap-10 xl:grid-cols-2"
        >
          <FormField
            :value="form.displayController"
            :field-definition="DisplayDefinitions.DisplayController"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.displayResolution"
            :field-definition="DisplayDefinitions.DisplayResolution"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.midiEventRetentionTime"
            :field-definition="DisplayDefinitions.MidiEventRetentionTime"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.octaveNormalizationValue"
            :field-definition="DisplayDefinitions.OctaveNormalizationValue"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.i2CAddress"
            :field-definition="DisplayDefinitions.I2CAddress"
            @modified="onSettingChange"
          />
        </div>
      </Section>
    </template>
  </DeviceSettings>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Block,
  defaultDisplayData,
  DisplayDefinitions,
} from "../../definitions";
import DeviceSettings from "./DeviceSettings.vue";
import { defaultTheme } from "./../../definitions";

export default defineComponent({
  name: "DeviceSectionDisplay",
  setup() {
    return {
      ...defaultTheme,
      Block,
      defaultDisplayData,
      DisplayDefinitions,
    };
  },
  components: {
    DeviceSettings,
  },
});
</script>
