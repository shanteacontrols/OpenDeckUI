<template>
  <DeviceForm
    :component-block="Block.Encoder"
    :component-index="componentIndex"
    :component-definition="EncoderSectionDefinitions"
    component-name="Encoder"
    route-name="device-encoders"
    :default-data="defaultEncoderData"
  >
    <template #default="{ form, showField, onValueChange }">
      <div class="form-grid lg:grid-cols-4">
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
          class="col-span-2"
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
          class="col-span-2"
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
          class="col-span-2"
          :value="form.remoteSync"
          :field-definition="EncoderSectionDefinitions.RemoteSync"
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
  defaultEncoderData,
  EncoderSectionDefinitions,
  ShowAccelerationOnTypes,
} from "../../definitions";
import router from "../../router";
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
      Block,
      defaultEncoderData,
      ShowAccelerationOnTypes,
      EncoderSectionDefinitions,
    };
  },
});
</script>
