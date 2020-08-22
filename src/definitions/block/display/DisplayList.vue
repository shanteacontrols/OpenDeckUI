<template>
  <DeviceSettings
    class="displays flex flex-wrap flex-grow"
    :block="Block.Display"
  >
    <template #default="{ form, showField, onSettingChange }">
      <Section title="Display Features" class="w-full">
        <div class="form-grid">
          <FormField
            v-if="showField(sections.EnableDisplay)"
            :value="form.enableDisplay"
            :field-definition="sections.EnableDisplay"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.WelcomeMessage)"
            :value="form.welcomeMessage"
            :field-definition="sections.WelcomeMessage"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.ShowVersionsOnStartup)"
            :value="form.showVersionsOnStartup"
            :field-definition="sections.ShowVersionsOnStartup"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.AlternateMidiNoteDisplay)"
            :value="form.alternateMidiNoteDisplay"
            :field-definition="sections.AlternateMidiNoteDisplay"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.DisplayController)"
            :value="form.displayController"
            :field-definition="sections.DisplayController"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.DisplayResolution)"
            :value="form.displayResolution"
            :field-definition="sections.DisplayResolution"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.MidiEventRetentionTime)"
            :value="form.midiEventRetentionTime"
            :field-definition="sections.MidiEventRetentionTime"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.OctaveNormalizationValue)"
            :value="form.octaveNormalizationValue"
            :field-definition="sections.OctaveNormalizationValue"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.I2CAddress)"
            :value="form.i2CAddress"
            :field-definition="sections.I2CAddress"
            @modified="onSettingChange"
          />
        </div>
      </Section>
    </template>
  </DeviceSettings>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "../../interface";
import { DisplayBlock } from "./display";

export default defineComponent({
  name: "DisplayList",
  setup() {
    const { sections } = DisplayBlock;

    return {
      Block,
      sections,
    };
  },
});
</script>
