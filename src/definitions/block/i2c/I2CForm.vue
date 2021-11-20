<template>
  <DeviceSettings class="i2c flex flex-wrap flex-grow" :block="Block.Display">
    <template #default="{ form, showField, onSettingChange }">
      <Section title="Display">
        <div class="form-grid">
          <FormField
            :value="form.enableDisplay"
            :field-definition="sections.EnableDisplay"
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
            v-if="showField(sections.DeviceInfoOnStartup)"
            :value="form.deviceInfoStartup"
            :field-definition="sections.DeviceInfoOnStartup"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.AlternateMidiNoteDisplay)"
            :value="form.alternateMidiNoteDisplay"
            :field-definition="sections.AlternateMidiNoteDisplay"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.MidiEventRetentionTime)"
            :value="form.midiEventRetentionTime"
            :field-definition="sections.MidiEventRetentionTime"
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
import { DisplayBlock } from "./i2c";

export default defineComponent({
  name: "Display",
  setup() {
    const { sections } = DisplayBlock;

    return {
      Block,
      sections,
    };
  },
});
</script>
