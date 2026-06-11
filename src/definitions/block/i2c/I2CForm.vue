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
            :value="form.apds9960ProximityGestureMode"
            :field-definition="sections.Apds9960ProximityGestureMode"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.InvertApds9960GestureX)"
            :value="form.invertApds9960GestureX"
            :field-definition="sections.InvertApds9960GestureX"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.InvertApds9960GestureY)"
            :value="form.invertApds9960GestureY"
            :field-definition="sections.InvertApds9960GestureY"
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
            v-if="showField(sections.Apds9960ProximityGain)"
            :value="form.apds9960ProximityGain"
            :field-definition="sections.Apds9960ProximityGain"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Apds9960AlsGain)"
            :value="form.apds9960AlsGain"
            :field-definition="sections.Apds9960AlsGain"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Apds9960ProximityLowerValue)"
            :value="form.apds9960ProximityLowerValue"
            :field-definition="sections.Apds9960ProximityLowerValue"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Apds9960ProximityUpperValue)"
            :value="form.apds9960ProximityUpperValue"
            :field-definition="sections.Apds9960ProximityUpperValue"
            @modified="onSettingChange"
          />
        </div>
      </Section>
      <Section title="BNO085">
        <div class="form-grid">
          <FormField
            :value="form.enableBno085Quaternion"
            :field-definition="sections.EnableBno085Quaternion"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.enableBno085Euler"
            :field-definition="sections.EnableBno085Euler"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.enableBno085Gyroscope"
            :field-definition="sections.EnableBno085Gyroscope"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.enableBno085LinearAcceleration"
            :field-definition="sections.EnableBno085LinearAcceleration"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.enableBno085Gravity"
            :field-definition="sections.EnableBno085Gravity"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Bno085Smoothing)"
            :value="form.bno085Smoothing"
            :field-definition="sections.Bno085Smoothing"
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
      <Section title="VL53L4CX">
        <div class="form-grid">
          <FormField
            :value="form.enableVl53l4cxDistanceMm"
            :field-definition="sections.EnableVl53l4cxDistanceMm"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.enableVl53l4cxDistanceNorm"
            :field-definition="sections.EnableVl53l4cxDistanceNorm"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Vl53l4cxSmoothing)"
            :value="form.vl53l4cxSmoothing"
            :field-definition="sections.Vl53l4cxSmoothing"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Vl53l4cxTrackingArea)"
            :value="form.vl53l4cxTrackingArea"
            :field-definition="sections.Vl53l4cxTrackingArea"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Vl53l4cxDistanceMode)"
            :value="form.vl53l4cxDistanceMode"
            :field-definition="sections.Vl53l4cxDistanceMode"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Vl53l4cxDistanceLowerValue)"
            :value="form.vl53l4cxDistanceLowerValue"
            :field-definition="sections.Vl53l4cxDistanceLowerValue"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.Vl53l4cxDistanceUpperValue)"
            :value="form.vl53l4cxDistanceUpperValue"
            :field-definition="sections.Vl53l4cxDistanceUpperValue"
            @modified="onSettingChange"
          />
        </div>
      </Section>
      <Section title="VL53L5CX">
        <div class="form-grid">
          <FormField
            :value="form.vl53l5cxOutputMode"
            :field-definition="sections.Vl53l5cxOutputMode"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.vl53l5cxResolution"
            :field-definition="sections.Vl53l5cxResolution"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.vl53l5cxOutputRate"
            :field-definition="sections.Vl53l5cxOutputRate"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.vl53l5cxSmoothing"
            :field-definition="sections.Vl53l5cxSmoothing"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.vl53l5cxDistanceLowerValue"
            :field-definition="sections.Vl53l5cxDistanceLowerValue"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.vl53l5cxDistanceUpperValue"
            :field-definition="sections.Vl53l5cxDistanceUpperValue"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.vl53l5cxRotation"
            :field-definition="sections.Vl53l5cxRotation"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.vl53l5cxInvertX"
            :field-definition="sections.Vl53l5cxInvertX"
            @modified="onSettingChange"
          />
          <FormField
            :value="form.vl53l5cxInvertY"
            :field-definition="sections.Vl53l5cxInvertY"
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
