<template>
  <DeviceForm
    :component-block="Block.Analog"
    :component-index="componentIndex"
    :component-count="count"
    :component-definition="AnalogSectionDefinitions"
    component-name="Analog"
    route-name="device-analogs"
    :default-data="defaultAnalogData"
  >
    <template #default="{ form, showField, onValueChange }">
      <Section class="w-full">
        <div
          class="w-full pb-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:gap-10"
        >
          <FormField
            v-if="showField(AnalogSectionDefinitions.Type)"
            :value="form.type"
            :field-definition="AnalogSectionDefinitions.Type"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(AnalogSectionDefinitions.Type)"
            :value="form.enabled"
            :field-definition="AnalogSectionDefinitions.Enabled"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(AnalogSectionDefinitions.MidiChannel)"
            :value="form.midiChannel"
            :field-definition="AnalogSectionDefinitions.MidiChannel"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(AnalogSectionDefinitions.Invert)"
            :value="form.Invert"
            :field-definition="AnalogSectionDefinitions.Invert"
            @modified="onValueChange"
          />
        </div>
        <div
          class="w-full pb-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:gap-10"
        >
          <FormField
            v-if="showField(AnalogSectionDefinitions.MidiIdLSB)"
            :value="form.midiIdLSB"
            :field-definition="AnalogSectionDefinitions.MidiIdLSB"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(AnalogSectionDefinitions.MidiIdMSB)"
            :value="form.midiIdMSB"
            :field-definition="AnalogSectionDefinitions.MidiIdMSB"
            @modified="onValueChange"
          />

          <FormField
            v-if="showField(AnalogSectionDefinitions.LowerCCLimitLSB)"
            :value="form.lowerCCLimitLSB"
            :field-definition="AnalogSectionDefinitions.LowerCCLimitLSB"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(AnalogSectionDefinitions.LowerCCLimitMSB)"
            :value="form.lowerCCLimitMSB"
            :field-definition="AnalogSectionDefinitions.LowerCCLimitMSB"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(AnalogSectionDefinitions.UpperCCLimitLSB)"
            :value="form.upperCCLimitLSB"
            :field-definition="AnalogSectionDefinitions.UpperCCLimitLSB"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(AnalogSectionDefinitions.UpperCCLimitMSB)"
            :value="form.upperCCLimitMSB"
            :field-definition="AnalogSectionDefinitions.UpperCCLimitMSB"
            @modified="onValueChange"
          />
        </div>
      </Section>
    </template>
  </DeviceForm>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  Block,
  defaultAnalogData,
  AnalogSectionDefinitions,
  AnalogType,
} from "../../definitions";
import router from "../../router";
import { deviceStoreMapped } from "../../store";
import DeviceForm from "./DeviceForm.vue";

export default defineComponent({
  name: "DeviceSectionAnalogsForm",
  components: {
    DeviceForm,
  },
  setup() {
    const componentIndex = computed(() =>
      Number(router.currentRoute.value.params.componentIndex),
    );

    return {
      componentIndex,
      count: deviceStoreMapped.analogInputs,
      Block,
      AnalogType,
      defaultAnalogData,
      AnalogSectionDefinitions,
    };
  },
});
</script>
