<template>
  <DeviceSettings class="global flex flex-wrap flex-grow" :block="Block.Global">
    <template #default="{ form, showField, onSettingChange }">
      <Section v-if="supportedPresetsCount > 1" title="Presets">
        <div class="form-grid">
          <FormField
            v-if="showField(sections.PreservePresetState)"
            class="col-span-2"
            :value="form.preservePresetState"
            :field-definition="sections.PreservePresetState"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.ActivePreset)"
            :value="form.activePreset"
            :field-definition="sections.ActivePreset"
            @modified="onSettingChange"
          />
        </div>
      </Section>

      <Section title="MIDI">
        <div class="form-grid">
          <FormField
            v-if="showField(sections.StandardNoteOff)"
            :value="form.standardNoteOff"
            :field-definition="sections.StandardNoteOff"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.DinMidiState)"
            :value="form.dinMidiState"
            :field-definition="sections.DinMidiState"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.RunningStatus)"
            :value="form.runningStatus"
            :field-definition="sections.RunningStatus"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.PassUSBtoDIN)"
            :value="form.passUSBtoDIN"
            :field-definition="sections.PassUSBtoDIN"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.MidiMergeEnable)"
            :value="form.midiMergeEnable"
            :field-definition="sections.MidiMergeEnable"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.MidiMergeType)"
            :value="form.midiMergeType"
            :field-definition="sections.MidiMergeType"
            @modified="onSettingChange"
          />
        </div>
      </Section>
    </template>
  </DeviceSettings>

  <GlobalHardware />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "../../interface";
import { GlobalBlock } from "./global";
import { deviceStoreMapped } from "../../device/device-store";

import GlobalHardware from "./GlobalHardware.vue";

export default defineComponent({
  name: "Global",
  components: {
    GlobalHardware,
  },
  setup() {
    const { sections } = GlobalBlock;
    const { supportedPresetsCount } = deviceStoreMapped;

    return {
      Block,
      sections,
      supportedPresetsCount,
    };
  },
});
</script>
