<template>
  <DeviceForm
    :component-block="Block.Encoder"
    :component-index="componentIndex"
    :component-count="count"
    :component-definition="EncoderSectionDefinitions"
    component-name="Encoder"
    route-name="device-encoders"
    :default-data="defaultEncoderData"
  >
    <template #default="{ form, showMsbControls, onValueChange }">
      <Section>
        <div class="pb-8 grid gap-6 grid-cols-1 md:grid-cols-2 md:gap-10">
          <FormField
            :value="form.enabled"
            :field-definition="EncoderSectionDefinitions.Enabled"
            @modified="onValueChange"
          />

          <FormField
            :value="form.invertDirection"
            :field-definition="EncoderSectionDefinitions.InvertDirection"
            @modified="onValueChange"
          />

          <!-- <FormField
          :value="form.midiType"
          :field-definition="EncoderSectionDefinitions.MidiType"
          @modified="onValueChange"
        /> -->

          <FormField
            :value="form.midiIdLSB"
            :field-definition="EncoderSectionDefinitions.MidiIdLSB"
            @modified="onValueChange"
          />

          <FormField
            v-if="showMsbControls"
            :value="form.midiIdMSB"
            :field-definition="EncoderSectionDefinitions.MidiIdMSB"
            @modified="onValueChange"
          />

          <!--
        <FormField
          :value="form.lowerCCLimitLSB"
          :field-definition="EncoderSectionDefinitions.LowerCCLimitLSB"
          @modified="onValueChange"
        />
        -->
          <FormField
            v-if="showMsbControls"
            :value="form.lowerCCLimitMSB"
            :field-definition="EncoderSectionDefinitions.LowerCCLimitMSB"
            @modified="onValueChange"
          />

          <!--
        <FormField
          :value="form.upperCCLimitLSB"
          :field-definition="EncoderSectionDefinitions.UpperCCLimitLSB"
          @modified="onValueChange"
        />
        -->

          <FormField
            v-if="showMsbControls"
            :value="form.upperCCLimitMSB"
            :field-definition="EncoderSectionDefinitions.UpperCCLimitMSB"
            @modified="onValueChange"
          />

          <FormField
            :value="form.midiChannel"
            :field-definition="EncoderSectionDefinitions.MidiChannel"
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
  defaultEncoderData,
  EncoderSectionDefinitions,
} from "../../definitions";
import router from "../../router";
import { deviceStoreMapped } from "../../store";
import DeviceForm from "./DeviceForm.vue";

export default defineComponent({
  name: "DeviceSectionEncodersForm",
  setup() {
    const componentIndex = computed(() =>
      Number(router.currentRoute.value.params.componentIndex)
    );

    return {
      componentIndex,
      count: deviceStoreMapped.analogInputs,
      Block,
      defaultEncoderData,
      EncoderSectionDefinitions,
    };
  },
  components: {
    DeviceForm,
  },
});
</script>
