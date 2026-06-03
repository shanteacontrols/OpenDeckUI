<template>
  <DeviceSettings class="i2c flex flex-wrap flex-grow" :block="Block.Display">
    <template #default="{ form, showField, onSettingChange }">
      <Section title="Display">
        <div class="form-grid">
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
      <Section title="APDS-9960">
        <div class="form-grid">
          <FormField
            :value="form.enableApds9960Proximity"
            :field-definition="sections.EnableApds9960Proximity"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Apds9960ProximityGain)"
            :value="form.apds9960ProximityGain"
            :field-definition="sections.Apds9960ProximityGain"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.enableApds9960AmbientLight"
            :field-definition="sections.EnableApds9960AmbientLight"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.enableApds9960Rgb"
            :field-definition="sections.EnableApds9960Rgb"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Apds9960AlsGain)"
            :value="form.apds9960AlsGain"
            :field-definition="sections.Apds9960AlsGain"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.enableApds9960Gesture"
            :field-definition="sections.EnableApds9960Gesture"
            @modified="onSettingChange"
          />
        </div>
      </Section>
      <Section title="VL53L4CX">
        <div class="form-grid">
          <FormField
            :value="form.enableVl53l4cxDistance"
            :field-definition="sections.EnableVl53l4cxDistance"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Vl53l4cxTrackingArea)"
            :value="form.vl53l4cxTrackingArea"
            :field-definition="sections.Vl53l4cxTrackingArea"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Vl53l4cxResponse)"
            :value="form.vl53l4cxResponse"
            :field-definition="sections.Vl53l4cxResponse"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Vl53l4cxDistanceMode)"
            :value="form.vl53l4cxDistanceMode"
            :field-definition="sections.Vl53l4cxDistanceMode"
            @modified="onSettingChange"
          />
        </div>
      </Section>
      <Section title="CAP1188">
        <div class="form-grid">
          <FormField
            :value="form.cap1188Sensitivity"
            :field-definition="sections.Cap1188Sensitivity"
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
