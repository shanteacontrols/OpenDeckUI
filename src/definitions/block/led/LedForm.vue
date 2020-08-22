<template>
  <DeviceForm :block="Block.Led" :index="index">
    <template #default="{ form, showField, onValueChange }">
      <div class="form-grid">
        <FormField
          v-if="showField(sections.LedColorTesting)"
          :value="form.ledColorTesting"
          :field-definition="sections.LedColorTesting"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.ActivationNote)"
          :value="form.activationNote"
          :field-definition="sections.ActivationNote"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.RGBEnable)"
          :value="form.rgbEnable"
          :field-definition="sections.RGBEnable"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.ControlType)"
          :value="form.controlType"
          :field-definition="sections.ControlType"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.ActivationVelocity)"
          :value="form.activationVelocity"
          :field-definition="sections.ActivationVelocity"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiChannel)"
          :value="form.midiChannel"
          :field-definition="sections.MidiChannel"
          @modified="onValueChange"
        />
      </div>
    </template>
  </DeviceForm>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import router from "../../../router";
import { Block } from "../../interface";
import { LedBlock } from "./led";

export default defineComponent({
  name: "LedForm",
  setup() {
    const { sections } = LedBlock;
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
