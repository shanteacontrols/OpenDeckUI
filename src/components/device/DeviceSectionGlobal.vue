<template>
  <DeviceComponentSettings
    class="global flex flex-wrap flex-grow"
    :component-block="Block.Global"
    :component-definition="GlobalDefinitions"
    :default-data="defaultGlobalData"
  >
    <template #default="{ form, onValueChange }">
      <Section title="Global Presets" class="w-full xl:w-1/3">
        <div
          class="w-full pb-8 grid gap-6 grid-col-1 md:grid-cols-2 xl:grid-cols-1"
        >
          <FormField
            :value="form.preservePresetState"
            :field-definition="GlobalDefinitions.PreservePresetState"
            @modified="onValueChange"
          />
          <FormField
            :value="form.activePreset"
            :field-definition="GlobalDefinitions.ActivePreset"
            @modified="onValueChange"
          />
        </div>
      </Section>

      <Section title="Global MIDI" class="w-full xl:w-2/3">
        <div
          class="w-full pb-8 grid gap-6 md:grid-cols-2 xl:gap-10 xl:grid-cols-2"
        >
          <FormField
            :value="form.standardNoteOff"
            :field-definition="GlobalDefinitions.StandardNoteOff"
            @modified="onValueChange"
          />
          <FormField
            :value="form.dinMidiState"
            :field-definition="GlobalDefinitions.DinMidiState"
            @modified="onValueChange"
          />
          <FormField
            v-if="form.dinMidiState"
            :value="form.runningStatus"
            :field-definition="GlobalDefinitions.RunningStatus"
            @modified="onValueChange"
          />
          <FormField
            v-if="form.dinMidiState"
            :value="form.midiMergeEnable"
            :field-definition="GlobalDefinitions.MidiMergeEnable"
            @modified="onValueChange"
          />
          <FormField
            :value="form.midiMergeType"
            :field-definition="GlobalDefinitions.MidiMergeType"
            @modified="onValueChange"
          />
        </div>
      </Section>
    </template>
  </DeviceComponentSettings>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block, defaultGlobalData, GlobalDefinitions } from "../../definitions";
import DeviceComponentSettings from "./DeviceComponentSettings.vue";
import { defaultTheme } from "./../../definitions";

export default defineComponent({
  name: "DeviceSectionGlobal",
  setup() {
    return {
      ...defaultTheme,
      Block,
      defaultGlobalData,
      GlobalDefinitions,
    };
  },
  components: {
    DeviceComponentSettings,
  },
});
</script>
