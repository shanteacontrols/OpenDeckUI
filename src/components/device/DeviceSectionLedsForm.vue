<template>
  <DeviceComponentForm
    :component-block="Block.Led"
    :component-index="componentIndex"
    :component-count="count"
    :component-definition="LedSectionDefinitions"
    component-name="LED"
    route-name="device-leds"
    :default-data="defaultLedComponentData"
  >
    <template #default="{ form, onValueChange }">
      <Section>
        <div
          class="w-full pb-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xl:gap-10"
        >
          <FormField
            :value="form.ledColorTesting"
            :field-definition="LedSectionDefinitions.LedColorTesting"
            @modified="onValueChange"
          />
          <FormField
            :value="form.ledBlinkTesting"
            :field-definition="LedSectionDefinitions.LedBlinkTesting"
            @modified="onValueChange"
          />
          <FormField
            :value="form.activationId"
            :field-definition="LedSectionDefinitions.ActivationId"
            @modified="onValueChange"
          />
          <FormField
            :value="form.rgbEnable"
            :field-definition="LedSectionDefinitions.RGBEnable"
            @modified="onValueChange"
          />
          <FormField
            :value="form.controlType"
            :field-definition="LedSectionDefinitions.ControlType"
            @modified="onValueChange"
          />
          <FormField
            :value="form.activationVelocity"
            :field-definition="LedSectionDefinitions.ActivationVelocity"
            @modified="onValueChange"
          />
          <FormField
            :value="form.midiChannel"
            :field-definition="LedSectionDefinitions.MidiChannel"
            @modified="onValueChange"
          />
        </div>
      </Section>
    </template>
  </DeviceComponentForm>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  Block,
  defaultLedSettingsData,
  defaultLedComponentData,
  LedSectionDefinitions,
} from "../../definitions";
import { deviceStoreMapped } from "../../store";
import router from "../../router";
import DeviceComponentForm from "./DeviceComponentForm.vue";

export default defineComponent({
  name: "DeviceSectionLedsForm",
  setup() {
    const componentIndex = computed(() =>
      Number(router.currentRoute.value.params.componentIndex)
    );

    return {
      componentIndex,
      count: deviceStoreMapped.buttons,
      Block,
      defaultLedSettingsData,
      defaultLedComponentData,
      LedSectionDefinitions,
    };
  },
  components: {
    DeviceComponentForm,
  },
});
</script>
