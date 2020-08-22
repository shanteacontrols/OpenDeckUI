<template>
  <DeviceSettings
    class="global flex flex-wrap flex-grow"
    :component-block="Block.Global"
    :component-definition="GlobalDefinitions"
    :default-data="defaultGlobalData"
  >
    <template #default="{ form, showField, onSettingChange }">
      <Section title="Presets">
        <div class="form-grid">
          <FormField
            v-if="showField(GlobalDefinitions.ActivePreset)"
            :value="form.activePreset"
            :field-definition="GlobalDefinitions.ActivePreset"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(GlobalDefinitions.PreservePresetState)"
            class="col-span-2"
            :value="form.preservePresetState"
            :field-definition="GlobalDefinitions.PreservePresetState"
            @modified="onSettingChange"
          />
        </div>
      </Section>

      <Section title="MIDI">
        <div class="form-grid">
          <FormField
            v-if="showField(GlobalDefinitions.StandardNoteOff)"
            :value="form.standardNoteOff"
            :field-definition="GlobalDefinitions.StandardNoteOff"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(GlobalDefinitions.DinMidiState)"
            :value="form.dinMidiState"
            :field-definition="GlobalDefinitions.DinMidiState"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(GlobalDefinitions.MidiMergeEnable)"
            :value="form.midiMergeEnable"
            :field-definition="GlobalDefinitions.MidiMergeEnable"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(GlobalDefinitions.RunningStatus)"
            :value="form.runningStatus"
            :field-definition="GlobalDefinitions.RunningStatus"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(GlobalDefinitions.MidiMergeType)"
            :value="form.midiMergeType"
            :field-definition="GlobalDefinitions.MidiMergeType"
            @modified="onSettingChange"
          />
        </div>
      </Section>

      <DeviceSectionHardware class="w-full" />
    </template>
  </DeviceSettings>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block, defaultGlobalData, GlobalDefinitions } from "../../definitions";
import DeviceSettings from "./DeviceSettings.vue";
import DeviceSectionHardware from "./DeviceSectionHardware.vue";

export default defineComponent({
  name: "DeviceSectionGlobal",
  components: {
    DeviceSettings,
    DeviceSectionHardware,
  },
  setup() {
    return {
      Block,
      defaultGlobalData,
      GlobalDefinitions,
    };
  },
});
</script>
