<template>
  <DeviceComponentForm
    :component-block="Block.Analog"
    :component-index="componentIndex"
    :component-count="count"
    :component-definition="AnalogSectionDefinitions"
    component-name="Analog"
    route-name="device-analogs"
    :default-data="defaultAnalogData"
  >
    <template #default="{ form, showMsbControls, onValueChange }">
      <Section class="w-full">
        <div
          class="w-full pb-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xl:gap-10"
        >
          <FormField
            :value="form.enabled"
            :field-definition="AnalogSectionDefinitions.Enabled"
            @modified="onValueChange"
          />

          <FormField
            :value="form.invertDirection"
            :field-definition="AnalogSectionDefinitions.InvertDirection"
            @modified="onValueChange"
          />

          <FormField
            :value="form.midiType"
            :field-definition="AnalogSectionDefinitions.MidiType"
            @modified="onValueChange"
          />

          <FormField
            :value="form.midiIdLSB"
            :field-definition="AnalogSectionDefinitions.MidiIdLSB"
            @modified="onValueChange"
          />

          <FormField
            v-if="showMsbControls"
            :value="form.midiIdMSB"
            :field-definition="AnalogSectionDefinitions.MidiIdMSB"
            @modified="onValueChange"
          />

          <FormField
            :value="form.lowerCCLimitLSB"
            :field-definition="AnalogSectionDefinitions.LowerCCLimitLSB"
            @modified="onValueChange"
          />

          <FormField
            v-if="showMsbControls"
            :value="form.lowerCCLimitMSB"
            :field-definition="AnalogSectionDefinitions.LowerCCLimitMSB"
            @modified="onValueChange"
          />

          <FormField
            :value="form.upperCCLimitLSB"
            :field-definition="AnalogSectionDefinitions.UpperCCLimitLSB"
            @modified="onValueChange"
          />

          <FormField
            v-if="showMsbControls"
            :value="form.upperCCLimitMSB"
            :field-definition="AnalogSectionDefinitions.UpperCCLimitMSB"
            @modified="onValueChange"
          />

          <FormField
            :value="form.midiChannel"
            :field-definition="AnalogSectionDefinitions.MidiChannel"
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
  defaultAnalogData,
  AnalogSectionDefinitions,
} from "../../definitions";
import router from "../../router";
import { deviceStoreMapped } from "../../store";
import DeviceComponentForm from "./DeviceComponentForm.vue";

export default defineComponent({
  name: "DeviceSectionAnalogsForm",
  setup() {
    const componentIndex = computed(() =>
      Number(router.currentRoute.value.params.componentIndex)
    );

    return {
      componentIndex,
      count: deviceStoreMapped.analogInputs,
      Block,
      defaultAnalogData,
      AnalogSectionDefinitions,
    };
  },
  components: {
    DeviceComponentForm,
  },
});
</script>
