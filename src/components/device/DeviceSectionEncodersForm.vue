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
    <template #default="{ form, showField, onValueChange }">
      <Section>
        <div class="pb-8 grid gap-6 grid-cols-1 md:grid-cols-2 md:gap-10">
          <FormField
            v-if="showField(EncoderSectionDefinitions.Enabled)"
            :value="form.enabled"
            :field-definition="EncoderSectionDefinitions.Enabled"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(EncoderSectionDefinitions.InvertState)"
            :value="form.invertState"
            :field-definition="EncoderSectionDefinitions.InvertState"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(EncoderSectionDefinitions.EncodingMode)"
            :value="form.encodingMode"
            :field-definition="EncoderSectionDefinitions.EncodingMode"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(EncoderSectionDefinitions.MidiChannel)"
            :value="form.midiChannel"
            :field-definition="EncoderSectionDefinitions.MidiChannel"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(EncoderSectionDefinitions.Acceleration)"
            :value="form.acceleration"
            :field-definition="EncoderSectionDefinitions.Acceleration"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(EncoderSectionDefinitions.MidiIdLSB)"
            :value="form.midiIdLSB"
            :field-definition="EncoderSectionDefinitions.MidiIdLSB"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(EncoderSectionDefinitions.PulsesPerStep)"
            :value="form.pulsesPerStep"
            :field-definition="EncoderSectionDefinitions.PulsesPerStep"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(EncoderSectionDefinitions.MidiIdMSB)"
            :value="form.midiIdMSB"
            :field-definition="EncoderSectionDefinitions.MidiIdMSB"
            @modified="onValueChange"
          />
          <FormField
            v-if="showField(EncoderSectionDefinitions.RemoteSync)"
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
      Block,
      defaultEncoderData,
      ShowAccelerationOnTypes,
      EncoderSectionDefinitions,
    };
  },
});
</script>
