<template>
  <DeviceForm
    :component-block="Block.Led"
    :component-index="componentIndex"
    :component-definition="LedSectionDefinitions"
    component-name="LED"
    route-name="device-leds"
    :default-data="defaultLedComponentData"
  >
    <template #default="{ form, showField, onValueChange }">
      <div class="form-grid">
        <FormField
          v-if="showField(LedSectionDefinitions.LedColorTesting)"
          :value="form.ledColorTesting"
          :field-definition="LedSectionDefinitions.LedColorTesting"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(LedSectionDefinitions.ActivationNote)"
          :value="form.activationNote"
          :field-definition="LedSectionDefinitions.ActivationNote"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(LedSectionDefinitions.RGBEnable)"
          :value="form.rgbEnable"
          :field-definition="LedSectionDefinitions.RGBEnable"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(LedSectionDefinitions.ControlType)"
          :value="form.controlType"
          :field-definition="LedSectionDefinitions.ControlType"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(LedSectionDefinitions.ActivationVelocity)"
          :value="form.activationVelocity"
          :field-definition="LedSectionDefinitions.ActivationVelocity"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(LedSectionDefinitions.MidiChannel)"
          :value="form.midiChannel"
          :field-definition="LedSectionDefinitions.MidiChannel"
          @modified="onValueChange"
        />
      </div>
    </template>
  </DeviceForm>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  Block,
  defaultLedSettingsData,
  defaultLedComponentData,
  LedSectionDefinitions,
} from "../../definitions";
import router from "../../router";
import DeviceForm from "./DeviceForm.vue";

export default defineComponent({
  name: "DeviceSectionLedsForm",
  components: {
    DeviceForm,
  },
  setup() {
    const componentIndex = computed(() =>
      Number(router.currentRoute.value.params.componentIndex),
    );

    return {
      componentIndex,
      Block,
      defaultLedSettingsData,
      defaultLedComponentData,
      LedSectionDefinitions,
    };
  },
});
</script>
