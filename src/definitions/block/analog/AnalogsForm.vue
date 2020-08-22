<template>
  <DeviceForm :block="Block.Analog" :index="index">
    <template #default="{ form, showField, onValueChange }">
      <div class="form-grid">
        <FormField
          v-if="showField(sections.Type)"
          class="col-span-2"
          :value="form.type"
          :field-definition="sections.Type"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.Type)"
          :value="form.enabled"
          :field-definition="sections.Enabled"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiChannel)"
          :value="form.midiChannel"
          :field-definition="sections.MidiChannel"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.Invert)"
          :value="form.Invert"
          :field-definition="sections.Invert"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiIdLSB)"
          :value="form.midiIdLSB"
          :field-definition="sections.MidiIdLSB"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiIdMSB)"
          :value="form.midiIdMSB"
          :field-definition="sections.MidiIdMSB"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.LowerCCLimitLSB)"
          :value="form.lowerCCLimitLSB"
          :field-definition="sections.LowerCCLimitLSB"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.LowerCCLimitMSB)"
          :value="form.lowerCCLimitMSB"
          :field-definition="sections.LowerCCLimitMSB"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.UpperCCLimitLSB)"
          :value="form.upperCCLimitLSB"
          :field-definition="sections.UpperCCLimitLSB"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.UpperCCLimitMSB)"
          :value="form.upperCCLimitMSB"
          :field-definition="sections.UpperCCLimitMSB"
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
import { AnalogBlock } from "./analog";

export default defineComponent({
  name: "Analog",
  setup() {
    const { sections } = AnalogBlock;
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
