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
    <template #default="{ form, onValueChange }">
      <Section>
        <div class="pb-8 grid gap-6 grid-cols-1 md:grid-cols-2 md:gap-10">
          <FormField
            :value="form.enabled"
            :field-definition="EncoderSectionDefinitions.Enabled"
            @modified="onValueChange"
          />
          <FormField
            :value="form.invertState"
            :field-definition="EncoderSectionDefinitions.InvertState"
            @modified="onValueChange"
          />
          <FormField
            :value="form.encodingMode"
            :field-definition="EncoderSectionDefinitions.EncodingMode"
            @modified="onValueChange"
          />
          <FormField
            :value="form.midiChannel"
            :field-definition="EncoderSectionDefinitions.MidiChannel"
            @modified="onValueChange"
          />
          <FormField
            v-show="ShowAccelerationOnTypes.includes(form.encodingMode)"
            :value="form.acceleration"
            :field-definition="EncoderSectionDefinitions.Acceleration"
            @modified="onValueChange"
          />
          <FormField
            :trim-lsb-string="!showMsbControls"
            :value="form.midiIdLSB"
            :field-definition="EncoderSectionDefinitions.MidiIdLSB"
            @modified="onValueChange"
          />
          <FormField
            :value="form.pulsesPerStep"
            :field-definition="EncoderSectionDefinitions.PulsesPerStep"
            @modified="onValueChange"
          />
          <FormField
            v-if="showMsbControls"
            :value="form.midiIdMSB"
            :field-definition="EncoderSectionDefinitions.MidiIdMSB"
            @modified="onValueChange"
          />
          <FormField
            :value="form.remoteSync"
            :field-definition="EncoderSectionDefinitions.RemoteSync"
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
  ShowAccelerationOnTypes,
} from "../../definitions";
import router from "../../router";
import { deviceStoreMapped } from "../../store";
import DeviceForm from "./DeviceForm.vue";

export default defineComponent({
  name: "DeviceSectionEncodersForm",
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
      showMsbControls: deviceStoreMapped.showMsbControls,
      Block,
      defaultEncoderData,
      ShowAccelerationOnTypes,
      EncoderSectionDefinitions,
    };
  },
});
</script>
