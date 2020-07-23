<template>
  <DeviceComponentSettings
    class="displays flex flex-wrap flex-grow"
    :component-block="Block.Display"
    :component-definition="DisplayDefinitions"
    :default-data="defaultDisplayData"
  >
    <template #default="{ form, onValueChange }">
      <Section title="Displays" class="w-full xl:w-1/3">
        <div
          class="w-full pb-8 grid gap-6 grid-col-1 md:grid-cols-2 xl:grid-cols-1"
        >
          <FormField
            :value="form.enableDisplay"
            :field-definition="DisplayDefinitions.EnableDisplay"
            @modified="onValueChange"
          />
          <FormField
            :value="form.displayController"
            :field-definition="DisplayDefinitions.DisplayController"
            @modified="onValueChange"
          />
          <FormField
            :value="form.displayResolution"
            :field-definition="DisplayDefinitions.DisplayResolution"
            @modified="onValueChange"
          />
          <FormField
            :value="form.i2CAddress"
            :field-definition="DisplayDefinitions.I2CAddress"
            @modified="onValueChange"
          />
        </div>
      </Section>
      <Section title="Displays MIDI" class="w-full xl:w-2/3">
        <div
          class="w-full pb-8 grid gap-6 md:grid-cols-2 xl:gap-10 xl:grid-cols-2"
        >
          <FormField
            :value="form.welcomeMessage"
            :field-definition="DisplayDefinitions.WelcomeMessage"
            @modified="onValueChange"
          />
          <FormField
            :value="form.showVersionsOnStartup"
            :field-definition="DisplayDefinitions.ShowVersionsOnStartup"
            @modified="onValueChange"
          />
          <FormField
            :value="form.alternateMidiNoteDisplay"
            :field-definition="DisplayDefinitions.AlternateMidiNoteDisplay"
            @modified="onValueChange"
          />
          <FormField
            :value="form.midiEventRetentionTime"
            :field-definition="DisplayDefinitions.MidiEventRetentionTime"
            @modified="onValueChange"
          />
          <FormField
            :value="form.octaveNormalizationValue"
            :field-definition="DisplayDefinitions.OctaveNormalizationValue"
            @modified="onValueChange"
          />
        </div>
      </Section>
    </template>
  </DeviceComponentSettings>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Block,
  defaultDisplayData,
  DisplayDefinitions,
} from "../../definitions";
import DeviceComponentSettings from "./DeviceComponentSettings.vue";
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
    DeviceComponentSettings,
  },
});
</script>
