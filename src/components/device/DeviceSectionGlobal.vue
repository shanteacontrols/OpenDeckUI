<template>
  <DeviceSettings
    class="global flex flex-wrap flex-grow"
    :component-block="Block.Global"
    :component-definition="GlobalDefinitions"
    :default-data="defaultGlobalData"
  >
    <template #default="{ form, onSettingChange }">
      <Section title="Presets" class="w-full">
        <div class="w-full pb-8 grid gap-6 grid-col-1 md:grid-cols-2">
          <FormField
            :value="form.preservePresetState"
            :field-definition="GlobalDefinitions.PreservePresetState"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.activePreset"
            :field-definition="GlobalDefinitions.ActivePreset"
            @modified="onSettingChange"
          />
        </div>
      </Section>

      <Section title="MIDI" class="w-full border-t-2 border-gray-900">
        <div class="w-full pb-8 grid gap-6 grid-col-1 md:grid-cols-2">
          <FormField
            :value="form.standardNoteOff"
            :field-definition="GlobalDefinitions.StandardNoteOff"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.dinMidiState"
            :field-definition="GlobalDefinitions.DinMidiState"
            @modified="onSettingChange"
          />
          <FormField
            v-if="!!form.dinMidiState"
            :value="form.midiMergeEnable"
            :field-definition="GlobalDefinitions.MidiMergeEnable"
            @modified="onSettingChange"
          />
          <FormField
            v-if="!!form.dinMidiState"
            :value="form.runningStatus"
            :field-definition="GlobalDefinitions.RunningStatus"
            @modified="onSettingChange"
          />
          <FormField
            v-if="!!form.midiMergeEnable"
            :value="form.midiMergeType"
            :field-definition="GlobalDefinitions.MidiMergeType"
            @modified="onSettingChange"
          />
        </div>
      </Section>

      <DeviceSectionHardware class="w-full border-t-2 border-gray-900" />
    </template>
  </DeviceSettings>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block, defaultGlobalData, GlobalDefinitions } from "../../definitions";
import { defaultTheme } from "./../../definitions";
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
      ...defaultTheme,
      Block,
      defaultGlobalData,
      GlobalDefinitions,
    };
  },
});
</script>
