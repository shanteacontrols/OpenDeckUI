<template>
  <DeviceSettings
    class="displays flex flex-wrap flex-grow"
    :component-block="Block.Display"
    :component-definition="DisplayDefinitions"
    :default-data="defaultDisplayData"
  >
    <template #default="{ form, showField, onSettingChange }">
      <Section title="Display Features" class="w-full">
        <div class="form-grid">
          <FormField
            v-if="showField(DisplayDefinitions.EnableDisplay)"
            :value="form.enableDisplay"
            :field-definition="DisplayDefinitions.EnableDisplay"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(DisplayDefinitions.WelcomeMessage)"
            :value="form.welcomeMessage"
            :field-definition="DisplayDefinitions.WelcomeMessage"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(DisplayDefinitions.ShowVersionsOnStartup)"
            :value="form.showVersionsOnStartup"
            :field-definition="DisplayDefinitions.ShowVersionsOnStartup"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(DisplayDefinitions.AlternateMidiNoteDisplay)"
            :value="form.alternateMidiNoteDisplay"
            :field-definition="DisplayDefinitions.AlternateMidiNoteDisplay"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(DisplayDefinitions.DisplayController)"
            :value="form.displayController"
            :field-definition="DisplayDefinitions.DisplayController"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(DisplayDefinitions.DisplayResolution)"
            :value="form.displayResolution"
            :field-definition="DisplayDefinitions.DisplayResolution"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(DisplayDefinitions.MidiEventRetentionTime)"
            :value="form.midiEventRetentionTime"
            :field-definition="DisplayDefinitions.MidiEventRetentionTime"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(DisplayDefinitions.OctaveNormalizationValue)"
            :value="form.octaveNormalizationValue"
            :field-definition="DisplayDefinitions.OctaveNormalizationValue"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(DisplayDefinitions.I2CAddress)"
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

export default defineComponent({
  name: "DeviceSectionDisplay",
  components: {
    DeviceSettings,
  },
  setup() {
    return {
      Block,
      defaultDisplayData,
      DisplayDefinitions,
    };
  },
});
</script>
