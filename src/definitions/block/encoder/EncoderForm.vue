<template>
  <DeviceForm :block="Block.Encoder" :index="index">
    <template #default="{ form, showField, onValueChange }">
      <div class="form-grid lg:grid-cols-4">
        <FormField
          v-if="showField(sections.Enabled)"
          :value="form.enabled"
          :field-definition="sections.Enabled"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.InvertState)"
          :value="form.invertState"
          :field-definition="sections.InvertState"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.EncodingMode)"
          class="col-span-2"
          :value="form.encodingMode"
          :field-definition="sections.EncodingMode"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiChannel)"
          :value="form.midiChannel"
          :field-definition="sections.MidiChannel"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.Acceleration)"
          :value="form.acceleration"
          :field-definition="sections.Acceleration"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiIdLSB)"
          :value="form.midiIdLSB"
          :field-definition="sections.MidiIdLSB"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.PulsesPerStep)"
          class="col-span-2"
          :value="form.pulsesPerStep"
          :field-definition="sections.PulsesPerStep"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiIdMSB)"
          :value="form.midiIdMSB"
          :field-definition="sections.MidiIdMSB"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.RemoteSync)"
          class="col-span-2"
          :value="form.remoteSync"
          :field-definition="sections.RemoteSync"
          @modified="onValueChange"
        />
      </div>
    </template>
  </DeviceForm>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { Block } from "../../interface";
import { EncoderBlock } from "./encoder";
import router from "../../../router";

export default defineComponent({
  name: "EncoderForm",
  setup() {
    const { sections } = EncoderBlock;
    const index = computed(() =>
      Number(router.currentRoute.value.params.index),
    );

    return {
      index,
      Block,
      sections,
    };
  },
});
</script>
